import * as React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import GavelIcon from '@mui/icons-material/Gavel';
import { AppProvider } from '@toolpad/core/react-router-dom';
import { Outlet, useNavigate } from 'react-router-dom';
import type { Navigation, Session } from '@toolpad/core';
import { SessionContext, useSession } from './SessionContext';
import {ManageAccounts} from "@mui/icons-material";
import { Typography } from '@mui/material';

import { ExtendedSession } from './pages/signIn';

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    title: 'Forums',
    icon: <DashboardIcon />,
    segment: 'forums',
  },
  {
    title: 'Rules',
    icon: <GavelIcon />,
    segment: 'rules',
  },
];

const BRANDING = {
  title: 'NovoForo',
};

export default function App() {
  const [session, setSession] = React.useState<Session | null>(null);
  const navigate = useNavigate();

  const signIn = React.useCallback(() => {
    navigate('/sign-in');
  }, [navigate]);

  const signOut = React.useCallback(() => {
    setSession(null);
    navigate('/sign-in');
  }, [navigate]);

  const sessionContextValue = React.useMemo(() => ({ session, setSession }), [session, setSession]);

  if (session) {
    const newItem = {
      title: "Manage Account",
      icon: <ManageAccounts />,
      segment: "manageaccount",
    };

    // Check if the item already exists in NAVIGATION
    const exists = NAVIGATION.some(item => item.segment === newItem.segment);

    if (!exists) {
      NAVIGATION.push(newItem);
    }
  }

  if (session && (session as ExtendedSession).isModerator) {
    const newItem = {
      title: "Moderator Control Panel",
      icon: <ManageAccounts />,
      segment: "moderatorcontrolpanel",
    };

    // Check if the item already exists in NAVIGATION
    const exists = NAVIGATION.some(item => item.segment === newItem.segment);

    if (!exists) {
      NAVIGATION.push(newItem);
    }
  }

  if (session && (session as ExtendedSession).isAdministrator) {
    const newItem = {
      title: "Administrator Control Panel",
      icon: <ManageAccounts />,
      segment: "administratorcontrolpanel",
    };

    // Check if the item already exists in NAVIGATION
    const exists = NAVIGATION.some(item => item.segment === newItem.segment);

    if (!exists) {
      NAVIGATION.push(newItem);
    }
  }

  return (
    <SessionContext.Provider value={sessionContextValue}>
      <AppProvider
        navigation={NAVIGATION}
        branding={BRANDING}
        session={session}
        authentication={{ signIn, signOut }}
      >
        <Outlet />
      </AppProvider>
    </SessionContext.Provider>
  );
}
