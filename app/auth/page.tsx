'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

export default function AuthPage() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div>
        <p>Welcome, {session.user?.email}</p>
        <button onClick={() => signOut()}>Sign Out</button>
      </div>
    );
  }
  return (
    <div>
      <p>You are not signed in.</p>
      <button onClick={() => signIn()}>Sign In</button>
    </div>
  );
}
