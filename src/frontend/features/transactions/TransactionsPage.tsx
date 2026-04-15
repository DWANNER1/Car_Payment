import { Button, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export function TransactionsPage() {
  return (
    <Stack spacing={2}>
      <Typography variant="h4">Transactions</Typography>
      <Typography color="text.secondary">Starter page for transaction ledger, filters, exports, and reconciliation tools.</Typography>
      <Button variant="contained" component={Link} to="/payments/new">Launch Payment Stepper</Button>
    </Stack>
  );
}
