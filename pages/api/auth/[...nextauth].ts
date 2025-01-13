import NextAuth from 'next-auth';
import { SupabaseAdapter } from '@auth/supabase-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createClient } from '@supabase/supabase-js';

// Supabase setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Sign in with Supabase
        const { data: user, error } = await supabase.auth.signInWithPassword({
          email: credentials?.email ?? '',
          password: credentials?.password ?? '',
        });

        if (user) {
          return user;
        } else {
          throw new Error('Invalid credentials');
        }
      },
    }),
  ],
  adapter: SupabaseAdapter({
    url: supabaseUrl,
    secret: supabaseAnonKey,
  }),
  secret: process.env.NEXTAUTH_SECRET,
});

console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET);
