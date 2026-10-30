# Device Care WebSocket contract

This contract is shared by the panel and the Python integration. All commands use the authenticated Home Assistant WebSocket connection. IDs are strings; timestamps are UTC ISO 8601.

## Commands

| Command | Request | Response |
| --- | --- | --- |
| `device_care/get_data` | `{type}` | `{devices, all_devices, areas, floors, labels, preferences, monitoring_since, capabilities, is_admin}` |
| `device_care/set_preferences` | `{type, preferences: object}` | `{preferences}`; admin only |
| `device_care/subscribe_updates` | `{type}` | Standard subscription ack `{subscription_id}` then event frames `{event_type:'device_care/updated', data:{reason, device_ids?}}` |
| `device_care/get_report` | `{type, window:'24h'|'7d'}` | `Report` |
| `device_care/generate_report` | `{type, window:'24h'|'7d'}` | `Report` |
| `device_care/call_entity` | `{type, entity_id, service, data?}` | `{success:true}`; admin only; supported CONFIG operations only |

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
  "entities": [{
    "entity_id": "binary_sensor.hall_motion",
    "name": "Hall motion",
    "state": "on",
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

Signal `meaning` is `active`, `inactive`, `unavailable`, `unknown`, `missing`, or `expected_off`; battery binary sensors may also use `low` or `ok`. Numeric battery values (percent or voltage) retain `value` and `unit` independently from `meaning`. Device health is `online`, `offline`, `partial`, `unknown`, or `expected_off`. Explicit connectivity entities can report online/offline. A problem-class entity reporting `on` indicates a device fault and yields `partial`; it does not establish loss of connectivity. Without a connectivity entity, a current state on an enabled operational entity is positive evidence of state availability, but an off state is not an outage. This is not a heartbeat guarantee. Diagnostic telemetry such as RSSI/LQI and unknown/unavailable states do not establish health. Devices without reliable current state remain unknown.

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
