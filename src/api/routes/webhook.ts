import { Router } from 'express';
import { iposWebhookSchema } from '../schemas/webhook.js';

export const webhookRouter = Router();

webhookRouter.post('/webhook/ipos', (req, res) => {
  const parsed = iposWebhookSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: 'invalid webhook payload' });
  }

  console.log('Received webhook', parsed.data);
  return res.status(202).json({ accepted: true });
});
