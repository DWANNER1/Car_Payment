import { Router } from 'express';
import { surchargeConfigSchema } from '../schemas/admin.js';
import { dmsForcePostSchema } from '../schemas/dms.js';
import { terminalMonitorService } from '../services/terminalMonitor.js';
import { transactionStore } from '../services/transactionStore.js';
import { prototypeState } from '../services/prototypeState.js';

export const adminRouter = Router();

adminRouter.get('/admin/demo-mode', (_req, res) => res.json({ enabled: prototypeState.getDemoMode() }));
adminRouter.post('/admin/demo-mode', (req, res) => res.json({ enabled: prototypeState.setDemoMode(Boolean(req.body?.enabled)) }));

adminRouter.get('/admin/mid-mapping', (_req, res) => res.json(prototypeState.getMidMapping()));
adminRouter.post('/admin/mid-mapping', (req, res) => res.json(prototypeState.setMidMapping(req.body ?? {})));

adminRouter.get('/admin/receipt-config', (_req, res) => res.json(prototypeState.getReceiptConfig()));
adminRouter.post('/admin/receipt-config', (req, res) => res.json(prototypeState.setReceiptConfig(req.body ?? {})));

adminRouter.get('/admin/branding', (_req, res) => res.json(prototypeState.getBranding()));
adminRouter.post('/admin/branding', (req, res) => res.json(prototypeState.setBranding(req.body ?? {})));

adminRouter.get('/admin/surcharge-config', (_req, res) => res.json(prototypeState.getSurchargeRules()));
adminRouter.post('/admin/surcharge-config', (req, res) => {
  const parsed = surchargeConfigSchema.safeParse(req.body ?? {});
  if (!parsed.success) return res.status(400).json({ error: 'invalid surcharge config payload' });
  return res.json(prototypeState.setSurchargeRules(parsed.data));
});

adminRouter.get('/admin/terminal-heartbeats', (_req, res) => res.json(terminalMonitorService.list()));

adminRouter.get('/admin/sync-exceptions', (_req, res) => {
  res.json(transactionStore.listSyncExceptions());
});

adminRouter.post('/admin/force-post', (req, res) => {
  const parsed = dmsForcePostSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid force-post payload' });

  const match = transactionStore.forcePost(parsed.data.gatewayTransactionId);
  if (!match) return res.status(404).json({ error: 'transaction not found' });
  return res.json({ ok: true, forced: true });
});
