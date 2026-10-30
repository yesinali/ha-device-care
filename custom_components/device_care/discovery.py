"""Build a normalized inventory from Home Assistant registries and states."""
from __future__ import annotations

from collections import defaultdict
from typing import Any

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
        return {
            "entity_id": entry.entity_id,
            "name": entry.name or attrs.get("friendly_name") or entry.entity_id,
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
        for kind, classes in SIGNAL_CLASSES.items():
            candidates = [e for e in items if e["device_class"] in classes]
            if kind == "battery":
                candidates.extend(e for e in items if _is_battery_voltage(e) and e not in candidates)
            forced = selected.get(kind)
            if forced:
                candidates = [e for e in items if e["entity_id"] == forced]
            # A battery class may be exposed as either a numeric sensor (level
            # or voltage) or a binary sensor (low battery). Don't silently pick
            # an arbitrary source when a device has several candidates.
            candidates = sorted(candidates, key=lambda e: e["entity_id"])
            signal = candidates[0] if len(candidates) == 1 else None
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
        area = area_by_id.get(area_id)
        floor_id = getattr(area, "floor_id", None) if area else None
        labels_ids = set(getattr(device, "labels", []) or []) if device else set()
        for entry in entity_entries:
            labels_ids.update(getattr(entry, "labels", []) or [])
        platforms = {getattr(entry, "platform", None) for entry in entity_entries if getattr(entry, "platform", None)}
        return {
            "id": ident, "device_id": did, "name": name,
            "area_id": area_id, "floor_id": floor_id,
            "labels": sorted(labels_ids),
            "manufacturer": getattr(device, "manufacturer", None),
            "model": getattr(device, "model", None),
            "integration": next(iter(platforms)) if len(platforms) == 1 else None,
            "integrations": sorted(platforms),
            "entities": items, "signals": signals, "health": health, "health_reason": reason,
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
    return signal_meaning(signal["state"], expected_off)


def _is_battery_voltage(entity: dict[str, Any]) -> bool:
    if entity.get("domain") != "sensor":
        return False
    label = f"{entity.get('entity_id', '')} {entity.get('name', '')}".casefold()
    unit = str(entity.get("unit") or "").casefold()
    return "battery" in label and unit in {"%", "v", "mv"}


def is_low_battery(signal: dict[str, Any] | None) -> bool:
    """Only interpret percentage battery readings as low-battery levels."""
    return bool(
        signal
        and str(signal.get("unit") or "").casefold() in {"%", "percent", "percentage"}
        and isinstance(signal.get("value"), (int, float))
        and signal["value"] < 20
    )
