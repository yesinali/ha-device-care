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
    """Derive conservative health from connectivity or current operational states.

    Only explicit connectivity=off reports offline. A problem-class entity that
    is on reports a fault/partial state, not an outage. A current operational
    state can establish state availability, but this is not a heartbeat check.
    """
    expected = expected_off_entity_ids or set()
    if primary_entity_id:
        selected = next((e for e in entities if e.get("entity_id") == primary_entity_id), None)
        if selected is None or selected.get("disabled"):
            return "unknown", "primary_source_missing"
        if selected.get("device_class") != "connectivity":
            return "unknown", "invalid_primary_source"
        candidates = [selected]
    else:
        candidates = [
            e for e in entities
            if e.get("device_class") == "connectivity"
            and not e.get("disabled")
        ]
    problem_entities = [
        e for e in entities
        if e.get("device_class") == "problem"
        and e.get("entity_category") != "diagnostic"
        and not e.get("disabled")
    ]
    if not candidates:
        # HA devices rarely expose a dedicated connectivity entity. A concrete
        # state from an enabled, operational entity (for example motion=off or
        # a light=switch state) is evidence that HA has a current state, but is
        # not evidence of an outage when it is off. Diagnostic/config entities
        # are intentionally excluded; RSSI/LQI values are telemetry, not a
        # connectivity verdict. This is a snapshot availability signal, not a
        # heartbeat or reachability guarantee.
        operational = [
            e for e in entities
            if not e.get("disabled")
            and e.get("entity_category") not in {"diagnostic", "config"}
            and e.get("domain") in {
                "binary_sensor", "button", "climate", "cover", "fan",
                "light", "lock", "media_player", "number", "select",
                "sensor", "switch", "vacuum", "valve",
            }
        ]
        if any(e.get("state") == "on" for e in problem_entities):
            return "partial", "device_problem"
        if any(e.get("state") not in {None, "", "unknown", "unavailable"} for e in operational if e.get("device_class") != "problem"):
            return "online", "state_available"
        if not operational:
            return "unknown", "no_health_source"
        return "unknown", "health_source_unavailable"
    states = [str(entity.get("state", "unknown")) for entity in candidates]
    if all(e.get("entity_id") in expected for e in candidates):
        return "expected_off", "configured_expected_off"
    if all(state == "off" for state in states):
        return "offline", "connectivity_off"
    if any(e.get("state") == "on" for e in problem_entities):
        return "partial", "device_problem"
    if all(state == "on" for state in states):
        return "online", None
    if any(state == "off" for state in states) and any(state == "on" for state in states):
        return "partial", "mixed_connectivity_sources"
    if any(state == "on" for state in states):
        return "partial", "mixed_connectivity_sources"
    if any(state == "unavailable" for state in states):
        return "unknown", "health_source_unavailable"
    if any(state == "on" for state in problem_entities):
        return "partial", "device_problem"
    return "unknown", "health_source_unknown"
