"""Import-free tests for Device Care's health and report calculations."""
import sys
import json
import unittest
from datetime import datetime, timezone
from pathlib import Path
from types import SimpleNamespace

sys.path.insert(0, str(Path(__file__).parents[1] / "custom_components"))

from device_care.health import derive_health, has_available_state, signal_meaning
from device_care.discovery import (
  _device_capabilities, _latest_event_activity, _select_battery_source, _select_signal,
  _firmware_update, _reported_sw_version, _signal_meaning, _signal_value, is_low_battery,
  is_valid_signal_source,
)
from device_care.const import SIGNAL_CLASSES
from device_care.history import close_open_events, record_transition, report_window
from device_care.discovery import include_new_manual_devices
from device_care import _weekly_report_notification


class CoreTests(unittest.TestCase):
  def test_localization_files_and_weekly_notification(self):
    component = Path(__file__).parents[1] / "custom_components" / "device_care"
    base = json.loads((component / "strings.json").read_text())
    english = json.loads((component / "translations" / "en.json").read_text())
    turkish = json.loads((component / "translations" / "tr.json").read_text())
    self.assertEqual(base, english)
    values = {"outage_starts": 2, "device_outage_seconds": 1800, "low_battery": 1}
    title, text = _weekly_report_notification(values, "2026-10-01T00:00:00+00:00", "en")
    self.assertEqual(title, "Device Care — weekly report")
    self.assertIn("2 outage starts", text)
    title, text = _weekly_report_notification(values, None, "tr-TR")
    self.assertIn("haftalık rapor", title)
    self.assertIn("2 kesinti başlangıcı", text)
    self.assertEqual(
      set(base["selector"]["device_scope"]["options"]),
      {"all", "area", "floor", "label", "integration", "manual"},
    )

  def test_signal_states_are_explicit(self):
    self.assertEqual(signal_meaning("on"), "active")
    self.assertEqual(signal_meaning("off"), "inactive")
    self.assertEqual(signal_meaning("unavailable"), "unavailable")
    self.assertEqual(signal_meaning("unknown"), "unknown")
    self.assertEqual(signal_meaning(None), "missing")
    self.assertEqual(signal_meaning("off", expected_off=True), "expected_off")
    self.assertTrue(has_available_state("off"))
    self.assertFalse(has_available_state(None))
    self.assertFalse(has_available_state("unknown"))
    self.assertFalse(has_available_state("unavailable"))


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
      "entity_id": "sensor.remote_battery", "domain": "sensor",
      "device_class": "battery", "entity_category": "diagnostic", "state": "100",
    }]), ("unknown", "no_reachability_source"))
    self.assertEqual(derive_health([{
      "entity_id": "sensor.remote_temperature", "domain": "sensor",
      "device_class": "temperature", "state": "21.5",
    }]), ("unknown", "no_reachability_source"))
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
    self.assertEqual(_signal_meaning("battery", percent, False), "measured")
    self.assertEqual(_signal_meaning("battery", voltage, False), "measured")
    self.assertEqual(_signal_meaning("battery", low, False), "low")
    self.assertEqual(_signal_meaning("battery", {**low, "state": "off"}, False), "ok")
    self.assertTrue(is_low_battery({"value": 12, "unit": "%"}))
    self.assertFalse(is_low_battery({"value": 2.9, "unit": "V"}))

  def test_battery_prefers_unique_percent_over_voltage_but_keeps_equal_sources_ambiguous(self):
    percent = {"entity_id": "sensor.remote_battery", "state": "100", "device_class": "battery", "domain": "sensor", "unit": "%", "name": "Battery", "attributes": {}}
    voltage = {"entity_id": "sensor.remote_battery_voltage", "state": "3.1", "device_class": "voltage", "domain": "sensor", "unit": "V", "name": "Battery voltage", "attributes": {}}
    another_percent = {**percent, "entity_id": "sensor.remote_battery_level_2"}
    self.assertEqual(_select_battery_source([voltage, percent]), percent)
    self.assertIsNone(_select_battery_source([percent, another_percent]))
    self.assertEqual(_select_signal("battery", [percent, voltage], "sensor.remote_battery_voltage"), voltage)
    self.assertIsNone(_select_signal("battery", [percent, voltage], "switch.remote_unrelated"))
    self.assertTrue(is_valid_signal_source("battery", voltage))
    self.assertFalse(is_valid_signal_source("battery", {**percent, "entity_id": "switch.remote", "domain": "switch", "device_class": None}))

  def test_event_activity_uses_explicit_valid_timestamp_without_claiming_reachability(self):
    now = datetime(2026, 10, 30, 12, tzinfo=timezone.utc)
    events = [
      {"entity_id": "event.remote_a", "domain": "event", "state": "single_press", "attributes": {"event_type": "single_press", "event_timestamp": "2026-10-30T10:30:00+00:00"}},
      {"entity_id": "event.remote_b", "domain": "event", "state": "2026-10-30T11:00:00+00:00", "attributes": {}},
      {"entity_id": "event.future", "domain": "event", "state": "2099-01-01T00:00:00Z", "attributes": {}},
    ]
    activity = _latest_event_activity(events, now, "UTC")
    self.assertEqual(activity, {"entity_id": "event.remote_b", "event_type": None, "last_event_at": "2026-10-30T11:00:00+00:00"})
    self.assertEqual(derive_health(events), ("unknown", "no_reachability_source"))

  def test_remote_device_type_and_capabilities_use_entities_not_names(self):
    entities = [
      {"domain": "event", "device_class": "button", "entity_id": "event.remote", "attributes": {}, "disabled": False},
      {"domain": "sensor", "device_class": "battery", "entity_id": "sensor.remote_battery", "unit": "%", "name": "Battery", "attributes": {}, "disabled": False},
      {"domain": "update", "device_class": "firmware", "entity_id": "update.remote_firmware", "attributes": {}, "disabled": False},
    ]
    device_type, capabilities = _device_capabilities(entities, {"battery": None, "connectivity": None, "motion": None, "occupancy": None})
    self.assertEqual(device_type, "remote")
    self.assertEqual(capabilities, ["activity", "battery", "firmware"])

  def test_device_type_prioritizes_light_over_button_and_distinguishes_button_from_tv(self):
    empty_signals = {"motion": None, "occupancy": None, "battery": None, "connectivity": None}
    light_type, _ = _device_capabilities([
      {"domain": "light", "device_class": None, "entity_id": "light.room", "attributes": {}, "disabled": False},
      {"domain": "button", "device_class": None, "entity_id": "button.identify", "attributes": {}, "disabled": False},
    ], empty_signals)
    button_type, _ = _device_capabilities([
      {"domain": "button", "device_class": None, "entity_id": "button.remote", "attributes": {}, "disabled": False},
    ], empty_signals)
    tv_type, _ = _device_capabilities([
      {"domain": "media_player", "device_class": "tv", "entity_id": "media_player.tv", "attributes": {}, "disabled": False},
    ], empty_signals)
    self.assertEqual(light_type, "light")
    self.assertEqual(button_type, "button")
    self.assertEqual(tv_type, "tv")

  def test_firmware_update_model_preserves_unknown_and_skipped_versions(self):
    entity = {
      "entity_id": "update.router_firmware", "domain": "update", "device_class": "firmware",
      "state": "off", "attributes": {
        "title": "Router firmware", "installed_version": "1.2.0", "latest_version": "1.3.0",
        "skipped_version": "1.3.0", "release_summary": "Security fixes", "release_url": "https://example.invalid/release",
      },
    }
    update = _firmware_update(entity)
    self.assertEqual(update["installed_version"], "1.2.0")
    self.assertEqual(update["latest_version"], "1.3.0")
    self.assertEqual(update["skipped_version"], "1.3.0")
    self.assertFalse(update["update_available"])
    self.assertIsNone(_firmware_update({**entity, "state": "unknown"})["update_available"])
    self.assertIsNone(_firmware_update({**entity, "state": "unavailable"})["update_available"])
    self.assertIsNone(_firmware_update({**entity, "domain": "sensor"}))

  def test_registry_software_version_is_reported_current_only(self):
    self.assertEqual(_reported_sw_version(SimpleNamespace(sw_version="4.2.1")), "4.2.1")
    self.assertIsNone(_reported_sw_version(SimpleNamespace(sw_version=None)))
    self.assertIsNone(_reported_sw_version(None))
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
