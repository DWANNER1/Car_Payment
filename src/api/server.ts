import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { z } from 'zod';

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'car-payment-api' });
});

app.get('/api/v1/metrics', (_req, res) => {
  res.json({
    todaySales: 0,
    pendingRos: 0,
    activeTerminals: 0,
    syncHealth: 'unknown'
  });
});

const roQuerySchema = z.object({
  query: z.string().min(1)
});

app.get('/api/dms/ro', (req, res) => {
  const parsed = roQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    return res.status(400).json({ error: 'query is required' });
  }

  return res.json([
    {
      ro_number: parsed.data.query,
      vin: 'STUBVIN1234567890',
      customer_name: 'Stub Customer',
      totalAmountDue: 100,
      status: 'open'
    }
  ]);
});

app.post('/api/webhook/ipos', (req, res) => {
  console.log('Received webhook', req.body);
  return res.status(202).json({ accepted: true });
});

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
