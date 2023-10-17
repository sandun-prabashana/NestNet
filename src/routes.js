import { Navigate, useRoutes } from 'react-router-dom';
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';


import UserPage from './pages/customer/CustomerPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/product/ProductPage';
import DashboardAppPage from './pages/DashboardAppPage';
import WelcomePage from './pages/WelcomePage';
import CustomerRegisterPage from './pages/CustomerRegisterPage';
import CategoryPage from './pages/category/CategoryPage';
import BrandPage from './pages/brand/BrandPage'
import Product  from './pages/ProductsPage'
import PurchasePage from './pages/purchase/PurchasePage';
import AdminPage from './pages/admin/AdminPage';
import LoanPage from './pages/loan/LoanPage';
import EmailVerificationPage from './pages/EmailVerificationPage';
import PropertiesGrid from './pages/properties/PropertiesGrid';
import DashboardAppAdminPage from './pages/admindashboard/DashboardAppAdminPage';
import AdsForAdmin from './pages/adsforadmin/AdsForAdmin';
import Audittrace from './pages/Audittrace';
import FeedbacksPage from './pages/Feedbacks/FeedbacksPage';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/user',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/user/dashboard" />, index: true },
        {path: "", element: <Navigate to="/user/dashboard"/>},
        { path: 'dashboard', element: <DashboardAppPage /> },
        { path: 'ads', element: <PropertiesGrid /> },
        { path: 'add', element: <BrandPage /> },
      ],
    },
    {
      path: '/admin',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/admin/dashboard" />, index: true },
        {path: "", element: <Navigate to="/admin/dashboard"/>},
        { path: 'dashboard', element: <DashboardAppAdminPage /> },
        { path: 'user', element: <UserPage /> },
        { path: 'ads', element: <AdsForAdmin /> },
        { path: 'audittrace', element: <Audittrace /> },
        { path: 'feedback', element: <FeedbacksPage/> },
      ],
    },
       {
      path: "/",
      element: <SimpleLayout/>,
      children: [
          {path: "login", element: <LoginPage/>},
          {path: "register", element: <CustomerRegisterPage/>},
          {path: "404", element: <Page404/>},
          {path: "/", element: <WelcomePage/>},
          {path: "*", element: <Navigate to="/404"/>},
          {path: 'verify/:token', element: <EmailVerificationPage />},
      ],
  },


  ]);

  return routes;
}
