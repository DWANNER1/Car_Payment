export type PaymentFlow = 'terminal' | 'token' | 'credit';

export interface ReceiptPreview {
  roNumber: string;
  customerName: string;
  amountBase: number;
  amountPaidNow: number;
  amountRemaining: number;
  amountTotal: number;
  flow: PaymentFlow;
  reference: string;
}

export interface TerminalSaleRequest {
  roNumber: string;
  tpn: string;
  amount: number;
  departmentId?: string;
}

export interface TokenSaleRequest {
  roNumber: string;
  cardToken: string;
  amount: number;
  description: string;
  departmentId?: string;
}

export interface FinalizePaymentRequest {
  roNumber: string;
  authCode: string;
  finalAmount: number;
  gatewayTransactionId: string;
}
