# Device Care beta5 QA report

Date: 2026-10-30  
Version: 0.1.0-beta.5  
QA target: Home Assistant Core 2026.10.4, Python 3.14.8, Node.js 22.23.4  
State: development preview; no live home or physical devices tested

## Checks completed

- Backend model/report tests: 17 passed (`tests/test_core.py`). Pytest plugin autoload was disabled because the installed Home Assistant pytest plugin targets an older Core API.
- Frontend TypeScript typecheck and production Vite build: passed on Node.js 22.23.4; the packaged JavaScript bundle was regenerated.
- Frontend DOM tests: 17 passed (`frontend-src/tests`). Coverage includes English (US) and Turkish UI, changing locale while connected, language fallback, translated load errors, entity-provided labels remaining unchanged, Home Assistant time-zone date formatting, locked controls, and existing device/firmware behavior.
- Frontend locale audit: all 183 statically referenced translation keys resolve in the typed locale dictionary. Dynamic Home Assistant device, entity, state, and option labels remain sourced from Home Assistant.
- Home Assistant config flow/runtime smoke: passed on Core 2026.10.4 using `tests/runtime_check.py` and a temporary config directory. Checks include English/Turkish selector localization, bootstrap, admin WebSocket access, CONFIG write guards, push subscribe/unsubscribe, unload/reload, panel registration/cleanup, and preference persistence.
- Python `compileall`, integration/translation/HACS JSON validation, source archive CRC checks, and clean source extraction: passed.

## Limits and release readiness

This is not a production installation test. It does not validate a user's Home Assistant configuration, installed integrations, physical devices, or live dashboard rendering. No browser screenshot review was available. No minimum supported Home Assistant version is declared; the exact runtime target tested was 2026.10.4.

GitHub-hosted CI, HACS validation, and Hassfest were not run locally. No repository write, tag, or release was created. Beta5 is prepared in source and is not yet a published GitHub release. The README records the known HACS 2.0.5 Marketplace/CDN repository-card icon limitation; local integration brand assets are included, and no unsupported `hacs.json` icon field was added.

No personal Home Assistant configuration, device inventory, tokens, or network addresses were used in the source package. The source archive excludes dependency directories, bytecode/cache files, local environments, and user screenshots.
