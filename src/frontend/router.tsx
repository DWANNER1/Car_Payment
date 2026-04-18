import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import { AdminPage } from './features/admin/AdminPage';
import { CustomersPage } from './features/customers/CustomersPage';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { PaymentPage } from './features/payments/PaymentPage';
import { TransactionsPage } from './features/transactions/TransactionsPage';
import { Navigate } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/transactions" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'transactions', element: <TransactionsPage /> },
      { path: 'customers', element: <CustomersPage /> },
      { path: 'admin', element: <AdminPage /> },
      { path: 'payments/new', element: <PaymentPage /> }
    ]
  }
]);
