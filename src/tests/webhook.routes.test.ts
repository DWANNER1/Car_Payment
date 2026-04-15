import request from 'supertest';
import { createApp } from '../api/app';

describe('webhook routes', () => {
  const app = createApp();

  const payload = {
    event: 'transaction.success',
    data: {
      transaction_id: 'txn-1',
      external_id: '1001',
      amount: 100,
      terminal_status: 'approved'
    }
  };

  it('accepts the first webhook', async () => {
    const response = await request(app).post('/api/webhook/ipos').send(payload);
    expect(response.status).toBe(202);
    expect(response.body.duplicate).toBe(false);
  });

  it('marks duplicate webhooks', async () => {
    await request(app).post('/api/webhook/ipos').send(payload);
    const response = await request(app).post('/api/webhook/ipos').send(payload);
    expect(response.status).toBe(200);
    expect(response.body.duplicate).toBe(true);
  });
});
