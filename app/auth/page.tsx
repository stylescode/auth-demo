'use client';

import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [role, setRole] = useState('');

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Login successful!');

      // Fetch the user's role from the user_roles table
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .single();

      if (roleError) {
        setMessage(`Error fetching role: ${roleError.message}`);
      } else if (roleData) {
        setRole(roleData.role);
      }
    }
  };


  return (
    <div>
      <h1>Sign-Up / Login</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Log In</button>
      <p>{message}</p>

      {role && (
        <p>
          Logged in as <strong>{role}</strong>
        </p>
      )}

      {role === 'admin' && <p>Welcome, Admin! You have full access.</p>}
      {role === 'user' && <p>Welcome, User! You have limited access.</p>}
    </div>
  );
}
