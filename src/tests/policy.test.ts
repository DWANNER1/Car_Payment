import { calculateRefundAmount, shouldUseVoid } from '../api/services/policy';

describe('policy helpers', () => {
  it('returns total when surcharge should be refunded', () => {
    expect(calculateRefundAmount({ amount_base: 100, amount_total: 103 }, { surcharge_pct: 3, refund_surcharge: true, auto_batch_time: '02:00' })).toBe(103);
  });

  it('returns base amount when surcharge should not be refunded', () => {
    expect(calculateRefundAmount({ amount_base: 100, amount_total: 103 }, { surcharge_pct: 3, refund_surcharge: false, auto_batch_time: '02:00' })).toBe(100);
  });

  it('uses void before batch cutoff', () => {
    expect(shouldUseVoid('01:30', '02:00')).toBe(true);
  });

  it('uses refund after batch cutoff', () => {
    expect(shouldUseVoid('02:30', '02:00')).toBe(false);
  });
});
