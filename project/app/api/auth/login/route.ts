/**
 * Authentication Login API Route
 * This file handles user authentication and login functionality.
 * It validates user credentials and sets a secure HTTP-only cookie
 * containing the JWT token upon successful authentication.
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { authenticate } from '../../../lib/auth';

/**
 * POST /api/auth/login
 * Authenticates a user and creates a secure session.
 * 
 * Request Body:
 * - username: User's username (string)
 * - password: User's password (string)
 * 
 * Returns:
 * - Success: JSON with user information and sets HTTP-only cookie
 * - Error: JSON with error message and appropriate status code
 * 
 * Response Body (Success):
 * - message: Success message
 * - user: Object containing user details (id, username, userType)
 * 
 * Cookie Settings:
 * - httpOnly: true (prevents JavaScript access)
 * - secure: true in production (HTTPS only)
 * - sameSite: 'strict' (prevents CSRF attacks)
 * - maxAge: 24 hours
 * 
 * Error Responses:
 * - 400: Missing username or password
 * - 401: Invalid credentials
 * - 500: Server error during authentication
 */
export async function POST(request: Request) {
  try {
    // Extract credentials from request body
    const body = await request.json();
    const { username, password } = body;

    // Validate required fields
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Attempt to authenticate user
    const result = await authenticate(username, password);
    if (!result) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Extract token and user data from authentication result
    const { token, user } = result;
    
    // Create success response with user information
    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        userType: user.userType
      }
    });

    // Set secure HTTP-only cookie with JWT token
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
} 