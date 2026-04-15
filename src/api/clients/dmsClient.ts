import type { DmsRo } from '../schemas/ro.js';
import { demoModeService } from '../services/demoMode.js';

export interface DmsClient {
  fetchRepairOrder(query: string): Promise<DmsRo>;
  writeBackPayment(input: {
    roNumber: string;
    authCode: string;
    finalAmount: number;
    gatewayTransactionId: string;
  }): Promise<{ ok: true }>;
}

export const dmsClient: DmsClient = {
  async fetchRepairOrder(query: string) {
    const suffix = query.slice(-4).padStart(4, '0');
    if (demoModeService.isEnabled()) {
      return {
        ro_number: query,
        vin: `DEMO-VIN-${suffix}`,
        customer_name: `Demo Customer ${suffix}`,
        totalAmountDue: 100 + Number(suffix) % 50,
        status: 'open'
      };
    }

    return {
      ro_number: query,
      vin: 'LIVE-PLACEHOLDER',
      customer_name: 'Live Placeholder',
      totalAmountDue: 100,
      status: 'open'
    };
  },
  async writeBackPayment() {
    return { ok: true };
  }
};
