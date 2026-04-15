export interface OrgSettings {
  surcharge_pct: number;
  refund_surcharge: boolean;
  auto_batch_time: string;
}

export interface TransactionLike {
  amount_base: number;
  amount_total: number;
}

export const calculateRefundAmount = (txn: TransactionLike, orgConfig: OrgSettings) => {
  return orgConfig.refund_surcharge ? txn.amount_total : txn.amount_base;
};

export const shouldUseVoid = (currentTime: string, autoBatchTime: string) => {
  return currentTime < autoBatchTime;
};
