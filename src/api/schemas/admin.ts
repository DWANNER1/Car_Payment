import { z } from 'zod';

export const surchargeConfigSchema = z.object({
  enabled: z.boolean().optional(),
  percentage: z.number().nonnegative().max(100).optional(),
  label: z.string().min(1).optional(),
  dmsCode: z.string().min(1).optional(),
  refundSurcharge: z.boolean().optional()
});
