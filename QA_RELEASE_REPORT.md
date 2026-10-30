# Device Care beta4 QA report

Date: 2026-10-30  
Version: 0.1.0-beta.4  
QA target: Home Assistant Core 2026.10.4, Python 3.14.8  
State: development preview; no live home or physical devices tested

## Checks completed

- Backend model/report tests: 16 passed (`tests/test_core.py`). Pytest plugin autoload was disabled because the installed Home Assistant pytest plugin targets an older Core API.
- Frontend TypeScript typecheck: passed on Node.js 22.23.4.
- Frontend production Vite build: passed on Node.js 22.23.4; packaged JavaScript was regenerated.
- Frontend DOM tests: 15 passed (`frontend-src/tests`). Coverage includes the default locked state, no control calls before explicit unlock, request unlock flag, session reset behavior, CONFIG state/range checks, safe device icons, and read-only firmware status.
- Isolated Home Assistant runtime smoke: passed on Core 2026.10.4 using `tests/runtime_check.py` and a temporary config directory. It exercised bootstrap, config flow, admin-only WebSocket access, CONFIG write rejection and allowed-call paths, push subscribe/unsubscribe, unload/reload, panel registration/cleanup, and preference persistence.
- Python `compileall`, integration manifest JSON validation, and HACS metadata JSON validation: passed.

## Limits and release readiness

This is not a production installation test. It does not validate a user's Home Assistant configuration, installed integrations, physical devices, or live dashboards. No browser screenshot review was available in this environment. No minimum supported Home Assistant version is declared. The exact tested target was 2026.10.4.

GitHub-hosted CI, HACS validation, and Hassfest were not run locally. No repository write, tag, or release was created. `yesinali/ha-device-care` remains provisional metadata pending publication. The README documents the known HACS 2.0.5 Marketplace/CDN icon limitation; the local integration brand assets are present and no unsupported `hacs.json` icon field was added.

No personal Home Assistant configuration, device inventory, tokens, or network addresses were used in the source package. The source archive excludes dependency directories, bytecode/cache files, and local environments.
