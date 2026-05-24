import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

/**
 * Middleware to protect /admin routes
 *
 * Behavior:
 * - Unauthenticated users accessing /admin/* → redirect to /admin/login
 * - Authenticated users accessing /admin/login → redirect to /admin/dashboard
 * - Authenticated users accessing other /admin/* routes → allowed
 */
export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // If user is authenticated and trying to access login page
    // Redirect to dashboard
    if (token && pathname === '/admin/login') {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }

    // Allow all other requests to proceed
    return NextResponse.next();
  },
  {
    callbacks: {
      // This callback runs before the middleware function
      // Return true to allow the request, false to redirect to login
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Allow access to login page without authentication
        if (pathname === '/admin/login') {
          return true;
        }

        // For all other /admin routes, require authentication
        return !!token;
      },
    },
    pages: {
      signIn: '/admin/login',
    },
  }
);

/**
 * Matcher Configuration
 * Applies middleware only to /admin routes
 */
export const config = {
  matcher: '/admin/:path*',
};
