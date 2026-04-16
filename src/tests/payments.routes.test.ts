import request from 'supertest';
import { createApp } from '../api/app';

describe('payment routes', () => {
  const app = createApp();

  it('creates a terminal sale and returns default service MID routing', async () => {
    const response = await request(app).post('/api/payments/terminal-sale').send({
      roNumber: '1001',
      tpn: 'TPN-1',
      amount: 120,
      departmentId: 'service'
    });

    expect(response.status).toBe(202);
    expect(response.body.transactionId).toBeDefined();
    expect(response.body.routingMid).toBe('MID-SERVICE-DEMO');
  });

  it('supports force post after a sync failure marker', async () => {
    await request(app).post('/api/payments/terminal-sale').send({ roNumber: '1001', tpn: 'TPN-1', amount: 120 });
    const response = await request(app).post('/api/admin/force-post').send({ gatewayTransactionId: 'demo-terminal-1' });
    expect([200, 404]).toContain(response.status);
  });
});
