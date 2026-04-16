import { Router } from 'express';
import { iposClient } from '../clients/iposClient.js';
import { dmsClient } from '../clients/dmsClient.js';
import { finalizePaymentSchema, partialRefundSchema, terminalSaleSchema, tokenSaleSchema } from '../schemas/payment.js';
import { transactionStore } from '../services/transactionStore.js';
import { demoModeService } from '../services/demoMode.js';

export const paymentsRouter = Router();

paymentsRouter.post('/payments/terminal-sale', async (req, res) => {
  const parsed = terminalSaleSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid terminal sale payload' });

  const result = await iposClient.createTerminalSale({
    tpn: parsed.data.tpn,
    amount: parsed.data.amount,
    externalId: parsed.data.roNumber
  });

  transactionStore.add({
    gatewayTransactionId: result.transactionId,
    roNumber: parsed.data.roNumber,
    amount: parsed.data.amount,
    flow: parsed.data.departmentId === 'parts' ? 'terminal' : 'terminal',
    status: 'accepted',
    createdAt: new Date().toISOString(),
    departmentId: parsed.data.departmentId ?? 'mixed'
  });

  return res.status(202).json({ ...result, demoMode: demoModeService.isEnabled() });
});

paymentsRouter.post('/payments/token-sale', async (req, res) => {
  const parsed = tokenSaleSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid token sale payload' });

  const result = await iposClient.createRecurringSale({
    cardToken: parsed.data.cardToken,
    amount: parsed.data.amount,
    description: parsed.data.description
  });

  transactionStore.add({
    gatewayTransactionId: result.transactionId,
    roNumber: parsed.data.roNumber,
    amount: parsed.data.amount,
    flow: 'token',
    status: 'accepted',
    createdAt: new Date().toISOString(),
    departmentId: parsed.data.departmentId ?? 'mixed'
  });

  return res.status(202).json({ ...result, demoMode: demoModeService.isEnabled() });
});

paymentsRouter.post('/payments/finalize', async (req, res) => {
  const parsed = finalizePaymentSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid finalize payload' });

  await dmsClient.writeBackPayment({
    roNumber: parsed.data.roNumber,
    authCode: parsed.data.authCode,
    finalAmount: parsed.data.finalAmount,
    gatewayTransactionId: parsed.data.gatewayTransactionId
  });

  transactionStore.finalize(parsed.data.gatewayTransactionId);
  return res.json({ ok: true });
});

paymentsRouter.post('/payments/partial-refund', async (req, res) => {
  const parsed = partialRefundSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid partial refund payload' });

  const match = transactionStore.partialRefund(parsed.data.gatewayTransactionId, parsed.data.refundAmount);
  if (!match) return res.status(404).json({ error: 'transaction not found' });

  return res.json({ ok: true, refunded: parsed.data.refundAmount, remainingCaptured: match.amount });
});
