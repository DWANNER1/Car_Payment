export type PaymentFlow = 'terminal' | 'token' | 'cash' | 'debit' | 'credit' | 'stored_token';
export type PaymentMethod = 'cash' | 'debit' | 'credit' | 'stored_token';
export type ReceiptVariant = 'print' | 'email' | 'text';

export interface ReceiptLineItem {
  label: string;
  amount: number;
  tone?: 'default' | 'muted' | 'accent';
}

export interface ReceiptHeaderConfig {
  businessName: string;
  receiptTitle: string;
  tagline: string;
  addressLine1: string;
  addressLine2: string;
  contactLine: string;
  footerNote: string;
}

export interface ReceiptTemplateConfig {
  print: ReceiptHeaderConfig;
  email: ReceiptHeaderConfig;
  text: ReceiptHeaderConfig;
}

export interface BrandingConfig {
  dealershipName: string;
  logoDataUrl: string | null;
  logoFileName: string | null;
}

export interface TokenMetadata {
  tokenId: string;
  tokenReference: string;
  last4: string;
  brand: string;
  isDefault: boolean;
  createdAt: string;
}

export interface ReceiptPreview {
  roNumber: string;
  customerName: string;
  routingMid: string;
  departmentId: string;
  amountBase: number;
  amountPaidNow: number;
  amountRemaining: number;
  amountSurcharge: number;
  amountTotal: number;
  flow: PaymentFlow;
  reference: string;
  paymentMethodLabel: string;
  surchargeLabel: string;
  lineItems: ReceiptLineItem[];
}
