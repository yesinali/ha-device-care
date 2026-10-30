"""Versioned, bounded config-entry storage for preferences and outage transitions."""
from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any

from homeassistant.helpers.storage import Store

from .const import PREFS_DEFAULT, STORAGE_KEY, STORAGE_VERSION
from .history import parse_time


class DeviceCareStore:
    """Storage wrapper that bounds event count and retention."""

    def __init__(self, hass: Any, entry_id: str) -> None:
        self._store = Store(hass, STORAGE_VERSION, f"{STORAGE_KEY}.{entry_id}")
        self.data: dict[str, Any] = {"preferences": dict(PREFS_DEFAULT), "events": [], "monitoring_since": None, "known_device_ids": [], "last_observed_at": None, "boot_id": None, "last_shutdown_at": None}
        self.has_data = False

    async def async_load(self) -> None:
        loaded = await self._store.async_load()
        if loaded:
            self.has_data = True
            self.data.update(loaded)
        prefs = dict(PREFS_DEFAULT)
        prefs.update(self.data.get("preferences", {}))
        self.data["preferences"] = prefs
        self._prune(datetime.now(timezone.utc))

    def set_preferences(self, patch: dict[str, Any]) -> dict[str, Any]:
        current = self.data["preferences"]
        current.update(patch)
        self._prune(datetime.now(timezone.utc))
        return current

    def record(self, device_id: str, state: str, at: datetime) -> None:
        from .history import record_transition
        record_transition(self.data["events"], device_id, state, at)
        self._prune(at)

    def _prune(self, now: datetime) -> None:
        cutoff = parse_time(now) - timedelta(days=max(1, min(365, int(self.data["preferences"].get("retention_days", 30)))))
        events = self.data.get("events", [])
        self.data["events"] = [e for e in events if e.get("end") is None or parse_time(e["end"]) >= cutoff][-20000:]

    async def async_save(self) -> None:
        await self._store.async_save(self.data)

    def async_delay_save(self, delay: float = 2.0) -> None:
        """Coalesce state changes into bounded delayed writes."""
        self._store.async_delay_save(lambda: self.data, delay=delay)

    async def async_remove(self) -> None:
        await self._store.async_remove()
