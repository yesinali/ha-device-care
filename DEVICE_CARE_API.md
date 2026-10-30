# Device Care WebSocket contract

The integration setup/options flow uses Home Assistant translations (`strings.json` English US default, `translations/tr.json` Turkish). The custom sidebar panel title is the fixed `Device Care` label because Home Assistant registers one shared panel title per instance; the panel content follows each user's frontend locale. The optional weekly persistent notification uses the Home Assistant instance language.

This contract is shared by the panel and the Python integration. All commands use the authenticated Home Assistant WebSocket connection. IDs are strings; timestamps are UTC ISO 8601.

## Commands

| Command | Request | Response |
| --- | --- | --- |
| `device_care/get_data` | `{type}` | `{devices, all_devices, areas, floors, labels, preferences, monitoring_since, capabilities, is_admin}` |
| `device_care/set_preferences` | `{type, preferences: object}` | `{preferences}`; admin only |
| `device_care/subscribe_updates` | `{type}` | Standard subscription ack `{subscription_id}` then event frames `{event_type:'device_care/updated', data:{reason, device_ids?}}` |
| `device_care/get_report` | `{type, window:'24h'|'7d'}` | `Report` |
| `device_care/generate_report` | `{type, window:'24h'|'7d'}` | `Report` |
| `device_care/call_entity` | `{type, entity_id, service, data?, controls_unlocked:true}` | `{success:true}`; admin only; supported CONFIG operations only; explicit per-request UI intent required |

Subscriptions are released through Home Assistant's standard `unsubscribe_events` protocol, which is managed by `hass.connection.subscribeMessage`.

## Device

```json
{
  "id": "device-registry-id-or-entity:entity_id",
  "device_id": "device-registry-id-or-null",
  "name": "Hall Motion",
  "area_id": "hall-or-null",
  "floor_id": null,
  "labels": [],
  "manufacturer": "Acme-or-null",
  "model": "M1-or-null",
  "integration": "mqtt-or-null",
  "integrations": ["mqtt"],
  "device_type": "sensor",
  "capabilities": ["motion"],
  "activity": null,
  "reported_sw_version": null,
  "firmware_updates": [],
  "entities": [{
    "entity_id": "binary_sensor.hall_motion",
    "name": "Hall motion",
    "state": "on",
    "icon": null,
    "domain": "binary_sensor",
    "device_class": "motion",
    "entity_category": null,
    "unit": null,
    "attributes": {},
    "disabled": false
  }],
  "signals": {
    "motion": {"entity_id":"binary_sensor.hall_motion","state":"on","value":"on","unit":null,"meaning":"active"},
    "occupancy": null,
    "battery": null,
    "connectivity": null
  },
  "health": "online",
  "health_reason": "state_available"
}
```

Signal `meaning` is `active`, `inactive`, `unavailable`, `unknown`, `missing`, `expected_off`, or `measured`; battery binary sensors may also use `low` or `ok`. Numeric battery values (percent or voltage) retain `value` and `unit` and use `meaning: measured`. When both battery percentage and voltage exist, a unique percentage reading is preferred; multiple same-priority readings remain ambiguous until the administrator selects a source. Device health is `online`, `offline`, `partial`, `unknown`, or `expected_off`. Explicit connectivity entities can report online/offline. A problem-class entity reporting `on` indicates a device fault and yields `partial`; it does not establish loss of connectivity. Without a connectivity entity, a current state on an enabled binary sensor or controllable entity is positive evidence that Home Assistant has a usable state, but an off state is not an outage. This is not a heartbeat guarantee. Battery/voltage telemetry and event timestamps do not establish current reachability. Devices without such evidence remain unknown with `health_reason: no_reachability_source`.

