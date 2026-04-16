import { Router } from 'express';
import { finalizePaymentSchema, partialRefundSchema, terminalSaleSchema, tokenSaleSchema } from '../schemas/payment.js';
import { transactionStore } from '../services/transactionStore.js';

let sequence = 1;
const serviceMid = 'MID-SERVICE-DEMO';

export const paymentsRouter = Router();

paymentsRouter.post('/payments/terminal-sale', (req, res) => {
  const parsed = terminalSaleSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid terminal sale payload' });

  const transactionId = `demo-terminal-${sequence++}`;
  transactionStore.add({
    gatewayTransactionId: transactionId,
    roNumber: parsed.data.roNumber,
    amount: parsed.data.amount,
    status: 'accepted',
    departmentId: parsed.data.departmentId ?? 'mixed'
  });

  return res.status(202).json({
    transactionId,
    status: 'accepted',
    routingMid: parsed.data.routingMid ?? serviceMid,
    mixedRule: 'default-service-mid'
  });
});

paymentsRouter.post('/payments/token-sale', (req, res) => {
  const parsed = tokenSaleSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid token sale payload' });

  const transactionId = `demo-token-${sequence++}`;
  transactionStore.add({
    gatewayTransactionId: transactionId,
    roNumber: parsed.data.roNumber,
    amount: parsed.data.amount,
    status: 'accepted',
    departmentId: parsed.data.departmentId ?? 'mixed'
  });

  return res.status(202).json({
    transactionId,
    status: 'accepted',
    routingMid: parsed.data.routingMid ?? serviceMid,
    mixedRule: 'default-service-mid'
  });
});

paymentsRouter.post('/payments/finalize', (req, res) => {
  const parsed = finalizePaymentSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid finalize payload' });

  transactionStore.finalize(parsed.data.gatewayTransactionId);
  return res.json({
    ok: true,
    dmsWriteBack: {
      surchargeLineItem: {
        code: 'NON_TAX_MISC_FEE',
        amount: parsed.data.surchargeAmount
      }
    }
  });
});

paymentsRouter.post('/payments/partial-refund', (req, res) => {
  const parsed = partialRefundSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid partial refund payload' });

  const match = transactionStore.partialRefund(parsed.data.gatewayTransactionId, parsed.data.refundAmount);
  if (!match) return res.status(404).json({ error: 'transaction not found' });
  return res.json({ ok: true, refunded: parsed.data.refundAmount });
});
