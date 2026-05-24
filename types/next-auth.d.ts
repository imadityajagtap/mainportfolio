import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT, DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  /**
   * Extends the built-in session types to include custom user properties
   */
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession['user'];
  }

  /**
   * Extends the built-in user types to include custom properties
   */
  interface User extends DefaultUser {
    id: string;
    role: string;
  }
}

declare module 'next-auth/jwt' {
  /**
   * Extends the built-in JWT types to include custom properties
   */
  interface JWT extends DefaultJWT {
    id: string;
    role: string;
  }
}
