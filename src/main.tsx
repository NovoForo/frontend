import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";
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
import { sessionTimeout } from "./utils";
import { SessionProvider, useSession } from "./SessionProvider";

interface SessionRouteProps {
  sessionTimeout: (timeStamp: number | undefined) => boolean;
  element: React.ReactNode;
}

const SessionRoute: React.FC<SessionRouteProps> = ({ sessionTimeout, element }) => {
  const { session } = useSession();
  console.log(`SessionRoute: ${JSON.stringify(session)}`);
  const tokenExpired = sessionTimeout(session?.sessionTimestamp);

  return tokenExpired ? <Navigate to="/sign-in" replace /> : element;
};
const router = createBrowserRouter([
  {
    Component: App,
    children: [
      {
        path: "/",
        element: <Layout />,
        children: [
          {
            path: "/",
            // Component: SiteIndexPage,
            element: <SiteIndexPage />,
          },
          {
            path: "/register",
            Component: SignUp,
          },
          {
            path: "/forums",
            element: <SessionRoute sessionTimeout={sessionTimeout} element={<SiteIndexPage />} />,
          },
          {
            path: "/category/:categoryId/forums/:forumId",
            element: <SessionRoute sessionTimeout={sessionTimeout} element={<ListForumTopics />} />,
          },
          {
            path: "/category/:categoryId/forums/:forumId/topics/:topicId",
            element: <SessionRoute sessionTimeout={sessionTimeout} element={<ViewTopicPage />} />,
          },
          {
            path: "/category/:categoryId/forums/:forumId/topics/:topicId/posts/:postId",
            element: <SessionRoute sessionTimeout={sessionTimeout} element={<EditPostPage />} />,
          },
          {
            path: "/category/:categoryId/forums/:forumId/topics/new",
            element: <SessionRoute sessionTimeout={sessionTimeout} element={<NewTopicsPage />} />,
          },
          {
            path: "/administratorcontrolpanel",
            element: <SessionRoute sessionTimeout={sessionTimeout} element={<AdministratorControlPanelPage />} />,
          },
          {
            path: "/moderatorcontrolpanel",
            element: <SessionRoute sessionTimeout={sessionTimeout} element={<ModeratorControlPanelPage />} />,
          },
          {
            path: "/rules",
            Component: RulesPage,
          },
          {
            path: "/manageaccount",
            element: <SessionRoute sessionTimeout={sessionTimeout} element={<ManageAccountPage />} />,
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
