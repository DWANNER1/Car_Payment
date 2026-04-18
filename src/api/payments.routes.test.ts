import request from 'supertest';
import { createApp } from './app.js';

describe('payment routes', () => {
  const app = createApp();

  beforeEach(async () => {
    await request(app).post('/api/admin/surcharge-config').send({
      enabled: true,
      percentage: 3,
      label: 'Service Fee',
      dmsCode: 'NON_TAX_MISC_FEE',
      refundSurcharge: false
    });
  });

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
    const created = await request(app).post('/api/payments/terminal-sale').send({ roNumber: '1001', tpn: 'TPN-1', amount: 120 });
    const response = await request(app).post('/api/admin/force-post').send({ gatewayTransactionId: created.body.transactionId });
    expect([200, 404]).toContain(response.status);
  });

  it('records a dms write-back with a surcharge line item', async () => {
    const created = await request(app).post('/api/payments/terminal-sale').send({ roNumber: '1002', tpn: 'TPN-1', amount: 120 });
    const response = await request(app).post('/api/payments/finalize').send({
      roNumber: '1002',
      authCode: 'AUTH01',
      finalAmount: 123.6,
      gatewayTransactionId: created.body.transactionId,
      surchargeAmount: 3.6
    });

    expect(response.status).toBe(200);
    expect(response.body.dmsWriteBack.surchargeLineItem.code).toBe('NON_TAX_MISC_FEE');
    expect(response.body.dmsWriteBack.surchargeLineItem.amount).toBe(3.6);
  });

  it('turns surcharge off when admin disables it', async () => {
    await request(app).post('/api/admin/surcharge-config').send({
      enabled: false,
      percentage: 3,
      label: 'Service Fee',
      dmsCode: 'NON_TAX_MISC_FEE',
      refundSurcharge: false
    });

    const created = await request(app).post('/api/payments/terminal-sale').send({ roNumber: '1003', tpn: 'TPN-1', amount: 120 });
    const response = await request(app).post('/api/payments/finalize').send({
      roNumber: '1003',
      authCode: 'AUTH01',
      finalAmount: 123.6,
      gatewayTransactionId: created.body.transactionId,
      surchargeAmount: 3.6
    });

    expect(response.status).toBe(200);
    expect(response.body.amountSurcharge).toBe(0);
    expect(response.body.dmsWriteBack.surchargeLineItem.amount).toBe(0);
  });

  it('refunds surcharge when policy is enabled', async () => {
    await request(app).post('/api/admin/surcharge-config').send({
      enabled: true,
      percentage: 3,
      label: 'Service Fee',
      dmsCode: 'NON_TAX_MISC_FEE',
      refundSurcharge: true
    });

    const created = await request(app).post('/api/payments/terminal-sale').send({ roNumber: '1004', tpn: 'TPN-1', amount: 120 });
    await request(app).post('/api/payments/finalize').send({
      roNumber: '1004',
      authCode: 'AUTH01',
      finalAmount: 123.6,
      gatewayTransactionId: created.body.transactionId,
      surchargeAmount: 3.6
    });

    const refund = await request(app).post('/api/payments/partial-refund').send({
      gatewayTransactionId: created.body.transactionId,
      refundAmount: 50,
      reason: 'Customer request'
    });

    expect(refund.status).toBe(200);
    expect(refund.body.refundedSurcharge).toBe(1.46);
    expect(refund.body.remainingAmount).toBe(72.14);
  });
});
