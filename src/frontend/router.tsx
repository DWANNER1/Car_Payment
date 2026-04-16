import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import { AdminPage } from './features/admin/AdminPage';
import { CustomersPage } from './features/customers/CustomersPage';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { PaymentPage } from './features/payments/PaymentPage';
import { TransactionsPage } from './features/transactions/TransactionsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'transactions', element: <TransactionsPage /> },
      { path: 'customers', element: <CustomersPage /> },
      { path: 'admin', element: <AdminPage /> },
      { path: 'payments/new', element: <PaymentPage /> }
    ]
  }
]);
