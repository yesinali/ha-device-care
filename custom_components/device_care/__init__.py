"""Home Assistant integration for device inventory, health and maintenance."""
from __future__ import annotations

import logging
from datetime import datetime, timezone

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)


def _weekly_report_notification(stats: dict, coverage_since: str | None, language: str | None) -> tuple[str, str]:
    """Build the instance-wide weekly notification in HA's configured language."""
    if (language or "").lower().startswith("tr"):
        title = "Device Care — haftalık rapor"
        message = (
            f"Son 7 gün: {stats['outage_starts']} kesinti başlangıcı, "
            f"{stats['device_outage_seconds'] // 60} cihaz-dakika doğrulanmış kesinti, "
            f"{stats['low_battery']} düşük pil. İzleme başlangıcı: "
            f"{coverage_since or 'bilinmiyor'}."
        )
        return title, message
    title = "Device Care — weekly report"
    message = (
        f"Last 7 days: {stats['outage_starts']} outage starts, "
        f"{stats['device_outage_seconds'] // 60} device-minutes of confirmed downtime, "
        f"{stats['low_battery']} low batteries. Monitoring started: "
        f"{coverage_since or 'unknown'}."
    )
    return title, message


async def async_setup(hass, config) -> bool:
    """Register domain-level websocket handlers."""
    from .websocket_api import async_register as async_register_websocket
    domain_data = hass.data.setdefault(DOMAIN, {"entries": {}, "websocket_registered": False})
    domain_data.setdefault("boot_id", datetime.now(timezone.utc).isoformat())
    _ensure_shutdown_listener(hass, domain_data)
    if not hass.data[DOMAIN]["websocket_registered"]:
        async_register_websocket(hass)
        hass.data[DOMAIN]["websocket_registered"] = True
    return True


async def async_setup_entry(hass, entry) -> bool:
    """Set up storage, panel, discovery listeners and event history."""
    from homeassistant.core import Event, callback
    from homeassistant.helpers.event import async_track_time_change
    from homeassistant.exceptions import ConfigEntryNotReady
    from .panel import async_register_panel
    from .storage import DeviceCareStore
    from .websocket_api import async_register as async_register_websocket
    from .history import report_window
    from .history import close_open_events
    domain_data = hass.data.setdefault(DOMAIN, {"entries": {}, "websocket_registered": False})
    domain_data.setdefault("boot_id", datetime.now(timezone.utc).isoformat())
    _ensure_shutdown_listener(hass, domain_data)
    if not domain_data.get("websocket_registered"):
        async_register_websocket(hass)
        domain_data["websocket_registered"] = True
    store = DeviceCareStore(hass, entry.entry_id)
    await store.async_load()
    boot_id = domain_data.get("boot_id")
    if store.has_data and store.data.get("boot_id") != boot_id:
        boundary = store.data.get("last_shutdown_at") or store.data.get("last_observed_at")
        close_open_events(store.data["events"], datetime.fromisoformat(boundary) if boundary else None, "ha_restart_gap")
    store.data["boot_id"] = boot_id
    store.data["last_shutdown_at"] = None
    if not store.has_data:
        store.set_preferences(entry.data)
        store.set_preferences(entry.options)
    if not store.data.get("known_device_ids"):
        from .discovery import build_inventory
        initial = build_inventory(hass, {**store.data["preferences"], "scope": "all", "included_device_ids": None, "excluded_device_ids": []})
        store.data["known_device_ids"] = [device["id"] for device in initial["devices"]]
    if not store.data.get("monitoring_since"):
        store.data["monitoring_since"] = datetime.now(timezone.utc).isoformat()
    startup_at = datetime.now(timezone.utc)
    for device in _inventory_devices(hass, store):
        store.record(device["id"], device["health"], startup_at)
    await store.async_save()
    runtime = {"entry": entry, "store": store, "unsubscribers": []}
    domain_data["entries"][entry.entry_id] = runtime
    try:
        await async_register_panel(hass)
    except Exception as err:
        _LOGGER.exception("Could not register Device Care panel")
        domain_data["entries"].pop(entry.entry_id, None)
        raise ConfigEntryNotReady("Device Care panel could not be registered") from err

    @callback
    def state_changed(event: Event) -> None:
        entity_id = event.data.get("entity_id")
        new_state = event.data.get("new_state")
        if not entity_id:
            return
        all_inventory = _all_inventory_devices(hass, store)
        current = next((d for d in all_inventory if any(e["entity_id"] == entity_id for e in d["entities"])), None)
        if current is None:
            return
        tracked_ids = {device["id"] for device in _inventory_devices(hass, store)}
        if current["id"] in tracked_ids:
            previous = event.data.get("old_state")
            before = _derive_for_device(hass, current, previous, store)
            after = _derive_for_device(hass, current, new_state, store)
            if before != after:
                store.record(current["id"], after, (new_state or previous).last_changed)
            store.data["last_observed_at"] = datetime.now(timezone.utc).isoformat()
            store.async_delay_save()
        hass.bus.async_fire(f"{DOMAIN}_device_care_updated", {"reason": "state", "device_ids": [current["id"]]})

    async def weekly_report(now):
        if now.weekday() != 0:
            return
        if not store.data["preferences"].get("weekly_report_enabled"):
            return
        week = now.date().isocalendar()
        week_key = f"{week.year}-W{week.week:02d}"
        if store.data.get("last_weekly_report_week") == week_key:
            return
        from .discovery import build_inventory
        inventory = build_inventory(hass, store.data["preferences"])
        tracked_ids = {device["id"] for device in inventory["devices"]}
        events = [event for event in store.data["events"] if event["device_id"] in tracked_ids]
        report = report_window(events, now, 168, store.data.get("monitoring_since"))
        from .discovery import is_low_battery
        report["stats"]["low_battery"] = sum(1 for d in inventory["devices"] if is_low_battery(d["signals"]["battery"]))
        report["stats"]["missing_data"] = sum(1 for d in inventory["devices"] if d["health"] == "unknown")
        stats = report["stats"]
        title, message = _weekly_report_notification(stats, report["coverage_since"], hass.config.language)
        await hass.services.async_call("persistent_notification", "create", {
            "title": title,
            "message": message,
            "notification_id": f"device_care_weekly_report_{week_key.replace('-', '_')}",
        }, blocking=True)
        store.data["last_weekly_report_week"] = week_key
        await store.async_save()

    try:
        runtime["unsubscribers"].append(hass.bus.async_listen("state_changed", state_changed))
        runtime["unsubscribers"].append(hass.bus.async_listen("entity_registry_updated", lambda event: hass.bus.async_fire(f"{DOMAIN}_device_care_updated", {"reason": "registry"})))
        runtime["unsubscribers"].append(hass.bus.async_listen("device_registry_updated", lambda event: hass.bus.async_fire(f"{DOMAIN}_device_care_updated", {"reason": "registry"})))
        runtime["unsubscribers"].append(hass.bus.async_listen("area_registry_updated", lambda event: hass.bus.async_fire(f"{DOMAIN}_device_care_updated", {"reason": "registry"})))
        runtime["unsubscribers"].append(hass.bus.async_listen("floor_registry_updated", lambda event: hass.bus.async_fire(f"{DOMAIN}_device_care_updated", {"reason": "registry"})))
        runtime["unsubscribers"].append(hass.bus.async_listen("label_registry_updated", lambda event: hass.bus.async_fire(f"{DOMAIN}_device_care_updated", {"reason": "registry"})))
        runtime["unsubscribers"].append(entry.add_update_listener(async_reload_entry))
        runtime["unsubscribers"].append(async_track_time_change(hass, weekly_report, hour=9, minute=0, second=0))
    except Exception as err:
        for unsubscribe in runtime["unsubscribers"]:
            unsubscribe()
        domain_data["entries"].pop(entry.entry_id, None)
        async_unregister_panel(hass)
        raise ConfigEntryNotReady("Device Care listeners could not be registered") from err
    return True


async def async_reload_entry(hass, entry) -> None:
    """Reload after options change so persisted retention settings take effect."""
    runtime = hass.data.get(DOMAIN, {}).get("entries", {}).get(entry.entry_id)
    if runtime:
        runtime["store"].set_preferences({"retention_days": entry.options.get("retention_days", runtime["store"].data["preferences"].get("retention_days", 30))})
        await runtime["store"].async_save()
    await hass.config_entries.async_reload(entry.entry_id)


def _ensure_shutdown_listener(hass, domain_data) -> None:
    """Keep shutdown censoring alive across config-entry reloads."""
    from homeassistant.core import callback
    from .history import close_open_events
    if domain_data.get("shutdown_listener_registered"):
        return

    @callback
    def homeassistant_stopping(event) -> None:
        stopped_at = datetime.now(timezone.utc)
        for runtime in domain_data["entries"].values():
            store = runtime["store"]
            close_open_events(store.data["events"], stopped_at, "ha_stopped")
            store.data["last_shutdown_at"] = stopped_at.isoformat()
            store.async_delay_save(0.5)

    hass.bus.async_listen_once("homeassistant_stop", homeassistant_stopping)
    domain_data["shutdown_listener_registered"] = True


def _inventory_devices(hass, store):
    from .discovery import build_inventory
    return build_inventory(hass, store.data["preferences"])["devices"]


def _all_inventory_devices(hass, store):
    from .discovery import build_inventory
    prefs = store.data["preferences"]
    return build_inventory(hass, {**prefs, "scope": "all", "included_device_ids": None, "excluded_device_ids": []})["devices"]


def _derive_for_device(hass, device, override_state, store):
    from .health import derive_health
    entities = []
    expected_states = {rule.get("entity_id"): rule.get("state") for rule in store.data["preferences"].get("expected_off_rules", [])}
    for entity in device["entities"]:
        state = override_state.state if override_state and entity["entity_id"] == override_state.entity_id else entity["state"]
        entities.append({**entity, "state": state})
    expected = {entity["entity_id"] for entity in entities if expected_states.get(entity["entity_id"]) == entity["state"]}
    if expected:
        return "expected_off"
    # Prefer explicit health source if the selected entity belongs to the device.
    primary = store.data["preferences"].get("source_overrides", {}).get(device["id"], {}).get("connectivity")
    return derive_health(entities, primary, expected)[0]


async def async_unload_entry(hass, entry) -> bool:
    """Remove entry listeners and panel registration cleanly."""
    from .panel import async_unregister_panel
    domain_data = hass.data.get(DOMAIN, {})
    runtime = domain_data.get("entries", {}).get(entry.entry_id)
    if runtime is None:
        return True
    for unsubscribe in runtime["unsubscribers"]:
        unsubscribe()
    await runtime["store"].async_save()
    domain_data["entries"].pop(entry.entry_id, None)
    if not domain_data["entries"]:
        async_unregister_panel(hass)
    return True
