"""Repeatable microbenchmark of registry discovery and bounded report math.

Run with: python tests/benchmark_synthetic.py
This measures the pure inventory/report computation, not a full HA event loop.
"""
from __future__ import annotations

import statistics
import time
from datetime import datetime, timedelta, timezone
from types import SimpleNamespace
from unittest.mock import patch

from homeassistant.core import State
from homeassistant.helpers import area_registry, device_registry, entity_registry, floor_registry, label_registry

from custom_components.device_care.const import PREFS_DEFAULT
from custom_components.device_care.discovery import build_inventory
from custom_components.device_care.history import report_window


def bench(number: int, repetitions: int = 7) -> tuple[float, float]:
    devices = []
    entities = {}
    states = {}
    for index in range(number):
        device_id = f"synthetic-{index}"
        devices.append(SimpleNamespace(
            id=device_id, area_id=None, name_by_user=None, name=f"Synthetic {index}",
            labels=set(), manufacturer="Fixture", model="Fixture 1",
        ))
        for kind, device_class, state in (
            ("link", "connectivity", "on"), ("motion", "motion", "off"), ("battery", "battery", "82")
        ):
            entity_id = f"sensor.synthetic_{index}_{kind}"
            entities[entity_id] = SimpleNamespace(
                entity_id=entity_id, name=entity_id, domain="sensor", device_id=device_id,
                area_id=None, disabled_by=None, hidden_by=None, entity_category=None,
                platform="fixture", labels=set(),
            )
            attrs = {"device_class": device_class}
            if kind == "battery":
                attrs["unit_of_measurement"] = "%"
            states[entity_id] = State(entity_id, state, attrs)

    registry = SimpleNamespace()
    config_entry = SimpleNamespace(entry_id="fixture-entry")
    hass = SimpleNamespace(
        states=SimpleNamespace(get=states.get),
        config_entries=SimpleNamespace(async_entries=lambda: [config_entry]),
    )
    empty_registry = SimpleNamespace(async_list_areas=lambda: [], async_list_floors=lambda: [], async_list_labels=lambda: [])
    all_device_registry = SimpleNamespace()
    entity_registry_obj = SimpleNamespace(entities=entities)
    events = [
        {"device_id": f"synthetic-{index}", "start": (datetime.now(timezone.utc) - timedelta(minutes=30)).isoformat(), "end": None}
        for index in range(number)
    ]
    prefs = {**PREFS_DEFAULT, "scope": "all", "excluded_device_ids": []}
    with (
        patch.object(device_registry, "async_get", return_value=all_device_registry),
        patch.object(device_registry, "async_entries_for_config_entry", return_value=devices),
        patch.object(entity_registry, "async_get", return_value=entity_registry_obj),
        patch.object(area_registry, "async_get", return_value=empty_registry),
        patch.object(floor_registry, "async_get", return_value=empty_registry),
        patch.object(label_registry, "async_get", return_value=empty_registry),
    ):
        inventory_times = []
        for _ in range(repetitions):
            started = time.perf_counter()
            built = build_inventory(hass, prefs)
            inventory_times.append(time.perf_counter() - started)
        report_times = []
        for _ in range(repetitions):
            started = time.perf_counter()
            report_window(events, datetime.now(timezone.utc), 168)
            report_times.append(time.perf_counter() - started)
    assert len(built["devices"]) == number
    return statistics.median(inventory_times) * 1000, statistics.median(report_times) * 1000


if __name__ == "__main__":
    from importlib.metadata import version
    import sys
    print(f"Home Assistant {version('homeassistant')}; Python {sys.version.split()[0]}; synthetic unit-time benchmark (median of 7)")
    for count in (50, 200):
        inventory_ms, report_ms = bench(count)
        print(f"{count} devices / {count * 3} entities: inventory {inventory_ms:.2f} ms; report {report_ms:.2f} ms")
