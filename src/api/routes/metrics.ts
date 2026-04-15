import { Router } from 'express';
import { transactionStore } from '../services/transactionStore.js';

export const metricsRouter = Router();

metricsRouter.get('/v1/metrics', (_req, res) => {
  const txns = transactionStore.list();
  const todaySales = txns.filter((t) => t.status === 'finalized').reduce((sum, t) => sum + t.amount, 0);
  const pendingRos = txns.filter((t) => t.status !== 'finalized').length;
  res.json({
    todaySales,
    pendingRos,
    activeTerminals: 1,
    syncHealth: 'demo-ready'
  });
});
