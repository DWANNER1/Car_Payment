export interface StoredTransaction {
  gatewayTransactionId: string;
  roNumber: string;
  amount: number;
  flow: 'terminal' | 'token' | 'credit';
  status: 'accepted' | 'finalized' | 'failed';
  createdAt: string;
  departmentId: string;
  refundAmount?: number;
  dmsSyncError?: string;
}

const transactions: StoredTransaction[] = [];

export const transactionStore = {
  add(txn: StoredTransaction) {
    transactions.unshift(txn);
    return txn;
  },
  finalize(gatewayTransactionId: string) {
    const match = transactions.find((t) => t.gatewayTransactionId === gatewayTransactionId);
    if (match) match.status = 'finalized';
    return match;
  },
  partialRefund(gatewayTransactionId: string, refundAmount: number) {
    const match = transactions.find((t) => t.gatewayTransactionId === gatewayTransactionId);
    if (match) {
      match.refundAmount = (match.refundAmount ?? 0) + refundAmount;
      match.amount = Math.max(0, match.amount - refundAmount);
    }
    return match;
  },
  markSyncException(gatewayTransactionId: string, message: string) {
    const match = transactions.find((t) => t.gatewayTransactionId === gatewayTransactionId);
    if (match) match.dmsSyncError = message;
    return match;
  },
  listSyncExceptions() {
    return transactions.filter((t) => Boolean(t.dmsSyncError));
  },
  list() {
    return transactions;
  },
  clear() {
    transactions.length = 0;
  }
};
