"""Import-free tests for Device Care's health and report calculations."""
import sys
import unittest
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parents[1] / "custom_components"))

from device_care.health import derive_health, signal_meaning
from device_care.discovery import _signal_meaning, _signal_value, is_low_battery
from device_care.const import SIGNAL_CLASSES
from device_care.history import close_open_events, record_transition, report_window
from device_care.discovery import include_new_manual_devices


class CoreTests(unittest.TestCase):
  def test_signal_states_are_explicit(self):
    self.assertEqual(signal_meaning("on"), "active")
    self.assertEqual(signal_meaning("off"), "inactive")
    self.assertEqual(signal_meaning("unavailable"), "unavailable")
    self.assertEqual(signal_meaning("unknown"), "unknown")
    self.assertEqual(signal_meaning(None), "missing")
    self.assertEqual(signal_meaning("off", expected_off=True), "expected_off")


  def test_health_requires_reliable_source(self):
    self.assertEqual(SIGNAL_CLASSES["connectivity"], {"connectivity"})
    self.assertEqual(derive_health([], None)[0], "unknown")
    self.assertEqual(derive_health([{
      "entity_id": "binary_sensor.motion", "domain": "binary_sensor",
      "device_class": "motion", "state": "on",
    }], "binary_sensor.removed_connectivity"), ("unknown", "primary_source_missing"))
    self.assertEqual(derive_health([{"entity_id": "binary_sensor.link", "device_class": "connectivity", "state": "on"}])[0], "online")
    self.assertEqual(derive_health([{"entity_id": "binary_sensor.link", "device_class": "connectivity", "state": "off"}])[0], "offline")
    self.assertEqual(derive_health([{"entity_id": "binary_sensor.problem", "device_class": "problem", "domain": "binary_sensor", "state": "on"}]), ("partial", "device_problem"))
    self.assertEqual(derive_health([{"entity_id": "binary_sensor.problem", "device_class": "problem", "domain": "binary_sensor", "state": "off"}])[0], "unknown")
    self.assertEqual(derive_health([
        {"entity_id": "binary_sensor.a", "device_class": "connectivity", "state": "on"},
        {"entity_id": "binary_sensor.b", "device_class": "connectivity", "state": "unavailable"},
    ])[0], "partial")

  def test_operational_state_is_positive_availability_evidence_only(self):
    self.assertEqual(derive_health([{
      "entity_id": "binary_sensor.room_motion", "domain": "binary_sensor",
      "device_class": "motion", "state": "on",
    }]), ("online", "state_available"))
    self.assertEqual(derive_health([{
      "entity_id": "binary_sensor.room_motion", "domain": "binary_sensor",
      "device_class": "motion", "state": "off",
    }]), ("online", "state_available"))
    self.assertEqual(derive_health([{
      "entity_id": "sensor.rssi", "domain": "sensor", "device_class": None,
      "entity_category": "diagnostic", "state": "-58",
    }])[0], "unknown")
    self.assertEqual(derive_health([{
      "entity_id": "binary_sensor.motion", "domain": "binary_sensor",
      "device_class": "motion", "state": "unknown",
    }])[0], "unknown")
    self.assertEqual(derive_health([{
      "entity_id": "binary_sensor.connectivity", "domain": "binary_sensor",
      "device_class": "connectivity", "entity_category": "diagnostic", "state": "on",
    }])[0], "online")
    self.assertEqual(derive_health([
      {"entity_id": "binary_sensor.link", "domain": "binary_sensor", "device_class": "connectivity", "state": "off"},
      {"entity_id": "binary_sensor.problem", "domain": "binary_sensor", "device_class": "problem", "state": "on"},
    ]), ("offline", "connectivity_off"))

  def test_battery_numeric_voltage_and_binary_low_are_distinct(self):
    percent = {"state": "87", "device_class": "battery", "domain": "sensor", "attributes": {}}
    voltage = {"state": "2.91", "device_class": None, "domain": "sensor", "attributes": {}}
    low = {"state": "on", "device_class": "battery", "domain": "binary_sensor", "attributes": {}}
    self.assertEqual(_signal_value("battery", percent), 87)
    self.assertEqual(_signal_value("battery", voltage), 2.91)
    self.assertEqual(_signal_meaning("battery", low, False), "low")
    self.assertEqual(_signal_meaning("battery", {**low, "state": "off"}, False), "ok")
    self.assertTrue(is_low_battery({"value": 12, "unit": "%"}))
    self.assertFalse(is_low_battery({"value": 2.9, "unit": "V"}))
    self.assertEqual(derive_health([
        {"entity_id": "binary_sensor.a", "device_class": "connectivity", "state": "on"},
        {"entity_id": "binary_sensor.b", "device_class": "connectivity", "state": "off"},
    ])[0], "partial")


  def test_outage_report_clips_window_and_counts_starts_separately(self):
    events = [
        {"device_id": "crossing", "start": "2026-10-30T00:05:00+00:00", "end": "2026-10-30T00:25:00+00:00"},
        {"device_id": "ongoing", "start": "2026-10-31T00:05:00+00:00", "end": None},
    ]
    report = report_window(events, datetime(2026, 10, 31, 0, 15, tzinfo=timezone.utc), 24)
    self.assertEqual(report["stats"]["outage_starts"], 1)
    self.assertEqual(report["stats"]["outage_intervals"], 2)
    self.assertEqual(report["stats"]["device_outage_seconds"], 10 * 60 + 10 * 60)
    self.assertEqual(report["ongoing"][0]["device_id"], "ongoing")


  def test_transition_events_open_and_close(self):
    events = []
    record_transition(events, "device", "offline", datetime(2026, 1, 1, tzinfo=timezone.utc))
    record_transition(events, "device", "online", datetime(2026, 1, 1, 0, 10, tzinfo=timezone.utc))
    self.assertEqual(len(events), 1)
    self.assertEqual(events[0]["end"], "2026-01-01T00:10:00+00:00")

  def test_uncertain_health_closes_confirmed_downtime_without_recovery_claim(self):
    for uncertain in ("unknown", "partial"):
      events = []
      record_transition(events, "device", "offline", datetime(2026, 1, 1, tzinfo=timezone.utc))
      record_transition(events, "device", uncertain, datetime(2026, 1, 1, 1, tzinfo=timezone.utc))
      report = report_window(events, datetime(2026, 1, 1, 2, tzinfo=timezone.utc), 24)
      self.assertEqual(report["stats"]["device_outage_seconds"], 3600)
      self.assertEqual(events[0]["end_reason"], f"health_{uncertain}")

  def test_home_assistant_gap_censors_open_outage(self):
    events = []
    record_transition(events, "device", "offline", datetime(2026, 1, 1, tzinfo=timezone.utc))
    close_open_events(events, datetime(2026, 1, 1, 1, tzinfo=timezone.utc), "ha_stopped")
    report = report_window(events, datetime(2026, 1, 1, 4, tzinfo=timezone.utc), 24)
    self.assertEqual(report["stats"]["device_outage_seconds"], 3600)
    self.assertEqual(report["ongoing"], [])
    self.assertEqual(report["events"][0]["end_reason"], "ha_stopped")

  def test_restart_without_last_observation_does_not_assume_downtime(self):
    events = []
    record_transition(events, "device", "offline", datetime(2026, 1, 1, tzinfo=timezone.utc))
    close_open_events(events, None, "ha_restart_gap")
    report = report_window(events, datetime(2026, 1, 2, tzinfo=timezone.utc), 24)
    self.assertEqual(report["stats"]["device_outage_seconds"], 0)
    self.assertEqual(events[0]["end_reason"], "ha_restart_gap")
    self.assertEqual(report["events"], [])

  def test_new_manual_scope_devices_persist_once_and_respect_exclusions(self):
    preferences = {
      "scope": "manual", "auto_include_new": True,
      "included_device_ids": ["picked"], "excluded_device_ids": ["excluded"],
    }
    known = {"picked", "existing-unselected", "excluded"}
    ids = {"picked", "existing-unselected", "excluded", "brand-new"}
    new = include_new_manual_devices(preferences, known, ids)
    self.assertEqual(new, {"brand-new"})
    self.assertEqual(preferences["included_device_ids"], ["brand-new", "picked"])
    # After persistence/reload, the newly included ID stays selected and isn't re-added.
    reloaded = dict(preferences)
    self.assertEqual(include_new_manual_devices(reloaded, known | new, ids), set())
    self.assertEqual(reloaded["included_device_ids"], ["brand-new", "picked"])
