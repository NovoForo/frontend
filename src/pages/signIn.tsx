'use client';
import * as React from 'react';
import { SignInPage } from '@toolpad/core/SignInPage';
import type { Session } from '@toolpad/core/AppProvider';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../SessionContext';

export interface ExtendedSession extends Session {
  token?: string; // Add token as an optional property
}


const login = async (formData: any): Promise<ExtendedSession> => {
  const email = formData.get('email');
  const password = formData.get('password');

  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch('http://localhost:8000/sign-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        resolve({
          user: {
            name: data.name || 'Unknown User',
            email: data.email || email || '',
            image: data.image || 'https://avatars.githubusercontent.com/u/193647016?s=400&v=4',
          },
          token,
        });
      } else {
        reject(new Error('Login failed. Incorrect credentials.'));
      }
    } catch (error) {
      reject(new Error('An error occurred while trying to log in.'));
    }
  });
};

export default function SignIn() {
  const { setSession } = useSession();
  const navigate = useNavigate();
  return (
    <SignInPage
      providers={[{ id: 'credentials', name: 'Credentials' }]}
      signIn={async (provider, formData, callbackUrl) => {
        // Demo session
        try {
          const session = await login(formData);
          if (session) {
            setSession(session);
            navigate(callbackUrl || '/', { replace: true });
            return {};
          }
        } catch (error) {
          return { error: error instanceof Error ? error.message : 'An error occurred' };
        }
        return {};
      }}
    />
  );
}
