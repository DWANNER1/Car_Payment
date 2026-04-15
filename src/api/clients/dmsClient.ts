import type { DmsRo } from '../schemas/ro.js';

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
    return {
      ro_number: query,
      vin: 'STUBVIN1234567890',
      customer_name: 'Stub Customer',
      totalAmountDue: 100,
      status: 'open'
    };
  },
  async writeBackPayment() {
    return { ok: true };
  }
};
