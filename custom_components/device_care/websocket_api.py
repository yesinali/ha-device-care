"""Authenticated, validated WebSocket API for the panel."""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import callback

from .const import DOMAIN, EVENT_UPDATED
from .discovery import build_inventory, include_new_manual_devices, is_valid_signal_source
from .health import has_available_state
from .history import report_window

_LAYOUTS = {"inventory", "rooms"}
_GROUPS = {"area", "floor", "integration", "none"}
_SORTS = {"name", "health", "area"}
_SCOPES = {"all", "area", "floor", "label", "integration", "manual"}
_SIGNALS = {"motion", "occupancy", "battery", "connectivity"}
_WINDOWS = {"24h": 24, "7d": 168}
_PREFERENCE_FIELDS = {
    "layout", "group_by", "sort", "visible_columns", "included_device_ids", "excluded_device_ids",
    "auto_include_new", "source_overrides", "expected_off_rules", "retention_days", "weekly_report_enabled", "scope", "scope_value",
}


def _runtime(hass):
    entries = hass.data[DOMAIN]["entries"]
    if len(entries) != 1:
        raise vol.Invalid("Device Care config entry is unavailable")
    return next(iter(entries.values()))


def _admin(connection) -> bool:
    return bool(connection.user and connection.user.is_admin)


def _notify(hass, reason: str, device_ids: list[str] | None = None) -> None:
    hass.bus.async_fire(f"{DOMAIN}_{EVENT_UPDATED}", {"reason": reason, "device_ids": device_ids})


