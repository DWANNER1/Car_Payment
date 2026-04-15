import { demoModeService } from '../services/demoMode.js';

let sequence = 1;

export interface IposClient {
  getAuthToken(): Promise<{ accessToken: string; expiresIn: number }>;
  createTerminalSale(input: {
    tpn: string;
    amount: number;
    externalId: string;
  }): Promise<{ transactionId: string; status: 'accepted' }>;
  createRecurringSale(input: {
    cardToken: string;
    amount: number;
    description: string;
  }): Promise<{ transactionId: string; status: 'accepted' }>;
}

export const iposClient: IposClient = {
  async getAuthToken() {
    return { accessToken: demoModeService.isEnabled() ? 'demo-token' : 'stub-token', expiresIn: 3600 };
  },
  async createTerminalSale() {
    return { transactionId: `${demoModeService.isEnabled() ? 'demo' : 'stub'}-terminal-${sequence++}`, status: 'accepted' };
  },
  async createRecurringSale() {
    return { transactionId: `${demoModeService.isEnabled() ? 'demo' : 'stub'}-token-${sequence++}`, status: 'accepted' };
  }
};
