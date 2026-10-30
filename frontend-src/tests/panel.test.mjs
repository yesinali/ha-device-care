import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { Window } from 'happy-dom';

const browserWindow = new Window({ url: 'http://localhost/' });
for (const key of ['window','document','customElements','HTMLElement','Element','Node','Document','ShadowRoot','CSSStyleSheet','Event','CustomEvent','KeyboardEvent','InputEvent','MutationObserver','navigator']) {
  if (browserWindow[key] !== undefined) Object.defineProperty(globalThis, key, { value: browserWindow[key], configurable: true, writable: true });
}

const makeDevice = (id, meaning, state, health = 'online') => ({
  id, device_id: id, name: `Sensor ${id}`, area_id: 'hall', floor_id: 'floor-1', labels: ['security'],
  manufacturer: 'Example', model: 'M1', integration: 'mqtt',
  entities: [{ entity_id: `binary_sensor.${id}`, name: `Sensor ${id}`, state, domain: 'binary_sensor', device_class: 'motion', entity_category: null, unit: null, attributes: {}, disabled: false }],
  signals: { motion: { entity_id: `binary_sensor.${id}`, state, value: state, unit: null, meaning }, occupancy: null, battery: null, connectivity: null },
  health, health_reason: null,
});
const initialDevices = [
  makeDevice('active', 'active', 'on'), makeDevice('inactive', 'inactive', 'off'),
  makeDevice('unavailable', 'unavailable', 'unavailable', 'offline'), makeDevice('unknown', 'unknown', 'unknown', 'unknown'),
  makeDevice('expected', 'expected_off', 'off', 'expected_off'),
];
const defaultPreferences = () => ({
  schema_version: 1, scope: 'all', scope_value: null, layout: 'inventory', group_by: 'area', sort: 'name',
  visible_columns: ['area','motion','battery','connectivity'], included_device_ids: null, excluded_device_ids: [],
  auto_include_new: false, source_overrides: {}, expected_off_rules: [], retention_days: 30, weekly_report_enabled: false,
});

let registered;
before(async () => { registered = await import('../../custom_components/device_care/frontend/device-care.js'); });
after(async () => { await browserWindow.happyDOM.close(); });

function mount({ failure = false, slowSave = false, slowEntity = false, locale = 'tr-TR', timeZone = 'UTC' } = {}) {
  let devices = structuredClone(initialDevices);
  let preferences = defaultPreferences();
  let updateCallback;
  let unsubscribed = false;
  const calls = [];
  const hass = { language: locale, locale: { language: locale }, config: { time_zone: timeZone }, connection: {
    async sendMessagePromise(message) {
      calls.push(message);
      if (message.type === 'device_care/get_data') {
        if (failure) throw new Error('backend unavailable');
        return { devices: structuredClone(devices), all_devices: structuredClone(devices), areas: [{ id:'hall', name:'Hall' }], floors: [{ id:'floor-1', name:'Ground floor' }], labels: [{ id:'security', name:'Security' }], preferences: structuredClone(preferences), monitoring_since:'2026-10-27T12:00:00Z', capabilities:{reports:true,settings:true}, is_admin:true };
      }
      if (message.type === 'device_care/set_preferences') { if (slowSave) await new Promise((resolve) => setTimeout(resolve, 100)); preferences = { ...preferences, ...message.preferences }; return { preferences: structuredClone(preferences) }; }
      if (message.type === 'device_care/call_entity') { if (slowEntity) await new Promise((resolve) => setTimeout(resolve, 100)); return { success:true }; }
      return {};
    },
    async subscribeMessage(callback) { updateCallback = callback; return () => { unsubscribed = true; }; },
  } };
  const element = document.createElement('device-care-panel');
  element.hass = hass;
  document.body.append(element);
  return { element, calls, get devices(){ return devices; }, set devices(value){ devices = value; }, get preferences(){ return preferences; }, get updateCallback(){ return updateCallback; }, get unsubscribed(){ return unsubscribed; } };
}
async function settle(element, ms = 0) {
  await new Promise((resolve) => setTimeout(resolve, ms));
  await element.updateComplete;
  await Promise.resolve();
  await element.updateComplete;
}

