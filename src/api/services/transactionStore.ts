export interface StoredTransaction { gatewayTransactionId:string; roNumber:string; amount:number; status:'accepted'|'finalized'|'failed'; departmentId:string; dmsPosted?:boolean; dmsSyncError?:string; refundAmount?:number; }
const transactions: StoredTransaction[] = [];
export const transactionStore = {
 add:(t:StoredTransaction)=>{transactions.unshift(t); return t;},
 finalize:(id:string)=>{const m=transactions.find(t=>t.gatewayTransactionId===id); if(m) m.status='finalized'; return m;},
 partialRefund:(id:string, amt:number)=>{const m=transactions.find(t=>t.gatewayTransactionId===id); if(m){m.refundAmount=(m.refundAmount??0)+amt; m.amount=Math.max(0,m.amount-amt);} return m;},
 markSyncException:(id:string,msg:string)=>{const m=transactions.find(t=>t.gatewayTransactionId===id); if(m){m.dmsPosted=false; m.dmsSyncError=msg;} return m;},
 forcePost:(id:string)=>{const m=transactions.find(t=>t.gatewayTransactionId===id); if(m){m.dmsPosted=true; m.dmsSyncError=undefined;} return m;},
 listSyncExceptions:()=>transactions.filter(t=>Boolean(t.dmsSyncError)),
 list:()=>transactions,
 clear:()=>{transactions.length=0;}
};
