# Device Care 0.1.0-beta.2

This source bundle contains the complete custom integration, compiled panel, frontend sources, API contract, and regression tests for beta.2. No Home Assistant configuration, entity history, token, or other personal HA data is included.

## What changed

- Current motion, occupancy, and other operational states can establish snapshot availability; unknown/unavailable state and diagnostic RSSI/LQI do not.
- Only an explicit connectivity entity reporting `off` records an outage. A `problem` entity reporting `on` is shown as a partial device fault, not a connectivity outage.
- Configured connectivity sources that disappear remain unknown; the backend does not silently substitute another signal.
- Numeric battery levels and battery voltage keep their value and unit; binary battery sensors distinguish low from okay. Voltage is not counted as a percent low-battery reading.
- Motion and occupancy remain distinct signals and no longer duplicate the same entity in the panel.
- Device name and model are displayed on separate lines.

## Apply to a repository checkout

Extract this archive over the root of your existing `ha-device-care` Git checkout. Review the resulting diff, then commit and push it:

```sh
git status --short
git diff --check
git add custom_components/device_care frontend-src DEVICE_CARE_API.md CHANGELOG.md tests
git commit -m "Fix device health and battery indicators"
git push origin HEAD
```

To publish a HACS beta after reviewing the pushed commit, create and push the version tag:

```sh
git tag -a 0.1.0-beta.2 -m "Device Care 0.1.0-beta.2"
git push origin 0.1.0-beta.2
```

Then create a GitHub release for that tag if your HACS repository workflow expects a release. The assistant did not push to GitHub or create a tag/release.

## Install directly in Home Assistant

Back up Home Assistant first. Copy `custom_components/device_care` from this bundle to `<config>/custom_components/device_care`, replacing the prior integration files, then restart Home Assistant. The integration's `.storage/device_care.storage*` files are not part of this bundle and should remain untouched. After restart, clear the browser cache/reload the panel if the previous JavaScript remains cached.

## Verification

The pure Python suite passes on Python 3.14.8 / Home Assistant 2026.10.4 (`10 passed`), frontend typecheck succeeds, and frontend DOM tests pass (`7 passed`). The isolated HA runtime check verifies config flow, admin WebSocket reads/reports, push subscription cleanup, unload/reload, and preference persistence. This is not a check against a user's live HA instance or their physical integrations.
