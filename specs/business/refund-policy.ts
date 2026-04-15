// Pseudo-logic for refund calculation
const calculateRefundAmount = (txn: Transaction, orgConfig: OrgSettings) => {
  return orgConfig.refund_surcharge 
    ? txn.amount_total   // Refund base + surcharge
    : txn.amount_base;   // Dealer retains 3%
};
