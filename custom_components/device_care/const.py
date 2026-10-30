"""Constants for Device Care."""
from __future__ import annotations

DOMAIN = "device_care"
VERSION = "0.1.0-beta.5"
PLATFORMS: list[str] = []
PANEL_URL = "device-care"
PANEL_TITLE = "Device Care"
PANEL_ICON = "mdi:heart-pulse"
STORAGE_VERSION = 1
STORAGE_KEY = f"{DOMAIN}.storage"
PREFS_DEFAULT = {
    "schema_version": 1,
    "layout": "inventory",
    "group_by": "area",
    "sort": "name",
    "visible_columns": ["name", "area", "health", "motion", "occupancy", "battery"],
    "included_device_ids": None,
    "excluded_device_ids": [],
    "auto_include_new": True,
    "source_overrides": {},
    "expected_off_rules": [],
    "retention_days": 30,
    "weekly_report_enabled": False,
    "scope": "all",
    "scope_value": None,
}
SIGNAL_CLASSES = {
    "motion": {"motion"},
    "occupancy": {"occupancy"},
    "battery": {"battery"},
    "connectivity": {"connectivity"},
}
EVENT_UPDATED = "device_care_updated"
