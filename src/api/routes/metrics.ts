import { Router } from 'express';

export const metricsRouter = Router();

metricsRouter.get('/v1/metrics', (_req, res) => {
  res.json({
    todaySales: 0,
    pendingRos: 0,
    activeTerminals: 0,
    syncHealth: 'unknown'
  });
});
