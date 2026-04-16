import { Stack, Typography } from '@mui/material';
import { PaymentStepperModal } from './PaymentStepperModal';

export function PaymentPage() {
  return (
    <Stack spacing={2}>
      <Typography variant="h4">New Payment</Typography>
      <Typography color="text.secondary">Starter flow for mixed-RO routing, partial payments, and receipt compliance.</Typography>
      <PaymentStepperModal open />
    </Stack>
  );
}
