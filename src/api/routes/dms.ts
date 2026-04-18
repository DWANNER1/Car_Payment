import { Router } from 'express';
import { dmsForcePostSchema, dmsWriteBackSchema } from '../schemas/dms.js';
import { roQuerySchema } from '../schemas/ro.js';
import { demoModeService } from '../services/demoMode.js';
import { transactionStore } from '../services/transactionStore.js';

export const dmsRouter = Router();

dmsRouter.get('/dms/ro', (req, res) => {
  const parsed = roQuerySchema.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ error: 'query is required' });

  const suffix = parsed.data.query.slice(-4).padStart(4, '0');
  const parts = 40 + (Number(suffix) % 25);
  const service = 60 + (Number(suffix) % 35);
  const total = parts + service;

  return res.json([
    {
      ro_number: parsed.data.query,
      vin: `${demoModeService.isEnabled() ? 'DEMO' : 'LIVE'}-VIN-${suffix}`,
      customer_name: `Customer ${suffix}`,
      totalAmountDue: total,
      remainingBalance: total,
      status: 'open',
      line_items: [
        { line_id: `P-${suffix}`, description: 'Brake Pads', department_id: 'parts', department_name: 'Parts', amount: parts, category: 'parts' },
        { line_id: `S-${suffix}`, description: 'Brake Service Labour', department_id: 'service', department_name: 'Service', amount: service, category: 'service' }
      ]
    }
  ]);
});

dmsRouter.post('/dms/write-back', (req, res) => {
  const parsed = dmsWriteBackSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid dms write-back payload' });

  const match = transactionStore.recordDmsWriteBack(parsed.data);
  if (!match) return res.status(404).json({ error: 'transaction not found' });

  return res.json({
    ok: true,
    posted: true,
    dmsWriteBack: {
      gatewayTransactionId: parsed.data.gatewayTransactionId,
      surchargeLineItem: {
        code: parsed.data.surchargeCode,
        amount: parsed.data.amountSurcharge
      }
    }
  });
});

dmsRouter.post('/dms/force-post', (req, res) => {
  const parsed = dmsForcePostSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid force-post payload' });

  const match = transactionStore.forcePost(parsed.data.gatewayTransactionId);
  if (!match) return res.status(404).json({ error: 'transaction not found' });

  return res.json({ ok: true, forced: true, gatewayTransactionId: parsed.data.gatewayTransactionId });
});
