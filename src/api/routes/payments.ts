import { Router } from 'express';
import { iposClient } from '../clients/iposClient.js';
import { dmsClient } from '../clients/dmsClient.js';
import { finalizePaymentSchema, terminalSaleSchema, tokenSaleSchema } from '../schemas/payment.js';
import { transactionStore } from '../services/transactionStore.js';

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
    flow: 'terminal',
    status: 'accepted',
    createdAt: new Date().toISOString()
  });

  return res.status(202).json(result);
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
    createdAt: new Date().toISOString()
  });

  return res.status(202).json(result);
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
