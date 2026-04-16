import { Alert, FormControlLabel, Stack, Switch, TextField, Typography } from '@mui/material';
import { useDemoMode, useSetDemoMode } from '../../hooks/useDemoMode';
import { useMidMapping, useSetMidMapping } from '../../hooks/useMidMapping';
import { useTerminalHeartbeats } from '../../hooks/useTerminalHeartbeats';

export function AdminPage() {
  const demoMode = useDemoMode();
  const setDemoMode = useSetDemoMode();
  const midMapping = useMidMapping();
  const setMidMapping = useSetMidMapping();
  const heartbeats = useTerminalHeartbeats();

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Admin</Typography>
      <Typography color="text.secondary">Control demo-mode behavior, MID routing, and terminal monitoring for demonstrations and operations.</Typography>
      <Alert severity="info">When demo mode is enabled, the app generates sample repair orders, fake transaction IDs, and demonstration-friendly API results.</Alert>
      <FormControlLabel
        control={<Switch checked={Boolean(demoMode.data?.enabled)} onChange={(_, checked) => setDemoMode.mutate(checked)} />}
        label={demoMode.data?.enabled ? 'Demo mode enabled' : 'Demo mode disabled'}
      />
      <Typography variant="h6">MID Mapping</Typography>
      <TextField label="Parts MID" value={midMapping.data?.parts ?? ''} onChange={(e) => setMidMapping.mutate({ parts: e.target.value })} />
      <TextField label="Service MID" value={midMapping.data?.service ?? ''} onChange={(e) => setMidMapping.mutate({ service: e.target.value })} />
      <TextField label="Body Shop MID" value={midMapping.data?.body_shop ?? ''} onChange={(e) => setMidMapping.mutate({ body_shop: e.target.value })} />
      <Typography variant="h6">Terminal Heartbeat Monitor</Typography>
      {(heartbeats.data ?? []).map((item) => (
        <Alert key={item.terminalId} severity={item.status === 'online' ? 'success' : item.status === 'offline' ? 'warning' : 'info'}>
          {item.terminalId} • {item.status} • last heartbeat {item.lastHeartbeatAt}
        </Alert>
      ))}
    </Stack>
  );
}
