import express from 'express';
import cors from 'cors';
import { healthRouter } from './routes/health.js';
import { metricsRouter } from './routes/metrics.js';
import { dmsRouter } from './routes/dms.js';
import { webhookRouter } from './routes/webhook.js';

export const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/api', healthRouter);
  app.use('/api', metricsRouter);
  app.use('/api', dmsRouter);
  app.use('/api', webhookRouter);

  return app;
};
