import type { CareData, HaConnection, Preferences, Report } from './types';

export class DeviceCareApi {
  private unsubscribe?: () => void;
  constructor(private connection: HaConnection) {}

  getData(): Promise<CareData> {
    return this.connection.sendMessagePromise<CareData>({ type: 'device_care/get_data' });
  }
  async setPreferences(preferences: Partial<Preferences>): Promise<Preferences> {
    const result = await this.connection.sendMessagePromise<{ preferences: Preferences }>({ type: 'device_care/set_preferences', preferences });
    return result.preferences;
  }
  getReport(window: '24h' | '7d'): Promise<Report> {
    return this.connection.sendMessagePromise<Report>({ type: 'device_care/get_report', window });
  }
  generateReport(window: '24h' | '7d'): Promise<Report> {
    return this.connection.sendMessagePromise<Report>({ type: 'device_care/generate_report', window });
  }
  callEntity(entity_id: string, service: string, data?: Record<string, unknown>): Promise<{ success: true }> {
    return this.connection.sendMessagePromise({ type: 'device_care/call_entity', entity_id, service, ...(data ? { data } : {}) });
  }
  async subscribe(onUpdate: (reason: string) => void): Promise<void> {
    await this.unsubscribe?.();
    this.unsubscribe = await this.connection.subscribeMessage<{ type: string; event_type: string; data?: { reason?: string } }>(
      (message) => { if (message.event_type === 'device_care/updated') onUpdate(message.data?.reason ?? 'state'); },
      { type: 'device_care/subscribe_updates' },
    );
  }
  async dispose(): Promise<void> {
    const unsubscribe = this.unsubscribe;
    this.unsubscribe = undefined;
    if (unsubscribe) {
      unsubscribe();
      // Server side registration is removed when the websocket subscription closes.
    }
  }
}
