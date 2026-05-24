import { NextResponse } from 'next/server';

/**
 * Standardized API response helpers
 * Ensures consistent response format across all API routes
 */

export interface ApiSuccessResponse<T = any> {
  ok: true;
  data: T;
}

export interface ApiErrorResponse {
  ok: false;
  error: {
    message: string;
    details?: string;
    code?: string;
  };
}

/**
 * Success response
 * @param data - The data to return
 * @returns NextResponse with ok:true and data
 */
export function apiSuccess<T>(data: T): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json({
    ok: true,
    data,
  });
}

/**
 * Error response
 * @param status - HTTP status code (400, 404, 500, etc)
 * @param message - User-friendly error message
 * @param details - Additional error details (stack trace in dev, etc)
 * @param code - Optional error code for client-side handling
 * @returns NextResponse with ok:false and error object
 */
export function apiError(
  status: number,
  message: string,
  details?: string,
  code?: string
): NextResponse<ApiErrorResponse> {
  const isDev = process.env.NODE_ENV === 'development';

  return NextResponse.json(
    {
      ok: false,
      error: {
        message,
        ...(isDev && details ? { details } : {}), // Only include details in dev
        ...(code ? { code } : {}),
      },
    },
    { status }
  );
}

/**
 * Error response from caught Error object
 * @param status - HTTP status code
 * @param error - Caught error object
 * @param fallbackMessage - Message to use if error is not an Error instance
 * @returns NextResponse with ok:false and error details
 */
export function apiErrorFromException(
  status: number,
  error: unknown,
  fallbackMessage: string = 'An unexpected error occurred'
): NextResponse<ApiErrorResponse> {
  if (error instanceof Error) {
    return apiError(
      status,
      error.message,
      error.stack,
      error.name
    );
  }

  return apiError(status, fallbackMessage);
}

/**
 * Common error responses
 */
export const apiErrors = {
  unauthorized: () => apiError(401, 'Unauthorized - Authentication required'),
  forbidden: () => apiError(403, 'Forbidden - Insufficient permissions'),
  notFound: (resource: string = 'Resource') => apiError(404, `${resource} not found`),
  badRequest: (message: string) => apiError(400, message),
  invalidId: () => apiError(400, 'Invalid ID format'),
  mongoError: (error: unknown) => {
    if (error instanceof Error) {
      // Handle specific MongoDB errors
      if (error.name === 'MongoServerSelectionError') {
        return apiError(
          503,
          'Database connection failed - please check your network or contact support',
          error.message,
          'DB_CONNECTION_FAILED'
        );
      }
      if (error.name === 'ValidationError') {
        return apiError(400, 'Validation failed', error.message, 'VALIDATION_ERROR');
      }
      return apiErrorFromException(500, error, 'Database operation failed');
    }
    return apiError(500, 'Database operation failed');
  },
};
