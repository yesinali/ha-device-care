"""Bounded outage event model and report window calculations."""
from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any


def parse_time(value: str | datetime) -> datetime:
    """Parse ISO timestamp and normalize to UTC."""
    result = datetime.fromisoformat(value.replace("Z", "+00:00")) if isinstance(value, str) else value
    if result.tzinfo is None:
        result = result.replace(tzinfo=timezone.utc)
    return result.astimezone(timezone.utc)


def record_transition(events: list[dict[str, Any]], device_id: str, state: str, at: datetime) -> None:
    """Append an outage start or close the current event for a device."""
    at_iso = parse_time(at).isoformat()
    open_event = next((e for e in reversed(events) if e["device_id"] == device_id and e.get("end") is None), None)
    if state == "offline" and open_event is None:
        events.append({"device_id": device_id, "start": at_iso, "end": None})
    elif state in {"online", "expected_off", "unknown", "partial"} and open_event is not None:
        open_event["end"] = at_iso
        if state in {"unknown", "partial"}:
            open_event["end_reason"] = f"health_{state}"


def close_open_events(events: list[dict[str, Any]], at: datetime | None, reason: str) -> None:
    """Censor confirmed outages at a monitoring boundary, never count unseen gaps."""
    for event in events:
        if event.get("end") is None:
            boundary = parse_time(at) if at is not None else parse_time(event["start"])
            event["end"] = max(parse_time(event["start"]), boundary).isoformat()
            event["end_reason"] = reason


def report_window(
    events: list[dict[str, Any]], now: datetime, hours: int, coverage_since: datetime | None = None
) -> dict[str, Any]:
    """Clip outage intervals to a window; separate starts from observed intervals."""
    end = parse_time(now)
    start = end - timedelta(hours=hours)
    clipped: list[dict[str, Any]] = []
    seconds = 0
    starts = 0
    for event in events:
        event_start = parse_time(event["start"])
        event_end = parse_time(event["end"]) if event.get("end") else end
        if event_start >= start and event_start <= end:
            starts += 1
        clip_start, clip_end = max(start, event_start), min(end, event_end)
        if clip_end <= clip_start:
            continue
        duration = int((clip_end - clip_start).total_seconds())
        seconds += duration
        clipped.append({"device_id": event["device_id"], "start": clip_start.isoformat(), "end": clip_end.isoformat(), "seconds": duration, "ongoing": event.get("end") is None, "end_reason": event.get("end_reason")})
    return {
        "window": f"{hours}h", "start": start.isoformat(), "end": end.isoformat(),
        "coverage_since": parse_time(coverage_since).isoformat() if coverage_since else None,
        "ongoing": [event for event in clipped if event["ongoing"]],
        "events": clipped,
        "stats": {"outage_starts": starts, "outage_intervals": len(clipped), "device_outage_seconds": seconds, "low_battery": 0, "missing_data": 0},
    }