test('renders distinct movement meanings with text and semantic classes', async () => {
  const app = mount(); await settle(app.element);
  const root = app.element.shadowRoot;
  assert.match(root.textContent, /Hareket algılanıyor/);
  assert.match(root.textContent, /Hareket algılanmıyor/);
  assert.match(root.textContent, /Erişilemiyor/);
  assert.match(root.textContent, /Durum bilinmiyor/);
  assert.match(root.textContent, /Bilerek kapalı/);
  assert.equal(root.querySelector('.metric.good strong')?.textContent, '2', 'unknown and expected-off devices are not counted as online');
  assert.equal(root.querySelector('.signal-pill.active')?.textContent.trim(), 'Hareket algılanıyor');
  assert.equal(root.querySelector('.signal-pill.warning')?.textContent.trim(), 'Erişilemiyor');
  assert.equal(root.querySelector('.signal-pill.expected')?.textContent.trim(), 'Bilerek kapalı');
  app.element.remove();
});

test('refreshes inventory after pushed state event and unsubscribes on disconnect', async () => {
  const app = mount(); await settle(app.element);
  const gate = app.element.shadowRoot.querySelector('.control-safety input');
  gate.checked = true; gate.dispatchEvent(new Event('change',{ bubbles:true })); await settle(app.element);
  assert.equal(app.element.settingsUnlocked,true);
  app.devices = [makeDevice('active', 'inactive', 'off')];
  app.updateCallback({ type:'event', event_type:'device_care/updated', data:{ reason:'state' } });
  await settle(app.element, 120);
  assert.match(app.element.shadowRoot.textContent, /Hareket algılanmıyor/);
  app.element.remove(); await settle(app.element);
  assert.equal(app.unsubscribed, true);
  assert.equal(app.element.settingsUnlocked, false, 'disconnect clears session unlock');
});

test('scope editor exposes all scope options and manual selection uses all_devices', async () => {
  const app = mount(); await settle(app.element);
  const edit = [...app.element.shadowRoot.querySelectorAll('button')].find((button) => button.textContent.includes('Düzenle'));
  edit.click(); await settle(app.element);
  const scope = app.element.shadowRoot.querySelector('.settings-panel select');
  assert.deepEqual([...scope.options].map((option) => option.value), ['all','area','floor','label','integration','manual']);
  scope.value = 'manual'; scope.dispatchEvent(new Event('change', { bubbles:true })); await settle(app.element);
  const rows = app.element.shadowRoot.querySelectorAll('.settings-device');
  assert.equal(rows.length, initialDevices.length);
  const save = [...app.element.shadowRoot.querySelectorAll('button')].find((button) => button.textContent.includes('Değişiklikleri kaydet'));
  save.click(); await settle(app.element);
  const saveCall = app.calls.find((call) => call.type === 'device_care/set_preferences');
  assert.equal(saveCall.preferences.scope, 'manual');
  assert.ok(Array.isArray(saveCall.preferences.included_device_ids));
  app.element.remove();
});

test('surfaces WebSocket load errors instead of showing an empty healthy inventory', async () => {
  const app = mount({ failure:true }); await settle(app.element);
  assert.match(app.element.shadowRoot.querySelector('[role="alert"]')?.textContent ?? '', /Home Assistant bağlantısı kullanılamıyor/);
  assert.doesNotMatch(app.element.shadowRoot.textContent, /0 erişilebilir/);
  app.element.remove();
});

test('keeps unavailable CONFIG switches disabled inside the drawer, even after explicit unlock', async () => {
  const app = mount(); await settle(app.element);
  const [device, ...rest] = app.devices;
  app.devices = [{ ...device, entities: [...device.entities, { entity_id:'switch.sensor_mode', name:'Sensor mode', state:'unavailable', domain:'switch', device_class:null, entity_category:'config', unit:null, attributes:{}, disabled:false }] }, ...rest];
  app.updateCallback({ type:'event', event_type:'device_care/updated', data:{ reason:'registry' } });
  await settle(app.element, 120);
  app.element.shadowRoot.querySelector('tbody tr').click(); await settle(app.element);
  const drawer = app.element.shadowRoot.querySelector('.drawer');
  const settings = [...drawer.querySelectorAll('.settings-panel')].find((panel) => panel.textContent.includes('Desteklenen ayarlar'));
  assert.ok(settings, 'settings are rendered in the drawer, above the backdrop');
  const control = [...settings.querySelectorAll('button')].find((button) => button.textContent.includes('Erişilemiyor'));
  assert.ok(control);
  assert.equal(control.disabled, true);
  const gate = drawer.querySelector('.control-safety input');
  assert.equal(gate.checked, false);
  gate.checked = true; gate.dispatchEvent(new Event('change', { bubbles:true })); await settle(app.element);
  assert.equal(control.disabled, true);
  control.click(); await settle(app.element);
  assert.equal(app.calls.filter((call) => call.type === 'device_care/call_entity').length, 0);
  app.element.remove();
});

