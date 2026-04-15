import { Alert, FormControlLabel, Stack, Switch, Typography } from '@mui/material';
import { useDemoMode, useSetDemoMode } from '../../hooks/useDemoMode';

export function AdminPage() {
  const demoMode = useDemoMode();
  const setDemoMode = useSetDemoMode();

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Admin</Typography>
      <Typography color="text.secondary">Control demo-mode behavior and prepare the system for live partner integrations.</Typography>
      <Alert severity="info">When demo mode is enabled, the app generates sample repair orders, fake transaction IDs, and demonstration-friendly API results.</Alert>
      <FormControlLabel
        control={<Switch checked={Boolean(demoMode.data?.enabled)} onChange={(_, checked) => setDemoMode.mutate(checked)} />}
        label={demoMode.data?.enabled ? 'Demo mode enabled' : 'Demo mode disabled'}
      />
      {setDemoMode.isSuccess && <Alert severity="success">Demo mode updated.</Alert>}
    </Stack>
  );
}
