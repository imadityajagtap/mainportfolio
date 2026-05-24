import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * NextAuth API Route Handler
 * Handles all auth-related requests:
 * - /api/auth/signin (login)
 * - /api/auth/signout (logout)
 * - /api/auth/session (get current session)
 * - /api/auth/csrf (CSRF token)
 * - /api/auth/providers (available providers)
 * - /api/auth/callback/* (OAuth callbacks)
 */
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
