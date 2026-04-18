import { Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PaymentStepperModal } from './PaymentStepperModal';
import { useDemoPortalData } from '../../hooks/useDemoPortalData';

export function PaymentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const portal = useDemoPortalData();
  const [open, setOpen] = useState(true);
  const initialRoNumber = searchParams.get('ro') ?? portal.data?.sampleRos[0]?.roNumber ?? 'RO-10001';
  const initialCustomerName = searchParams.get('customer') ?? undefined;

  const handleClose = () => {
    setOpen(false);
    navigate('/transactions', { replace: true });
  };

  return (
    <Stack spacing={2} sx={{ maxWidth: 1440 }}>
      <Typography variant="h4">New Payment</Typography>
      <Typography color="text.secondary" sx={{ maxWidth: 880 }}>
        Guided mixed-RO payment flow with sample data, cash/credit/debit/stored-token payment methods, manual MID override, partial payments, and a separate surcharge line on the receipt.
      </Typography>
      <PaymentStepperModal open={open} onClose={handleClose} initialRoNumber={initialRoNumber} initialCustomerName={initialCustomerName} />
    </Stack>
  );
}
