import { Alert, Button, Card, CardActions, CardContent, Stack, Typography } from '@mui/material';
import type { ReceiptPreview } from '../../../shared/payment';

export function ReceiptPreviewCard({ receipt }: { receipt: ReceiptPreview }) {
  const fakeAction = (label: string) => window.alert(`${label} action triggered for receipt ${receipt.reference}`);

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="h6">Receipt Preview</Typography>
          <Typography color="text.secondary">RO: {receipt.roNumber}</Typography>
          <Typography color="text.secondary">Customer: {receipt.customerName}</Typography>
          <Typography color="text.secondary">Base: ${receipt.amountBase.toFixed(2)}</Typography>
          <Typography color="text.secondary">Service Fee: ${receipt.amountSurcharge.toFixed(2)}</Typography>
          <Typography color="text.secondary">Paid Now: ${receipt.amountPaidNow.toFixed(2)}</Typography>
          <Typography color="text.secondary">Remaining Balance: ${receipt.amountRemaining.toFixed(2)}</Typography>
          <Typography color="text.secondary">Total on This Receipt: ${receipt.amountTotal.toFixed(2)}</Typography>
          <Typography color="text.secondary">Reference: {receipt.reference}</Typography>
          <Alert severity="info">Surcharge is shown separately for compliance and DMS posting accuracy.</Alert>
        </Stack>
      </CardContent>
      <CardActions>
        <Button onClick={() => window.print()}>Print</Button>
        <Button onClick={() => fakeAction('Email')}>Email</Button>
        <Button onClick={() => fakeAction('Text')}>Text</Button>
      </CardActions>
    </Card>
  );
}
