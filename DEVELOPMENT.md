# Development and testing

This page is for contributors and maintainers. Home Assistant users do not need Node.js, npm, or Python development tools to install a published HACS release.

## Project files

- `custom_components/device_care/` contains the Home Assistant integration.
- `frontend-src/src/` contains the TypeScript/Lit panel source; its production bundle is served from `custom_components/device_care/frontend/`.
- `frontend-src/tests/` contains frontend DOM tests.
- `tests/test_core.py` contains backend model/report tests; `tests/runtime_check.py` exercises an isolated Home Assistant lifecycle.
- [DEVICE_CARE_API.md](DEVICE_CARE_API.md) documents internal WebSocket and data contracts. It is not required for installation or everyday use.
- [QA_RELEASE_REPORT.md](QA_RELEASE_REPORT.md) records the latest release-candidate checks and their limits.

## Frontend

Use Node.js 22 or newer. From `frontend-src/`:

```sh
npm ci
npm run typecheck
npm test
npm run build
```

The build produces the frontend bundle. Keep the checked-in integration bundle synchronized with source changes before preparing a release.

## Backend and Home Assistant runtime

The current CI/runtime check target is Home Assistant Core 2026.10.4 with Python 3.14.8. This target is not a declaration of the minimum supported Home Assistant version. In an isolated virtual environment:

```sh
python3.14 -m pip install "homeassistant==2026.10.4" pytest
PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 python3.14 -m pytest -q tests/test_core.py
python3.14 -m compileall -q custom_components/device_care
python3.14 tests/runtime_check.py
```

The runtime smoke check uses a temporary Home Assistant configuration and stubs optional network-adapter discovery for containers without network interfaces. Run it only in a disposable environment. It does not validate hardware integrations, a user's Home Assistant configuration, or real physical devices.

Frontend, backend, and Home Assistant runtime checks are not a substitute for HACS validation, Hassfest, or testing on supported real installations. Record which checks ran in [QA_RELEASE_REPORT.md](QA_RELEASE_REPORT.md).

## Localization

The Home Assistant config flow translations live in `custom_components/device_care/strings.json` and `translations/`. Panel translations belong in typed locale dictionaries in the frontend; keep interpolated values explicit and do not translate device-provided names or values. Validate every supported locale, including errors, empty states, controls, and accessible labels. Format dates with the active Home Assistant locale and configured Home Assistant time zone.

## Contribution and release notes

Follow [CONTRIBUTING.md](CONTRIBUTING.md). Never commit personal Home Assistant configuration, device inventories, tokens, private addresses, or unredacted screenshots. Keep user-facing release and install status accurate: a version in source is not a published GitHub release.
