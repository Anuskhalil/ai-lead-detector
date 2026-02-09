// app/api/auth/[...nextauth]/route.ts

import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectDB } from '../../../lib/mongodb';
import UserModel from '../../../models/User';
import bcrypt from 'bcryptjs';

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

          if (!credentials?.email || !credentials?.password) {
            throw new Error('Please enter your email and password');
          }

          await connectDB();

          const user = await UserModel.findOne({ 
            email: credentials.email.toLowerCase().trim() 
          });

          if (!user) {
            console.log('❌ User not found:', credentials.email);
            throw new Error('Invalid email or password');
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            console.log('❌ Invalid password for user:', credentials.email);
            throw new Error('Invalid email or password');
          }

          console.log('✅ User logged in successfully:', user.email);

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
          };

        } catch (error: any) {
          console.error('❌ Authentication error:', error.message);
          throw error;
        }
      },
    }),
  ],
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/login', 
  },
  
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
      }
      return session;
    },
  },
  
  secret: process.env.NEXTAUTH_SECRET,
  
  // Debug mode (disable in production)
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };