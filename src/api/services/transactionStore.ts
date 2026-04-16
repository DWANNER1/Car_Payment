export interface StoredTransaction {
  gatewayTransactionId: string;
  roNumber: string;
  amount: number;
  status: 'accepted' | 'finalized' | 'failed';
  departmentId: string;
  dmsPosted?: boolean;
  dmsSyncError?: string;
  refundAmount?: number;
}

const transactions: StoredTransaction[] = [];

export const transactionStore = {
  add: (txn: StoredTransaction) => {
    transactions.unshift(txn);
    return txn;
  },
  finalize: (gatewayTransactionId: string) => {
    const match = transactions.find((t) => t.gatewayTransactionId === gatewayTransactionId);
    if (match) match.status = 'finalized';
    return match;
  },
  partialRefund: (gatewayTransactionId: string, refundAmount: number) => {
    const match = transactions.find((t) => t.gatewayTransactionId === gatewayTransactionId);
    if (match) {
      match.refundAmount = (match.refundAmount ?? 0) + refundAmount;
      match.amount = Math.max(0, match.amount - refundAmount);
    }
    return match;
  },
  markSyncException: (gatewayTransactionId: string, message: string) => {
    const match = transactions.find((t) => t.gatewayTransactionId === gatewayTransactionId);
    if (match) {
      match.dmsPosted = false;
      match.dmsSyncError = message;
    }
    return match;
  },
  forcePost: (gatewayTransactionId: string) => {
    const match = transactions.find((t) => t.gatewayTransactionId === gatewayTransactionId);
    if (match) {
      match.dmsPosted = true;
      match.dmsSyncError = undefined;
    }
    return match;
  },
  listSyncExceptions: () => transactions.filter((t) => Boolean(t.dmsSyncError)),
  list: () => transactions,
  clear: () => {
    transactions.length = 0;
  }
};
