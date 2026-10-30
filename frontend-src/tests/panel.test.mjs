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

function mount({ failure = false } = {}) {
  let devices = structuredClone(initialDevices);
  let preferences = defaultPreferences();
  let updateCallback;
  let unsubscribed = false;
  const calls = [];
  const hass = { language: 'en', connection: {
    async sendMessagePromise(message) {
      calls.push(message);
      if (message.type === 'device_care/get_data') {
        if (failure) throw new Error('backend unavailable');
        return { devices: structuredClone(devices), all_devices: structuredClone(devices), areas: [{ id:'hall', name:'Hall' }], floors: [{ id:'floor-1', name:'Ground floor' }], labels: [{ id:'security', name:'Security' }], preferences: structuredClone(preferences), monitoring_since:'2026-10-27T12:00:00Z', capabilities:{reports:true,settings:true}, is_admin:true };
      }
      if (message.type === 'device_care/set_preferences') { preferences = { ...preferences, ...message.preferences }; return { preferences: structuredClone(preferences) }; }
      if (message.type === 'device_care/call_entity') return { success:true };
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
  app.devices = [makeDevice('active', 'inactive', 'off')];
  app.updateCallback({ type:'event', event_type:'device_care/updated', data:{ reason:'state' } });
  await settle(app.element, 120);
  assert.match(app.element.shadowRoot.textContent, /Hareket algılanmıyor/);
  app.element.remove(); await settle(app.element);
  assert.equal(app.unsubscribed, true);
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
  assert.match(app.element.shadowRoot.querySelector('[role="alert"]')?.textContent ?? '', /backend unavailable/);
  assert.doesNotMatch(app.element.shadowRoot.textContent, /0 erişilebilir/);
  app.element.remove();
});

test('disables a CONFIG switch when its state is unavailable', async () => {
  const app = mount(); await settle(app.element);
  const [device, ...rest] = app.devices;
  app.devices = [{ ...device, entities: [...device.entities, { entity_id:'switch.sensor_mode', name:'Sensor mode', state:'unavailable', domain:'switch', device_class:null, entity_category:'config', unit:null, attributes:{}, disabled:false }] }, ...rest];
  app.updateCallback({ type:'event', event_type:'device_care/updated', data:{ reason:'registry' } });
  await settle(app.element, 120);
  app.element.shadowRoot.querySelector('tbody tr').click(); await settle(app.element);
  const settings = [...app.element.shadowRoot.querySelectorAll('.settings-panel')].find((panel) => panel.textContent.includes('Desteklenen ayarlar'));
  const control = [...settings.querySelectorAll('button')].find((button) => button.textContent.includes('Erişilemiyor'));
  assert.ok(control);
  assert.equal(control.disabled, true);
  app.element.remove();
});
