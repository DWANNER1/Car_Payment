import { Alert, Card, CardContent, Grid, Typography } from '@mui/material';
import { useHealth } from '../../hooks/useHealth';
import { useMetrics } from '../../hooks/useMetrics';

export function DashboardPage() {
  const health = useHealth();
  const metrics = useMetrics();
  const values = [
    { label: 'Today Sales', value: metrics.data?.todaySales ?? '--' },
    { label: 'Pending ROs', value: metrics.data?.pendingRos ?? '--' },
    { label: 'Active Terminals', value: metrics.data?.activeTerminals ?? '--' },
    { label: 'Sync Health', value: metrics.data?.syncHealth ?? '--' }
  ];

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}><Typography variant="h4">Dashboard</Typography></Grid>
      <Grid item xs={12}><Alert severity={health.data?.ok ? 'success' : 'warning'}>API status: {health.isLoading ? 'Checking...' : health.data?.ok ? 'Healthy' : 'Unavailable'}</Alert></Grid>
      {values.map((item) => (
        <Grid item xs={12} md={6} lg={3} key={item.label}>
          <Card><CardContent><Typography variant="subtitle2" color="text.secondary">{item.label}</Typography><Typography variant="h5">{item.value}</Typography></CardContent></Card>
        </Grid>
      ))}
    </Grid>
  );
}
