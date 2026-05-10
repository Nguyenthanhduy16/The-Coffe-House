import { createBrowserRouter } from 'react-router';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import CafeDetailPage from './pages/CafeDetailPage';
import CafeSetupPage from './pages/CafeSetupPage';
import OwnerHomePage from './pages/OwnerHomePage';
import OwnerCafeDetailPage from './pages/OwnerCafeDetailPage';
import OwnerProfilePage from './pages/OwnerProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import AdminUserManagementPage from './pages/AdminUserManagementPage';
import AdminCafeManagementPage from './pages/AdminCafeManagementPage';
import AdminReportsPage from './pages/AdminReportsPage';
import StaffHomePage from './pages/StaffHomePage';
import StaffCafeDetailPage from './pages/StaffCafeDetailPage';
import StaffProfilePage from './pages/StaffProfilePage';
import ErrorPage from './pages/ErrorPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/home',
    element: <HomePage />,
  },
  {
    path: '/cafe/:id',
    element: <CafeDetailPage />,
  },
  {
    path: '/cafe-setup',
    element: <CafeSetupPage />,
  },
  {
    path: '/owner',
    element: <OwnerHomePage />,
  },
  {
    path: '/owner/cafe/:id',
    element: <OwnerCafeDetailPage />,
  },
  {
    path: '/owner/profile',
    element: <OwnerProfilePage />,
  },
  {
    path: '/staff',
    element: <StaffHomePage />,
  },
  {
    path: '/staff/cafe/:id',
    element: <StaffCafeDetailPage />,
  },
  {
    path: '/staff/profile',
    element: <StaffProfilePage />,
  },
  {
    path: '/admin',
    element: <AdminDashboard />,
  },
  {
    path: '/admin/users',
    element: <AdminUserManagementPage />,
  },
  {
    path: '/admin/cafes',
    element: <AdminCafeManagementPage />,
  },
  {
    path: '/admin/reports',
    element: <AdminReportsPage />,
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
]);