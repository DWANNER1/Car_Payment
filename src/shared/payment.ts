export type PaymentFlow = 'terminal' | 'token' | 'credit';

export interface ReceiptPreview {
  roNumber: string;
  customerName: string;
  amountBase: number;
  amountPaidNow: number;
  amountRemaining: number;
  amountSurcharge: number;
  amountTotal: number;
  flow: PaymentFlow;
  reference: string;
  surchargeLabel: string;
}
