import { createIdempotencyGuard } from '../api/services/idempotency';

describe('idempotency guard', () => {
  it('marks the first key as new', () => {
    const guard = createIdempotencyGuard();
    expect(guard.checkAndMark('txn-1')).toBe(false);
  });

  it('marks duplicate keys as already seen', () => {
    const guard = createIdempotencyGuard();
    guard.checkAndMark('txn-1');
    expect(guard.checkAndMark('txn-1')).toBe(true);
  });

  it('can be reset', () => {
    const guard = createIdempotencyGuard();
    guard.checkAndMark('txn-1');
    guard.reset();
    expect(guard.checkAndMark('txn-1')).toBe(false);
  });
});
