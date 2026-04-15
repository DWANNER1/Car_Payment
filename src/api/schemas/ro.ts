import { z } from 'zod';

export const roQuerySchema = z.object({
  query: z.string().min(1, 'query is required')
});

export const dmsRoSchema = z.object({
  ro_number: z.string(),
  vin: z.string(),
  customer_name: z.string(),
  totalAmountDue: z.number(),
  status: z.enum(['open', 'closed'])
});

export type RoQuery = z.infer<typeof roQuerySchema>;
export type DmsRo = z.infer<typeof dmsRoSchema>;
