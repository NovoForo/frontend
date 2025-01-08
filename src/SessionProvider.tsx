'use client';
import * as React from 'react';

// The shape of our session, extending Toolpad’s base Session if needed
export interface ExtendedSession {
    user?: {
        name?: string;
        email?: string;
        image?: string;
    };
    token?: string;
    isModerator?: boolean;
    isAdministrator?: boolean;
}

interface SessionContextValue {
    session: ExtendedSession | null;
    signIn: (newSession: ExtendedSession, rememberMe?: boolean) => void;
    signOut: () => void;
}

// Create a React context with defaults
const SessionContext = React.createContext<SessionContextValue>({
    session: null,
    signIn: () => {},
    signOut: () => {},
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = React.useState<ExtendedSession | null>(null);

    React.useEffect(() => {
        // Attempt to load an existing session from localStorage
        const storedSession = localStorage.getItem('session');
        if (storedSession) {
            try {
                const parsed: ExtendedSession = JSON.parse(storedSession);
                setSession(parsed);
            } catch (err) {
                console.error('Failed to parse session from localStorage:', err);
            }
        }
    }, []);

    const signIn = React.useCallback(
        (newSession: ExtendedSession, rememberMe = false) => {
            setSession(newSession);
            if (rememberMe) {
                localStorage.setItem('session', JSON.stringify(newSession));
            } else {
                localStorage.removeItem('session');
            }
        },
        [],
    );

    const signOut = React.useCallback(() => {
        setSession(null);
        localStorage.removeItem('session');
    }, []);

    const value = React.useMemo(
        () => ({
            session,
            signIn,
            signOut,
        }),
        [session, signIn, signOut],
    );

    return (
        <SessionContext.Provider value={value}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSession() {
    return React.useContext(SessionContext);
}
