import { Divider, Stack } from '@mui/material';
import { AppShell } from './components/AppShell';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { TransactionsPage } from './features/transactions/TransactionsPage';
import { CustomersPage } from './features/customers/CustomersPage';
import { AdminPage } from './features/admin/AdminPage';

export default function App() {
  return (
    <AppShell>
      <Stack spacing={4}>
        <DashboardPage />
        <Divider />
        <TransactionsPage />
        <Divider />
        <CustomersPage />
        <Divider />
        <AdminPage />
      </Stack>
    </AppShell>
  );
}
