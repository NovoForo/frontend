'use client';
import * as React from 'react';
import { SignInPage } from '@toolpad/core/SignInPage';
import type { Session } from '@toolpad/core/AppProvider';
import { Link, useNavigate } from 'react-router-dom';
import { useSession } from '../SessionContext';
import MD5 from 'crypto-js/md5';

export interface ExtendedSession extends Session {
  token?: string; // Add token as an optional property
  isModerator?: boolean;
  isAdministrator?: boolean;
}


const login = async (formData: any): Promise<ExtendedSession> => {
  const email = formData.get('email');
  const password = formData.get('password');

  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + '/sign-in', {
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
            image: `http://www.gravatar.com/avatar/${data["HashedEmailAddress"] || ''}`,
          },
          token,
          isModerator: data.isModerator,
          isAdministrator: data.isAdministrator,
        });
      }
      else {
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
        formFields={[
          { type: 'email', name: 'email', label: 'Email' },
          { type: 'password', name: 'password', label: 'Password' },
        ]}
      providers={[{ id: 'credentials', name: 'Credentials' }]}
      slots={{
        signUpLink: () => <><Link to='/register'>Register</Link></>,
        forgotPasswordLink: () => <><Link to='/forgot-password'>Forgot Password</Link></>,
      }}
      signIn={async (provider, formData, callbackUrl) => {
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
