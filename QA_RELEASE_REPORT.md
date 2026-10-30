# Device Care beta3 QA report

Date: 2026-10-30  
Version: 0.1.0-beta.3  
QA target: Home Assistant Core 2026.10.4, Python 3.14.8  
State: development preview; no live home or physical devices tested

## Checks completed

- Backend model and report tests: 13 passed (`tests/test_core.py`). Pytest plugin autoload was disabled because the installed Home Assistant pytest plugin targets an older Core API.
- Frontend TypeScript typecheck: passed on Node.js 22.23.4.
- Frontend production Vite build: passed on Node.js 22.23.4; packaged JavaScript was regenerated.
- Frontend DOM tests: 10 passed (`frontend-src/tests`).
- Isolated Home Assistant runtime smoke: passed on Core 2026.10.4 using `tests/runtime_check.py` and a temporary config directory. It exercised bootstrap, config flow, admin-only WebSocket access, push subscribe/unsubscribe, unload/reload, panel registration/cleanup, and preference persistence.
- The runtime smoke emitted optional environment warnings for skipped dependency installation, unavailable network interfaces, and native camera dependencies. The integration lifecycle checks completed successfully.

## Limits and release readiness

This is not a production installation test. It does not validate a user's Home Assistant configuration, installed integrations, physical devices, or live dashboards. No minimum supported Home Assistant version is declared. The exact tested target was 2026.10.4.

GitHub-hosted CI, HACS validation, and Hassfest were not run locally. No repository write, tag, or release was created. `yesinali/ha-device-care` remains provisional metadata pending publication.

No personal Home Assistant configuration, device inventory, tokens, or network addresses were used in the source package. The source archive excludes dependency directories, bytecode/cache files, and local environments.
