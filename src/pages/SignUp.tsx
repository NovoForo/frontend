import { Box, Button, Paper, TextField } from '@mui/material';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
    const [username, setUsername] = React.useState('');
    const [emailAddress, setEmailAddress] = React.useState('');
    const [password, setPassword] = React.useState('');
    const navigate = useNavigate();
    
    const handlePostClick = async () => {
        const createAccountResult = await fetch(import.meta.env.VITE_API_URL + `/sign-up`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    email: emailAddress,
                    password: password
                }),
        }).then(() => {
            navigate('/sign-in');
        });

        
    }

    return <>
        <Paper>
            <Box component="form" autoComplete='off' onSubmit={(e) => { e.preventDefault(); handlePostClick(); }}>
                <TextField
                    value={username}
                    onChange={(e) =>setUsername(e.target.value)}
                    fullWidth
                    label='Username'
                    required
                />
                
                <TextField
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    fullWidth
                    label='Email Address'
                    required
                />

                <TextField
                    type='password'
                    label='Password'
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <Button
                    variant='contained'
                    onClick={handlePostClick}
                >
                    Create Account
                </Button>
            </Box>
        </Paper>
    </>
}