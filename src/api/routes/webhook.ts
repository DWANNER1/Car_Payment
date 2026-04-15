import { Router } from 'express';
import { iposWebhookSchema } from '../schemas/webhook.js';
import { createIdempotencyGuard } from '../services/idempotency.js';
import { transactionStore } from '../services/transactionStore.js';

const guard = createIdempotencyGuard();
export const webhookRouter = Router();

webhookRouter.post('/webhook/ipos', (req, res) => {
  const parsed = iposWebhookSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: 'invalid webhook payload' });
  }

  const duplicate = guard.checkAndMark(parsed.data.data.transaction_id);
  if (duplicate) {
    return res.status(200).json({ accepted: true, duplicate: true });
  }

  if (parsed.data.event === 'transaction.success') {
    transactionStore.finalize(parsed.data.data.transaction_id);
  }

  return res.status(202).json({ accepted: true, duplicate: false });
});
