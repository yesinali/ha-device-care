# Device Care

Device Care is a Home Assistant custom integration for keeping an at-a-glance inventory of selected devices and reviewing the health information Home Assistant already has for them. It uses Home Assistant's device and entity registry; it does not scan your network, pair devices, or replace the integrations that connect them.

![Device Care brand icon](custom_components/device_care/brand/icon.png)

> **Beta preview:** version `0.1.0-beta.5` is being prepared and has not been published as a GitHub release. The latest published version may be older. Beta software is still being tested; back up your Home Assistant configuration before trying it.

For the Turkish user guide, see [README.tr.md](README.tr.md). Contributors and maintainers can use [DEVELOPMENT.md](DEVELOPMENT.md).

## What it does

- Shows a searchable device inventory, with a compact list and room-grouped view.
- Lets you choose which devices to follow by area, floor, label, integration, or manual selection. You can opt to include new devices that later match the selected scope.
- Shows battery, sensor, activity, and health details when those facts are exposed by Home Assistant and the device's integration.
- Can show firmware versions and update status reported by Home Assistant. Firmware information is read-only in Device Care; it does not install updates.
- Keeps an event history from the time monitoring starts. It does not invent older history or an uptime percentage for periods Home Assistant was unavailable.
- Follows the Home Assistant language setting. English (United States) and Turkish are supported. Dates use the Home Assistant time zone.

Device Care cannot establish instantaneous reachability for every device. A recent event or battery reading does not prove that a device is currently online. Some integrations do not provide battery, connectivity, activity, or firmware data, so those details may be unavailable.

## Install with HACS

Device Care is a custom HACS repository. The repository is:

`https://github.com/yesinali/ha-device-care`

1. In Home Assistant, open **HACS → Integrations**, open the menu, and choose **Custom repositories**.
2. Enter the repository URL above and choose **Integration** as the category.
3. Add it, find **Device Care** in HACS, download the available release, and restart Home Assistant.
4. Open **Settings → Devices & services → Add integration**, search for **Device Care**, and follow the setup steps.
5. Choose a device scope and which devices to include. The Device Care panel will then appear in the Home Assistant sidebar for administrators.

The beta.5 source is not yet a published GitHub release, so HACS cannot install beta.5 until a release is published. Do not treat the beta.5 version number in source files as proof that a release is available. Use the newest release shown by HACS, or wait for beta.5 to appear there.

### Optional settings

Device control settings are locked by default. An administrator must explicitly unlock them in the Device Care panel before changing supported Home Assistant controls. The unlock is temporary and resets when you disconnect, change device scope, or start a new session. Only supported controls that Home Assistant exposes with the required configuration metadata can be changed. Firmware installation is not offered.

The firmware column is hidden by default. Use **Edit → Table columns** in the panel to show it when Home Assistant provides firmware information.

### HACS icon

The integration's local brand files are included at `custom_components/device_care/brand/`. The icon shown on an integration detail page and the icon shown on a HACS Marketplace repository card can come from different sources. HACS 2.0.5 may show a placeholder on the repository card because of its Marketplace/CDN icon path; the local integration brand files are still present. The repository does not add an unsupported `icon` field to `hacs.json` as a workaround.

## Update, rollback, or remove

- **Update:** install an available release from HACS and restart Home Assistant. Review the release notes before updating.
- **Rollback:** if HACS offers an earlier release, select that version and restart. Keep a Home Assistant backup so you can restore the integration files and configuration if needed.
- **Remove:** remove Device Care through HACS, then restart Home Assistant. Removing the integration stops monitoring and removes its panel. Stored preferences and event history can remain in Home Assistant's storage after removal; this release does not provide a separate in-panel data purge. Event history is bounded by the retention setting (1–365 days, 30 days by default) and a 20,000-event cap while the integration is running. Do not edit Home Assistant's `.storage` files while it is running; keep a full backup before file-level maintenance.

## Privacy and support

Device Care reads Home Assistant's local device registry, entity registry, and entity states. It has no external cloud or AI service dependency. Its stored history begins when monitoring starts; time before installation and periods when Home Assistant was unavailable are not reconstructed.

To report a problem, include your Home Assistant version, Device Care version, HACS version if relevant, what you expected, what happened, and steps to reproduce it. Before sharing logs, remove access tokens, passwords, private URLs, public IP addresses, and any device names or identifiers you consider sensitive. Do not attach your full Home Assistant configuration or an unredacted device/entity dump. See [GitHub Issues](https://github.com/yesinali/ha-device-care/issues).

Device Care is distributed under the [MIT License](LICENSE).
