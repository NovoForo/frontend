import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Layout from "./layouts/dashboard";
import ManageAccountPage from "./pages/ManageAccountPage";
import RulesPage from "./pages/RulesPage";
import SiteIndexPage from "./pages/SiteIndexPage";
import ListForumTopics from "./pages/ListForumTopics";
import ViewTopicPage from "./pages/ViewTopicPage";
import NewTopicsPage from "./pages/CreateNewTopicPage";
import SignUp from "./pages/SignUp";
import EditPostPage from "./pages/EditPostPage";
import AdministratorControlPanelPage from "./pages/AdministratorControlPanelPage";
import ModeratorControlPanelPage from "./pages/ModeratorControlPanelPage";
import SignIn from "./pages/SignIn";

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
            Component: SiteIndexPage,
          },
          {
            path: "/register",
            Component: SignUp,
          },
          {
            path: "/forums",
            Component: SiteIndexPage,
          },
          {
            path: "/category/:categoryId/forums/:forumId",
            Component: ListForumTopics,
          },
          {
            path: "/category/:categoryId/forums/:forumId/topics/:topicId",
            Component: ViewTopicPage,
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
            path: "/moderatorcontrolpanel",
            Component: ModeratorControlPanelPage,
          },
          {
            path: "/rules",
            Component: RulesPage,
          },
          {
            path: "/manageaccount",
            Component: ManageAccountPage,
          },
        ],
      },
      {
        path: "/sign-in",
        Component: SignIn,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
