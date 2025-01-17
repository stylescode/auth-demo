import { NextAuthOptions } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import { supabaseAdmin } from '@/utils/supabase/server';

export const authOptions: NextAuthOptions = {
  providers: [
      CredentialsProvider({
          name: 'Credentials',
          credentials: {
              email: { label: 'Email', type: 'email' },
              password: { label: 'Password', type: 'password' },
          },
          async authorize(credentials) {
            console.log('credentials')
            try {
                if (!credentials) {
                    console.error("No credentials provided.");
                    throw new Error("No credentials provided");
                }

                const { email, password } = credentials as { email: string; password: string };

                console.log("Attempting to sign in with:", { email });

                const { data, error } = await supabaseAdmin.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) {
                    console.error("Supabase sign-in error:", error.message);
                    throw new Error(error.message || "Invalid credentials");
                }

                if (!data.user) {
                    console.error("No user returned during sign-in:", data);
                    throw new Error("Invalid credentials");
                }

                console.log("User successfully signed in:", data.user);

                return { id: data.user.id, email: data.user.email };
            } catch (err) {
                console.error("Authorize function error:", err);
                throw err;
            }
        }
      }),
  ],
  session: {
      strategy: 'jwt',
  },
  callbacks: {
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        }
    },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true
};