test('requires explicit opt-in for CONFIG writes and sends controls_unlocked true', async () => {
  const app = mount(); await settle(app.element);
  const [device, ...rest] = app.devices;
  const controls = [
    { entity_id:'switch.sensor_mode', name:'Sensor mode', state:'off', domain:'switch', device_class:null, entity_category:'config', unit:null, attributes:{}, disabled:false },
    { entity_id:'select.sensor_profile', name:'Sensor profile', state:'eco', domain:'select', device_class:null, entity_category:'config', unit:null, attributes:{ options:['eco','boost'] }, disabled:false },
    { entity_id:'number.sensor_level', name:'Sensor level', state:'20', domain:'number', device_class:null, entity_category:'config', unit:null, attributes:{ min:0,max:100,step:5 }, disabled:false },
  ];
  app.devices = [{ ...device, entities:[...device.entities,...controls] }, ...rest];
  app.updateCallback({ type:'event', event_type:'device_care/updated', data:{ reason:'registry' } }); await settle(app.element,120);
  app.element.shadowRoot.querySelector('tbody tr').click(); await settle(app.element);
  const drawer = app.element.shadowRoot.querySelector('.drawer');
  const panel = drawer.querySelector('.settings-panel');
  assert.ok(panel);
  assert.equal(app.element.shadowRoot.querySelectorAll(':scope > .settings-panel').length, 0);
  const switchButton = [...panel.querySelectorAll('button')].find((button) => button.textContent.includes('Kapalı'));
  const select = panel.querySelector('select');
  const number = panel.querySelector('input[type=number]');
  assert.ok(switchButton.disabled && select.disabled && number.disabled);
  assert.equal(select.value, 'eco');
  assert.equal(number.value, '20');
  switchButton.click(); await settle(app.element);
  assert.equal(app.calls.filter((call) => call.type === 'device_care/call_entity').length, 0);
  const gate = drawer.querySelector('.control-safety input');
  gate.checked = true; gate.dispatchEvent(new Event('change', { bubbles:true })); await settle(app.element);
  assert.ok(!switchButton.disabled && !select.disabled && !number.disabled);
  number.value = '101'; number.dispatchEvent(new Event('change',{ bubbles:true })); await settle(app.element);
  assert.match(drawer.querySelector('[role="alert"]')?.textContent ?? '',/0–100 aralığında/);
  assert.equal(app.calls.filter((call) => call.type === 'device_care/call_entity').length,0,'out-of-range number values are rejected locally');
  const safeSwitchButton = [...drawer.querySelectorAll('.settings-panel button')].find((button) => button.textContent.trim() === 'Kapalı');
  safeSwitchButton.click(); await settle(app.element,20);
  const call = app.calls.find((item) => item.type === 'device_care/call_entity');
  assert.equal(call.entity_id, 'switch.sensor_mode');
  assert.equal(call.controls_unlocked, true);
  app.element.remove();
});

