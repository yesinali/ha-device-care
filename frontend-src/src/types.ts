export type SignalMeaning = 'active' | 'inactive' | 'unavailable' | 'unknown' | 'missing' | 'expected_off' | 'low' | 'ok' | 'measured';
export interface Signal { entity_id: string; state: string; value: number | string | null; unit: string | null; meaning: SignalMeaning }
export interface DeviceEntity {
  entity_id: string; name: string; state: string; domain: string; device_class: string | null;
  entity_category: string | null; unit: string | null; attributes: Record<string, unknown>; disabled: boolean; icon?: string | null;
}
export interface FirmwareUpdate {
  entity_id: string; title: string | null; state: string; installed_version: string | null; latest_version: string | null;
  skipped_version: string | null; release_summary: string | null; release_url: string | null; update_available: boolean | null;
}
export interface Device {
  id: string; device_id: string | null; name: string; area_id: string | null; floor_id: string | null; labels: string[];
  manufacturer: string | null; model: string | null; integration: string | null; integrations: string[]; entities: DeviceEntity[];
  device_type?: 'remote' | 'button' | 'tv' | 'light' | 'switch' | 'camera' | 'cover' | 'climate' | 'fan' | 'lock' | 'sensor' | 'other'; capabilities?: string[];
  activity?: { entity_id: string; event_type: string | null; last_event_at: string | null } | null;
  firmware_updates?: FirmwareUpdate[]; reported_sw_version?: string | null;
  signals: { motion: Signal | null; occupancy: Signal | null; battery: Signal | null; connectivity: Signal | null };
  health: 'online' | 'offline' | 'partial' | 'unknown' | 'expected_off'; health_reason: string | null;
}
export interface NamedItem { id: string; name: string }
export interface ExpectedOffRule { id: string; entity_id: string; state: string }
export interface Preferences {
  schema_version: 1; layout: 'inventory' | 'rooms'; scope: 'all' | 'area' | 'floor' | 'label' | 'integration' | 'manual'; scope_value: string | null; group_by: 'area' | 'floor' | 'integration' | 'none';
  sort: 'name' | 'health' | 'area'; visible_columns: string[]; included_device_ids: string[] | null;
  excluded_device_ids: string[]; auto_include_new: boolean; retention_days: number; weekly_report_enabled: boolean;
  source_overrides: Record<string, Record<'motion' | 'occupancy' | 'battery' | 'connectivity', string | null>>;
  expected_off_rules: ExpectedOffRule[];
}
export interface CareData {
  devices: Device[]; all_devices: Device[]; areas: NamedItem[]; floors: NamedItem[]; labels: NamedItem[]; preferences: Preferences;
  monitoring_since: string | null; capabilities: { reports: boolean; settings: boolean }; is_admin: boolean;
}
export interface ReportEvent { device_id: string; start: string; end: string | null; seconds: number; ongoing: boolean }
export interface Report {
  window: '24h' | '7d'; start: string; end: string; coverage_since: string | null; ongoing: ReportEvent[];
  events: ReportEvent[]; stats: { outage_starts: number; outage_intervals: number; device_outage_seconds: number; low_battery: number; missing_data: number };
}
export interface PreferencesPatch { preferences: Partial<Preferences> }
export interface HaConnection {
  sendMessagePromise<T = unknown>(message: Record<string, unknown>): Promise<T>;
  subscribeMessage<T>(callback: (message: T) => void, message: Record<string, unknown>): Promise<() => void>;
}
export interface HomeAssistant { connection: HaConnection; language?: string; themes?: { darkMode?: boolean }; user?: { is_admin?: boolean } }
