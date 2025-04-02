/**
 * User Profile Update API Route
 * This file handles updating user profile information including username
 * and password changes. It includes authentication checks and secure
 * password handling using transactions for data consistency.
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '../../../lib/auth';
import { db } from '../../../lib/db';
import { hash } from 'bcryptjs';

/**
 * PUT /api/user/update
 * Updates a user's profile information with authentication and validation.
 * 
 * Authentication:
 * - Requires a valid JWT token in cookies
 * - User can only update their own profile
 * 
 * Request Body:
 * - userId: ID of the user to update (must match authenticated user)
 * - username: New username (optional)
 * - password: New password (optional)
 * 
 * Returns:
 * - Success: JSON with success message
 * - Error: JSON with error message and appropriate status code
 * 
 * Response Body (Success):
 * - success: true
 * 
 * Security Features:
 * - JWT token verification
 * - Password hashing using bcryptjs
 * - Transaction-based updates for data consistency
 * - Username uniqueness validation
 * - Self-only profile updates
 * 
 * Error Responses:
 * - 401: Not authenticated or invalid token
 * - 403: Attempting to update another user's profile
 * - 400: Username already taken
 * - 500: Server error during update
 */
export async function PUT(request: Request) {
  try {
    // Verify user is authenticated
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Verify token and get user information
    const user = await verifyToken(token.value);
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Extract update data from request body
    const body = await request.json();
    const { userId, username, password } = body;

    // Ensure user can only update their own profile
    if (user.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Start a database transaction for atomic updates
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Handle username update if provided
      if (username) {
        // Check if new username is already taken by another user
        const [existingUser]: any = await connection.query(
          'SELECT UserID FROM UserTable WHERE UserName = ? AND UserID != ?',
          [username, userId]
        );

        if (existingUser.length > 0) {
          throw new Error('Username is already taken');
        }

        // Update username in database
        await connection.query(
          'UPDATE UserTable SET UserName = ? WHERE UserID = ?',
          [username, userId]
        );
      }

      // Handle password update if provided
      if (password) {
        // Hash the new password for secure storage
        const hashedPassword = await hash(password, 10);
        
        // Update password in database
        await connection.query(
          'UPDATE UserTable SET Password = ? WHERE UserID = ?',
          [hashedPassword, userId]
        );
      }

      // Commit the transaction and release the connection
      await connection.commit();
      connection.release();

      return NextResponse.json({ success: true });
    } catch (error) {
      // Rollback transaction on error and release connection
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('Failed to update user:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update user' },
      { status: 500 }
    );
  }
} 