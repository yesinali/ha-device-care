# Changelog

All notable changes to this project will be documented here. The project has not published a release yet.

## 0.1.0-beta.2

- Treat current operational entity states as positive availability evidence while keeping missing, unavailable, and diagnostic-only telemetry unknown.
- Count offline time only from explicit connectivity sources; device problem entities report a partial/device-problem state.
- Decode numeric battery level/voltage values and binary low-battery sensors separately; low-battery totals only include percentage readings.
- Separate motion and occupancy roles to prevent duplicate badges.

## Unreleased

- Initial Home Assistant custom integration and HACS packaging are in development.
- No minimum supported Home Assistant version has been declared; compatibility must be confirmed for the target installation.
- An isolated runtime smoke check passes on Home Assistant Core 2026.10.4. No user's live Home Assistant installation or physical device integrations have been validated.
