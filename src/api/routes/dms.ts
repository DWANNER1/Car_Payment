import { Router } from 'express';
import { roQuerySchema } from '../schemas/ro.js';
import { dmsClient } from '../clients/dmsClient.js';

export const dmsRouter = Router();

dmsRouter.get('/dms/ro', async (req, res) => {
  const parsed = roQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    return res.status(400).json({ error: 'query is required' });
  }

  const ro = await dmsClient.fetchRepairOrder(parsed.data.query);
  return res.json([ro]);
});
