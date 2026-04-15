const calculateRefundAmount = (txn: Transaction, orgConfig: OrgSettings) => {
  return orgConfig.refund_surcharge ? txn.amount_total : txn.amount_base;
};
