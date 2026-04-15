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
    return { accessToken: 'stub-token', expiresIn: 3600 };
  },
  async createTerminalSale() {
    return { transactionId: 'stub-terminal-sale', status: 'accepted' };
  },
  async createRecurringSale() {
    return { transactionId: 'stub-recurring-sale', status: 'accepted' };
  }
};
