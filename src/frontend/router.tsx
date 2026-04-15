import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { TransactionsPage } from './features/transactions/TransactionsPage';
import { CustomersPage } from './features/customers/CustomersPage';
import { AdminPage } from './features/admin/AdminPage';
import { PaymentPage } from './features/payments/PaymentPage';

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
