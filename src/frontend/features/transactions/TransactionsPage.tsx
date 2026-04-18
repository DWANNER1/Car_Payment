import { Alert, Box, Chip, Stack, Typography } from '@mui/material';
import { RepairOrderTable } from './RepairOrderTable';
import { useDemoPortalData } from '../../hooks/useDemoPortalData';

export function TransactionsPage() {
  const portal = useDemoPortalData();
  const ros = portal.data?.sampleRos ?? [];
  const openCount = ros.filter((ro) => ro.status === 'open').length;
  const closedCount = ros.filter((ro) => ro.status === 'closed').length;
  const mixedCount = ros.filter((ro) => ro.lineItems.some((item) => item.category === 'parts') && ro.lineItems.some((item) => item.category === 'service')).length;

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
            <Chip label={`${openCount} open`} sx={{ bgcolor: 'rgba(255,255,255,0.14)', color: 'inherit' }} />
            <Chip label={`${closedCount} closed`} sx={{ bgcolor: 'rgba(255,255,255,0.14)', color: 'inherit' }} />
            <Chip label={`${ros.length} ROs total`} sx={{ bgcolor: 'rgba(255,255,255,0.14)', color: 'inherit' }} />
            <Chip label={`${mixedCount} mixed`} sx={{ bgcolor: 'rgba(255,255,255,0.14)', color: 'inherit' }} />
          </Stack>
          <Typography variant="overline" sx={{ letterSpacing: 2, opacity: 0.78 }}>
            Repair Order list
          </Typography>
          <Typography variant="h3" sx={{ maxWidth: 900 }}>
            Transactions is the RO worklist, not a generic payment ledger.
          </Typography>
          <Typography sx={{ maxWidth: 900, color: 'rgba(255,255,255,0.88)' }}>
            Use this tab to find open or closed repair orders, filter by status or customer, and click an open RO to start payment.
          </Typography>
          <Alert severity="info" sx={{ bgcolor: 'rgba(255,255,255,0.08)', color: 'inherit', maxWidth: 920 }}>
            Open rows are highlighted in orange and are actionable. Closed rows are highlighted in green and remain visible for history.
          </Alert>
        </Stack>
      </Box>

      <RepairOrderTable ros={ros} />
    </Stack>
  );
}
