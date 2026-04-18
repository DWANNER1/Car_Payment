import { Alert, Box, Button, Card, CardActions, CardContent, Chip, Divider, Stack, Typography } from '@mui/material';
import type { ReceiptPreview, ReceiptTemplateConfig, ReceiptVariant } from '../../../shared/payment';
import { useBrandingConfig } from '../../hooks/useBrandingConfig';

function formatMoney(amount: number) {
  return `$${amount.toFixed(2)}`;
}

export function ReceiptPreviewCard({
  receipt,
  template,
  variant = 'print'
}: {
  receipt: ReceiptPreview;
  template: ReceiptTemplateConfig;
  variant?: ReceiptVariant;
}) {
  const branding = useBrandingConfig();
  const receiptHeader = template[variant];
  const logoDataUrl = branding.data?.logoDataUrl;
  const dealerName = branding.data?.dealershipName ?? receiptHeader.businessName;
  const fakeAction = (label: string) => window.alert(`${label} action triggered for receipt ${receipt.reference}`);

  const detailRow = (label: string, value: string, emphasis = false) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, py: 0.45 }}>
      <Typography variant="body2" sx={{ color: emphasis ? 'text.primary' : 'text.secondary', fontWeight: emphasis ? 700 : 500 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: emphasis ? 700 : 650, textAlign: 'right' }}>
        {value}
      </Typography>
    </Box>
  );

  return (
    <Card
      variant="outlined"
      sx={{
        overflow: 'hidden',
        position: 'relative',
        mx: 'auto',
        maxWidth: 560,
        borderColor: 'rgba(23, 50, 79, 0.14)',
        background: 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(251,248,243,1) 100%)'
      }}
    >
      <Box sx={{ height: 6, background: 'linear-gradient(90deg, #17324f 0%, #0f766e 58%, #8a5a34 100%)' }} />
      <CardContent sx={{ p: { xs: 1.75, md: 2.5 } }}>
        <Stack spacing={1.5}>
          <Stack alignItems="center" spacing={0.75}>
            {logoDataUrl ? (
              <Box component="img" src={logoDataUrl} alt="Dealership logo" sx={{ width: 130, height: 54, objectFit: 'contain' }} />
            ) : (
              <Box sx={{ width: 130, height: 54, borderRadius: 2, background: 'linear-gradient(135deg, #17324f 0%, #0f766e 100%)' }} />
            )}
            <Typography variant="overline" sx={{ letterSpacing: 2.5, color: 'text.secondary' }}>
              {receiptHeader.receiptTitle}
            </Typography>
            <Typography variant="h5" sx={{ textAlign: 'center', fontSize: { xs: '1.1rem', md: '1.3rem' } }}>
              {dealerName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', fontSize: { xs: 12, md: 13 } }}>
              {receiptHeader.addressLine1}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', fontSize: { xs: 12, md: 13 } }}>
              {receiptHeader.addressLine2}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', fontSize: { xs: 12, md: 13 } }}>
              {receiptHeader.contactLine}
            </Typography>
          </Stack>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <Box
            sx={{
              px: 1.25,
              py: 1,
              borderRadius: 2,
              backgroundColor: 'rgba(23,50,79,0.05)',
              border: '1px solid rgba(18,32,51,0.08)'
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1} flexWrap="wrap">
              <Typography sx={{ fontWeight: 800, letterSpacing: 1.4 }}>RECEIPT</Typography>
              <Chip label={receipt.paymentMethodLabel ?? receipt.flow.toUpperCase()} size="small" variant="outlined" />
            </Stack>
            <Stack sx={{ mt: 0.75 }}>
              {detailRow('RO Number', receipt.roNumber, true)}
              {detailRow('Customer', receipt.customerName)}
              {detailRow('Payment Method', receipt.paymentMethodLabel)}
              {detailRow('Reference', receipt.reference)}
              {detailRow('Route MID', receipt.routingMid)}
              {detailRow('Department', receipt.departmentId)}
            </Stack>
          </Box>

          <Box sx={{ borderRadius: 2.5, border: '1px solid rgba(18,32,51,0.12)', overflow: 'hidden', backgroundColor: '#fff' }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 96px',
                px: 1.25,
                py: 0.9,
                backgroundColor: 'rgba(23,50,79,0.06)',
                borderBottom: '1px solid rgba(18,32,51,0.08)'
              }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 1 }}>
                Line Item
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 1, textAlign: 'right' }}>
                Amount
              </Typography>
            </Box>
            <Stack divider={<Divider sx={{ opacity: 0.6 }} />}>
              {receipt.lineItems.map((item) => (
                <Box
                  key={item.label}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 96px',
                    gap: 1,
                    alignItems: 'center',
                    px: 1.25,
                    py: 0.95
                  }}
                >
                  <Typography sx={{ fontWeight: item.tone === 'accent' ? 700 : 500, color: item.tone === 'muted' ? 'text.secondary' : 'text.primary', fontSize: { xs: 13, md: 14 } }}>
                    {item.label}
                  </Typography>
                  <Typography sx={{ textAlign: 'right', fontWeight: 700, color: item.tone === 'accent' ? 'secondary.main' : 'text.primary', fontSize: { xs: 13, md: 14 } }}>
                    {formatMoney(item.amount)}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <Stack spacing={0.75}>
            {detailRow('Base Amount', formatMoney(receipt.amountBase))}
            {detailRow(receipt.surchargeLabel ?? 'Service Fee', formatMoney(receipt.amountSurcharge))}
            <Divider />
            {detailRow('Paid Now', formatMoney(receipt.amountPaidNow), true)}
            {detailRow('Remaining Balance', formatMoney(receipt.amountRemaining), true)}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, pt: 0.25 }}>
              <Typography variant="h6" sx={{ fontSize: { xs: '1rem', md: '1.1rem' } }}>
                Total Paid Now
              </Typography>
              <Typography variant="h6" sx={{ fontSize: { xs: '1rem', md: '1.1rem' } }}>
                {formatMoney(receipt.amountTotal)}
              </Typography>
            </Box>
          </Stack>

          <Alert severity="info">
            Surcharge is shown separately for compliance and DMS posting accuracy. DMS code: NON_TAX_MISC_FEE.
          </Alert>

          <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: 'rgba(23,50,79,0.05)', border: '1px solid rgba(18,32,51,0.08)' }}>
            <Typography variant="body2" color="text.secondary">
              {receiptHeader.footerNote}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
      <CardActions sx={{ px: { xs: 2, md: 3 }, pb: { xs: 2, md: 3 }, justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Button onClick={() => window.print()}>Print</Button>
          <Button onClick={() => fakeAction('Email')}>Email</Button>
          <Button onClick={() => fakeAction('Text')}>Text</Button>
        </Stack>
        <Chip label="Receipt preview" variant="outlined" />
      </CardActions>
    </Card>
  );
}
