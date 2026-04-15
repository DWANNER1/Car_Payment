export interface StoredTransaction {
  gatewayTransactionId: string;
  roNumber: string;
  amount: number;
  flow: 'terminal' | 'token' | 'credit';
  status: 'accepted' | 'finalized' | 'failed';
  createdAt: string;
}

const transactions: StoredTransaction[] = [];

export const transactionStore = {
  add(txn: StoredTransaction) {
    transactions.unshift(txn);
    return txn;
  },
  finalize(gatewayTransactionId: string) {
    const match = transactions.find((t) => t.gatewayTransactionId === gatewayTransactionId);
    if (match) {
      match.status = 'finalized';
    }
    return match;
  },
  list() {
    return transactions;
  },
  clear() {
    transactions.length = 0;
  }
};
