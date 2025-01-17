import * as React from "react";
import { Outlet, Navigate, useLocation } from "react-router";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import { useSession } from "../SessionContext";
import { match } from "path-to-regexp";
import { Stack, Typography } from "@mui/material";

export default function Layout() {
  const { session } = useSession();
  const location = useLocation();

  if (!session) {
    const skippedUrls = [
      "/",
      "/register",
      "/rules",
      "/forums",
      "/category/:categoryId/forums/:forumId",
      "/category/:categoryId/forums/:forumId/topics/:topicId",
      "/category/:categoryId/forums/:forumId/topics/:topicId/posts/:postId",
    ];

    const isSkippedUrl = (path: string) => {
      return skippedUrls.some((pattern) => {
        const matcher = match(pattern, { decode: decodeURIComponent });
        return matcher(path) !== false;
      });
    };

    if (!isSkippedUrl(location.pathname)) {
      // Add the `callbackUrl` search parameter
      const redirectTo = `/sign-in?callbackUrl=${encodeURIComponent(location.pathname)}`;

      return <Navigate to={redirectTo} replace />;
    }
  }

  return (
    <DashboardLayout>
      <PageContainer title={""}>
        <Outlet />
        <Stack alignItems="center">
          <Typography>
            Powered by <a href="https://github.com/NovoForo">NovoForo</a>
          </Typography>
        </Stack>
      </PageContainer>
    </DashboardLayout>
  );
}
