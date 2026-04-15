import { Router } from 'express';
import { roQuerySchema } from '../schemas/ro.js';

export const dmsRouter = Router();

dmsRouter.get('/dms/ro', (req, res) => {
  const parsed = roQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    return res.status(400).json({ error: 'query is required' });
  }

  return res.json([
    {
      ro_number: parsed.data.query,
      vin: 'STUBVIN1234567890',
      customer_name: 'Stub Customer',
      totalAmountDue: 100,
      status: 'open'
    }
  ]);
});
