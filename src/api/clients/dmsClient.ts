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
    const parts = 40 + (Number(suffix) % 25);
    const service = 60 + (Number(suffix) % 35);
    const total = parts + service;

    if (demoModeService.isEnabled()) {
      return {
        ro_number: query,
        vin: `DEMO-VIN-${suffix}`,
        customer_name: `Demo Customer ${suffix}`,
        totalAmountDue: total,
        remainingBalance: total,
        status: 'open',
        line_items: [
          {
            line_id: `P-${suffix}`,
            description: 'Brake Pads',
            department_id: 'parts',
            department_name: 'Parts',
            amount: parts,
            category: 'parts'
          },
          {
            line_id: `S-${suffix}`,
            description: 'Brake Service Labour',
            department_id: 'service',
            department_name: 'Service',
            amount: service,
            category: 'service'
          }
        ]
      };
    }

    return {
      ro_number: query,
      vin: 'LIVE-PLACEHOLDER',
      customer_name: 'Live Placeholder',
      totalAmountDue: total,
      remainingBalance: total,
      status: 'open',
      line_items: []
    };
  },
  async writeBackPayment() {
    return { ok: true };
  }
};
