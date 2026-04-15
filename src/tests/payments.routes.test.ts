import request from 'supertest';
import { createApp } from '../api/app';

describe('payment routes', () => {
  const app = createApp();

  it('creates a terminal sale', async () => {
    const response = await request(app).post('/api/payments/terminal-sale').send({ roNumber: '1001', tpn: 'TPN-1', amount: 120 });
    expect(response.status).toBe(202);
    expect(response.body.transactionId).toBeDefined();
  });

  it('creates a token sale', async () => {
    const response = await request(app).post('/api/payments/token-sale').send({ roNumber: '1001', cardToken: 'tok_123456', amount: 120, description: 'RO 1001' });
    expect(response.status).toBe(202);
    expect(response.body.transactionId).toBeDefined();
  });

  it('finalizes a payment', async () => {
    const response = await request(app).post('/api/payments/finalize').send({ roNumber: '1001', authCode: 'AUTH', finalAmount: 120, gatewayTransactionId: 'demo-terminal-1' });
    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
  });
});
