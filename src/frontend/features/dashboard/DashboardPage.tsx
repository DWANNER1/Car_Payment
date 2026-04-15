import { Alert, Card, CardContent, Grid, Typography } from '@mui/material';
import { useHealth } from '../../hooks/useHealth';

export function DashboardPage() {
  const health = useHealth();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Alert severity={health.data?.ok ? 'success' : 'warning'}>
          API status: {health.isLoading ? 'Checking...' : health.data?.ok ? 'Healthy' : 'Unavailable'}
        </Alert>
      </Grid>

      {['Today Sales', 'Pending ROs', 'Active Terminals', 'Sync Health'].map((label) => (
        <Grid item xs={12} md={6} lg={3} key={label}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                {label}
              </Typography>
              <Typography variant="h5">--</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
