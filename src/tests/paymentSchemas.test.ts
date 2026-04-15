import { finalizePaymentSchema, terminalSaleSchema, tokenSaleSchema } from '../api/schemas/payment';

describe('payment schemas', () => {
  it('accepts a valid terminal sale payload', () => {
    expect(
      terminalSaleSchema.safeParse({ roNumber: '1001', tpn: 'TPN-1', amount: 125.5 }).success
    ).toBe(true);
  });

  it('rejects a terminal sale with non-positive amount', () => {
    expect(
      terminalSaleSchema.safeParse({ roNumber: '1001', tpn: 'TPN-1', amount: 0 }).success
    ).toBe(false);
  });

  it('accepts a valid token sale payload', () => {
    expect(
      tokenSaleSchema.safeParse({
        roNumber: '1001',
        cardToken: 'tok_123',
        amount: 50,
        description: 'RO payment'
      }).success
    ).toBe(true);
  });

  it('accepts a valid finalize payload', () => {
    expect(
      finalizePaymentSchema.safeParse({
        roNumber: '1001',
        authCode: 'AUTH1',
        finalAmount: 50,
        gatewayTransactionId: 'gw_123'
      }).success
    ).toBe(true);
  });
});
