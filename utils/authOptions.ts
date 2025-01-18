import { NextAuthOptions } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import { supabaseAdmin } from '@/utils/supabase/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
      CredentialsProvider({
          name: 'Credentials',
          credentials: {
              email: { label: 'Email', type: 'email' },
              password: { label: 'Password', type: 'password' },
          },
          async authorize(credentials) {
            try {
                if (!credentials) {
                    console.error("No credentials provided.");
                    throw new Error("No credentials provided");
                }

                const { email, password } = credentials as { email: string; password: string };

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
    async jwt({ token, user }) {
        if (user) {
          // Store the id from auth.users in the token
          token.authUserId = user.id;

          // Fetch the id from public.users
          const publicUser = await prisma.user.findUnique({
            where: { user_id: user.id }, // user.id is from auth.users
            select: { id: true, role: true },
          });

          if (publicUser) {
            token.publicUserId = publicUser.id; // Add the public.users id to the token
            token.role = publicUser.role; // Add the role to the token
          }
        }
        return token;
      },
      async session({ session, token }) {
        if (session.user) {
          session.user.authUserId = token.authUserId as string; // id from auth.users
          session.user.publicUserId = token.publicUserId as string; // id from public.users
          session.user.role = token.role as string; // role from public.users
        }
        return session;
      },
    },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true
};