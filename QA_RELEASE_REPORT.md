# Device Care QA and release report

Date: 2026-10-30  
QA target: Home Assistant Core 2026.10.4, Python 3.14.8  
State: development preview; no live home or physical devices tested

## Checks completed

- Backend model/report tests: 8 passed (`tests/test_core.py`).
- Frontend DOM tests: 5 passed (`frontend-src/tests`).
- Frontend TypeScript typecheck and production Vite build: passed; packaged JS was regenerated.
- Python `compileall`: passed for integration and tests.
- Manifest and HACS JSON parse: passed.
- Isolated HA runtime smoke: passed using `tests/runtime_check.py` in a temporary config directory with the exact HA Core target. It exercised HA bootstrap, config flow, admin-only data/report WebSocket access, push subscription and unsubscribe, entry unload/reload, panel registration/cleanup, and preference persistence.
- Synthetic computation benchmark (median of 7; not a full HA or event-loop performance test): 50 devices / 150 entities, inventory 0.55 ms and report 0.15 ms; 200 devices / 600 entities, inventory 2.08 ms and report 0.59 ms.

## Limits and release readiness

The isolated HA runtime uses `skip_pip=True` and an empty network-interface stub because the execution container cannot enumerate interfaces reliably. HA logged unrelated optional component/native dependency errors during bootstrap; the integration's tested flows completed. This is not a production installation test and does not validate any user's Home Assistant configuration, installed integrations, devices, or dashboards. The user's exact Core target was provided as 2026.10.4; no minimum supported Core version is declared.

CI workflows are included for frontend tests/typecheck/build, Python tests/compile, HACS validation, and Hassfest. GitHub-hosted CI, HACS Action, and Hassfest were not run locally. No repository or release was created. `yesinali/ha-device-care` is provisional metadata pending publication. The repository now contains an MIT license using the project-level copyright holder `Device Care contributors`.

No personal Home Assistant configuration, device inventory, tokens, or network addresses were used in the deliverable. The source archive excludes dependency directories, bytecode/cache files, and local environments.
