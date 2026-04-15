import { Stack, Typography } from '@mui/material';
import { PaymentStepperModal } from './PaymentStepperModal';

export function PaymentPage() {
  return (
    <Stack spacing={2}>
      <Typography variant="h4">New Payment</Typography>
      <Typography color="text.secondary">Starter payment flow wired to demo mode, mutation hooks, and receipt preview.</Typography>
      <PaymentStepperModal open />
    </Stack>
  );
}