`device_type` is inferred from entity domains/classes (`remote`, `button`, `tv`, `light`, `switch`, `camera`, `cover`, `climate`, `fan`, `lock`, `sensor`, `other`). A supported light/switch/etc. domain takes priority over an auxiliary button entity. `capabilities` lists available entity roles such as `activity`, `battery`, `brightness`, `connectivity`, `control`, `firmware`, `motion`, `occupancy`, and `power_state`. Entity `icon` is a validated Material Design Icon name from the registry's current/original icon or state attributes. `activity` is `null` or `{entity_id, event_type, last_event_at}`. `last_event_at` is included only when parsed from the event entity state or an explicit event timestamp attribute. Entity `last_updated`/`last_changed` timestamps are never treated as user activity. A remote can therefore show its last recorded press while its health stays `unknown` and its current reachability stays unclaimed. `call_entity` rejects a CONFIG action when the entity is currently `unknown` or `unavailable`, even if it was usable when the panel loaded.

`reported_sw_version` is the Home Assistant device-registry `sw_version`, when present; it is a reported current version only and is never used to infer a latest version or update status. `firmware_updates` contains one entry per enabled/visible entity whose domain is `update` and `device_class` is `firmware`: `{entity_id,title,state,installed_version,latest_version,skipped_version,release_summary,release_url,update_available}`. Metadata is copied only when HA supplies it; missing values are `null`. `update_available` is `true` for HA state `on`, `false` for `off`, and `null` for `unknown`/`unavailable` or any unrecognized state. HA defines `off` as up to date or skipped, so consumers must inspect `skipped_version` before labeling it current. Firmware data is read-only.

`call_entity` also requires `controls_unlocked: true`, representing the panel's explicit temporary unlock toggle. This is write intent only, not an authorization token or persistent preference. Administrator authorization, CONFIG entity category, current state availability, and supported service/range checks still apply.

## Preferences

`schema_version: 1`, `layout: inventory|rooms`, `group_by: area|floor|integration|none`, `sort: name|health|area`, `visible_columns: string[]`, `scope: all|area|floor|label|integration|manual`, `scope_value: string|null`, `included_device_ids: string[]|null`, `excluded_device_ids: string[]`, `auto_include_new: boolean`, `source_overrides: {device_id: {motion|occupancy|battery|connectivity: entity_id|null}}`, `expected_off_rules: [{id, entity_id, state}]`, `retention_days: 1..365`, `weekly_report_enabled: boolean`.

`devices` contains the filtered inventory. Admin-only `all_devices` is the complete editor inventory so excluded devices can be restored. `scope` selects all devices or a single area, floor, label, integration, or explicit manual list. New devices matching a selected registry scope are discovered automatically; manual scope also honors `auto_include_new`. Explicit exclusions always win. `weekly_report_enabled` opts into a local Home Assistant persistent notification each Monday at 09:00 in HA's configured timezone; repeated execution in the same ISO week reuses the same notification ID and is deduplicated.

## Report

```json
{
  "window":"24h",
  "start":"2026-10-30T00:00:00+00:00",
  "end":"2026-10-31T00:00:00+00:00",
  "coverage_since":"2026-10-01T00:00:00+00:00",
  "ongoing":[{"device_id":"abc123","start":"2026-10-30T03:00:00+00:00","end":"2026-10-30T03:15:00+00:00","seconds":900,"ongoing":true}],
  "events":[{"device_id":"abc123","start":"2026-10-30T03:00:00+00:00","end":"2026-10-30T03:15:00+00:00","seconds":900,"ongoing":false,"end_reason":"health_unknown"}],
  "stats":{"outage_starts":1,"outage_intervals":1,"device_outage_seconds":900,"low_battery":0,"missing_data":0}
}
```

Durations are clipped to the report window. `outage_starts` is the count of outages that began inside the window; `outage_intervals` counts clipped intervals; `device_outage_seconds` sums device downtime (not house downtime). `end_reason` can be `health_unknown`, `health_partial`, `ha_stopped`, or `ha_restart_gap`: confirmed downtime stops at that point and the uncertain span is not counted as recovery or outage. `low_battery` counts current battery percentages below 20; `missing_data` counts devices without a reliable health source. Monitoring begins when this integration is first configured, so prior history is not inferred.
