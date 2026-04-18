import { Router } from 'express';
import { terminalMonitorService } from '../services/terminalMonitor.js';
import { transactionStore } from '../services/transactionStore.js';
import { prototypeState } from '../services/prototypeState.js';
import { prototypeSeed } from '../../shared/prototype.js';

export const demoRouter = Router();

function mergeTransactionsById(
  seedTransactions: Array<{ gatewayTransactionId: string }>,
  liveTransactions: Array<{ gatewayTransactionId: string }>
) {
  const byId = new Map<string, (typeof seedTransactions)[number] | (typeof liveTransactions)[number]>();

  for (const txn of seedTransactions) {
    byId.set(txn.gatewayTransactionId, txn);
  }

  for (const txn of liveTransactions) {
    byId.set(txn.gatewayTransactionId, txn);
  }

  return [...byId.values()];
}

demoRouter.get('/demo/prototype', (_req, res) => {
  const liveTransactions = transactionStore.list();
  const sampleTransactions = mergeTransactionsById(prototypeSeed.sampleTransactions, liveTransactions);
  res.json({
    demoModeEnabled: prototypeState.getDemoMode(),
    generatedAt: new Date().toISOString(),
    surchargeRules: prototypeState.getSurchargeRules(),
    midMapping: prototypeState.getMidMapping(),
    receiptConfig: prototypeState.getReceiptConfig(),
    branding: prototypeState.getBranding(),
    stats: [
      { label: 'Sample ROs', value: prototypeSeed.sampleRos.length.toString() },
      { label: 'Sample Customers', value: prototypeSeed.sampleCustomers.length.toString() },
      { label: 'Live Transactions', value: sampleTransactions.length.toString() },
      { label: 'Terminals', value: terminalMonitorService.list().length.toString() }
    ],
    sampleRos: prototypeSeed.sampleRos,
    sampleCustomers: prototypeSeed.sampleCustomers,
    sampleTransactions,
    terminalHeartbeats: terminalMonitorService.list(),
    portalNotes: prototypeSeed.portalNotes
  });
});
