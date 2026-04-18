import { Alert, Box, Card, CardContent, Chip, Divider, Grid, Stack, Typography } from '@mui/material';
import { useDemoPortalData } from '../../hooks/useDemoPortalData';

export function DashboardPage() {
  const portal = useDemoPortalData();
  const stats = portal.data?.stats ?? [
    { label: 'Sample ROs', value: '--' },
    { label: 'Sample Customers', value: '--' },
    { label: 'Live Transactions', value: '--' },
    { label: 'Terminal Health', value: '--' }
  ];

  return (
    <Stack spacing={3}>
      <Box
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          color: 'primary.contrastText',
          background: 'linear-gradient(135deg, rgba(23,50,79,0.98) 0%, rgba(15,118,110,0.92) 55%, rgba(138,90,52,0.95) 100%)',
          boxShadow: '0 24px 60px rgba(15,23,42,0.2)'
        }}
      >
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip label={portal.data?.demoModeEnabled ? 'Demo mode on' : 'Demo mode off'} sx={{ bgcolor: 'rgba(255,255,255,0.14)', color: 'inherit' }} />
            <Chip label="Mixed RO routing" sx={{ bgcolor: 'rgba(255,255,255,0.14)', color: 'inherit' }} />
            <Chip label="Separate surcharge line" sx={{ bgcolor: 'rgba(255,255,255,0.14)', color: 'inherit' }} />
          </Stack>
          <Typography variant="overline" sx={{ letterSpacing: 2, opacity: 0.78 }}>
            Dealership payment operations
          </Typography>
          <Typography variant="h3" sx={{ maxWidth: 880 }}>
            A polished demo workspace for payment routing, partial captures, and compliant DMS write-back.
          </Typography>
          <Typography sx={{ maxWidth: 860, color: 'rgba(255,255,255,0.88)' }}>
            Use the sample records below to explore a mixed RO, test manual MID override, and inspect receipt behavior without live credentials.
          </Typography>
        </Stack>
      </Box>

      <Grid container spacing={2}>
        {stats.map((item) => (
          <Grid item xs={12} sm={6} lg={3} key={item.label}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  {item.label}
                </Typography>
                <Typography variant="h4" sx={{ mt: 0.5 }}>
                  {item.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} lg={7}>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6">Sample Repair Orders</Typography>
                <Divider />
                <Stack spacing={1.5}>
                  {(portal.data?.sampleRos ?? []).map((ro) => (
                    <Box
                      key={ro.roNumber}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        border: '1px solid rgba(18, 32, 51, 0.08)',
                        backgroundColor: 'rgba(255,255,255,0.7)'
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2} flexWrap="wrap">
                        <Box>
                          <Typography fontWeight={700}>{ro.roNumber}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {ro.customerName} - {ro.vin}
                          </Typography>
                        </Box>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          <Chip label={ro.status.toUpperCase()} size="small" />
                          <Chip label={ro.defaultRoutingMid} size="small" variant="outlined" />
                        </Stack>
                      </Stack>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Balance due: ${ro.remainingBalance.toFixed(2)} of ${ro.totalAmountDue.toFixed(2)}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Stack spacing={2}>
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="h6">Portal Notes</Typography>
                  <Divider />
                  <Stack spacing={1}>
                    {(portal.data?.portalNotes ?? []).map((note) => (
                      <Alert key={note} severity="info">
                        {note}
                      </Alert>
                    ))}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography variant="h6">Snapshot</Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  Generated at {portal.data?.generatedAt ?? '--'}
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
}