test('locks settings on device change, scope change, and a fresh panel session', async () => {
  const app = mount(); await settle(app.element);
  const root = app.element.shadowRoot;
  const topGate = root.querySelector('.control-safety input');
  topGate.checked = true; topGate.dispatchEvent(new Event('change', { bubbles:true })); await settle(app.element);
  root.querySelector('tbody tr').click(); await settle(app.element);
  assert.equal(root.querySelector('.drawer .control-safety input').checked, false, 'opening another device locks the controls');
  const drawerGate = root.querySelector('.drawer .control-safety input');
  drawerGate.checked = true; drawerGate.dispatchEvent(new Event('change', { bubbles:true })); await settle(app.element);
  root.querySelector('.drawer .close').click(); await settle(app.element);
  root.querySelectorAll('tbody tr')[1].click(); await settle(app.element);
  assert.equal(root.querySelector('.drawer .control-safety input').checked, false, 'switching devices resets unlock state');
  root.querySelector('.drawer .close').click(); await settle(app.element);
  const mainGate = root.querySelector('.shell > .control-safety input');
  mainGate.checked = true; mainGate.dispatchEvent(new Event('change', { bubbles:true })); await settle(app.element);
  root.querySelector('.top-actions button').click(); await settle(app.element);
  const scope = [...root.querySelectorAll('.settings-panel select')].find((select) => [...select.options].some((option) => option.value === 'manual'));
  scope.value = 'manual'; scope.dispatchEvent(new Event('change', { bubbles:true })); await settle(app.element);
  assert.equal(root.querySelector('.shell > .control-safety input').checked, false, 'changing scope relocks settings');
  app.element.remove(); await settle(app.element);
  const fresh = mount(); await settle(fresh.element);
  assert.equal(fresh.element.shadowRoot.querySelector('.control-safety input').checked, false, 'a fresh panel starts locked');
  fresh.element.remove();
});

test('locking during a pending settings request blocks every subsequent write', async () => {
  const app = mount({ slowEntity:true }); await settle(app.element);
  const [device, ...rest] = app.devices;
  const configSwitch = { entity_id:'switch.sensor_mode',name:'Sensor mode',state:'off',domain:'switch',device_class:null,entity_category:'config',unit:null,attributes:{},disabled:false };
  const configSelect = { entity_id:'select.sensor_profile',name:'Sensor profile',state:'eco',domain:'select',device_class:null,entity_category:'config',unit:null,attributes:{ options:['eco','boost'] },disabled:false };
  app.devices = [{ ...device, entities:[...device.entities,configSwitch,configSelect] }, ...rest];
  app.updateCallback({ type:'event',event_type:'device_care/updated',data:{ reason:'registry' } }); await settle(app.element,120);
  app.element.shadowRoot.querySelector('tbody tr').click(); await settle(app.element);
  const drawer = app.element.shadowRoot.querySelector('.drawer');
  const gate = drawer.querySelector('.control-safety input');
  gate.checked = true; gate.dispatchEvent(new Event('change',{ bubbles:true })); await settle(app.element);
  [...drawer.querySelectorAll('.settings-panel button')].find((button) => button.textContent.trim() === 'Kapalı').click();
  await settle(app.element,5);
  const lock = drawer.querySelector('.control-safety input');
  lock.checked = false; lock.dispatchEvent(new Event('change',{ bubbles:true })); await settle(app.element);
  const select = drawer.querySelector('.settings-panel select');
  select.value = 'boost'; select.dispatchEvent(new Event('change',{ bubbles:true }));
  assert.equal(app.calls.filter((call) => call.type === 'device_care/call_entity').length,1);
  await settle(app.element,120);
  assert.equal(drawer.querySelector('.control-safety input').checked,false);
  app.element.remove();
});

