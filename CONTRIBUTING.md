# Contributing

Thanks for helping improve Cihazlar & Bakım. This project is under active development and is not yet a stable release.

## Before opening an issue

- Include the Home Assistant Core and HACS versions and whether the issue occurs on a clean test installation.
- Describe steps to reproduce and the expected and actual result.
- Remove access tokens, IP addresses, personal names, entity IDs, device identifiers, and private screenshots from logs and examples.
- Use synthetic or anonymized fixture data when sharing diagnostics.

## Local checks

The frontend uses Node.js and npm:

```sh
cd frontend-src
npm ci
npm test
npm run typecheck
```

Python checks use the Home Assistant version confirmed for the project test target:

```sh
python3.14 -m pip install "homeassistant==2026.10.4" pytest
python3.14 -m pytest -q tests/test_core.py
python3.14 -m compileall -q custom_components/device_care
```

The CI target is not a declaration that this is the minimum supported Home Assistant version. Do not claim successful live Home Assistant validation based only on local checks.
