import { z } from 'zod';

export const iposWebhookSchema = z.object({
  event: z.enum(['transaction.success', 'transaction.failed']),
  data: z.object({
    transaction_id: z.string(),
    external_id: z.string(),
    amount: z.number(),
    terminal_status: z.string()
  })
});

export type IposWebhookEvent = z.infer<typeof iposWebhookSchema>;
