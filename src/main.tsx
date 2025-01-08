import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Layout from "./layouts/dashboard";
import OrdersPage from "./pages/orders";
import SignInPage from "./pages/signIn";
import RulesPage from "./pages/rules";
import ForumsPage from "./pages/ForumsPage";
import CategoryForumPage from "./pages/CategoryForumPage";
import TopicPage from "./pages/TopicPage";
import NewTopicsPage from "./pages/NewTopicPage";
import SignUp from "./pages/SignUp";
import EditPostPage from "./pages/EditPostPage";
import AdministratorControlPanelPage from "./pages/AdministratorControlPanelPage";

const router = createBrowserRouter([
  {
    Component: App,
    children: [
      {
        path: "/",
        Component: Layout,
        children: [
          {
            path: "/",
            Component: ForumsPage,
          },
          {
            path: "/register",
            Component: SignUp,
          },
          {
            path: "/forums",
            Component: ForumsPage,
          },
          {
            path: "/category/:categoryId/forums/:forumId",
            Component: CategoryForumPage,
          },
          {
            path: "/category/:categoryId/forums/:forumId/topics/:topicId",
            Component: TopicPage,
          },
          {
            path: "/category/:categoryId/forums/:forumId/topics/:topicId/posts/:postId",
            Component: EditPostPage,
          },
          {
            path: "/category/:categoryId/forums/:forumId/topics/new",
            Component: NewTopicsPage,
          },
          {
            path: "/administratorcontrolpanel",
            Component: AdministratorControlPanelPage,
          },
          {
            path: "/rules",
            Component: RulesPage,
          },
          {
            path: "/manageaccount",
            Component: OrdersPage,
          },
          {
            path: "/orders",
            Component: OrdersPage,
          },
        ],
      },
      {
        path: "/sign-in",
        Component: SignInPage,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
