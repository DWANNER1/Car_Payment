import { readRuntimeJson, writeRuntimeJson } from './runtimeStore.js';

export interface StoredTransaction {
  gatewayTransactionId: string;
  roNumber: string;
  amount: number;
  status: 'accepted' | 'finalized' | 'failed';
  departmentId: string;
  paymentFlow: 'terminal' | 'token' | 'cash' | 'debit' | 'credit' | 'stored_token';
  routingMid: string;
  surchargeAmount: number;
  createdAt: string;
  dmsPosted?: boolean;
  dmsSyncError?: string;
  refundAmount?: number;
  refundSurchargeAmount?: number;
  dmsWriteBack?: {
    amountBase: number;
    amountApplied: number;
    amountSurcharge: number;
    surchargeCode: string;
    postedAt: string;
  };
}

const fileName = 'transactions.json';
const serviceMid = 'MID-SERVICE-DEMO';
const parseSequence = (gatewayTransactionId: string) => {
  const match = gatewayTransactionId.match(/-(\d+)$/);
  return match ? Number(match[1]) : 0;
};

function normalizeTransaction(txn: Partial<StoredTransaction>): StoredTransaction {
  return {
    gatewayTransactionId: txn.gatewayTransactionId ?? 'demo-terminal-0',
    roNumber: txn.roNumber ?? 'RO-10001',
    amount: typeof txn.amount === 'number' ? txn.amount : 0,
    status: txn.status ?? 'accepted',
    departmentId: txn.departmentId ?? 'mixed',
    paymentFlow: txn.paymentFlow ?? 'terminal',
    routingMid: txn.routingMid ?? serviceMid,
    surchargeAmount: typeof txn.surchargeAmount === 'number' ? txn.surchargeAmount : 0,
    createdAt: txn.createdAt ?? new Date().toISOString(),
    dmsPosted: txn.dmsPosted,
    dmsSyncError: txn.dmsSyncError,
    refundAmount: txn.refundAmount,
    refundSurchargeAmount: txn.refundSurchargeAmount,
    dmsWriteBack: txn.dmsWriteBack
  };
}

let transactions: StoredTransaction[] = readRuntimeJson(fileName, []).map(normalizeTransaction);
let sequence = transactions.reduce((max, txn) => Math.max(max, parseSequence(txn.gatewayTransactionId)), 0) + 1;

function persist() {
  writeRuntimeJson(fileName, transactions);
}

export const transactionStore = {
  add: (txn: StoredTransaction) => {
    transactions.unshift(txn);
    persist();
    return txn;
  },
  nextGatewayTransactionId: (prefix: 'demo-terminal' | 'demo-token') => `${prefix}-${sequence++}`,
  finalize: (gatewayTransactionId: string) => {
    const match = transactions.find((t) => t.gatewayTransactionId === gatewayTransactionId);
    if (match) {
      match.status = 'finalized';
      persist();
    }
    return match;
  },
  partialRefund: (gatewayTransactionId: string, refundAmount: number, refundSurchargeAmount = 0) => {
    const match = transactions.find((t) => t.gatewayTransactionId === gatewayTransactionId);
    if (match) {
      match.refundAmount = (match.refundAmount ?? 0) + refundAmount;
      match.refundSurchargeAmount = (match.refundSurchargeAmount ?? 0) + refundSurchargeAmount;
      match.amount = Math.max(0, match.amount - refundAmount - refundSurchargeAmount);
      persist();
    }
    return match;
  },
  markSyncException: (gatewayTransactionId: string, message: string) => {
    const match = transactions.find((t) => t.gatewayTransactionId === gatewayTransactionId);
    if (match) {
      match.dmsPosted = false;
      match.dmsSyncError = message;
      persist();
    }
    return match;
  },
  forcePost: (gatewayTransactionId: string) => {
    const match = transactions.find((t) => t.gatewayTransactionId === gatewayTransactionId);
    if (match) {
      match.dmsPosted = true;
      match.dmsSyncError = undefined;
      persist();
    }
    return match;
  },
  recordDmsWriteBack: (payload: {
    gatewayTransactionId: string;
    amountBase: number;
    amountApplied: number;
    amountSurcharge: number;
    surchargeCode: string;
  }) => {
    const match = transactions.find((t) => t.gatewayTransactionId === payload.gatewayTransactionId);
    if (!match) return undefined;

    match.dmsPosted = true;
    match.dmsSyncError = undefined;
    match.status = 'finalized';
    match.amount = payload.amountApplied;
    match.dmsWriteBack = {
      amountBase: payload.amountBase,
      amountApplied: payload.amountApplied,
      amountSurcharge: payload.amountSurcharge,
      surchargeCode: payload.surchargeCode,
      postedAt: new Date().toISOString()
    };
    persist();
    return match;
  },
  listSyncExceptions: () => transactions.filter((t) => Boolean(t.dmsSyncError)),
  list: () => transactions,
  clear: () => {
    transactions = [];
    sequence = 1;
    persist();
  }
};
