# Device Care beta3 source archive

Extract this archive as-is. Its top-level folder is `ha-device-care/`; the integration is at `ha-device-care/custom_components/device_care/`, and the editable frontend source remains under `ha-device-care/frontend-src/src/`. Do not flatten directories. The compiled Home Assistant panel is at `ha-device-care/custom_components/device_care/frontend/device-care.js`.

To apply the integration to a Home Assistant custom_components tree, copy the `custom_components/device_care/` directory into `<config>/custom_components/`, then restart Home Assistant. The archive also includes project metadata, frontend source, tests, and development documentation.
