/**
 * Authentication Middleware
 * This module provides helper functions for authentication and authorization checks.
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken, User } from '../lib/auth';

/**
 * Checks if the user is authenticated and returns the user object
 * @param request The incoming request
 * @returns User object if authenticated, or NextResponse with error if not
 */
export async function requireAuth(request: Request): Promise<User | NextResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const user = await verifyToken(token.value);
  if (!user) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  return user;
}

/**
 * Checks if the user is an admin and returns the user object
 * @param request The incoming request
 * @returns User object if admin, or NextResponse with error if not
 */
export async function requireAdmin(request: Request): Promise<User | NextResponse> {
  const authResult = await requireAuth(request);
  
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  if (authResult.userType !== 1) {
    return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
  }

  return authResult;
}

/**
 * Creates a standardized error response
 * @param error The error object
 * @param message The error message
 * @param status The HTTP status code
 * @returns NextResponse with error details
 */
export function createErrorResponse(error: unknown, message: string, status: number = 500): NextResponse {
  console.error(message, error);
  return NextResponse.json(
    { error: error instanceof Error ? error.message : message },
    { status }
  );
}

/**
 * Creates a standardized success response
 * @param data The response data
 * @param status The HTTP status code
 * @returns NextResponse with success data
 */
export function createSuccessResponse<T>(data: T, status: number = 200): NextResponse {
  return NextResponse.json(data, { status });
} 