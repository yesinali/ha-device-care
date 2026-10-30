import { LitElement, css, html, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { DeviceCareApi } from './api';
import type { CareData, Device, DeviceEntity, FirmwareUpdate, HomeAssistant, NamedItem, Preferences, Report, Signal } from './types';
import brandIcon from './assets/brand-icon.png?inline';

const icon = (name: string) => {
  const paths: Record<string, string> = {
    grid: 'M3 3h8v8H3zM13 3h8v5h-8zM13 10h8v11h-8zM3 13h8v8H3z',
    room: 'M3 21V5l9-3 9 3v16h-7v-6H9v6z',
    search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm5.5 12.5L21 21',
    check: 'm5 12 4 4L19 6', alert: 'M12 3 2 21h20L12 3zm0 6v5m0 3v.1',
    motion: 'M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1m0-12.8-2.1 2.1m-8.6 8.6-2.1 2.1',
    light: 'M9 18h6m-5 4h4m-5-8a6 6 0 1 1 6 0c-1 1-1 2-1 4h-4c0-2 0-3-1-4z',
    switch: 'M4 7h16v10H4zM8 12h.01', remote: 'M8 3h8v18H8zM12 7h.01M10 11h4m-4 3h4m-4 3h4',
    sensor: 'M4 12a8 8 0 0 1 16 0M7 12a5 5 0 0 1 10 0m-7 0a2 2 0 0 1 4 0m-2 4v4',
    fan: 'M12 12c-1-3-1-8 2-9 3-1 4 3 1 7m-3 2c3-1 8-1 9 2 1 3-3 4-7 1m-2-3c1 3 1 8-2 9-3 1-4-3-1-7m3-2c-3 1-8 1-9-2-1-3 3-4 7-1',
    lock: 'M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4m-4 4v2', climate: 'M10 14.5V5a2 2 0 0 1 4 0v9.5a4 4 0 1 1-4 0zM12 17v-7',
    camera: 'M3 8h4l2-3h6l2 3h4v12H3zM12 11a3 3 0 1 0 0 6 3 3 0 0 0 0-6z', cover: 'M4 4h16v16H4zM8 8h8m-8 4h8m-8 4h8',
    television: 'M3 5h18v13H3zM8 22l4-4 4 4', button: 'M4 4h16v16H4zM12 9v6m-3-3h6', relay: 'M3 7h18v10H3zM7 12h4m2 0h4', outlet: 'M4 4h16v16H4zM9 9v3m6-3v3m-5 3h4', media: 'M4 5h16v12H4zM8 21h8m-4-4v4',
    battery: 'M2 8h18v9H2zM22 11v3M5 11v3', wifi: 'M2 8a15 15 0 0 1 20 0M5 12a10 10 0 0 1 14 0m-11 4a5 5 0 0 1 8 0m-4 4h.01',
    close: 'M6 6l12 12M18 6 6 18', edit: 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4z',
    down: 'm6 9 6 6 6-6', chevron: 'm9 18 6-6-6-6', report: 'M4 19V5m0 14h16M8 15l3-4 3 2 5-7',
    settings: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM4 12H2m20 0h-2M12 4V2m0 20v-2M6.3 6.3 4.9 4.9m14.2 14.2-1.4-1.4m0-11.4 1.4-1.4M4.9 19.1l1.4-1.4',
  };
  return html`<svg viewBox="0 0 24 24" data-icon=${name} aria-hidden="true"><path d=${paths[name] ?? paths.check}></path></svg>`;
};
const healthLabel: Record<Device['health'], string> = { online: 'Online', offline: 'Erişilemiyor', partial: 'Kısmi sorun', unknown: 'Durum bilinmiyor', expected_off: 'Bilerek kapalı' };
const roleLabel = { motion: 'Hareket', occupancy: 'Varlık', battery: 'Pil', connectivity: 'Bağlantı' } as const;
const safeEntityIcons = new Set(['mdi:television','mdi:lightbulb','mdi:lightbulb-on','mdi:lightbulb-outline','mdi:lightbulb-group','mdi:remote','mdi:remote-tv','mdi:button-pointer','mdi:gesture-tap-button','mdi:power-socket','mdi:power-socket-eu','mdi:power-socket-us','mdi:toggle-switch','mdi:toggle-switch-variant','mdi:motion-sensor','mdi:battery','mdi:thermostat','mdi:thermometer','mdi:fan','mdi:lock','mdi:lock-open','mdi:camera','mdi:blinds','mdi:window-shutter','mdi:door','mdi:door-open','mdi:media-player','mdi:power']);
const signalText = (kind: 'motion' | 'occupancy', signal: Signal | null) => {
  const noun = kind === 'motion' ? 'Hareket' : 'Varlık';
  if (!signal || signal.meaning === 'missing') return 'Veri yok';
  if (signal.meaning === 'active') return `${noun} algılanıyor`;
  if (signal.meaning === 'inactive') return `${noun} algılanmıyor`;
  if (signal.meaning === 'unavailable') return 'Erişilemiyor';
  if (signal.meaning === 'expected_off') return 'Bilerek kapalı';
  return 'Durum bilinmiyor';
};
const humanize = (value: string | null | undefined) => value ? value.replaceAll('_', ' ').replace(/\b\w/g, (c) => c.toLocaleUpperCase()) : 'Atanmamış';
const healthReasonText = (reason: string) => ({
  no_health_source: 'Çevrimdışı durumunu bildiren bir sensör yok.', no_connectivity_source: 'Bağlantı sensörü yok; erişilebilirlik doğrulanamıyor.',
  no_reachability_source: 'Bu cihaz türü anlık bağlantı bilgisi sağlamıyor.', health_source_unavailable: 'Bağlantı kaynağı şu anda veri vermiyor.',
  health_source_unknown: 'Bağlantı durumu doğrulanamıyor.', connectivity_off: 'Bağlantı sensörü cihazı çevrimdışı gösteriyor.',
  configured_expected_off: 'Kapalı durumu ayarlarda beklenen durum olarak tanımlanmış.', device_problem: 'Cihaz bir sorun bildiriyor.',
  mixed_connectivity_sources: 'Bağlantı sensörleri birbiriyle uyuşmuyor.', state_available: 'Home Assistant cihazdan güncel durum alıyor.',
  primary_source_missing: 'Seçilen bağlantı sensörü bulunamıyor.', invalid_primary_source: 'Seçilen kaynak bağlantı sensörü değil.',
  connectivity_unavailable: 'Bağlantı sensörü şu anda veri vermiyor.', partial_failure: 'Cihazın bazı işlevleri çalışmıyor olabilir.',
} as Record<string, string>)[reason] ?? 'Durumla ilgili ek açıklama mevcut.';

@customElement('device-care-panel')
export class DeviceCarePanel extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @state() private data?: CareData;
  @state() private loading = true;
  @state() private error = '';
  @state() private query = '';
  @state() private selectedId?: string;
  @state() private editing = false;
  @state() private saving = false;
  @state() private settingsUnlocked = false;
  @state() private report?: Report;
  @state() private reportWindow: '24h' | '7d' = '24h';
  @state() private openGroups: Record<string, boolean> = {};
  @state() private savingEntity?: string;
  private api?: DeviceCareApi;
  private refreshTimer?: number;
  private reconnectTimer?: number;

  static styles = css`
    :host { display:block; color:var(--primary-text-color); --care-accent:#087f8c; --care-accent-ink:color-mix(in srgb,var(--care-accent) 65%,var(--primary-text-color,#111)); --care-blue-ink:color-mix(in srgb,#2169a6 60%,var(--primary-text-color,#111)); --care-amber-ink:color-mix(in srgb,#9a6200 58%,var(--primary-text-color,#111)); --care-violet-ink:color-mix(in srgb,#6555a5 62%,var(--primary-text-color,#111)); --care-warn:#a95000; --care-warn-ink:color-mix(in srgb,#c56a17 58%,var(--primary-text-color,#111)); --care-accent-soft:color-mix(in srgb,var(--care-accent) 11%,var(--card-background-color,#fff)); --care-warn-soft:color-mix(in srgb,#d8761a 12%,var(--card-background-color,#fff)); --care-border:var(--divider-color,#d9dee3); --care-muted:var(--secondary-text-color,#66717c); }
    * { box-sizing:border-box } button, input, select { font:inherit } button { color:inherit; cursor:pointer }
    .shell { max-width:1560px; margin:0 auto; padding:20px clamp(14px,2.5vw,38px) 40px }
    .top { display:flex; align-items:flex-start; justify-content:space-between; gap:18px; margin-bottom:14px }
    h1 { margin:0; font-size:clamp(22px,2vw,29px); letter-spacing:-.035em; font-weight:720 }
    .brand-title { display:flex; align-items:center; gap:10px }.brand-title img { width:38px; height:38px; object-fit:contain; flex:none }
    .subtitle { margin:5px 0 0; color:var(--care-muted); font-size:13px }
    .top-actions { display:flex; gap:8px; align-items:center }
    .button { border:1px solid var(--care-border); background:var(--card-background-color,#fff); border-radius:9px; padding:8px 12px; display:inline-flex; gap:7px; align-items:center; font-size:13px; font-weight:600; min-height:36px }
    .button:hover { background:var(--secondary-background-color,#f4f6f7) }.button.primary { background:var(--care-accent); color:white; border-color:var(--care-accent) }.button.ghost { border-color:transparent; background:transparent }
    .control-safety { display:flex; align-items:center; gap:10px; border:1px solid var(--care-border); border-left:3px solid #a95000; border-radius:10px; padding:9px 12px; margin:-3px 0 13px; background:var(--card-background-color,#fff) }.control-safety.unlocked { border-left-color:var(--care-accent); background:color-mix(in srgb,var(--care-accent) 5%,var(--card-background-color,#fff)) }.control-safety input { width:18px; height:18px; accent-color:var(--care-accent); flex:none }.control-safety span { display:grid; gap:2px }.control-safety strong { font-size:12px }.control-safety small { color:var(--care-muted); font-size:11px }
    svg { width:17px; height:17px; fill:none; stroke:currentColor; stroke-width:1.8; stroke-linecap:round; stroke-linejoin:round; flex:none }
    .summary { display:flex; align-items:center; gap:10px; padding:11px 14px; border:1px solid color-mix(in srgb,var(--care-accent) 22%,var(--care-border)); border-left:3px solid var(--care-accent); border-radius:12px; background:var(--card-background-color,#fff); margin-bottom:13px; flex-wrap:wrap }
    .summary-title { font-size:13px; font-weight:700; margin-right:auto }.metric { display:flex; gap:6px; align-items:center; color:var(--care-muted); font-size:12px; padding:4px 8px; border-radius:7px; background:var(--secondary-background-color,#f5f7f8) }.metric strong { color:var(--primary-text-color); font-size:13px }
    .metric.warn { color:var(--care-warn-ink); background:var(--care-warn-soft) }.metric.good { color:var(--care-accent-ink); background:var(--care-accent-soft) }
    .toolbar { display:flex; align-items:center; gap:8px; margin:0 0 13px; flex-wrap:wrap }.search { position:relative; flex:1; min-width:180px; max-width:420px }.search svg { position:absolute; left:11px; top:10px; color:var(--care-muted) }.search input { width:100%; padding:8px 12px 8px 36px; border:1px solid var(--care-border); border-radius:9px; background:var(--card-background-color,#fff); color:inherit; outline:none; min-height:38px }.search input:focus, select:focus, input:focus { outline:2px solid color-mix(in srgb,var(--care-accent) 42%,transparent); outline-offset:1px }
    .select { border:1px solid var(--care-border); border-radius:9px; background:var(--card-background-color,#fff); color:inherit; padding:8px 30px 8px 10px; min-height:38px; font-size:13px }
    .tabs { display:flex; border:1px solid var(--care-border); padding:3px; border-radius:10px; background:var(--card-background-color,#fff); margin-left:auto }.tabs button { border:0; border-radius:7px; padding:6px 9px; display:flex; gap:6px; align-items:center; background:transparent; color:var(--care-muted); font-size:12px }.tabs button.active { color:var(--primary-text-color); background:var(--secondary-background-color,#eff2f4); font-weight:700 }
    .inventory { border:1px solid var(--care-border); border-radius:12px; overflow:hidden; background:var(--card-background-color,#fff) }.table-scroll { overflow:auto; max-height:calc(100vh - 300px); min-height:180px }
    table { width:100%; border-collapse:collapse; min-width:740px } th { text-align:left; font-size:10px; letter-spacing:.075em; text-transform:uppercase; color:var(--care-muted); font-weight:650; padding:10px 12px; background:var(--secondary-background-color,#f7f8f9); white-space:nowrap; position:sticky; top:0; z-index:1 }
    td { border-top:1px solid var(--care-border); padding:9px 12px; font-size:13px; vertical-align:middle } tbody tr { cursor:pointer } tbody tr:hover, tbody tr.selected { background:var(--secondary-background-color,#f7f8f9) }.device-name { display:flex; gap:9px; align-items:center; min-width:190px }.device-name > span:last-child { min-width:0 }.device-name .name,.device-name .sub { display:block }.device-glyph { width:30px; height:30px; display:grid; place-items:center; border-radius:8px; color:var(--care-muted); background:var(--secondary-background-color,#f1f3f4) }.name { font-weight:650 }.sub { font-size:11px; color:var(--care-muted); margin-top:2px }.health-pill, .signal-pill { display:inline-flex; align-items:center; gap:6px; font-size:11px; font-weight:620; border-radius:999px; padding:5px 8px; white-space:nowrap; background:var(--secondary-background-color,#f2f4f5); color:var(--care-muted) }.health-pill.online { color:var(--care-accent); background:var(--care-accent-soft) }.health-pill.offline, .health-pill.partial { color:var(--care-warn); background:var(--care-warn-soft) }.health-pill.expected_off { color:#6555a5; background:color-mix(in srgb,#6555a5 12%,var(--card-background-color,#fff)) }
    .signal-pill.active { color:var(--care-accent); background:var(--care-accent-soft); border:1px solid color-mix(in srgb,var(--care-accent) 24%,transparent) }.signal-pill.warning { color:var(--care-warn); background:var(--care-warn-soft) }.signal-pill.expected { color:#6555a5; background:color-mix(in srgb,#6555a5 12%,var(--card-background-color,#fff)) }.signal-pill.low { color:var(--care-warn); background:var(--care-warn-soft); font-weight:700 }.signal-pill.unknown { border:1px dashed var(--care-border); background:transparent }
    .signal-pill svg { width:14px;height:14px }.battery { font-variant-numeric:tabular-nums; white-space:nowrap }.battery.low { color:var(--care-warn); font-weight:700 }.table-footer { border-top:1px solid var(--care-border); padding:9px 12px; color:var(--care-muted); font-size:11px; display:flex; justify-content:space-between; gap:10px }
    .room-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); align-items:start; gap:12px }.room { align-self:start; border:1px solid var(--care-border); border-radius:12px; overflow:hidden; background:var(--card-background-color,#fff); min-width:0 }.room-head { width:100%; border:0; background:transparent; display:flex; align-items:center; gap:9px; padding:13px 14px; text-align:left }.room-head .room-title { font-weight:700; font-size:14px }.room-head small { color:var(--care-muted); margin-left:auto; font-size:11px }.room-body { border-top:1px solid var(--care-border); padding:9px; display:grid; align-content:start; gap:8px }.device-card { border:1px solid var(--care-border); border-radius:10px; padding:11px; cursor:pointer; min-width:0 }.device-card:hover { border-color:color-mix(in srgb,var(--care-accent) 42%,var(--care-border)) }.card-head { display:flex; gap:8px; align-items:flex-start }.card-head .name { flex:1; font-size:13px }.card-meta { color:var(--care-muted); font-size:11px; margin:4px 0 9px; display:grid; gap:2px }.card-meta-secondary { color:var(--care-muted) }.signals { display:flex; flex-wrap:wrap; gap:6px }.signal-pill { font-size:10px; padding:4px 7px }.card-health { margin-top:8px; display:flex; align-items:center; gap:7px; font-size:11px; color:var(--care-muted) }
    .device-glyph.type-motion,.device-glyph.type-sensor { color:#087f8c; background:color-mix(in srgb,#087f8c 12%,var(--card-background-color,#fff)) }.device-glyph.type-light { color:#9a6200; background:color-mix(in srgb,#db9b26 18%,var(--card-background-color,#fff)) }.device-glyph.type-switch,.device-glyph.type-cover { color:#6555a5; background:color-mix(in srgb,#6555a5 12%,var(--card-background-color,#fff)) }.device-glyph.type-remote,.device-glyph.type-camera { color:#2169a6; background:color-mix(in srgb,#2169a6 12%,var(--card-background-color,#fff)) }.device-glyph.type-lock,.device-glyph.type-fan,.device-glyph.type-climate { color:#785694; background:color-mix(in srgb,#785694 12%,var(--card-background-color,#fff)) }
    .signal-pill.state-on { color:#087f8c; background:color-mix(in srgb,#087f8c 12%,var(--card-background-color,#fff)) }.signal-pill.state-off { color:var(--care-muted); background:var(--secondary-background-color,#f2f4f5) }.signal-pill.state-unavailable { color:var(--care-warn); background:var(--care-warn-soft) }
    tbody tr.selected { box-shadow:inset 3px 0 var(--care-accent) }.device-card:focus-visible,.room-head:focus-visible,.button:focus-visible { outline:2px solid color-mix(in srgb,var(--care-accent) 65%,var(--primary-text-color)); outline-offset:2px }
    .health-pill.online,.signal-pill.active,.signal-pill.state-on,.metric.good { color:var(--care-accent-ink) }.health-pill.offline,.health-pill.partial,.signal-pill.warning,.signal-pill.low,.signal-pill.state-unavailable,.metric.warn { color:var(--care-warn-ink) }.health-pill.expected_off,.signal-pill.expected { color:var(--care-violet-ink) }.tabs button.active { color:var(--care-accent-ink); background:var(--care-accent-soft) }
    .device-glyph.type-motion,.device-glyph.type-sensor { color:var(--care-accent-ink); background:var(--care-accent-soft) }.device-glyph.type-light { color:var(--care-amber-ink) }.device-glyph.type-switch,.device-glyph.type-cover,.device-glyph.type-lock,.device-glyph.type-fan,.device-glyph.type-climate { color:var(--care-violet-ink) }.device-glyph.type-remote,.device-glyph.type-camera { color:var(--care-blue-ink) }
    .drawer-backdrop { position:fixed; inset:0; background:#0005; z-index:8 }.drawer { position:fixed; z-index:9; right:0; top:0; bottom:0; width:min(460px,94vw); background:var(--primary-background-color,#fff); box-shadow:-12px 0 36px #0002; overflow:auto; padding:20px }.drawer-head { display:flex; align-items:flex-start; gap:12px; border-bottom:1px solid var(--care-border); padding-bottom:15px }.drawer-head h2 { margin:0; font-size:20px }.drawer-head .close { margin-left:auto }.section { padding:15px 0; border-bottom:1px solid var(--care-border) }.section h3 { margin:0 0 10px; font-size:12px; text-transform:uppercase; letter-spacing:.06em; color:var(--care-muted) }.detail-row { display:flex; justify-content:space-between; gap:16px; padding:6px 0; font-size:13px }.detail-row span:first-child { color:var(--care-muted) }.entity-row { border-top:1px solid var(--care-border); padding:10px 0; display:flex; justify-content:space-between; align-items:center; gap:10px }.entity-row:first-of-type { border:0 }.entity-title { min-width:0 }.entity-title strong { font-size:12px; display:block; overflow-wrap:anywhere }.entity-title small { color:var(--care-muted); font-size:11px }
    .settings-panel, .report-panel { border:1px solid var(--care-border); border-radius:12px; background:var(--card-background-color,#fff); padding:16px; margin-bottom:12px }.settings-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:12px }.field { display:flex; flex-direction:column; gap:5px; font-size:12px; color:var(--care-muted) }.field select, .field input { width:100%; border:1px solid var(--care-border); border-radius:8px; background:var(--primary-background-color,#fff); color:inherit; padding:8px; min-height:36px }.settings-panel h2,.report-panel h2 { margin:0 0 12px; font-size:16px }.subhead { margin:16px 0 8px; font-size:12px; font-weight:700 }.checkline { display:flex; gap:8px; align-items:center; font-size:12px; margin:8px 0 }.settings-devices { border:1px solid var(--care-border); border-radius:8px; max-height:210px; overflow:auto; padding:8px 10px }.settings-device { display:flex; gap:8px; padding:5px 0; align-items:center; font-size:12px }.settings-device small { color:var(--care-muted); margin-left:auto }.sources { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px }.rule-row { display:grid; grid-template-columns:1fr 1fr auto; gap:8px; margin:7px 0 }.plain-input { padding:7px 9px; border:1px solid var(--care-border); border-radius:7px; background:var(--primary-background-color,#fff); color:inherit; min-width:0 }.error { border:1px solid color-mix(in srgb,#c14635 32%,var(--care-border)); background:color-mix(in srgb,#c14635 8%,var(--card-background-color,#fff)); color:#9c3026; border-radius:9px; padding:10px 12px; margin:10px 0; font-size:13px }.empty { padding:48px 20px; text-align:center; color:var(--care-muted) }.loading { padding:60px 16px; text-align:center; color:var(--care-muted) }.report-stats { display:grid; grid-template-columns:repeat(5,minmax(0,1fr)); gap:8px }.stat { padding:10px; border-radius:9px; background:var(--secondary-background-color,#f5f7f8) }.stat strong { display:block; font-size:18px; font-variant-numeric:tabular-nums }.stat span { display:block; color:var(--care-muted); font-size:10px; margin-top:2px }.report-events { margin-top:12px; border-top:1px solid var(--care-border) }.report-event { display:flex; gap:12px; padding:8px 0; font-size:12px; border-bottom:1px solid var(--care-border) }.report-event span:last-child { margin-left:auto; color:var(--care-muted) }.coverage { font-size:11px; color:var(--care-muted); margin-top:12px }
    .settings-panel.read-only { opacity:.92 }.firmware-item { padding:10px 0; border-top:1px solid var(--care-border); display:grid; gap:5px; font-size:12px }.firmware-item:first-of-type { border-top:0 }.firmware-item .versions { color:var(--care-muted); overflow-wrap:anywhere }.firmware-item a { color:var(--care-accent-ink); text-decoration:underline }.device-glyph ha-icon { --mdc-icon-size:19px; width:19px; height:19px }
    @media (max-width:1100px) { .room-grid { grid-template-columns:repeat(2,minmax(0,1fr)); align-items:start } }
    @media (max-width:720px) { .shell { padding:14px 12px 26px }.top { align-items:center }.top-actions .button-label { display:none }.top-actions .button { padding:8px }.summary { gap:6px; padding:9px }.summary-title { width:100%; margin:0 0 2px }.metric { font-size:11px; padding:4px 6px }.toolbar { gap:6px }.search { min-width:100%; max-width:none }.tabs { margin-left:0; order:2 }.toolbar > .select { flex:1; min-width:110px }.room-grid { grid-template-columns:minmax(0,1fr) }.table-scroll { max-height:none; overflow:visible }.inventory { border:0; background:transparent; overflow:visible } table,tbody { display:block; min-width:0 } thead { display:none } tbody { display:grid; gap:8px } tbody tr { display:flex; flex-direction:column; border:1px solid var(--care-border); border-radius:10px; padding:10px; background:var(--card-background-color,#fff) } td { display:none; border:0; padding:4px 0 } td:first-child, td[data-mobile] { display:block } td:first-child { padding:0 0 6px }.table-footer { margin-top:8px; border:1px solid var(--care-border); border-radius:9px; background:var(--card-background-color,#fff) }.settings-grid { grid-template-columns:1fr 1fr }.report-stats { grid-template-columns:repeat(2,minmax(0,1fr)) }.report-stats .stat:first-child { grid-column:span 2 }.sources { grid-template-columns:1fr }.rule-row { grid-template-columns:1fr 1fr auto } }
    @media (max-width:520px) { .drawer { padding:15px }.drawer .entity-row { align-items:flex-start; flex-wrap:wrap }.drawer .entity-row > button,.drawer .entity-row > select,.drawer .entity-row > input { margin-left:auto; max-width:100%; min-width:150px } }
    @media (prefers-reduced-motion: no-preference) { .button, .device-card, tbody tr { transition:background-color .15s ease,border-color .15s ease } }
  `;

  connectedCallback() { super.connectedCallback(); void this.connect(); }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.settingsUnlocked = false;
    if (this.refreshTimer) window.clearTimeout(this.refreshTimer);
    if (this.reconnectTimer) window.clearTimeout(this.reconnectTimer);
    const api = this.api; this.api = undefined;
    void api?.dispose();
  }
  updated(changed: Map<string, unknown>) { if (changed.has('hass') && this.hass?.connection && !this.api) void this.connect(); }
  private async connect() {
    if (!this.hass?.connection || this.api) return;
    this.settingsUnlocked = false;
    this.api = new DeviceCareApi(this.hass.connection);
    await this.load();
    try { await this.api.subscribe((reason) => this.queueRefresh(reason)); }
    catch (e) { this.error = `Canlı güncelleme bağlantısı kurulamadı: ${this.message(e)}`; this.scheduleReconnect(); }
  }
  private async load() {
    if (!this.api) return;
    this.loading = !this.data;
    try { this.data = await this.api.getData(); this.error = ''; }
    catch (e) { this.error = this.message(e); }
    finally { this.loading = false; }
  }
  private message(error: unknown) { return error instanceof Error ? error.message : String(error); }
  private queueRefresh(_reason: string) {
    if (this.refreshTimer) window.clearTimeout(this.refreshTimer);
    this.refreshTimer = window.setTimeout(() => { void this.load(); }, 80);
  }
  private scheduleReconnect() {
    this.reconnectTimer = window.setTimeout(async () => {
      if (!this.api || !this.isConnected) return;
      try { await this.api.subscribe((reason) => this.queueRefresh(reason)); this.settingsUnlocked = false; this.error = ''; }
      catch { this.scheduleReconnect(); }
    }, 5000);
  }
  private get visibleDevices() {
    if (!this.data) return [];
    const prefs = this.data.preferences;
    const excluded = new Set(prefs.excluded_device_ids);
    const included = prefs.included_device_ids;
    const q = this.query.trim().toLocaleLowerCase();
    const source = this.data.all_devices.filter((d) => {
      if (prefs.scope === 'area' && d.area_id !== prefs.scope_value) return false;
      if (prefs.scope === 'floor' && d.floor_id !== prefs.scope_value) return false;
      if (prefs.scope === 'label' && !d.labels.includes(prefs.scope_value ?? '')) return false;
      if (prefs.scope === 'integration' && !(d.integrations?.length ? d.integrations.includes(prefs.scope_value ?? '') : d.integration === prefs.scope_value)) return false;
      if (prefs.scope === 'manual' && included !== null && !included.includes(d.id)) return false;
      return true;
    });
    return source.filter((d) => !excluded.has(d.id) &&
      (!q || [d.name, d.manufacturer, d.model, d.integration, ...(d.integrations ?? []), ...d.labels, ...d.entities.map((e) => e.entity_id)].some((x) => x?.toLocaleLowerCase().includes(q))))
      .sort((a,b) => prefs.sort === 'health' ? this.healthRank(a.health) - this.healthRank(b.health) || a.name.localeCompare(b.name) : prefs.sort === 'area' ? this.groupName(a).localeCompare(this.groupName(b)) || a.name.localeCompare(b.name) : a.name.localeCompare(b.name));
  }
  private healthRank(h: Device['health']) { return ({ offline: 0, partial: 1, unknown: 2, expected_off: 3, online: 4 } as const)[h]; }
  private healthText(device: Device) {
    if (device.health !== 'unknown' || this.deviceType(device) !== 'remote') return healthLabel[device.health];
    if (device.health_reason === 'no_reachability_source') return 'Erişilebilirlik bilgisi yok';
    return 'Bağlantı doğrulanamıyor';
  }
  private groupName(device: Device) {
    const by = this.data?.preferences.group_by ?? 'area';
    if (by === 'floor') return this.data?.floors.find((x) => x.id === device.floor_id)?.name ?? 'Kat atanmamış';
    if (by === 'integration') return (device.integrations?.length ? device.integrations : [device.integration].filter((value): value is string => Boolean(value))).map(humanize).join(', ') || 'Entegrasyon yok';
    if (by === 'none') return 'Tüm cihazlar';
    return this.data?.areas.find((x) => x.id === device.area_id)?.name ?? 'Atanmamış';
  }
  private areaName(device: Device) { return this.data?.areas.find((area) => area.id === device.area_id)?.name ?? 'Oda atanmamış'; }
  private deviceType(device: Device): NonNullable<Device['device_type']> {
    if (device.device_type) return device.device_type;
    for (const domain of ['light','switch','camera','cover','climate','fan','lock'] as const) if (device.entities.some((entity) => entity.domain === domain)) return domain;
    if (device.entities.some((entity) => entity.domain === 'remote')) return 'remote';
    if (device.entities.some((entity) => entity.domain === 'event')) return 'remote';
    if (device.entities.some((entity) => ['button','input_button'].includes(entity.domain) || entity.device_class === 'button')) return 'button';
    if (device.entities.some((entity) => entity.domain === 'media_player' && ['tv','television'].includes(entity.device_class ?? ''))) return 'tv';
    if (device.entities.some((entity) => entity.device_class === 'motion' || entity.device_class === 'occupancy')) return 'sensor';
    return 'other';
  }
  private deviceIcon(device: Device): TemplateResult {
    const type = this.deviceType(device);
    const preferredDomain: Record<string, string> = { remote:'remote', button:'button', light:'light', switch:'switch', fan:'fan', lock:'lock', climate:'climate', camera:'camera', cover:'cover', tv:'media_player' };
    const primaryEntity = type === 'remote'
      ? device.entities.find((item) => !item.disabled && (item.domain === 'remote' || item.domain === 'event'))
      : type === 'button'
        ? device.entities.find((item) => !item.disabled && (item.domain === 'button' || item.domain === 'input_button' || item.device_class === 'button'))
        : device.entities.find((item) => !item.disabled && item.domain === preferredDomain[type]) ?? device.entities.find((item) => !item.disabled && item.domain === 'media_player' && ['tv','television'].includes(item.device_class ?? '')) ?? device.entities.find((item) => !item.disabled);
    const custom = primaryEntity?.icon ?? primaryEntity?.attributes.icon;
    if (typeof custom === 'string' && safeEntityIcons.has(custom)) return html`<ha-icon .icon=${custom} aria-hidden="true" data-mdi=${custom}></ha-icon>`;
    const entity = primaryEntity;
    let name = type === 'light' ? 'light' : type === 'switch' ? 'relay' : type === 'remote' ? 'remote' : type === 'button' ? 'button' : type === 'tv' ? 'television' : type === 'sensor' ? 'sensor' : type === 'fan' ? 'fan' : type === 'lock' ? 'lock' : type === 'climate' ? 'climate' : type === 'camera' ? 'camera' : type === 'cover' ? 'cover' : 'settings';
    if (type !== 'remote' && (entity?.domain === 'button' || entity?.domain === 'input_button' || entity?.device_class === 'button')) name = 'button';
    else if (entity?.domain === 'media_player') name = ['tv','television'].includes(entity.device_class ?? '') || type === 'tv' ? 'television' : 'media';
    else if (entity?.domain === 'switch' && ['outlet','plug'].includes(entity.device_class ?? '')) name = 'outlet';
    return icon(name);
  }
  private statusText(device: Device) {
    const type = this.deviceType(device);
    if (type === 'light' || type === 'switch' || type === 'cover' || type === 'fan' || type === 'lock' || type === 'climate') {
      const entity = device.entities.find((item) => item.domain === type && !item.disabled);
      if (!entity) return html`<span class="signal-pill unknown">${this.deviceIcon(device)}Durum ölçümü yok</span>`;
      if (entity.state === 'unavailable') return html`<span class="signal-pill state-unavailable">${this.deviceIcon(device)}Durum erişilemiyor</span>`;
      if (entity.state === 'unknown') return html`<span class="signal-pill unknown">${this.deviceIcon(device)}Durum bilinmiyor</span>`;
      if (type === 'climate') {
        const state = entity.state === 'off' ? 'Kapalı' : entity.state === 'unknown' ? 'Durum bilinmiyor' : humanize(entity.state);
        const temperature = entity.attributes.current_temperature;
        const tempText = typeof temperature === 'number' && Number.isFinite(temperature) ? ` · ${temperature}°${typeof entity.attributes.temperature_unit === 'string' ? entity.attributes.temperature_unit : ''}` : '';
        return html`<span class="signal-pill ${entity.state === 'off' ? 'state-off' : 'state-on'}">${this.deviceIcon(device)}${state}${entity.state !== 'off' ? tempText : ''}</span>`;
      }
      if (type === 'cover') {
        const state = ({ open:'Açık', closed:'Kapalı', opening:'Açılıyor', closing:'Kapanıyor' } as Record<string,string>)[entity.state] ?? entity.state;
        return html`<span class="signal-pill ${entity.state === 'closed' ? 'state-off' : 'state-on'}">${this.deviceIcon(device)}${state}</span>`;
      }
      if (type === 'lock') {
        const locked = entity.state === 'locked';
        if (!locked && entity.state !== 'unlocked') return html`<span class="signal-pill unknown">${this.deviceIcon(device)}Durum bilinmiyor</span>`;
        return html`<span class="signal-pill ${locked ? 'state-off' : 'state-on'}">${this.deviceIcon(device)}${locked ? 'Kilitli' : 'Kilit açık'}</span>`;
      }
      if (!['on','off'].includes(entity.state)) return html`<span class="signal-pill unknown">${this.deviceIcon(device)}Durum bilinmiyor</span>`;
      const active = entity.state === 'on';
      const brightness = Number(entity.attributes.brightness);
      const level = type === 'light' && active && Number.isFinite(brightness) ? ` · %${Math.round(brightness / 255 * 100)}` : '';
      return html`<span class="signal-pill ${active ? 'state-on' : 'state-off'}">${this.deviceIcon(device)}${active ? 'Açık' : 'Kapalı'}${level}</span>`;
    }
    if (type === 'remote') {
      const activity = device.activity;
      const timestamp = activity?.last_event_at ? this.formatDate(activity.last_event_at) : null;
      const event = activity?.event_type ? ` · ${humanize(activity.event_type)}` : '';
      return html`${device.signals.connectivity ? this.renderConnectivity(device.signals.connectivity) : html`<span class="signal-pill unknown">${this.deviceIcon(device)}Anlık bağlantı bilgisi yok</span>`}${timestamp || activity?.event_type ? html`<span class="signal-pill">${icon('remote')}${timestamp ? `Son basış ${timestamp}` : 'Son olay zamanı yok'}${event}</span>` : nothing}${device.signals.battery ? this.renderBattery(device.signals.battery) : nothing}`;
    }
    if (type === 'tv') {
      const player = device.entities.find((entity) => entity.domain === 'media_player' && !entity.disabled);
      if (!player) return html`<span class="signal-pill unknown">${this.deviceIcon(device)}TV durumu yok</span>`;
      if (player.state === 'unavailable') return html`<span class="signal-pill state-unavailable">${this.deviceIcon(device)}TV erişilemiyor</span>`;
      if (player.state === 'unknown') return html`<span class="signal-pill unknown">${this.deviceIcon(device)}TV durumu bilinmiyor</span>`;
      const state = ({ on:'Açık',off:'Kapalı',playing:'Oynatıyor',paused:'Duraklatıldı',idle:'Boşta',standby:'Beklemede',buffering:'Yükleniyor' } as Record<string,string>)[player.state] ?? humanize(player.state);
      return html`<span class="signal-pill ${player.state === 'off' || player.state === 'standby' ? 'state-off' : 'state-on'}">${this.deviceIcon(device)}${state}</span>`;
    }
    if (type === 'button') return html`<span class="signal-pill unknown">${this.deviceIcon(device)}Düğme · anlık durum yok</span>`;
    const hasMovement = Boolean(device.signals.motion || device.signals.occupancy);
    if (hasMovement) return this.renderMotion(device);
    if (device.signals.battery) return this.renderBattery(device.signals.battery);
    if (device.signals.connectivity?.meaning === 'unavailable') return html`<span class="signal-pill state-unavailable">${icon('wifi')}Erişilemiyor</span>`;
    if (device.signals.connectivity) return this.renderConnectivity(device.signals.connectivity);
    return html`<span class="signal-pill unknown">${this.deviceIcon(device)}Bu cihaz türünde durum ölçümü yok</span>`;
  }
  private async patch(patch: Partial<Preferences>) {
    if (!this.api || !this.data) return;
    this.saving = true;
    try { const preferences = await this.api.setPreferences(patch); this.data = { ...this.data, preferences }; this.error = ''; if (!this.editing) await this.load(); }
    catch (e) { this.error = `Ayarlar kaydedilemedi: ${this.message(e)}`; }
    finally { this.saving = false; }
  }
  private async saveEditor() { const { schema_version: _version, ...preferences } = this.data!.preferences; await this.patch(preferences); if (!this.error) this.editing = false; }
  private editPreference<K extends keyof Preferences>(key: K, value: Preferences[K]) {
    if (!this.data) return;
    this.data = { ...this.data, preferences: { ...this.data.preferences, [key]: value } };
  }
  private async changeSetting(entity: DeviceEntity, value: string | number | boolean) {
    if (!this.api || !this.canChangeSettings(entity) || !['number','select'].includes(entity.domain)) return;
    if (entity.domain === 'number') {
      const number = Number(value); const attrs = entity.attributes;
      const min = Number(attrs.min ?? 0); const max = Number(attrs.max ?? 100); const step = Number(attrs.step ?? 1);
      if (!Number.isFinite(number) || number < min || number > max || (Number.isFinite(step) && step > 0 && Math.abs((number - min) / step - Math.round((number - min) / step)) > 1e-7)) {
        this.error = `${entity.name}: Değer ${min}–${max} aralığında ve ${step} adımına uygun olmalı.`; return;
      }
      value = number;
    }
    if (entity.domain === 'select') {
      const options = Array.isArray(entity.attributes.options) ? entity.attributes.options as string[] : [];
      if (typeof value !== 'string' || !options.includes(value)) { this.error = `${entity.name}: Listeden geçerli bir seçenek seçin.`; return; }
    }
    const service = entity.domain === 'number' ? 'set_value' : entity.domain === 'select' ? 'select_option' : 'turn_on';
    const data = entity.domain === 'number' ? { value: Number(value) } : entity.domain === 'select' ? { option: String(value) } : {};
    this.savingEntity = entity.entity_id;
    try { await this.api.callEntity(entity.entity_id, service, data, this.settingsUnlocked); await this.load(); }
    catch (e) { this.error = `“${entity.name}” güncellenemedi: ${this.message(e)}`; }
    finally { this.savingEntity = undefined; }
  }
  private async toggleSwitch(entity: DeviceEntity) {
    if (!this.api || !this.canChangeSettings(entity) || entity.domain !== 'switch' || !['on','off'].includes(entity.state)) return;
    this.savingEntity = entity.entity_id;
    try { await this.api.callEntity(entity.entity_id, entity.state === 'on' ? 'turn_off' : 'turn_on', undefined, this.settingsUnlocked); await this.load(); }
    catch (e) { this.error = `“${entity.name}” güncellenemedi: ${this.message(e)}`; }
    finally { this.savingEntity = undefined; }
  }
  private async showReport(generate = false) {
    if (!this.api) return;
    try { this.report = generate ? await this.api.generateReport(this.reportWindow) : await this.api.getReport(this.reportWindow); this.error = ''; }
    catch (e) { this.error = `Rapor alınamadı: ${this.message(e)}`; }
  }
  private groupDevices(devices: Device[]) {
    const groups = new Map<string, Device[]>();
    for (const device of devices) { const name = this.groupName(device); groups.set(name, [...(groups.get(name) ?? []), device]); }
    return [...groups.entries()];
  }
  private selectDevice(device: Device) { if (this.selectedId !== device.id) this.settingsUnlocked = false; this.selectedId = device.id; }
  private canChangeSettings(entity: DeviceEntity) {
    return Boolean(this.api && this.data?.is_admin && this.data.capabilities.settings && this.settingsUnlocked && !this.savingEntity && !entity.disabled && entity.entity_category === 'config' && ['number','select','switch'].includes(entity.domain) && !this.stateUnavailable(entity));
  }
  private setSettingsUnlocked(unlocked: boolean) {
    if (unlocked && (!this.data?.is_admin || !this.data.capabilities.settings || this.savingEntity)) return;
    this.settingsUnlocked = unlocked;
  }
  private renderSettingsGate() {
    if (!this.data?.is_admin || !this.data.capabilities.settings) return nothing;
    return html`<label class="control-safety ${this.settingsUnlocked ? 'unlocked' : ''}"><input type="checkbox" aria-label="Cihaz ayarı değişikliklerine izin ver" .checked=${this.settingsUnlocked} @change=${(event: Event) => this.setSettingsUnlocked((event.target as HTMLInputElement).checked)}><span><strong>${this.settingsUnlocked ? 'Cihaz ayarı değişikliklerine izin verildi' : 'Cihaz ayarları kilitli'}</strong><small>${this.settingsUnlocked ? 'Bu oturumda uygun ayarlar değiştirilebilir. İşiniz bitince kilitleyin.' : 'Değişiklikleri açmak için kutuyu işaretleyin. Ayar değiştirme izni varsayılan olarak kapalıdır.'}</small></span></label>`;
  }

  render() {
    if (this.loading && !this.data) return html`<div class="loading">Cihazlar yükleniyor…</div>`;
    if (!this.data) return html`<main class="shell"><h1>Cihazlar & Bakım</h1>${this.error ? html`<div class="error" role="alert">${this.error}</div>` : nothing}<button class="button" @click=${() => this.load()}>Yeniden dene</button></main>`;
    const devices = this.visibleDevices;
    const selected = devices.find((d) => d.id === this.selectedId);
    const layout = this.data.preferences.layout;
    const offline = devices.filter((d) => d.health === 'offline' || d.health === 'partial').length;
    const accessible = devices.filter((d) => d.health === 'online').length;
    const expected = devices.filter((d) => d.health === 'expected_off').length;
    const unknown = devices.filter((d) => d.health === 'unknown').length;
    const lowBattery = devices.filter((d) => { const signal = d.signals.battery; const value = signal ? this.batteryNumber(signal) : null; return signal?.meaning === 'low' || (signal?.unit?.trim() === '%' && value !== null && value < 20); }).length;
    return html`<main class="shell">
      <header class="top"><div><h1 class="brand-title"><img src=${brandIcon} alt="" aria-hidden="true">Cihazlar & Bakım</h1><p class="subtitle">${devices.length} cihaz izleniyor · ${this.data.monitoring_since ? `İzleme başlangıcı ${this.formatDate(this.data.monitoring_since)}` : 'İzleme başlangıç zamanı yok'}</p></div><div class="top-actions">
        ${this.data.is_admin ? html`<button class="button" @click=${() => { this.editing = !this.editing; if (!this.editing) void this.load(); }}>${icon(this.editing ? 'close' : 'edit')}<span class="button-label">${this.editing ? 'Düzenlemeyi kapat' : 'Düzenle'}</span></button>` : nothing}
        <button class="button" @click=${() => this.report ? (this.report = undefined) : void this.showReport()}>${icon('report')}<span class="button-label">${this.report ? 'Raporu kapat' : 'Raporlar'}</span></button>
      </div></header>
      ${this.error ? html`<div class="error" role="alert">${this.error}</div>` : nothing}
      <section class="summary" aria-label="Cihaz sağlığı özeti"><span class="summary-title">Genel durum</span><span class="metric good">${icon('check')} <strong>${accessible}</strong> erişilebilir</span><span class="metric ${offline ? 'warn' : ''}">${icon('alert')} <strong>${offline}</strong> sorunlu</span><span class="metric"><strong>${unknown}</strong> belirsiz</span><span class="metric"><strong>${expected}</strong> bilerek kapalı</span><span class="metric ${lowBattery ? 'warn' : ''}">${icon('battery')} <strong>${lowBattery}</strong> düşük pil</span></section>
      ${this.renderSettingsGate()}
      ${this.report ? this.renderReport() : nothing}
      ${this.editing ? this.renderEditor(this.data.all_devices) : nothing}
      <div class="toolbar"><label class="search">${icon('search')}<input aria-label="Cihazlarda ara" placeholder="Cihaz, üretici veya entity ara" .value=${this.query} @input=${(e: InputEvent) => this.query = (e.target as HTMLInputElement).value}></label>
        <select class="select" aria-label="Sıralama" .value=${this.data.preferences.sort} @change=${(e: Event) => void this.patch({ sort: (e.target as HTMLSelectElement).value as Preferences['sort'] })}><option value="name">Ada göre</option><option value="health">Sağlık durumuna göre</option><option value="area">Odaya göre</option></select>
        <div class="tabs" role="tablist" aria-label="Görünüm"><button class=${layout === 'inventory' ? 'active' : ''} role="tab" aria-selected=${layout === 'inventory'} @click=${() => void this.patch({ layout: 'inventory' })}>${icon('grid')} Liste</button><button class=${layout === 'rooms' ? 'active' : ''} role="tab" aria-selected=${layout === 'rooms'} @click=${() => void this.patch({ layout: 'rooms' })}>${icon('room')} Odalar</button></div>
      </div>
      ${devices.length ? layout === 'inventory' ? this.renderInventory(devices) : this.renderRooms(devices) : html`<div class="empty">Bu arama ve kapsamda cihaz bulunamadı.</div>`}
      ${selected ? this.renderDrawer(selected) : nothing}
    </main>`;
  }

  private renderInventory(devices: Device[]) {
    const columns = new Set(this.data!.preferences.visible_columns);
    return html`<section class="inventory"><div class="table-scroll"><table><thead><tr><th>Cihaz</th><th>Sağlık</th>${columns.has('area') ? html`<th>Oda</th>` : nothing}${columns.has('motion') ? html`<th>Durum</th>` : nothing}${columns.has('battery') ? html`<th>Pil</th>` : nothing}${columns.has('connectivity') ? html`<th>Bağlantı</th>` : nothing}${columns.has('firmware') ? html`<th>Firmware</th>` : nothing}<th></th></tr></thead><tbody>
      ${devices.map((device) => html`<tr class=${this.selectedId === device.id ? 'selected' : ''} @click=${() => this.selectDevice(device)} tabindex="0" @keydown=${(e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') this.selectDevice(device); }}>
        <td><div class="device-name"><span class="device-glyph type-${this.deviceType(device)}">${this.deviceIcon(device)}</span><span><span class="name">${device.name}</span>${device.model ? html`<span class="sub">${device.model}</span>` : nothing}<span class="sub">${this.devicePlatformLine(device)}</span></span></div></td>
        <td data-mobile><span class="health-pill ${device.health}" title=${device.health_reason ? healthReasonText(device.health_reason) : healthLabel[device.health]}>${icon(device.health === 'online' ? 'check' : 'alert')}${this.healthText(device)}</span></td>
        ${columns.has('area') ? html`<td>${this.areaName(device)}</td>` : nothing}
        ${columns.has('motion') ? html`<td data-mobile>${this.statusText(device)}</td>` : nothing}
        ${columns.has('battery') ? html`<td data-mobile>${this.renderDeviceBattery(device)}</td>` : nothing}
        ${columns.has('connectivity') ? html`<td data-mobile>${this.renderConnectivity(device.signals.connectivity)}</td>` : nothing}
        ${columns.has('firmware') ? html`<td data-mobile>${this.renderFirmwareSummary(device)}</td>` : nothing}
        <td>${icon('chevron')}</td></tr>`)}
      </tbody></table></div><footer class="table-footer"><span>${devices.length} cihaz</span><span>Bir cihazı seçerek ayrıntılarını ve desteklenen ayarları açın</span></footer></section>`;
  }
  private renderRooms(devices: Device[]) {
    return html`<section class="room-grid">${this.groupDevices(devices).map(([group, items]) => html`<article class="room"><button class="room-head" aria-expanded=${this.openGroups[group] !== false} @click=${() => this.openGroups = { ...this.openGroups, [group]: this.openGroups[group] === false }}>${icon('room')}<span class="room-title">${group}</span><small>${items.length} cihaz</small>${icon('down')}</button>${this.openGroups[group] === false ? nothing : html`<div class="room-body">${items.map((device) => this.renderDeviceCard(device))}</div>`}</article>`)}</section>`;
  }
  private renderDeviceCard(device: Device) {
    return html`<article class="device-card" role="button" tabindex="0" @click=${() => this.selectDevice(device)} @keydown=${(e: KeyboardEvent) => { if (e.key === 'Enter') this.selectDevice(device); }}><div class="card-head"><span class="device-glyph type-${this.deviceType(device)}">${this.deviceIcon(device)}</span><span class="name">${device.name}</span><span class="health-pill ${device.health}" title=${device.health_reason ? healthReasonText(device.health_reason) : healthLabel[device.health]}>${this.healthText(device)}</span></div><p class="card-meta">${device.model ? html`<span>${device.model}</span>` : nothing}<span class="card-meta-secondary">${this.devicePlatformLine(device)}</span></p><div class="signals">${this.statusText(device)}</div></article>`;
  }
  private renderMotion(device: Device) {
    const motion = device.signals.motion; const occupancy = device.signals.occupancy;
    const rawItems = [motion && ['motion', motion] as const, occupancy && ['occupancy', occupancy] as const].filter(Boolean) as (readonly ['motion' | 'occupancy', Signal])[];
    const items = rawItems.filter(([_, signal], index) => rawItems.findIndex(([, other]) => other.entity_id === signal.entity_id) === index);
    if (!items.length) return html`<span class="signal-pill unknown">${icon('motion')}Veri yok</span>`;
    return html`${items.map(([kind, signal]) => {
      const cls = signal.meaning === 'active' ? 'active' : signal.meaning === 'unavailable' ? 'warning' : signal.meaning === 'expected_off' ? 'expected' : signal.meaning === 'unknown' || signal.meaning === 'missing' ? 'unknown' : '';
      return html`<span class="signal-pill ${cls}" aria-label=${`${roleLabel[kind]}: ${signalText(kind, signal)}`}>${icon('motion')}${signalText(kind, signal)}</span>`;
    })}`;
  }
  private batteryNumber(signal: Signal) {
    const parse = (value: number | string | null) => typeof value === 'number' && Number.isFinite(value) ? value : typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value)) ? Number(value) : null;
    const stateNumber = parse(signal.state);
    if (signal.meaning === 'unknown' && stateNumber === null) return null;
    return parse(signal.value);
  }
  private renderBattery(signal: Signal | null) {
    if (!signal || signal.meaning === 'missing') return html`<span class="signal-pill unknown">${icon('battery')}Pil verisi yok</span>`;
    if (signal.meaning === 'unavailable' || signal.state === 'unavailable') return html`<span class="signal-pill warning">${icon('battery')}Pil erişilemiyor</span>`;
    if (signal.state === 'unknown') return html`<span class="signal-pill unknown">${icon('battery')}Pil bilinmiyor</span>`;
    if (signal.meaning === 'low') return html`<span class="signal-pill low">${icon('battery')}Pil düşük</span>`;
    if (signal.meaning === 'ok') return html`<span class="signal-pill">${icon('battery')}Pil normal</span>`;
    if (signal.meaning === 'expected_off') return html`<span class="signal-pill expected">${icon('battery')}Bilerek kapalı</span>`;
    const raw = signal.value;
    const numeric = this.batteryNumber(signal);
    const low = numeric !== null && signal.unit?.trim() === '%' && numeric < 20;
    const value = numeric !== null ? `${numeric}${signal.unit ? ` ${signal.unit}` : ''}` : raw === null ? signal.state : `${raw}${signal.unit ? ` ${signal.unit}` : ''}`;
    if (signal.meaning === 'unknown' && numeric === null) return html`<span class="signal-pill unknown">${icon('battery')}Pil bilinmiyor</span>`;
    const cls = signal.meaning === 'unknown' && numeric === null ? 'unknown' : '';
    const uncertain = signal.meaning === 'unknown' && numeric === null ? ' · durum bilinmiyor' : '';
    return html`<span class="signal-pill ${cls} ${low ? 'low' : ''}">${icon('battery')}Pil ${value}${uncertain}</span>`;
  }
  private renderDeviceBattery(device: Device) {
    if (device.signals.battery) return this.renderBattery(device.signals.battery);
    const supportsBattery = device.capabilities?.includes('battery') ?? device.entities.some((entity) => entity.device_class === 'battery' || `${entity.entity_id} ${entity.name}`.toLocaleLowerCase().includes('battery'));
    return html`<span class="signal-pill unknown">${icon('battery')}${supportsBattery ? 'Pil verisi yok' : 'Pil ölçümü yok'}</span>`;
  }
  private renderConnectivity(signal: Signal | null) {
    if (!signal || signal.meaning === 'missing') return html``;
    const text = signal.meaning === 'unavailable' ? 'Bağlantı erişilemiyor' : signal.meaning === 'unknown' ? 'Bağlantı bilinmiyor' : signal.meaning === 'active' ? 'Bağlı' : signal.meaning === 'inactive' ? 'Bağlantı yok' : String(signal.value ?? signal.state);
    return html`<span class="signal-pill ${signal.meaning === 'unavailable' ? 'warning' : signal.meaning === 'unknown' ? 'unknown' : ''}">${icon('wifi')}${text}</span>`;
  }
  private firmwareState(update: FirmwareUpdate) {
    if (update.state === 'unavailable') return { label:'Erişilemiyor', className:'warning' };
    if (update.state === 'unknown') return { label:'Durum bilinmiyor', className:'unknown' };
    if (update.update_available === true || update.state === 'on') return { label:'Güncelleme var', className:'warning' };
    if (update.state === 'off' && update.skipped_version) return { label:`Atlandı · ${update.skipped_version}`, className:'unknown' };
    if (update.state === 'off') return { label:'Güncel', className:'active' };
    return { label:'Durum bilinmiyor', className:'unknown' };
  }
  private renderFirmwareSummary(device: Device) {
    const updates = device.firmware_updates ?? [];
    if (!updates.length) return html`<span class="signal-pill unknown">${device.reported_sw_version ? `Sürüm ${device.reported_sw_version} · güncellik bilinmiyor` : 'HA güncelleme kaynağı yok'}</span>`;
    const states = updates.map((update) => this.firmwareState(update));
    const first = states.find((status) => status.label === 'Güncelleme var') ?? states[0];
    const version = updates.find((update) => update.latest_version)?.latest_version;
    const more = updates.length > 1 ? ` · +${updates.length - 1}` : '';
    return html`<span class="signal-pill ${first.className}">${first.label}${version && first.label === 'Güncelleme var' ? ` · ${version}` : ''}${more}</span>`;
  }
  private safeReleaseUrl(value: string | null) {
    if (!value) return null;
    try { const url = new URL(value); return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null; }
    catch { return null; }
  }
  private renderFirmwareDetails(device: Device) {
    const updates = device.firmware_updates ?? [];
    if (!updates.length) return html`<section class="section"><h3>Firmware durumu</h3>${device.reported_sw_version ? html`<div class="detail-row"><span>HA cihaz kaydındaki yazılım</span><span>${device.reported_sw_version}</span></div>` : nothing}<p>Home Assistant bu cihaz için güncelleme kaynağı sunmuyor; yüklü veya en son firmware sürümü doğrulanamıyor.</p></section>`;
    return html`<section class="section"><h3>Firmware durumu</h3>${updates.map((update) => {
      const status = this.firmwareState(update); const href = this.safeReleaseUrl(update.release_url);
      return html`<article class="firmware-item"><strong>${update.title || 'Firmware güncellemesi'}</strong><small>${update.entity_id}</small><span class="signal-pill ${status.className}">${status.label}</span><div class="versions">${update.installed_version ? `Yüklü: ${update.installed_version}` : 'Yüklü sürüm bilinmiyor'}${update.latest_version ? ` · En son: ${update.latest_version}` : ''}${update.skipped_version ? ` · Atlanan: ${update.skipped_version}` : ''}</div>${update.release_summary ? html`<p>${update.release_summary}</p>` : nothing}${href ? html`<a href=${href} target="_blank" rel="noopener noreferrer">Sürüm notlarını aç</a>` : nothing}</article>`;
    })}</section>`;
  }
  private renderDrawer(device: Device) {
    return html`<div class="drawer-backdrop" @click=${() => this.selectedId = undefined}></div><aside class="drawer" aria-label=${`${device.name} ayrıntıları`}><div class="drawer-head"><span class="device-glyph type-${this.deviceType(device)}">${this.deviceIcon(device)}</span><div><h2>${device.name}</h2>${device.model ? html`<div class="sub">${device.model}</div>` : nothing}<div class="sub">${this.devicePlatformLine(device)}</div></div><button class="button ghost close" aria-label="Kapat" @click=${() => this.selectedId = undefined}>${icon('close')}</button></div>
      ${this.renderSettingsGate()}
      <section class="section"><h3>Sağlık</h3><div class="detail-row"><span>Durum</span><strong>${this.healthText(device)}</strong></div>${device.health_reason ? html`<div class="detail-row"><span>Açıklama</span><span>${healthReasonText(device.health_reason)}</span></div>` : nothing}<div class="detail-row"><span>Oda</span><span>${this.areaName(device)}</span></div><div class="detail-row"><span>Etiketler</span><span>${device.labels.length ? device.labels.join(', ') : '—'}</span></div>
      ${device.device_type === 'remote' ? html`<div class="detail-row"><span>Anlık bağlantı</span><span>${device.signals.connectivity ? 'Bağlantı sensörü mevcut' : 'Anlık bağlantı bilgisi yok'}</span></div>${device.activity?.event_type || device.activity?.last_event_at ? html`<div class="detail-row"><span>Son basış / etkinlik</span><span>${device.activity.last_event_at ? this.formatDate(device.activity.last_event_at) : 'Zaman bilgisi yok'}${device.activity.event_type ? ` · ${humanize(device.activity.event_type)}` : ''}</span></div>` : nothing}` : nothing}
      ${device.signals.motion ? html`<div class="detail-row"><span>Hareket</span>${this.renderMotion(device)}</div>` : nothing}${device.signals.occupancy && device.signals.occupancy.entity_id !== device.signals.motion?.entity_id ? html`<div class="detail-row"><span>Varlık</span>${this.renderMotion({ ...device, signals: { ...device.signals, motion: null } })}</div>` : nothing}${device.signals.battery ? html`<div class="detail-row"><span>Pil</span>${this.renderBattery(device.signals.battery)}</div>` : nothing}</section>
      ${this.data?.is_admin && this.data.capabilities.settings ? this.renderDeviceSettings(device) : nothing}
      ${this.renderFirmwareDetails(device)}
      <section class="section"><h3>Varlıklar (${device.entities.length})</h3>${device.entities.map((entity) => html`<div class="entity-row"><div class="entity-title"><strong>${entity.name}</strong><small>${entity.entity_id}${entity.disabled ? ' · devre dışı' : ''}</small></div><span class="sub">${entity.state}</span></div>`)}</section></aside>`;
  }
  private renderEditor(devices: Device[]) {
    const p = this.data!.preferences;
    return html`<section class="settings-panel"><h2>Görünüm ve kapsam</h2><div class="settings-grid"><label class="field">Cihaz kapsamı<select .value=${p.scope} @change=${(e: Event) => this.changeScope((e.target as HTMLSelectElement).value as Preferences['scope'])}><option value="all">Tüm cihazlar</option><option value="area">Oda</option><option value="floor">Kat</option><option value="label">Etiket</option><option value="integration">Entegrasyon</option><option value="manual">Elle seç</option></select></label>${this.renderScopeValue(p)}<label class="field">Gruplama<select .value=${p.group_by} @change=${(e: Event) => this.editPreference('group_by', (e.target as HTMLSelectElement).value as Preferences['group_by'])}><option value="area">Odaya göre</option><option value="floor">Kata göre</option><option value="integration">Entegrasyona göre</option><option value="none">Gruplama yok</option></select></label><label class="field">Sıralama<select .value=${p.sort} @change=${(e: Event) => this.editPreference('sort', (e.target as HTMLSelectElement).value as Preferences['sort'])}><option value="name">Ada göre</option><option value="health">Sağlığa göre</option><option value="area">Odaya göre</option></select></label><label class="field">Başlangıç görünümü<select .value=${p.layout} @change=${(e: Event) => this.editPreference('layout', (e.target as HTMLSelectElement).value as Preferences['layout'])}><option value="inventory">Kompakt envanter</option><option value="rooms">Oda kartları</option></select></label></div>
      <label class="checkline"><input type="checkbox" .checked=${p.auto_include_new} ?disabled=${p.scope !== 'manual'} @change=${(e: Event) => this.editPreference('auto_include_new', (e.target as HTMLInputElement).checked)}> Yeni bulunan cihazları otomatik dahil et (elle seçilen kapsamda)</label>
      <div class="settings-grid"><label class="field">Geçmiş saklama süresi (gün)<input type="number" min="1" max="365" step="1" .value=${String(p.retention_days)} @change=${(e: Event) => this.editPreference('retention_days', Math.max(1, Math.min(365, Number((e.target as HTMLInputElement).value))))}></label><label class="checkline"><input type="checkbox" .checked=${p.weekly_report_enabled} @change=${(e: Event) => this.editPreference('weekly_report_enabled', (e.target as HTMLInputElement).checked)}> Haftalık rapor bildirimi (Pazartesi 09.00)</label></div>
      <div class="subhead">Tabloda gösterilen sütunlar</div><div class="settings-grid">${[['area','Oda'],['motion','Durum'],['battery','Pil'],['connectivity','Bağlantı'],['firmware','Firmware']].map(([key,label]) => html`<label class="checkline"><input type="checkbox" .checked=${p.visible_columns.includes(key)} @change=${(e: Event) => { const checked = (e.target as HTMLInputElement).checked; this.editPreference('visible_columns', checked ? [...p.visible_columns,key] : p.visible_columns.filter((x) => x !== key)); }}>${label}</label>`)}</div>
      <div class="subhead">Cihaz istisnaları ve elle seçilen cihazlar <span class="sub">(hariç tutulanlar kapsam kuralının önceliğindedir)</span></div><div class="settings-devices">${devices.map((device) => { const excluded = p.excluded_device_ids.includes(device.id); const isIncluded = p.included_device_ids === null ? !excluded : p.included_device_ids.includes(device.id); return html`<label class="settings-device"><input type="checkbox" .checked=${p.scope === 'manual' ? isIncluded : !excluded} @change=${(e: Event) => { const checked = (e.target as HTMLInputElement).checked; if (p.scope === 'manual') { const list = new Set(p.included_device_ids ?? this.data!.all_devices.map((d) => d.id)); const excludedIds = new Set(p.excluded_device_ids); if (checked) { list.add(device.id); excludedIds.delete(device.id); } else list.delete(device.id); this.editPreference('included_device_ids', [...list]); this.editPreference('excluded_device_ids', [...excludedIds]); } else { const list = new Set(p.excluded_device_ids); checked ? list.delete(device.id) : list.add(device.id); this.editPreference('excluded_device_ids', [...list]); } }}><span>${device.name}</span><small>${this.groupName(device)}</small></label>`; })}</div>
      <div class="subhead">Algılayıcı kaynakları</div><div class="sources">${devices.flatMap((device) => (['motion','occupancy','battery','connectivity'] as const).map((role) => {
        const current = p.source_overrides[device.id]?.[role] ?? '';
        const candidates = device.entities.filter((entity) => !entity.disabled && (role === 'motion' ? entity.domain === 'binary_sensor' && entity.device_class === 'motion' : role === 'occupancy' ? entity.domain === 'binary_sensor' && ['occupancy','presence'].includes(entity.device_class ?? '') : role === 'battery' ? entity.device_class === 'battery' || (entity.domain === 'sensor' && ['%','v','mv'].includes((entity.unit ?? '').toLocaleLowerCase()) && `${entity.entity_id} ${entity.name}`.toLocaleLowerCase().includes('battery')) : entity.domain === 'binary_sensor' && entity.device_class === 'connectivity'));
        return candidates.length ? html`<label class="field">${device.name} · ${roleLabel[role]}<select .value=${current} @change=${(e: Event) => { const byId = { ...p.source_overrides, [device.id]: { ...{ motion: null, occupancy: null, battery: null, connectivity: null }, ...p.source_overrides[device.id], [role]: (e.target as HTMLSelectElement).value || null } }; this.editPreference('source_overrides', byId); }}><option value="">Otomatik kaynak</option>${candidates.map((entity) => html`<option value=${entity.entity_id}>${entity.name} (${entity.entity_id})</option>`)}</select></label>` : nothing;
      }))}</div>
      <div class="subhead">Bilerek kapalı kuralları</div>${p.expected_off_rules.map((rule, index) => html`<div class="rule-row"><input class="plain-input" aria-label="Entity" .value=${rule.entity_id} @change=${(e: Event) => this.updateRule(index,'entity_id',(e.target as HTMLInputElement).value)}><input class="plain-input" aria-label="Beklenen durum" .value=${rule.state} @change=${(e: Event) => this.updateRule(index,'state',(e.target as HTMLInputElement).value)}><button class="button" aria-label="Kuralı sil" @click=${() => this.editPreference('expected_off_rules', p.expected_off_rules.filter((_, i) => i !== index))}>${icon('close')}</button></div>`)}
      <button class="button" @click=${() => this.editPreference('expected_off_rules', [...p.expected_off_rules,{ id: crypto.randomUUID(), entity_id:'', state:'off' }])}>+ Kural ekle</button>
      <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px"><button class="button" @click=${() => { this.editing = false; void this.load(); }}>İptal</button><button class="button primary" ?disabled=${this.saving} @click=${() => this.saveEditor()}>${this.saving ? 'Kaydediliyor…' : 'Değişiklikleri kaydet'}</button></div></section>`;
  }
  private changeScope(scope: Preferences['scope']) {
    this.settingsUnlocked = false;
    const p = this.data!.preferences;
    let included = p.included_device_ids;
    if (scope === 'manual' && p.scope !== 'manual') included = this.visibleDevices.map((device) => device.id);
    this.editPreference('scope', scope);
    this.editPreference('scope_value', null);
    this.editPreference('included_device_ids', scope === 'manual' ? included ?? [] : null);
  }
  private renderScopeValue(p: Preferences) {
    const choices: NamedItem[] = p.scope === 'area' ? this.data!.areas : p.scope === 'floor' ? this.data!.floors : p.scope === 'label' ? this.data!.labels : p.scope === 'integration' ? [...new Set(this.data!.all_devices.flatMap((d) => d.integrations?.length ? d.integrations : d.integration ? [d.integration] : []))].map((id) => ({ id, name: humanize(id) })) : [];
    if (!['area','floor','label','integration'].includes(p.scope)) return nothing;
    return html`<label class="field">${({ area:'Oda',floor:'Kat',label:'Etiket',integration:'Entegrasyon' } as Record<string,string>)[p.scope]}<select .value=${p.scope_value ?? ''} @change=${(e: Event) => this.editPreference('scope_value', (e.target as HTMLSelectElement).value || null)}><option value="">Seçiniz</option>${choices.map((choice) => html`<option value=${choice.id}>${choice.name}</option>`)}</select></label>`;
  }
  private updateRule(index: number, key: 'entity_id'|'state', value: string) {
    const rules = [...this.data!.preferences.expected_off_rules]; rules[index] = { ...rules[index], [key]: value }; this.editPreference('expected_off_rules', rules);
  }
  private renderDeviceSettings(device?: Device) {
    if (!device) return nothing;
    const eligible = device.entities.filter((entity) => !entity.disabled && ['number','select','switch'].includes(entity.domain) && entity.entity_category === 'config');
    if (!eligible.length) return nothing;
    return html`<section class="settings-panel ${this.settingsUnlocked ? '' : 'read-only'}"><h2>Desteklenen ayarlar</h2>${this.error ? html`<div class="error" role="alert">${this.error}</div>` : nothing}<p class="sub">Kilitliyken değerler yalnızca görüntülenir. Değişiklik için yukarıdaki onay kutusunu açın.</p>${eligible.map((entity) => html`<div class="entity-row"><div class="entity-title"><strong>${entity.name}</strong><small>${entity.entity_id}${entity.entity_category ? ` · ${entity.entity_category}` : ''}</small></div>${entity.domain === 'switch' ? html`<button class="button" ?disabled=${!this.canChangeSettings(entity)} @click=${() => this.toggleSwitch(entity)}>${this.stateUnavailable(entity) ? (entity.state === 'unavailable' ? 'Erişilemiyor' : 'Durum bilinmiyor') : entity.state === 'on' ? 'Açık' : entity.state === 'off' ? 'Kapalı' : entity.state}</button>` : entity.domain === 'select' ? this.renderSelect(entity) : this.renderNumber(entity)}</div>`)}</section>`;
  }
  private stateUnavailable(entity: DeviceEntity) { return ['unknown','unavailable'].includes(entity.state); }
  private renderSelect(entity: DeviceEntity) {
    const options = Array.isArray(entity.attributes.options) ? entity.attributes.options as string[] : [];
    return html`<select class="select" aria-label=${entity.name} ?disabled=${!this.canChangeSettings(entity)} .value=${this.stateUnavailable(entity) ? '' : entity.state} @change=${(e: Event) => void this.changeSetting(entity,(e.target as HTMLSelectElement).value)}>${this.stateUnavailable(entity) ? html`<option value="">${entity.state === 'unavailable' ? 'Erişilemiyor' : 'Durum bilinmiyor'}</option>` : !options.includes(entity.state) ? html`<option value=${entity.state}>${entity.state} · geçerli seçenek yok</option>` : nothing}${options.map((x) => html`<option value=${x}>${x}</option>`)}</select>`;
  }
  private renderNumber(entity: DeviceEntity) {
    const attrs = entity.attributes; const min = Number(attrs.min ?? 0); const max = Number(attrs.max ?? 100); const step = Number(attrs.step ?? 1);
    return html`<input class="plain-input" type="number" aria-label=${entity.name} .value=${this.stateUnavailable(entity) ? '' : entity.state} placeholder=${this.stateUnavailable(entity) ? (entity.state === 'unavailable' ? 'Erişilemiyor' : 'Durum bilinmiyor') : ''} min=${min} max=${max} step=${step} ?disabled=${!this.canChangeSettings(entity)} @change=${(e: Event) => void this.changeSetting(entity,Number((e.target as HTMLInputElement).value))}>`;
  }
  private renderReport() {
    const r = this.report!; const s = r.stats;
    return html`<section class="report-panel"><div style="display:flex;align-items:center;gap:8px;margin-bottom:12px"><h2 style="margin:0">Bakım raporu</h2><select class="select" .value=${this.reportWindow} @change=${(e: Event) => { this.reportWindow = (e.target as HTMLSelectElement).value as '24h'|'7d'; void this.showReport(); }}><option value="24h">Son 24 saat</option><option value="7d">Son 7 gün</option></select><button class="button primary" style="margin-left:auto" @click=${() => this.showReport(true)}>Rapor oluştur</button></div>
      <div class="report-stats"><div class="stat"><strong>${this.formatDuration(s.device_outage_seconds)}</strong><span>Cihaz-kesinti toplamı</span></div><div class="stat"><strong>${s.outage_starts}</strong><span>Kesinti başlangıcı</span></div><div class="stat"><strong>${s.outage_intervals}</strong><span>Kesinti aralığı</span></div><div class="stat"><strong>${s.low_battery}</strong><span>Düşük pil</span></div><div class="stat"><strong>${s.missing_data}</strong><span>Eksik veri</span></div></div>
      ${r.ongoing.length ? html`<div class="subhead">Devam eden kesintiler</div>${r.ongoing.map((event) => html`<div class="report-event"><strong>${this.deviceName(event.device_id)}</strong><span>Başlangıç ${this.formatDate(event.start)}</span><span>${this.formatDuration(event.seconds)} · sürüyor</span></div>`)}` : nothing}
      <div class="report-events">${r.events.filter((event) => !event.ongoing).slice(0,8).map((event) => html`<div class="report-event"><strong>${this.deviceName(event.device_id)}</strong><span>${this.formatDate(event.start)}</span><span>${this.formatDuration(event.seconds)}</span></div>`)}</div>
      <p class="coverage">${r.coverage_since ? `Veri kapsamı ${this.formatDate(r.coverage_since)} tarihinden itibaren.` : 'Veri kapsamı başlangıcı bilinmiyor.'} Cihaz kesinti süreleri cihaz bazında toplanır; evin çevrimdışı süresi değildir.</p></section>`;
  }
  private deviceName(id: string) { return this.data?.devices.find((device) => device.id === id)?.name ?? id; }
  private devicePlatformLine(device: Device) {
    const platforms = device.integrations?.length ? device.integrations : [device.integration].filter((value): value is string => Boolean(value));
    return [device.manufacturer, platforms.map(humanize).join(', ')].filter(Boolean).join(' · ') || 'Üretici / entegrasyon bilgisi yok';
  }
  private formatDate(value: string) { const date = new Date(value); return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat(this.hass?.language || 'tr', { dateStyle:'short', timeStyle:'short' }).format(date); }
  private formatDuration(seconds: number) { const minutes = Math.round(seconds / 60); if (minutes < 60) return `${minutes} dk`; const hours = Math.floor(minutes / 60); const remaining = minutes % 60; return remaining ? `${hours} sa ${remaining} dk` : `${hours} sa`; }
}

declare global { interface HTMLElementTagNameMap { 'device-care-panel': DeviceCarePanel } }
