import * as React from 'react';
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Divider,
  Stack,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
  const navigate = useNavigate();

  // Form fields
  const [username, setUsername] = React.useState('');
  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');

  // Field-level error states
  const [usernameError, setUsernameError] = React.useState('');
  const [emailAddressError, setEmailAddressError] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');

  // General API error state
  const [apiError, setApiError] = React.useState('');

  /**
   * Validate the input fields on the client:
   * 1. Username must be non-empty.
   * 2. Email must be non-empty and in a valid format.
   * 3. Password must be at least 16 characters.
   */
  const validateForm = (): boolean => {
    let isValid = true;

    // Validate Username
    if (!username.trim()) {
      setUsernameError('Username is required.');
      isValid = false;
    } else {
      setUsernameError('');
    }

    // Validate Email
    if (!emailAddress.trim()) {
      setEmailAddressError('Email is required.');
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(emailAddress)) {
      setEmailAddressError('Email must be a valid email address.');
      isValid = false;
    } else {
      setEmailAddressError('');
    }

    // Validate Password (minimum 16 characters)
    if (!password.trim()) {
      setPasswordError('Password is required.');
      isValid = false;
    } else if (password.length < 16) {
      setPasswordError('Password must be at least 16 characters long.');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  /**
   * Attempt to create an account by sending a POST request.
   * - If the server returns an error status (not 200), show an error message
   *   indicating that the username/email may already be in use or the password
   *   is too short.
   * - If the request succeeds, redirect to sign-in page.
   */
  const handlePostClick = async () => {
    // Clear any lingering API error before validation
    setApiError('');

    // Validate the form before attempting the request
    if (!validateForm()) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/sign-up`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email: emailAddress,
          password,
        }),
      });

      // If we get a 200 OK, navigate to sign in.
      // Otherwise, assume username/email conflict or password too short.
      if (response.ok) {
        navigate('/sign-in');
      } else {
        setApiError(
          'Your username or email might already be in use, or the password is under 16 characters. Please try again.'
        );
      }
    } catch (error) {
      // Network or other unexpected errors
      console.error(error);
      setApiError('Something went wrong. Please try again later.');
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        backgroundColor: '#f3f3f3',
        padding: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 400,
          width: '100%',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Create an Account
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {/* Show a general API error above the fields if present */}
        {apiError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {apiError}
          </Alert>
        )}

        <Box
          component="form"
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
            handlePostClick();
          }}
        >
          <Stack spacing={2}>
            <TextField
              label="Username"
              fullWidth
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={Boolean(usernameError)}
              helperText={usernameError || ' '}
            />

            <TextField
              label="Email Address"
              fullWidth
              required
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              error={Boolean(emailAddressError)}
              helperText={emailAddressError || ' '}
            />

            <TextField
              type="password"
              label="Password"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={Boolean(passwordError)}
              helperText={passwordError || ' '}
            />

            <Button variant="contained" type="submit" sx={{ mt: 1 }}>
              Sign Up
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}
