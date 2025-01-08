'use client';
import * as React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AppProvider } from '@toolpad/core/react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GavelIcon from '@mui/icons-material/Gavel';
import { AdminPanelSettings, ManageAccounts, SafetyCheck } from '@mui/icons-material';
import type { Navigation } from '@toolpad/core';
import { SessionProvider, useSession, ExtendedSession } from './SessionProvider';

const NAVIGATION: Navigation = [
  { kind: 'header', title: 'Main items' },
  { title: 'Forums', icon: <DashboardIcon />, segment: 'forums' },
  { title: 'Rules', icon: <GavelIcon />, segment: 'rules' },
];

const BRANDING = {
  title: 'NovoForo',
};

function AppContent() {
  const navigate = useNavigate();
  const { session, signOut } = useSession();

  // signOut is provided by our SessionProvider
  // We'll link it here so Toolpad can use it
  const handleSignOut = React.useCallback(() => {
    signOut();
    navigate('/sign-in');
  }, [signOut, navigate]);

  // (Optional) Dynamically add nav items
  if (session) {
    const manageAccount = {
      title: 'Manage Account',
      icon: <ManageAccounts />,
      segment: 'manageaccount',
    };
    if (!NAVIGATION.some((item) => 'segment' in item && item.segment === manageAccount.segment)) {
      NAVIGATION.push(manageAccount);
    }
  }
  if (session?.isModerator) {
    const modItem = {
      title: 'Moderator Control Panel',
      icon: <SafetyCheck />,
      segment: 'moderatorcontrolpanel',
    };
    if (!NAVIGATION.some((item) => 'segment' in item && item.segment === modItem.segment)) {
      NAVIGATION.push(modItem);
    }
  }
  if (session?.isAdministrator) {
    const adminItem = {
      title: 'Administrator Control Panel',
      icon: <AdminPanelSettings />,
      segment: 'administratorcontrolpanel',
    };
    if (!NAVIGATION.some((item) => 'segment' in item && item.segment === adminItem.segment)) {
      NAVIGATION.push(adminItem);
    }
  }

  return (
      <AppProvider
          navigation={NAVIGATION}
          branding={BRANDING}
          session={session}
          authentication={{
            signIn: () => navigate('/sign-in'), // If Toolpad tries to sign in, we navigate
            signOut: handleSignOut,
          }}
      >
        <Outlet />
      </AppProvider>
  );
}

export default function App() {
  return (
      <SessionProvider>
        <AppContent />
      </SessionProvider>
  );
}
