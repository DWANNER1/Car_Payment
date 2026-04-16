import { Alert, Card, CardContent, Grid, Typography } from '@mui/material';

export function DashboardPage() {
  const values = [
    { label: 'Today Sales', value: '--' },
    { label: 'Pending ROs', value: '--' },
    { label: 'Active Terminals', value: '--' },
    { label: 'Sync Health', value: 'demo-ready' }
  ];

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}><Typography variant="h4">Dashboard</Typography></Grid>
      <Grid item xs={12}><Alert severity="info">Starter dashboard wired for future metrics integration.</Alert></Grid>
      {values.map((item) => (
        <Grid item xs={12} md={6} lg={3} key={item.label}>
          <Card><CardContent><Typography variant="subtitle2" color="text.secondary">{item.label}</Typography><Typography variant="h5">{item.value}</Typography></CardContent></Card>
        </Grid>
      ))}
    </Grid>
  );
}
