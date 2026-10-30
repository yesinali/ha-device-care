"""Build a normalized inventory from Home Assistant registries and states."""
from __future__ import annotations

from collections import defaultdict
import re
from datetime import UTC, datetime, timedelta
from typing import Any
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from .const import SIGNAL_CLASSES
from .health import derive_health, signal_meaning


def include_new_manual_devices(preferences: dict[str, Any], known_ids: set[str], current_ids: set[str]) -> set[str]:
    """Persist newly observed devices into an auto-including manual scope."""
    new_ids = current_ids - known_ids
    if preferences.get("scope") != "manual" or not preferences.get("auto_include_new") or not new_ids:
        return new_ids
    included = set(preferences.get("included_device_ids") or [])
    excluded = set(preferences.get("excluded_device_ids", []))
    included.update(new_ids - excluded)
    preferences["included_device_ids"] = sorted(included)
    return new_ids


def _dict(value: Any) -> dict[str, Any]:
    return value if isinstance(value, dict) else {}


def build_inventory(hass: Any, preferences: dict[str, Any]) -> dict[str, Any]:
    """Return registry-backed devices, including orphan entities without faking devices."""
    from homeassistant.helpers import area_registry, device_registry, entity_registry
    try:
        from homeassistant.helpers import floor_registry
    except ImportError:  # Floors were added after early supported HA releases.
        floor_registry = None
    try:
        from homeassistant.helpers import label_registry
    except ImportError:  # Labels are optional for installations without label support.
        label_registry = None

    dev_reg = device_registry.async_get(hass)
    ent_reg = entity_registry.async_get(hass)
    areas = area_registry.async_get(hass)
    floors = floor_registry.async_get(hass) if floor_registry else None
    labels = label_registry.async_get(hass) if label_registry else None
    area_by_id = {a.id: a for a in areas.async_list_areas()}
    floor_by_id = {f.floor_id: f for f in floors.async_list_floors()} if floors else {}
    label_by_id = {x.label_id: x for x in labels.async_list_labels()} if labels else {}
    entities_by_device: dict[str, list[Any]] = defaultdict(list)
    orphan_entities: list[Any] = []
    for entry in ent_reg.entities.values():
        if entry.disabled_by is not None or entry.hidden_by is not None:
            continue
        if entry.device_id:
            entities_by_device[entry.device_id].append(entry)
        else:
            orphan_entities.append(entry)

    expected_states = {rule.get("entity_id"): rule.get("state") for rule in preferences.get("expected_off_rules", []) if rule.get("entity_id") and isinstance(rule.get("state"), str)}
    override_map = preferences.get("source_overrides", {})
    devices: list[dict[str, Any]] = []

    def entity_model(entry: Any) -> dict[str, Any] | None:
        state_obj = hass.states.get(entry.entity_id)
        attrs = dict(state_obj.attributes) if state_obj is not None else {}
        entity_category = getattr(entry, "entity_category", None) or attrs.get("entity_category")
        if entity_category is not None:
            entity_category = getattr(entity_category, "value", entity_category)
        icon = getattr(entry, "icon", None) or getattr(entry, "original_icon", None) or attrs.get("icon")
        if not isinstance(icon, str) or not re.fullmatch(r"mdi:[a-z0-9-]+", icon):
            icon = None
        return {
            "entity_id": entry.entity_id,
            "name": entry.name or attrs.get("friendly_name") or entry.entity_id,
            "icon": icon,
            "state": state_obj.state if state_obj is not None else "unknown",
            "domain": entry.domain,
            "device_class": attrs.get("device_class"),
            "entity_category": entity_category,
            "unit": attrs.get("unit_of_measurement"),
            "attributes": attrs,
            "disabled": entry.disabled_by is not None,
        }

    def make_device(device_id: str | None, ident: str, name: str, area_id: str | None, entity_entries: list[Any], device: Any = None) -> dict[str, Any] | None:
        items = [m for entry in entity_entries if (m := entity_model(entry)) is not None]
        if not items:
            return None
        did = device_id
        selected = override_map.get(ident, {})
        signals: dict[str, dict[str, Any] | None] = {}
        for kind in SIGNAL_CLASSES:
            signal = _select_signal(kind, items, selected.get(kind))
            signals[kind] = ({
                "entity_id": signal["entity_id"], "state": signal["state"],
                "value": _signal_value(kind, signal),
                "unit": signal["unit"],
                "meaning": _signal_meaning(kind, signal, expected_states.get(signal["entity_id"]) == signal["state"]),
            } if signal else None)
        primary = selected.get("connectivity")
        expected_ids = {entity["entity_id"] for entity in items if expected_states.get(entity["entity_id"]) == entity["state"]}
        if expected_ids:
            health, reason = "expected_off", "configured_expected_off"
        else:
            health, reason = derive_health(items, primary, expected_ids)
        activity = _latest_event_activity(items, datetime.now(UTC), getattr(hass.config, "time_zone", None))
        area = area_by_id.get(area_id)
        floor_id = getattr(area, "floor_id", None) if area else None
        labels_ids = set(getattr(device, "labels", []) or []) if device else set()
        for entry in entity_entries:
            labels_ids.update(getattr(entry, "labels", []) or [])
        platforms = {getattr(entry, "platform", None) for entry in entity_entries if getattr(entry, "platform", None)}
        device_type, capabilities = _device_capabilities(items, signals)
        firmware_updates = sorted(
            (update for entity in items if (update := _firmware_update(entity)) is not None),
            key=lambda update: update["entity_id"],
        )
        return {
            "id": ident, "device_id": did, "name": name,
            "area_id": area_id, "floor_id": floor_id,
            "labels": sorted(labels_ids),
            "manufacturer": getattr(device, "manufacturer", None),
            "model": getattr(device, "model", None),
            "integration": next(iter(platforms)) if len(platforms) == 1 else None,
            "integrations": sorted(platforms),
            "reported_sw_version": _reported_sw_version(device),
            "entities": items, "signals": signals, "health": health, "health_reason": reason,
            "device_type": device_type, "capabilities": capabilities, "activity": activity,
            "firmware_updates": firmware_updates,
        }

    registered_devices = {}
    for config_entry in hass.config_entries.async_entries():
        for device in device_registry.async_entries_for_config_entry(dev_reg, config_entry.entry_id):
            registered_devices[device.id] = device
    for device in registered_devices.values():
        entries = entities_by_device.get(device.id, [])
        area_id = getattr(device, "area_id", None) or next((e.area_id for e in entries if e.area_id), None)
        ident = device.id
        model = make_device(device.id, ident, device.name_by_user or device.name or device.id, area_id, entries, device)
        if model:
            devices.append(model)
    for entry in orphan_entities:
        model = make_device(None, f"entity:{entry.entity_id}", entry.name or entry.entity_id, entry.area_id, [entry])
        if model:
            devices.append(model)

    scope, value = preferences.get("scope", "all"), preferences.get("scope_value")
    included = preferences.get("included_device_ids")
    if scope == "area":
        devices = [d for d in devices if d["area_id"] == value]
    elif scope == "floor":
        devices = [d for d in devices if d["floor_id"] == value]
    elif scope == "label":
        devices = [d for d in devices if value in d["labels"]]
    elif scope == "integration":
        devices = [d for d in devices if value in d["integrations"]]
    elif scope == "manual" and included is not None:
        devices = [d for d in devices if d["id"] in included]
    excluded = set(preferences.get("excluded_device_ids", []))
    devices = [d for d in devices if d["id"] not in excluded]
    return {
        "devices": devices,
        "areas": [{"id": a.id, "name": a.name} for a in area_by_id.values()],
        "floors": [{"id": f.floor_id, "name": f.name} for f in floor_by_id.values()],
        "labels": [{"id": x.label_id, "name": x.name} for x in label_by_id.values()],
    }


