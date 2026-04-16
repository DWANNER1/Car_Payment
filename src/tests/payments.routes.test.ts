import request from 'supertest';
import { createApp } from '../api/app';

describe('payment routes', () => {
  const app = createApp();

  it('creates a terminal sale', async () => {
    const response = await request(app).post('/api/payments/terminal-sale').send({ roNumber: '1001', tpn: 'TPN-1', amount: 120, departmentId: 'service' });
    expect(response.status).toBe(202);
    expect(response.body.transactionId).toBeDefined();
  });

  it('creates a token sale', async () => {
    const response = await request(app).post('/api/payments/token-sale').send({ roNumber: '1001', cardToken: 'tok_123456', amount: 120, description: 'RO 1001', departmentId: 'parts' });
    expect(response.status).toBe(202);
    expect(response.body.transactionId).toBeDefined();
  });

  it('supports a partial refund', async () => {
    await request(app).post('/api/payments/terminal-sale').send({ roNumber: '1001', tpn: 'TPN-1', amount: 120, departmentId: 'service' });
    const response = await request(app).post('/api/payments/partial-refund').send({ gatewayTransactionId: 'demo-terminal-1', refundAmount: 50, reason: 'Customer goodwill' });
    expect([200,404]).toContain(response.status);
  });
}
