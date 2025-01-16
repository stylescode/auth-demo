'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function AuthPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');

        if (isSignUp) {
            try {
                const response = await fetch('/api/auth/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setMessage('Sign-up successful! Please log in.');
                } else {
                    console.error(response);
                    const error = await response.json();
                    setMessage(error.message || 'Something went wrong. Please try again.');
                }
            } catch (error) {
                setMessage('An error occurred. Please try again later.');
            }
            return;
        } else {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result.error) {
                console.error(result.error);
                setMessage(result.error);
                return;
            }

            router.push('/');
        }
    };

    return (
        <div>
            <h1>{isSignUp ? 'Sign Up' : 'Sign In'}</h1>
            <form onSubmit={handleAuth}>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit">{isSignUp ? 'Sign Up' : 'Sign In'}</button>
            </form>

            <button onClick={() => setIsSignUp(!isSignUp)}>
                Switch to {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>

            {message && <p>{message}</p>}
        </div>
    );
}