def _numeric_or_state(value: str) -> int | float | str | None:
    try:
        number = float(value)
        return int(number) if number.is_integer() else number
    except (ValueError, TypeError):
        return value if value not in {"unknown", "unavailable", ""} else None


def _optional_string(value: Any) -> str | None:
    return value if isinstance(value, str) and value.strip() else None


def _reported_sw_version(device: Any) -> str | None:
    """Return only the registry's current reported version; never infer latest/status."""
    return _optional_string(getattr(device, "sw_version", None)) if device is not None else None


def _firmware_update(entity: dict[str, Any]) -> dict[str, Any] | None:
    """Return read-only metadata for one HA firmware update entity."""
    if entity.get("domain") != "update" or entity.get("device_class") != "firmware":
        return None
    attrs = entity.get("attributes", {})
    state = entity.get("state")
    return {
        "entity_id": entity["entity_id"],
        "title": _optional_string(attrs.get("title")),
        "state": state if isinstance(state, str) else "unknown",
        "installed_version": _optional_string(attrs.get("installed_version")),
        "latest_version": _optional_string(attrs.get("latest_version")),
        "skipped_version": _optional_string(attrs.get("skipped_version")),
        "release_summary": _optional_string(attrs.get("release_summary")),
        "release_url": _optional_string(attrs.get("release_url")),
        "update_available": True if state == "on" else False if state == "off" else None,
    }


