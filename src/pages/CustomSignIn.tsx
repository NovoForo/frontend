'use client';
import * as React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSession } from '../SessionProvider';
import type { ExtendedSession } from '../SessionProvider';
import { Box, Typography, TextField, Button, Checkbox, FormControlLabel, Alert, Paper } from '@mui/material';

async function loginToBackend(email: string, password: string): Promise<ExtendedSession> {
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
        const rememberMe = formData.get('rememberMe') === 'on';

        loginToBackend(email, password)
            .then((session) => {
                signIn(session, true);
                navigate('/', { replace: true });
            })
            .catch((err) => {
                setError(err.message || 'An error occurred');
            });
    }

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            bgcolor="background.default">
            <Paper elevation={3} sx={{ padding: 4, maxWidth: 400, width: '100%' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Sign In
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Box display="flex" flexDirection="column" gap={2}>
                        <TextField
                            name="email"
                            label="Email"
                            type="email"
                            required
                            fullWidth
                        />
                        <TextField
                            name="password"
                            label="Password"
                            type="password"
                            required
                            fullWidth
                        />
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Log In
                        </Button>
                    </Box>
                </form>
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

                <Box display="flex" justifyContent="space-between" mt={2}>
                    <Typography variant="body2">
                        <Link to="/register">Register</Link>
                    </Typography>
                    <Typography variant="body2">
                        <Link to="/forgot-password">Forgot Password?</Link>
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
}