test('shows numeric battery unknown values but never stale unavailable values', async () => {
  const app = mount(); await settle(app.element);
  const [device, ...rest] = app.devices;
  const sensor = { ...device, signals: { ...device.signals, battery:{ entity_id:'sensor.battery_voltage',state:'2.7',value:2.7,unit:'V',meaning:'unknown' } } };
  app.devices = [sensor, ...rest];
  app.updateCallback({ type:'event', event_type:'device_care/updated', data:{ reason:'state' } });
  await settle(app.element, 120);
  assert.match(app.element.shadowRoot.textContent, /Pil 2\.7 V/);
  assert.doesNotMatch(app.element.shadowRoot.textContent, /Pil 2\.7 V · durum bilinmiyor/);
  const fullBattery = { ...sensor, signals:{ ...sensor.signals, battery:{ entity_id:'sensor.battery_percent',state:'100',value:100,unit:'%',meaning:'measured' } } };
  app.devices = [fullBattery, ...rest];
  app.updateCallback({ type:'event', event_type:'device_care/updated', data:{ reason:'state' } });
  await settle(app.element,120);
  const fullBatteryPill = [...app.element.shadowRoot.querySelectorAll('.signal-pill')].find((pill) => pill.textContent.includes('Pil 100 %'));
  assert.ok(fullBatteryPill);
  assert.ok(!fullBatteryPill.classList.contains('unknown'));
  const unavailable = { ...sensor, signals:{ ...sensor.signals, battery:{ ...sensor.signals.battery,state:'unavailable',value:2.7,meaning:'unavailable' } } };
  app.devices = [unavailable, ...rest];
  app.updateCallback({ type:'event', event_type:'device_care/updated', data:{ reason:'state' } });
  await settle(app.element, 120);
  assert.match(app.element.shadowRoot.textContent, /Pil erişilemiyor/);
  assert.doesNotMatch(app.element.shadowRoot.textContent, /Pil 2\.7 V/);
  const cachedUnknown = { ...sensor, signals:{ ...sensor.signals, battery:{ ...sensor.signals.battery,state:'unknown',value:2.7,meaning:'unknown' } } };
  app.devices = [cachedUnknown, ...rest];
  app.updateCallback({ type:'event', event_type:'device_care/updated', data:{ reason:'state' } });
  await settle(app.element, 120);
  assert.match(app.element.shadowRoot.textContent, /Pil bilinmiyor/);
  assert.doesNotMatch(app.element.shadowRoot.textContent, /Pil 2\.7 V/);
  app.element.remove();
});

test('offers battery voltage sources and excludes diagnostic RSSI from connectivity sources', async () => {
  const app = mount(); await settle(app.element);
  const [device, ...rest] = app.devices;
  const entities = [...device.entities,
    { entity_id:'sensor.sensor_battery_voltage',name:'Battery voltage',state:'2.8',domain:'sensor',device_class:null,entity_category:null,unit:'V',attributes:{},disabled:false },
    { entity_id:'binary_sensor.device_link',name:'Device link',state:'on',domain:'binary_sensor',device_class:'connectivity',entity_category:null,unit:null,attributes:{},disabled:false },
    { entity_id:'binary_sensor.device_link_diag',name:'Diagnostic link status',state:'on',domain:'binary_sensor',device_class:'connectivity',entity_category:'diagnostic',unit:null,attributes:{},disabled:false },
    { entity_id:'sensor.device_rssi',name:'RSSI',state:'-67',domain:'sensor',device_class:null,entity_category:'diagnostic',unit:'dBm',attributes:{},disabled:false },
  ];
  app.devices = [{ ...device, integrations:['mqtt','matter'], entities }, ...rest.map((item) => ({ ...item, integrations:[item.integration ?? 'zha'] }))];
  app.updateCallback({ type:'event', event_type:'device_care/updated', data:{ reason:'registry' } });
  await settle(app.element, 120);
  const edit = [...app.element.shadowRoot.querySelectorAll('button')].find((button) => button.textContent.includes('Düzenle'));
  edit.click(); await settle(app.element);
  const batteryField = [...app.element.shadowRoot.querySelectorAll('.sources .field')].find((field) => field.textContent.includes('Sensor active · Pil'));
  assert.ok([...batteryField.querySelectorAll('option')].some((option) => option.value === 'sensor.sensor_battery_voltage'));
  const connectivityField = [...app.element.shadowRoot.querySelectorAll('.sources .field')].find((field) => field.textContent.includes('Sensor active · Bağlantı'));
  const connectivityOptions = [...connectivityField.querySelectorAll('option')].map((option) => option.value);
  assert.ok(connectivityOptions.includes('binary_sensor.device_link'));
  assert.ok(connectivityOptions.includes('binary_sensor.device_link_diag'));
  assert.ok(!connectivityOptions.includes('sensor.device_rssi'));
  const scope = app.element.shadowRoot.querySelector('.settings-panel select');
  scope.value = 'integration'; scope.dispatchEvent(new Event('change', { bubbles:true })); await settle(app.element);
  const integrationScope = [...app.element.shadowRoot.querySelectorAll('.settings-panel select')].find((select) => [...select.options].some((option) => option.value === 'matter'));
  assert.ok(integrationScope);
  assert.ok([...integrationScope.options].some((option) => option.value === 'matter'));
  app.element.remove();
});