def _signal_value(kind: str, signal: dict[str, Any]) -> int | float | str | None:
    state = signal["state"]
    if kind == "battery":
        # Some integrations publish the level as an attribute while the state
        # contains a label (or vice versa). Prefer the live numeric state.
        parsed = _numeric_or_state(state)
        if isinstance(parsed, (int, float)):
            return parsed
        if state in {"unknown", "unavailable", ""}:
            return None
        for key in ("battery_level", "battery", "percentage"):
            parsed = _numeric_or_state(signal["attributes"].get(key))
            if isinstance(parsed, (int, float)):
                return parsed
        return parsed
    return _numeric_or_state(state)


def _signal_meaning(kind: str, signal: dict[str, Any], expected_off: bool) -> str:
    if kind == "battery" and signal.get("domain") == "binary_sensor" and signal.get("device_class") == "battery":
        if expected_off:
            return "expected_off"
        if signal["state"] == "on":
            return "low"
        if signal["state"] == "off":
            return "ok"
    if kind == "battery" and isinstance(_signal_value(kind, signal), (int, float)):
        return "measured"
    return signal_meaning(signal["state"], expected_off)


def _is_battery_voltage(entity: dict[str, Any]) -> bool:
    if entity.get("domain") != "sensor":
        return False
    label = f"{entity.get('entity_id', '')} {entity.get('name', '')}".casefold()
    unit = str(entity.get("unit") or "").casefold()
    return "battery" in label and unit in {"%", "v", "mv"}


def is_battery_source(entity: dict[str, Any]) -> bool:
    return entity.get("device_class") == "battery" or _is_battery_voltage(entity)


def is_valid_signal_source(kind: str, entity: dict[str, Any]) -> bool:
    if kind == "battery":
        return is_battery_source(entity)
    return kind in SIGNAL_CLASSES and entity.get("device_class") in SIGNAL_CLASSES[kind]


def _select_battery_source(candidates: list[dict[str, Any]]) -> dict[str, Any] | None:
    """Prefer one percentage reading, then a binary low-battery sensor, then voltage.

    Ambiguous candidates at the same priority stay unselected. A saved source
    override is handled by the caller and always takes precedence.
    """
    percent = [e for e in candidates if _battery_priority(e) == 0]
    binary = [e for e in candidates if _battery_priority(e) == 1]
    voltage = [e for e in candidates if _battery_priority(e) == 2]
    for group in (percent, binary, voltage):
        if not group:
            continue
        if len(group) == 1:
            return group[0]
        available = [e for e in group if _signal_value("battery", e) is not None]
        if len(available) == 1:
            return available[0]
        return None
    return None


def _select_signal(
    kind: str, entities: list[dict[str, Any]], override_id: str | None = None
) -> dict[str, Any] | None:
    """Select only role-compatible sources; a bad saved override never falls back."""
    if override_id:
        return next(
            (e for e in entities if e["entity_id"] == override_id and is_valid_signal_source(kind, e)),
            None,
        )
    classes = SIGNAL_CLASSES[kind]
    candidates = [e for e in entities if e["device_class"] in classes]
    if kind == "battery":
        candidates.extend(e for e in entities if _is_battery_voltage(e) and e not in candidates)
        return _select_battery_source(candidates)
    candidates.sort(key=lambda e: e["entity_id"])
    return candidates[0] if len(candidates) == 1 else None


def _battery_priority(entity: dict[str, Any]) -> int | None:
    unit = str(entity.get("unit") or "").casefold()
    if entity.get("domain") == "binary_sensor" and entity.get("device_class") == "battery":
        return 1
    if unit in {"%", "percent", "percentage"}:
        return 0
    if entity.get("device_class") == "battery" and unit not in {"v", "mv"}:
        return 0
    if _is_battery_voltage(entity) or unit in {"v", "mv"} and "battery" in f"{entity.get('entity_id', '')} {entity.get('name', '')}".casefold():
        return 2
    return None