async def _get_report_data(hass, window: str) -> dict[str, Any]:
    runtime = _runtime(hass)
    inventory = build_inventory(hass, runtime["store"].data["preferences"])
    tracked_ids = {device["id"] for device in inventory["devices"]}
    tracked_events = [event for event in runtime["store"].data["events"] if event["device_id"] in tracked_ids]
    data = report_window(tracked_events, datetime.now(timezone.utc), _WINDOWS[window], runtime["store"].data.get("monitoring_since"))
    data["window"] = window
    from .discovery import is_low_battery
    low = sum(1 for d in inventory["devices"] if is_low_battery(d["signals"]["battery"]))
    data["stats"]["low_battery"] = low
    data["stats"]["missing_data"] = sum(1 for d in inventory["devices"] if d["health"] == "unknown")
    return data


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/get_data"})
@websocket_api.async_response
async def ws_get_data(hass, connection, msg):
    if not _admin(connection):
        connection.send_error(msg["id"], websocket_api.ERR_UNAUTHORIZED, "Administrator access required")
        return
    runtime = _runtime(hass)
    prefs = runtime["store"].data["preferences"]
    all_devices = build_inventory(hass, {**prefs, "scope": "all", "included_device_ids": None, "excluded_device_ids": []})["devices"]
    known = set(runtime["store"].data.get("known_device_ids", []))
    all_ids = {device["id"] for device in all_devices}
    new_ids = include_new_manual_devices(prefs, known, all_ids)
    runtime["store"].data["known_device_ids"] = sorted(known | all_ids)
    if new_ids:
        await runtime["store"].async_save()
    inventory = build_inventory(hass, prefs)
    connection.send_result(msg["id"], {
        **inventory, "all_devices": all_devices, "preferences": prefs,
        "monitoring_since": runtime["store"].data.get("monitoring_since"),
        "capabilities": {"reports": True, "settings": _admin(connection)},
        "is_admin": _admin(connection),
    })


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/set_preferences", vol.Required("preferences"): dict})
@websocket_api.async_response
async def ws_set_preferences(hass, connection, msg):
    if not _admin(connection):
        connection.send_error(msg["id"], websocket_api.ERR_UNAUTHORIZED, "Administrator access required")
        return
    patch = msg["preferences"]
    if set(patch) - _PREFERENCE_FIELDS:
        connection.send_error(msg["id"], websocket_api.ERR_INVALID_FORMAT, "Unsupported preference field")
        return
    if "layout" in patch and patch["layout"] not in _LAYOUTS:
        connection.send_error(msg["id"], websocket_api.ERR_INVALID_FORMAT, "Invalid layout")
        return
    if "group_by" in patch and patch["group_by"] not in _GROUPS:
        connection.send_error(msg["id"], websocket_api.ERR_INVALID_FORMAT, "Invalid group")
        return
    if "sort" in patch and patch["sort"] not in _SORTS:
        connection.send_error(msg["id"], websocket_api.ERR_INVALID_FORMAT, "Invalid sort")
        return
    if "scope" in patch and patch["scope"] not in _SCOPES:
        connection.send_error(msg["id"], websocket_api.ERR_INVALID_FORMAT, "Invalid scope")
        return
    if "scope_value" in patch and patch["scope_value"] is not None and not isinstance(patch["scope_value"], str):
        connection.send_error(msg["id"], websocket_api.ERR_INVALID_FORMAT, "Invalid scope value")
        return
    if "scope" in patch or "scope_value" in patch:
        current_prefs = _runtime(hass)["store"].data["preferences"]
        candidate_scope = patch.get("scope", current_prefs.get("scope", "all"))
        candidate_value = patch.get("scope_value", current_prefs.get("scope_value"))
        if candidate_scope in {"area", "floor", "label", "integration"} and not candidate_value:
            connection.send_error(msg["id"], websocket_api.ERR_INVALID_FORMAT, "This scope requires a selected value")
            return
        if candidate_scope in {"area", "floor", "label", "integration"}:
            options = build_inventory(hass, {"scope": "all", "excluded_device_ids": []})
            valid_values = {
                "area": {item["id"] for item in options["areas"]},
                "floor": {item["id"] for item in options["floors"]},
                "label": {item["id"] for item in options["labels"]},
                "integration": {integration for device in options["devices"] for integration in device["integrations"]},
            }[candidate_scope]
            if candidate_value not in valid_values:
                connection.send_error(msg["id"], websocket_api.ERR_NOT_FOUND, "Scope value does not exist")
                return
        if candidate_scope == "manual":
            selected = patch.get("included_device_ids", current_prefs.get("included_device_ids"))
            if not isinstance(selected, list):
                connection.send_error(msg["id"], websocket_api.ERR_INVALID_FORMAT, "Manual scope requires an explicit device list")
                return
    if "included_device_ids" in patch and patch["included_device_ids"] is not None and (not isinstance(patch["included_device_ids"], list) or any(not isinstance(item, str) for item in patch["included_device_ids"])):
        connection.send_error(msg["id"], websocket_api.ERR_INVALID_FORMAT, "Invalid selected device list")
        return
    for list_key in ("excluded_device_ids", "visible_columns"):
        if list_key in patch and (not isinstance(patch[list_key], list) or any(not isinstance(item, str) for item in patch[list_key])):
            connection.send_error(msg["id"], websocket_api.ERR_INVALID_FORMAT, f"{list_key} must be a list of strings")
            return
    if "retention_days" in patch and (type(patch["retention_days"]) is not int or not 1 <= patch["retention_days"] <= 365):
        connection.send_error(msg["id"], websocket_api.ERR_INVALID_FORMAT, "Retention must be 1–365 days")
        return
    for boolean_key in ("auto_include_new", "weekly_report_enabled"):
        if boolean_key in patch and type(patch[boolean_key]) is not bool:
            connection.send_error(msg["id"], websocket_api.ERR_INVALID_FORMAT, f"{boolean_key} must be boolean")
            return
    if "source_overrides" in patch:
        if not isinstance(patch["source_overrides"], dict):
            connection.send_error(msg["id"], websocket_api.ERR_INVALID_FORMAT, "Invalid source overrides")
            return
        all_devices = build_inventory(hass, {"scope": "all", "excluded_device_ids": []})["devices"]
        devices_by_id = {
            device["id"]: {entity["entity_id"]: entity for entity in device["entities"]}
            for device in all_devices
        }
        for device_id, sources in patch["source_overrides"].items():
            if not isinstance(device_id, str) or not isinstance(sources, dict) or set(sources) - _SIGNALS:
                connection.send_error(msg["id"], websocket_api.ERR_INVALID_FORMAT, "Invalid source override")
                return
            for role, entity_id in sources.items():
                if entity_id is None:
                    continue
                entity = devices_by_id.get(device_id, {}).get(entity_id)
                if entity is None or hass.states.get(entity_id) is None:
                    connection.send_error(msg["id"], websocket_api.ERR_NOT_FOUND, "Selected entity does not exist")
                    return
                if not is_valid_signal_source(role, entity):
                    connection.send_error(msg["id"], websocket_api.ERR_INVALID_FORMAT, f"Selected entity is not a valid {role} source")
                    return
    if "expected_off_rules" in patch:
        if not isinstance(patch["expected_off_rules"], list):
            connection.send_error(msg["id"], websocket_api.ERR_INVALID_FORMAT, "Expected-off rules must be a list")
            return
        for rule in patch["expected_off_rules"]:
            if not isinstance(rule, dict) or not isinstance(rule.get("id"), str) or not isinstance(rule.get("entity_id"), str) or not isinstance(rule.get("state"), str) or not rule["state"]:
                connection.send_error(msg["id"], websocket_api.ERR_INVALID_FORMAT, "Invalid expected-off rule")
                return
            if hass.states.get(rule["entity_id"]) is None:
                connection.send_error(msg["id"], websocket_api.ERR_NOT_FOUND, "Expected-off entity does not exist")
                return
    runtime = _runtime(hass)
    prefs = runtime["store"].set_preferences(patch)
    await runtime["store"].async_save()
    _notify(hass, "preferences")
    connection.send_result(msg["id"], {"preferences": prefs})


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/subscribe_updates"})
@websocket_api.async_response
async def ws_subscribe(hass, connection, msg):
    """Use standard HA subscribeMessage lifecycle and unsubscribe command."""
    if not _admin(connection):
        connection.send_error(msg["id"], websocket_api.ERR_UNAUTHORIZED, "Administrator access required")
        return
    event_type = f"{DOMAIN}_{EVENT_UPDATED}"

    @callback
    def forward(event):
        connection.send_event(msg["id"], {"event_type": f"{DOMAIN}/updated", "data": event.data})

    unsub = hass.bus.async_listen(event_type, forward)
    runtime = _runtime(hass)
    active = True

    @callback
    def unsubscribe() -> None:
        nonlocal active
        if not active:
            return
        active = False
        unsub()
        connection.subscriptions.pop(msg["id"], None)
        try:
            runtime["unsubscribers"].remove(unsubscribe)
        except ValueError:
            pass

    connection.subscriptions[msg["id"]] = unsubscribe
    runtime["unsubscribers"].append(unsubscribe)
    connection.send_result(msg["id"], {"subscription_id": msg["id"]})


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/get_report", vol.Required("window"): str})
@websocket_api.async_response
async def ws_get_report(hass, connection, msg):
    if not _admin(connection):
        connection.send_error(msg["id"], websocket_api.ERR_UNAUTHORIZED, "Administrator access required")
        return
    if msg["window"] not in _WINDOWS:
        connection.send_error(msg["id"], websocket_api.ERR_INVALID_FORMAT, "Window must be 24h or 7d")
        return
    data = await _get_report_data(hass, msg["window"])
    connection.send_result(msg["id"], data)


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/generate_report", vol.Required("window"): str})
@websocket_api.async_response
async def ws_generate_report(hass, connection, msg):
    if not _admin(connection):
        connection.send_error(msg["id"], websocket_api.ERR_UNAUTHORIZED, "Administrator access required")
        return
    if msg["window"] not in _WINDOWS:
        connection.send_error(msg["id"], websocket_api.ERR_INVALID_FORMAT, "Window must be 24h or 7d")
        return
    connection.send_result(msg["id"], await _get_report_data(hass, msg["window"]))


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/call_entity", vol.Required("entity_id"): str, vol.Required("service"): str, vol.Optional("data", default={}): dict})
@websocket_api.async_response
async def ws_call_entity(hass, connection, msg):
    if not _admin(connection):
        connection.send_error(msg["id"], websocket_api.ERR_UNAUTHORIZED, "Administrator access required")
        return
    from homeassistant.helpers import entity_registry
    entry = entity_registry.async_get(hass)
    entity = entry.async_get(msg["entity_id"])
    state = hass.states.get(msg["entity_id"])
    if entity is None or state is None:
        connection.send_error(msg["id"], websocket_api.ERR_NOT_FOUND, "Entity not found")
        return
    if not has_available_state(state):
        connection.send_error(msg["id"], websocket_api.ERR_NOT_FOUND, "Entity state is currently unavailable")
        return
    if getattr(entity, "entity_category", None) != "config":
        connection.send_error(msg["id"], websocket_api.ERR_UNAUTHORIZED, "Only CONFIG entities can be controlled")
        return
    domain = entity.domain
    service = msg["service"]
    data = dict(msg.get("data", {}))
    data["entity_id"] = msg["entity_id"]
    allowed = {"number": {"set_value"}, "select": {"select_option"}, "switch": {"turn_on", "turn_off"}}
    if service not in allowed.get(domain, set()):
        connection.send_error(msg["id"], websocket_api.ERR_UNAUTHORIZED, "Unsupported setting operation")
        return
    if domain == "number":
        value = data.get("value")
        attrs = state.attributes
        step = attrs.get("step")
        min_value = attrs.get("min", 0)
        step_invalid = step is not None and (
            not isinstance(step, (int, float)) or step <= 0 or
            isinstance(value, (int, float)) and abs((value - min_value) / step - round((value - min_value) / step)) > 1e-8
        )
        if set(data) - {"entity_id", "value"} or not isinstance(value, (int, float)) or ("min" in attrs and value < attrs["min"]) or ("max" in attrs and value > attrs["max"]) or step_invalid:
            connection.send_error(msg["id"], websocket_api.ERR_INVALID_FORMAT, "Value is outside the entity limits")
            return
    if domain == "select":
        if set(data) - {"entity_id", "option"} or data.get("option") not in state.attributes.get("options", []):
            connection.send_error(msg["id"], websocket_api.ERR_INVALID_FORMAT, "Option is not supported by this entity")
            return
    if domain == "switch" and set(data) - {"entity_id"}:
        connection.send_error(msg["id"], websocket_api.ERR_INVALID_FORMAT, "Switch operations do not accept extra data")
        return
    try:
        await hass.services.async_call(domain, service, data, blocking=True)
    except Exception as err:  # surface an explicit failed operation to the frontend
        connection.send_error(msg["id"], websocket_api.ERR_UNKNOWN_ERROR, f"Could not update setting: {err}")
        return
    connection.send_result(msg["id"], {"success": True})


def async_register(hass) -> None:
    """Register websocket commands once at integration setup."""
    for handler in (ws_get_data, ws_set_preferences, ws_subscribe, ws_get_report, ws_generate_report, ws_call_entity):
        websocket_api.async_register_command(hass, handler)
