"""Pure device health and signal classification helpers."""
from __future__ import annotations

from collections.abc import Mapping, Sequence
from typing import Any


def signal_meaning(state: str | None, expected_off: bool = False) -> str:
    """Map an HA state into display semantics; never infer missing as inactive."""
    if expected_off:
        return "expected_off"
    if state is None:
        return "missing"
    if state == "unavailable":
        return "unavailable"
    if state in ("unknown", ""):
        return "unknown"
    if state == "on":
        return "active"
    if state == "off":
        return "inactive"
    return "unknown"


def derive_health(
    entities: Sequence[Mapping[str, Any]],
    primary_entity_id: str | None = None,
    expected_off_entity_ids: set[str] | None = None,
) -> tuple[str, str | None]:
    """Derive conservative health from configured primary or connectivity entities.

    A single unavailable diagnostic entity never makes a device offline. A selected
    primary source can decide health; otherwise connectivity entities are used.
    """
    expected = expected_off_entity_ids or set()
    if primary_entity_id:
        candidates = [e for e in entities if e.get("entity_id") == primary_entity_id]
    else:
        candidates = [
            e for e in entities
            if e.get("device_class") in {"connectivity", "problem"}
            and e.get("entity_category") != "diagnostic"
            and not e.get("disabled")
        ]
    if not candidates:
        active = [e for e in entities if not e.get("disabled") and e.get("entity_category") != "diagnostic"]
        if not active:
            return "unknown", "no_enabled_entities"
        if all(e.get("state") in {None, "unknown"} for e in active):
            return "unknown", "no_health_source"
        return "unknown", "no_health_source"
    states = []
    for entity in candidates:
        state = str(entity.get("state", "unknown"))
        if entity.get("device_class") == "problem":
            state = {"on": "off", "off": "on"}.get(state, state)
        states.append(state)
    if all(e.get("entity_id") in expected for e in candidates):
        return "expected_off", "configured_expected_off"
    if all(state == "on" for state in states):
        return "online", None
    if all(state == "off" for state in states):
        return "offline", "connectivity_off"
    if any(state == "off" for state in states) and any(state == "on" for state in states):
        return "partial", "mixed_connectivity_sources"
    if any(state == "on" for state in states):
        return "partial", "mixed_connectivity_sources"
    if any(state == "unavailable" for state in states):
        return "unknown", "health_source_unavailable"
    return "unknown", "health_source_unknown"
