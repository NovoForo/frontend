'use client';
import * as React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSession } from '../SessionProvider';
import type { ExtendedSession } from '../SessionProvider';

async function loginToBackend(email: string, password: string): Promise<ExtendedSession> {
    // Example fetch to your backend:
    const response = await fetch(import.meta.env.VITE_API_URL + '/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        throw new Error('Login failed. Incorrect credentials.');
    }

    const data = await response.json();
    return {
        user: {
            name: data.name || 'Unknown User',
            email: data.email || email || '',
            image: data.image || 'https://avatars.githubusercontent.com/u/193647016?s=400&v=4',
        },
        token: data.token,
        isModerator: data.isModerator,
        isAdministrator: data.isAdministrator,
    };
}

export default function CustomSignIn() {
    const [error, setError] = React.useState<string | null>(null);
    const { signIn } = useSession();
    const navigate = useNavigate();

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        // If you want a manual "remember me" checkbox, handle it here:
        const rememberMe = formData.get('rememberMe') === 'on';

        loginToBackend(email, password)
            .then((session) => {
                // Store session in context & localStorage if rememberMe
                signIn(session, true);
                navigate('/', { replace: true });
            })
            .catch((err) => {
                setError(err.message || 'An error occurred');
            });
    }

    return (
        <div style={{ maxWidth: 400, margin: 'auto', padding: 24 }}>
            <h2>Sign In</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                    <label>
                        Email
                        <input name="email" type="email" required />
                    </label>
                </div>
                <div>
                    <label>
                        Password
                        <input name="password" type="password" required />
                    </label>
                </div>
                {/* If you don't want a "Remember Me" checkbox, remove this block */}
                <div>
                    <label>
                        <input name="rememberMe" type="checkbox" /> Remember Me
                    </label>
                </div>
                <button type="submit">Log In</button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div style={{ marginTop: 16 }}>
                <Link to="/register">Register</Link> |{' '}
                <Link to="/forgot-password">Forgot Password?</Link>
            </div>
        </div>
    );
}
