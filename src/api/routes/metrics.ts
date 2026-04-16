import { Router } from 'express';
import { transactionStore } from '../services/transactionStore.js';
import { terminalMonitorService } from '../services/terminalMonitor.js';
export const metricsRouter=Router();
metricsRouter.get('/v1/metrics',(_req,res)=>{const txns=transactionStore.list(); const todaySales=txns.filter(t=>t.status==='finalized').reduce((s,t)=>s+t.amount,0); const pendingRos=txns.filter(t=>t.status!=='finalized').length; const activeTerminals=terminalMonitorService.list().filter(t=>t.status==='online').length; res.json({todaySales,pendingRos,activeTerminals,syncHealth:'demo-ready'});});
metricsRouter.get('/v1/reports/dms-sync-exceptions',(_req,res)=>res.json(transactionStore.listSyncExceptions()));
