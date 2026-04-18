import { z } from 'zod';

export const dmsWriteBackSchema = z.object({
  gatewayTransactionId: z.string().min(1),
  roNumber: z.string().min(1),
  departmentId: z.string().min(1),
  amountBase: z.number().nonnegative(),
  amountApplied: z.number().nonnegative(),
  amountSurcharge: z.number().nonnegative().default(0),
  surchargeCode: z.string().min(1).default('NON_TAX_MISC_FEE')
});

export const dmsForcePostSchema = z.object({
  gatewayTransactionId: z.string().min(1)
});