test('renders capability-aware status for lights, switches, and remotes without inventing reachability', async () => {
  const app = mount(); await settle(app.element);
  const base = app.devices[0];
  app.devices = [
    { ...base, id:'lamp', name:'Desk lamp', device_type:'light', entities:[{ entity_id:'light.desk',name:'Desk lamp',state:'on',domain:'light',device_class:null,entity_category:null,unit:null,attributes:{ brightness:128 },disabled:false }], signals:{ motion:null,occupancy:null,battery:null,connectivity:null } },
    { ...base, id:'relay', name:'Relay', device_type:'switch', entities:[{ entity_id:'switch.relay',name:'Relay',state:'off',domain:'switch',device_class:null,entity_category:null,unit:null,attributes:{},disabled:false }], signals:{ motion:null,occupancy:null,battery:null,connectivity:null } },
    { ...base, id:'remote', name:'Remote', device_type:'remote', activity:{ entity_id:'event.remote_button',event_type:'button_1_single',last_event_at:'2026-10-30T10:00:00Z' }, health:'unknown', health_reason:'no_reachability_source', entities:[{ entity_id:'event.remote_button',name:'Remote button',state:'button_1_single',domain:'event',device_class:'button',entity_category:null,unit:null,attributes:{},disabled:false }], signals:{ motion:null,occupancy:null,battery:null,connectivity:null } },
  ];
  app.updateCallback({ type:'event', event_type:'device_care/updated', data:{ reason:'registry' } }); await settle(app.element,120);
  const root = app.element.shadowRoot;
  assert.match(root.textContent, /Açık · %50/);
  assert.match(root.textContent, /Kapalı/);
  assert.match(root.textContent, /Anlık bağlantı bilgisi yok/);
  assert.match(root.textContent, /Erişilebilirlik bilgisi yok/);
  assert.match(root.textContent, /Son basış/);
  const remoteRow = [...root.querySelectorAll('tbody tr')].find((row) => row.textContent.includes('Remote'));
  assert.match(remoteRow.textContent, /Erişilebilirlik bilgisi yok/);
  assert.ok(remoteRow.querySelector('[data-icon="remote"]'), 'event-domain devices retain the remote glyph');
  remoteRow.click(); await settle(app.element);
  assert.match(root.querySelector('.drawer')?.textContent ?? '', /Erişilebilirlik bilgisi yok/);
  assert.ok(root.querySelector('.drawer-head .device-glyph svg'));
  app.element.remove();
});

test('maps TV, button, light, and relay entities to specific safe icons', async () => {
  const app = mount(); await settle(app.element);
  const base = app.devices[0];
  app.devices = [
    { ...base,id:'tv',name:'TV',device_type:'tv',entities:[{ entity_id:'media_player.tv',name:'TV',state:'playing',domain:'media_player',device_class:'tv',entity_category:null,unit:null,attributes:{},disabled:false }] },
    { ...base,id:'button',name:'Button',device_type:'button',entities:[{ entity_id:'button.button',name:'Button',state:'unknown',domain:'button',device_class:null,entity_category:null,unit:null,attributes:{},disabled:false }] },
    { ...base,id:'lamp',name:'Lamp',device_type:'light',entities:[{ entity_id:'light.lamp',name:'Lamp',state:'off',domain:'light',device_class:null,entity_category:null,unit:null,attributes:{},icon:'mdi:lightbulb',disabled:false }] },
    { ...base,id:'relay',name:'Relay',device_type:'switch',entities:[{ entity_id:'switch.relay',name:'Relay',state:'off',domain:'switch',device_class:'switch',entity_category:null,unit:null,attributes:{},icon:'https://example.invalid/icon.svg',disabled:false }] },
  ];
  app.updateCallback({ type:'event',event_type:'device_care/updated',data:{ reason:'registry' } }); await settle(app.element,120);
  const root = app.element.shadowRoot;
  const glyphFor = (name) => [...root.querySelectorAll('tbody tr')].find((row) => row.textContent.includes(name))?.querySelector('.device-glyph');
  assert.ok(glyphFor('TV').querySelector('[data-icon="television"]'));
  assert.match(root.textContent,/Oynatıyor/);
  assert.ok(glyphFor('Button').querySelector('[data-icon="button"]'));
  assert.equal(glyphFor('Lamp').querySelector('ha-icon')?.icon,'mdi:lightbulb');
  assert.ok(glyphFor('Relay').querySelector('[data-icon="relay"]'));
  assert.equal(glyphFor('Relay').querySelector('ha-icon'),null,'non-MDI icon URLs are ignored');
  app.element.remove();
});