def _parse_event_time(value: Any, now: datetime, timezone_name: str | None) -> datetime | None:
    if not isinstance(value, (str, int, float)) or isinstance(value, bool):
        return None
    try:
        parsed = datetime.fromtimestamp(value, UTC) if isinstance(value, (int, float)) else datetime.fromisoformat(value.strip().replace("Z", "+00:00"))
    except (ValueError, OverflowError, OSError):
        return None
    if parsed.tzinfo is None:
        try:
            parsed = parsed.replace(tzinfo=ZoneInfo(timezone_name)) if timezone_name else parsed.replace(tzinfo=UTC)
        except (ZoneInfoNotFoundError, ValueError):
            parsed = parsed.replace(tzinfo=UTC)
    parsed = parsed.astimezone(UTC)
    if parsed < datetime(2000, 1, 1, tzinfo=UTC) or parsed > now + timedelta(minutes=5):
        return None
    return parsed


def _latest_event_activity(
    entities: list[dict[str, Any]], now: datetime, timezone_name: str | None
) -> dict[str, Any] | None:
    """Describe event entities only from explicit event timestamps, never HA update time."""
    events = sorted((e for e in entities if e["domain"] == "event" and not e.get("disabled")), key=lambda e: e["entity_id"])
    if not events:
        return None
    observed: list[tuple[datetime, dict[str, Any], str | None]] = []
    undated: list[tuple[dict[str, Any], str | None]] = []
    time_keys = ("last_event_at", "event_timestamp", "event_time", "timestamp", "last_triggered", "last_event")
    for entity in events:
        attrs = entity.get("attributes", {})
        event_time = _parse_event_time(entity.get("state"), now, timezone_name)
        if event_time is None:
            for key in time_keys:
                event_time = _parse_event_time(attrs.get(key), now, timezone_name)
                if event_time is not None:
                    break
        event_type = attrs.get("event_type") or attrs.get("event")
        if not isinstance(event_type, str) or not event_type:
            state = entity.get("state")
            event_type = state if isinstance(state, str) and _parse_event_time(state, now, timezone_name) is None else None
        if event_time is None:
            undated.append((entity, event_type))
        else:
            observed.append((event_time, entity, event_type))
    if observed:
        event_time, entity, event_type = max(observed, key=lambda item: item[0])
        return {"entity_id": entity["entity_id"], "event_type": event_type, "last_event_at": event_time.isoformat()}
    entity, event_type = undated[0]
    return {"entity_id": entity["entity_id"], "event_type": event_type, "last_event_at": None}


def _device_capabilities(
    entities: list[dict[str, Any]], signals: dict[str, dict[str, Any] | None]
) -> tuple[str, list[str]]:
    domains = {e["domain"] for e in entities if not e.get("disabled")}
    classes = {e["device_class"] for e in entities if not e.get("disabled") and e.get("device_class")}
    controllable_type = next(
        (domain for domain in ("light", "switch", "camera", "cover", "climate", "fan", "lock") if domain in domains),
        None,
    )
    if controllable_type:
        device_type = controllable_type
    elif domains & {"remote", "event"}:
        device_type = "remote"
    elif domains & {"button", "input_button"} or "button" in classes:
        device_type = "button"
    elif "media_player" in domains and classes & {"tv", "television"}:
        device_type = "tv"
    else:
        device_type = "sensor" if domains & {"sensor", "binary_sensor"} else "other"
    capabilities: set[str] = set()
    capabilities.update(kind for kind, signal in signals.items() if signal is not None)
    for kind, supported_classes in SIGNAL_CLASSES.items():
        if any(not e.get("disabled") and e.get("device_class") in supported_classes for e in entities):
            capabilities.add(kind)
    if any(_is_battery_voltage(e) for e in entities if not e.get("disabled")):
        capabilities.add("battery")
    if "event" in domains:
        capabilities.add("activity")
    if any(e.get("domain") == "update" and e.get("device_class") == "firmware" and not e.get("disabled") for e in entities):
        capabilities.add("firmware")
    if domains & {"light", "switch", "fan", "climate", "cover", "lock", "media_player", "vacuum", "valve"}:
        capabilities.update({"power_state", "control"})
    if any(
        e.get("attributes", {}).get("brightness") is not None
        or (
            isinstance(e.get("attributes", {}).get("supported_color_modes"), (list, tuple, set))
            and any(mode != "onoff" for mode in e["attributes"]["supported_color_modes"])
        )
        for e in entities
    ):
        capabilities.add("brightness")
    return device_type, sorted(capabilities)


def is_low_battery(signal: dict[str, Any] | None) -> bool:
    """Only interpret percentage battery readings as low-battery levels."""
    return bool(
        signal
        and str(signal.get("unit") or "").casefold() in {"%", "percent", "percentage"}
        and isinstance(signal.get("value"), (int, float))
        and signal["value"] < 20
    )
