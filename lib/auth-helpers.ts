import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';

/**
 * Helper function to check authentication in API routes
 * Returns NextResponse with 401 if not authenticated, null if authenticated
 *
 * Usage:
 * ```typescript
 * const authError = await requireAuth();
 * if (authError) return authError;
 * ```
 */
export async function requireAuth() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      {
        success: false,
        error: 'Unauthorized - Authentication required',
      },
      { status: 401 }
    );
  }

  return null;
}

/**
 * Helper function to get the current session
 * Returns the session or throws an error if not authenticated
 */
export async function getAuthSession() {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error('Unauthorized');
  }

  return session;
}
