import { Router } from 'express';
import { demoModeService } from '../services/demoMode.js';

export const adminRouter = Router();

adminRouter.get('/admin/demo-mode', (_req, res) => {
  res.json({ enabled: demoModeService.isEnabled() });
});

adminRouter.post('/admin/demo-mode', (req, res) => {
  const enabled = Boolean(req.body?.enabled);
  res.json({ enabled: demoModeService.setEnabled(enabled) });
});
