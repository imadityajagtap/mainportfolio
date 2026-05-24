import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

/**
 * NextAuth Configuration
 * Handles admin authentication using credentials (email + password)
 */
export const authOptions: NextAuthOptions = {
  // Use JWT session strategy (no database session storage)
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Custom pages
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },

  // Authentication providers
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'admin@example.com',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },

      async authorize(credentials) {
        // Validate credentials exist
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        try {
          // Connect to database
          await connectDB();

          // Find user by email (include password field that's normally excluded)
          const user = await User.findOne({ email: credentials.email }).select(
            '+hashedPassword'
          );

          // Check if user exists
          if (!user) {
            throw new Error('Invalid email or password');
          }

          // Compare provided password with hashed password
          const isPasswordValid = await compare(
            credentials.password,
            user.hashedPassword
          );

          if (!isPasswordValid) {
            throw new Error('Invalid email or password');
          }

          // Return user object (will be encoded in JWT)
          return {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error('Authentication error:', error);

          // Re-throw error for NextAuth to handle
          if (error instanceof Error) {
            throw error;
          }

          throw new Error('Authentication failed');
        }
      },
    }),
  ],

  // Callbacks
  callbacks: {
    /**
     * JWT Callback
     * Runs whenever a JWT is created or updated
     * Add custom properties to the token
     */
    async jwt({ token, user }) {
      // On sign in, user object is available
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },

    /**
     * Session Callback
     * Runs whenever a session is checked (e.g., getServerSession, useSession)
     * Add custom properties from token to session
     */
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }

      return session;
    },
  },

  // Enable debug messages in development
  debug: process.env.NODE_ENV === 'development',
};
