import * as React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import { useSession } from '../SessionContext';
import { match } from 'path-to-regexp';

export default function Layout() {
  const { session } = useSession();
  const location = useLocation();

  if (!session) {
    const skippedUrls = [
      '/',
      '/rules',
      '/forums',
      '/category/:categoryId/forums/:forumId',
    ];

    const isSkippedUrl = (path) => {
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
      <PageContainer>
        <Outlet />
      </PageContainer>
    </DashboardLayout>
  );
}