test('shows firmware update facts read-only, distinguishes skipped and unknown states, and never fabricates latest status', async () => {
  const app = mount(); await settle(app.element);
  const base = app.devices[0];
  const firmware = (entity_id,title,state,installed_version,latest_version,skipped_version=null,update_available=null,release_url=null) => ({ entity_id,title,state,installed_version,latest_version,skipped_version,release_summary:'<img src=x onerror=alert(1)> release notes',release_url,update_available });
  const devices = [
    { ...base,id:'available',name:'Available update',firmware_updates:[firmware('update.router','Router firmware','on','1.0','1.1',null,true,'https://example.com/release')] },
    { ...base,id:'current',name:'Current firmware',firmware_updates:[firmware('update.current','Current firmware','off','2.0','2.0',null,false)] },
    { ...base,id:'skipped',name:'Skipped update',firmware_updates:[firmware('update.sensor','Sensor firmware','off','1.0','1.2','1.2',false,'javascript:alert(1)')] },
    { ...base,id:'unknown_update',name:'Unknown update',firmware_updates:[firmware('update.unknown','Adapter firmware','unknown',null,null)] },
    { ...base,id:'unavailable_update',name:'Unavailable update',firmware_updates:[firmware('update.unavailable','Lamp firmware','unavailable',null,null)] },
    { ...base,id:'reported_only',name:'Reported version',reported_sw_version:'6.4.2',firmware_updates:[] },
    { ...base,id:'no_source',name:'No update entity',firmware_updates:[] },
  ];
  app.element.data = { ...app.element.data,devices,all_devices:devices,preferences:{ ...app.element.data.preferences,visible_columns:[...app.element.data.preferences.visible_columns,'firmware'] } };
  await settle(app.element);
  const root = app.element.shadowRoot;
  assert.match(root.textContent,/Güncelleme var · 1\.1/);
  assert.match(root.textContent,/Güncel/);
  assert.match(root.textContent,/Atlandı · 1\.2/);
  assert.match(root.textContent,/Durum bilinmiyor/);
  assert.match(root.textContent,/Erişilemiyor/);
  assert.match(root.textContent,/Sürüm 6\.4\.2 · güncellik bilinmiyor/);
  assert.match(root.textContent,/HA güncelleme kaynağı yok/);
  assert.doesNotMatch(root.textContent,/Reported version[\s\S]{0,120}Güncel/);
  const skippedRow = [...root.querySelectorAll('tbody tr')].find((row) => row.textContent.includes('Skipped update'));
  skippedRow.click(); await settle(app.element);
  const drawer = root.querySelector('.drawer');
  assert.match(drawer.textContent,/Atlandı · 1\.2/);
  assert.match(drawer.textContent,/Yüklü: 1\.0 · En son: 1\.2/);
  assert.equal(drawer.querySelector('.firmware-item a'),null,'unsafe release URLs are not linkified');
  assert.equal(drawer.querySelector('.firmware-item img'),null,'release summaries are rendered as text');
  assert.equal(drawer.querySelectorAll('.firmware-item button').length,0,'firmware UI has no install action');
  app.element.remove();
});

test('save button uses Lit interpolation and submits preferences while showing saving state', async () => {
  const app = mount({ slowSave:true }); await settle(app.element);
  app.element.shadowRoot.querySelector('button[aria-label="Düzenle"], .top-actions button')?.click(); await settle(app.element);
  const save = [...app.element.shadowRoot.querySelectorAll('button')].find((button) => button.textContent.includes('Değişiklikleri kaydet'));
  assert.ok(save);
  assert.equal(save.textContent.trim(), 'Değişiklikleri kaydet');
  save.click(); await settle(app.element);
  const saving = [...app.element.shadowRoot.querySelectorAll('button')].find((button) => button.textContent.includes('Kaydediliyor'));
  assert.ok(saving);
  assert.equal(saving.disabled, true);
  await settle(app.element,120);
  const saveCall = app.calls.find((call) => call.type === 'device_care/set_preferences');
  assert.equal(saveCall.preferences.scope, 'all');
  assert.equal(saveCall.preferences.layout, 'inventory');
  app.element.remove();
});

