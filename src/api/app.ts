import cors from 'cors';
import express from 'express';
import { adminRouter } from './routes/admin.js';
import { dmsRouter } from './routes/dms.js';
import { metricsRouter } from './routes/metrics.js';
import { paymentsRouter } from './routes/payments.js';

export const createApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'car-payment-api' }));
  app.use('/api', dmsRouter);
  app.use('/api', paymentsRouter);
  app.use('/api', adminRouter);
  app.use('/api', metricsRouter);
  return app;
};
