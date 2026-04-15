import { z } from 'zod';

export const terminalSaleSchema = z.object({
  roNumber: z.string().min(1),
  tpn: z.string().min(1),
  amount: z.number().positive()
});

export const tokenSaleSchema = z.object({
  roNumber: z.string().min(1),
  cardToken: z.string().min(1),
  amount: z.number().positive(),
  description: z.string().min(1)
});

export const finalizePaymentSchema = z.object({
  roNumber: z.string().min(1),
  authCode: z.string().min(1),
  finalAmount: z.number().positive(),
  gatewayTransactionId: z.string().min(1)
});

export type TerminalSaleInput = z.infer<typeof terminalSaleSchema>;
export type TokenSaleInput = z.infer<typeof tokenSaleSchema>;
export type FinalizePaymentInput = z.infer<typeof finalizePaymentSchema>;