test('area column and drawer stay tied to actual area when grouping is disabled; room grid aligns cards to top', async () => {
  const app = mount(); await settle(app.element);
  app.element.data = { ...app.element.data, preferences:{ ...app.element.data.preferences, group_by:'none' } };
  await settle(app.element);
  assert.equal(app.element.shadowRoot.querySelector('tbody tr td:nth-child(3)')?.textContent.trim(), 'Hall');
  app.element.shadowRoot.querySelector('tbody tr').click(); await settle(app.element);
  assert.equal([...app.element.shadowRoot.querySelectorAll('.detail-row')].find((row) => row.textContent.includes('Oda'))?.textContent, 'OdaHall');
  assert.match(registered.DeviceCarePanel.styles.cssText, /align-items:start/);
  app.element.remove();
});

test('renders English US UI and updates labels immediately when HA locale changes', async () => {
  const app = mount({ locale:'en-US', timeZone:'America/Los_Angeles' }); await settle(app.element);
  const root = app.element.shadowRoot;
  assert.match(root.querySelector('h1').textContent,/Devices & Care/);
  assert.match(root.textContent,/Motion detected/);
  assert.equal(root.querySelector('.control-safety input')?.getAttribute('aria-label'),'Allow device setting changes');
  const translatedDevice = { ...app.element.data.devices[0], name:'Salon Hareket', entities:app.element.data.devices[0].entities.map((entity) => ({ ...entity, name:'Salon hareket sensörü' })) };
  app.element.data = { ...app.element.data, devices:[translatedDevice,...app.element.data.devices.slice(1)], all_devices:[translatedDevice,...app.element.data.all_devices.slice(1)] };
  await settle(app.element);
  assert.match(root.textContent,/Salon Hareket/);
  root.querySelector('tbody tr')?.click(); await settle(app.element);
  assert.match(root.querySelector('.drawer').textContent,/Salon hareket sensörü/,'entity-provided labels remain unchanged in English UI');
  const expectedDate = new Intl.DateTimeFormat('en-US',{dateStyle:'short',timeStyle:'short',timeZone:'America/Los_Angeles'}).format(new Date('2026-10-27T12:00:00Z'));
  assert.match(root.querySelector('.subtitle').textContent,new RegExp(expectedDate.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')),'dates use the Home Assistant timezone');
  root.querySelector('.top-actions button').click(); await settle(app.element);
  assert.match(root.textContent,/View and scope/);
  assert.match(root.textContent,/Save changes/);
  assert.match(root.textContent,/Automatically include new devices/);
  app.element.hass = { ...app.element.hass, language:'tr-TR', locale:{language:'tr-TR'} };
  await settle(app.element);
  assert.match(root.querySelector('h1').textContent,/Cihazlar & Bakım/);
  assert.match(root.textContent,/Hareket algılanıyor/);
  assert.match(root.textContent,/Görünüm ve kapsam/);
  const expectedTurkishDate = new Intl.DateTimeFormat('tr-TR',{dateStyle:'short',timeStyle:'short',timeZone:'America/Los_Angeles'}).format(new Date('2026-10-27T12:00:00Z'));
  assert.ok(root.querySelector('.subtitle').textContent.includes(expectedTurkishDate),'Turkish date formatting still honors the HA timezone');
  app.element.remove();
});

test('defaults locale fallback to English US and localizes initial load errors', async () => {
  const app = mount({ failure:true, locale:'en-US' }); await settle(app.element);
  assert.match(app.element.shadowRoot.textContent,/Devices & Care/);
  assert.match(app.element.shadowRoot.textContent,/Retry/);
  assert.match(app.element.shadowRoot.textContent,/Home Assistant connection is unavailable/);
  app.element.hass = { connection:app.element.hass.connection, config:{time_zone:'UTC'} }; await settle(app.element);
  assert.match(app.element.shadowRoot.querySelector('h1').textContent,/Devices & Care/,'missing locale falls back to English US');
  app.element.remove();
});
