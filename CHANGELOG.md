# Changelog

All notable changes to this project will be documented here.

## 0.1.0-beta.5

- Localize setup and options flows in Home Assistant's English (US) and Turkish locales, including device-scope selector choices.
- Use the globally neutral `Device Care` sidebar and entry title; the panel registration API provides one shared title per Home Assistant instance.
- Localize the weekly persistent notification using the Home Assistant instance language (English US by default, Turkish when configured as Turkish).

## 0.1.0-beta.4

- Read-only firmware status from Home Assistant firmware update entities; keep unknown and skipped states explicit and never install updates.
- Show the device registry's reported software version only as current-version metadata, without inferring an available or latest release.
- Require a temporary explicit unlock before supported CONFIG controls can be changed.
- Expose Home Assistant entity icons for type-aware display.
- Document the known HACS 2.0.5 repository-card icon CDN limitation.

## 0.1.0-beta.3

- Prefer a unique battery percentage source over voltage; preserve same-priority ambiguity and validate saved source overrides.
- Expose inferred device type and capabilities, plus event activity only from explicit event timestamps.
- Keep remote reachability unknown without an actual connectivity source and explain the limitation in the panel.
- Treat numeric battery readings as measured values and avoid interpreting numeric telemetry as liveness.
- Reject CONFIG actions when the entity state is unknown or unavailable.

## 0.1.0-beta.2

- Treat current operational entity states as positive availability evidence while keeping missing, unavailable, and diagnostic-only telemetry unknown.
- Count offline time only from explicit connectivity sources; device problem entities report a partial/device-problem state.
- Decode numeric battery level/voltage values and binary low-battery sensors separately; low-battery totals only include percentage readings.
- Separate motion and occupancy roles to prevent duplicate badges.

## Unreleased

- Initial Home Assistant custom integration and HACS packaging are in development.
- No minimum supported Home Assistant version has been declared; compatibility must be confirmed for the target installation.
- An isolated runtime smoke check passes on Home Assistant Core 2026.10.4. No user's live Home Assistant installation or physical device integrations have been validated.
