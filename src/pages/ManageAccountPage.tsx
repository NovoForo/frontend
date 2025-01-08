import * as React from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Alert,
  Snackbar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@toolpad/core';
import { useState, useEffect, useRef } from 'react';
import { ExtendedSession } from "../ExtendedSession";

const fetchWithErrorHandling = async (url, options) => {
  const response = await fetch(url, options);
  if (response.status === 429) {
    throw new Error('Too many requests. Please wait 10 seconds and try again.');
  }
  return response;
};

export default function ManageAccountPage() {
  const session = useSession() as ExtendedSession | null;
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [openAlert, setOpenAlert] = useState(false);

  const isFormValid = displayName.trim() && email.trim() && password.trim();

  const hasFetched = useRef(false);

  const handleCloseAlert = () => {
    setOpenAlert(false);
    setAlertMessage('');
  };

  const handleUpdateAccount = async () => {
    try {
      const response = await fetchWithErrorHandling(
          import.meta.env.VITE_API_URL + '/s/account',
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session?.token}`,
            },
            body: JSON.stringify({
              displayName,
              email,
              password,
            }),
          }
      );

      if (response.ok) {
        const json = await response.json();
        setAlertMessage('Account updated successfully!');
        setOpenAlert(true);
        window.localStorage.removeItem('session');
        window.location.reload();
      } else {
        setAlertMessage('Failed to update account. Please try again.');
        setOpenAlert(true);
      }
    } catch (error) {
      if (error.message.includes('Too many requests')) {
        setAlertMessage(error.message);
      } else {
        setAlertMessage('An error occurred. Please try again later.');
      }
      setOpenAlert(true);
    }
  };

  useEffect(() => {
    if (!session) {
      navigate('/');
      return;
    }

    if (hasFetched.current) return;
    hasFetched.current = true;

    fetchWithErrorHandling(
        import.meta.env.VITE_API_URL + '/s/verify_credentials',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.token}`,
          },
          body: JSON.stringify({}),
        }
    )
        .then(async (response) => {
          if (response.ok) {
            const json = await response.json();
            setDisplayName(json.user.Username || '');
            setEmail(json.user.EmailAddress || '');
          } else {
            setError('Failed to fetch user credentials. Please try again later.');
          }
        })
        .catch((error) => {
          if (error.message.includes('Too many requests')) {
            setAlertMessage(error.message);
          } else {
            setAlertMessage('Failed to fetch user credentials.');
          }
          setOpenAlert(true);
        });
  }, [session, navigate]);

  return (
      <>
        <Snackbar
            open={openAlert}
            autoHideDuration={6000}
            onClose={handleCloseAlert}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseAlert} severity="info" sx={{ width: '100%' }}>
            {alertMessage}
          </Alert>
        </Snackbar>
        {session && (
            <Container maxWidth="sm">
              <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                  Manage Account
                </Typography>
                {error && (
                    <Typography color="error" gutterBottom>
                      {error}
                    </Typography>
                )}
                <Box
                    component="form"
                    noValidate
                    autoComplete="off"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (isFormValid) {
                        handleUpdateAccount();
                      }
                    }}
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                >
                  <TextField
                      required
                      id="displayName"
                      label="Username"
                      fullWidth
                      margin="normal"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      error={!displayName.trim()}
                      helperText={!displayName.trim() ? 'Please provide a display name.' : ''}
                  />
                  <TextField
                      required
                      id="email"
                      label="Email Address"
                      fullWidth
                      margin="normal"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      error={!email.trim()}
                      helperText={!email.trim() ? 'Please provide an email address.' : ''}
                  />
                  <TextField
                      required
                      id="password"
                      label="New Password"
                      type="password"
                      fullWidth
                      margin="normal"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      error={!password.trim()}
                      helperText={!password.trim() ? 'Please provide a password.' : ''}
                  />
                  <Button
                      type="submit"
                      variant="contained"
                      disabled={!isFormValid}
                  >
                    Update Account
                  </Button>
                </Box>
              </Paper>
            </Container>
        )}
      </>
  );
}