import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Layout from './layouts/dashboard';
import DashboardPage from './pages';
import OrdersPage from './pages/orders';
import SignInPage from './pages/signIn';
import RulesPage from "./pages/rules";
import ForumsPage from "./pages/forumsPage";
import CategoryForumPage from './pages/CategoryForumPage';

const router = createBrowserRouter([
  {
    Component: App,
    children: [
      {
        path: '/',
        Component: Layout,
        children: [
          {
            path: '/',
            Component: ForumsPage,
          },
          {
            path: '/forums',
            Component: ForumsPage,
          },
          {
            path: '/category/:categoryId/forums/:forumId',
            Component: CategoryForumPage,
          },
          {
            path: '/rules',
            Component: RulesPage,
          },
          {
            path: '/manageaccount',
            Component: OrdersPage,
          },
          {
            path: '/orders',
            Component: OrdersPage,
          },
        ],
      },
      {
        path: '/sign-in',
        Component: SignInPage,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
