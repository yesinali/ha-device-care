# Device Care beta4 source package

Extract this archive while preserving its top-level `ha-device-care/` directory. To install in Home Assistant, copy `ha-device-care/custom_components/device_care/` into `<config>/custom_components/device_care/`, then restart Home Assistant.

`frontend-src/` contains the editable frontend sources and tests. The integration serves the already-built frontend from `custom_components/device_care/frontend/`; after frontend edits, run `npm ci`, `npm run typecheck`, `npm test`, and `npm run build` in `frontend-src/`, then copy the build output as documented in the project README.

The separate brand patch archive only replaces the integration's two local brand icon files. No repository, tag, or release was published by this package step.
