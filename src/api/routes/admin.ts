import { Router } from 'express';
import { demoModeService } from '../services/demoMode.js';
import { terminalMonitorService } from '../services/terminalMonitor.js';

let midMapping = {
  parts: 'MID-PARTS-DEMO',
  service: 'MID-SERVICE-DEMO',
  body_shop: 'MID-BODY-DEMO'
};

export const adminRouter = Router();

adminRouter.get('/admin/demo-mode', (_req, res) => {
  res.json({ enabled: demoModeService.isEnabled() });
});

adminRouter.post('/admin/demo-mode', (req, res) => {
  const enabled = Boolean(req.body?.enabled);
  res.json({ enabled: demoModeService.setEnabled(enabled) });
});

adminRouter.get('/admin/mid-mapping', (_req, res) => {
  res.json(midMapping);
});

adminRouter.post('/admin/mid-mapping', (req, res) => {
  midMapping = { ...midMapping, ...req.body };
  res.json(midMapping);
});

adminRouter.get('/admin/terminal-heartbeats', (_req, res) => {
  res.json(terminalMonitorService.list());
});
