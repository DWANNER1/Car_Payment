export interface IpOsC2DPayload {
  tpn: string;
  amount: number;
  external_id: string;
  currency: 'USD';
}

export interface IpOsWebhookEvent {
  event: 'transaction.success' | 'transaction.failed';
  data: { transaction_id: string; external_id: string; amount: number; terminal_status: string };
}
