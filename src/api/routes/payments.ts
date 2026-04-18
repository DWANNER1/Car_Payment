import { Router } from 'express';
import { finalizePaymentSchema, partialRefundSchema, terminalSaleSchema, tokenSaleSchema } from '../schemas/payment.js';
import { prototypeState } from '../services/prototypeState.js';
import { transactionStore } from '../services/transactionStore.js';

const serviceMid = 'MID-SERVICE-DEMO';

export const paymentsRouter = Router();

paymentsRouter.post('/payments/terminal-sale', (req, res) => {
  const parsed = terminalSaleSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid terminal sale payload' });

  const transactionId = transactionStore.nextGatewayTransactionId('demo-terminal');
  transactionStore.add({
    gatewayTransactionId: transactionId,
    roNumber: parsed.data.roNumber,
    amount: parsed.data.amount,
    status: 'accepted',
    departmentId: parsed.data.departmentId ?? 'mixed',
    paymentFlow: 'terminal',
    routingMid: parsed.data.routingMid ?? serviceMid,
    surchargeAmount: 0,
    createdAt: new Date().toISOString()
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

  const transactionId = transactionStore.nextGatewayTransactionId('demo-token');
  transactionStore.add({
    gatewayTransactionId: transactionId,
    roNumber: parsed.data.roNumber,
    amount: parsed.data.amount,
    status: 'accepted',
    departmentId: parsed.data.departmentId ?? 'mixed',
    paymentFlow: 'stored_token',
    routingMid: parsed.data.routingMid ?? serviceMid,
    surchargeAmount: 0,
    createdAt: new Date().toISOString()
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
  const surchargeRules = prototypeState.getSurchargeRules();
  const surchargeAmount = surchargeRules.enabled ? parsed.data.surchargeAmount : 0;

  const match = transactionStore.recordDmsWriteBack({
    gatewayTransactionId: parsed.data.gatewayTransactionId,
    amountBase: Math.max(0, parsed.data.finalAmount - surchargeAmount),
    amountApplied: parsed.data.finalAmount,
    amountSurcharge: surchargeAmount,
    surchargeCode: surchargeRules.dmsCode || 'NON_TAX_MISC_FEE'
  });
  if (!match) return res.status(404).json({ error: 'transaction not found' });
  return res.json({
    ok: true,
    amountBase: Math.max(0, parsed.data.finalAmount - surchargeAmount),
    amountApplied: parsed.data.finalAmount,
    amountSurcharge: surchargeAmount,
    dmsWriteBack: {
      surchargeLineItem: {
        code: surchargeRules.dmsCode || 'NON_TAX_MISC_FEE',
        amount: surchargeAmount
      },
      amountBase: Math.max(0, parsed.data.finalAmount - surchargeAmount),
      amountApplied: parsed.data.finalAmount,
      amountSurcharge: surchargeAmount
    }
  });
});

paymentsRouter.post('/payments/partial-refund', (req, res) => {
  const parsed = partialRefundSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid partial refund payload' });
  const surchargeRules = prototypeState.getSurchargeRules();

  const match = transactionStore.list().find((t) => t.gatewayTransactionId === parsed.data.gatewayTransactionId);
  if (!match) return res.status(404).json({ error: 'transaction not found' });

  const dmsWriteBackSurcharge = match.dmsWriteBack?.amountSurcharge ?? match.surchargeAmount ?? 0;
  const dmsWriteBackApplied = match.dmsWriteBack?.amountApplied ?? match.amount;
  const surchargeRefundAmount = surchargeRules.refundSurcharge && dmsWriteBackApplied > 0
    ? Number(((parsed.data.refundAmount * dmsWriteBackSurcharge) / dmsWriteBackApplied).toFixed(2))
    : 0;

  const updated = transactionStore.partialRefund(parsed.data.gatewayTransactionId, parsed.data.refundAmount, surchargeRefundAmount);
  return res.json({ ok: true, refunded: parsed.data.refundAmount, refundedSurcharge: surchargeRefundAmount, remainingAmount: updated?.amount ?? 0 });
});
