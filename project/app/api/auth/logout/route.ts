/**
 * Authentication Logout API Route
 * This file handles user logout functionality by removing the authentication token
 * from the HTTP-only cookie, effectively ending the user's session.
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * POST /api/auth/logout
 * Logs out the current user by removing their authentication token.
 * 
 * Returns:
 * - Success: JSON with success message and removes token cookie
 * - Error: JSON with error message and 500 status code
 * 
 * Response Body (Success):
 * - success: true
 * 
 * Cookie Actions:
 * - Deletes the 'token' cookie, effectively ending the session
 * 
 * Error Response:
 * - 500: Server error during logout process
 */
export async function POST() {
  try {
    // Create success response
    const response = NextResponse.json({ success: true });
    
    // Remove the authentication token cookie
    response.cookies.delete('token');
    
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    );
  }
} 