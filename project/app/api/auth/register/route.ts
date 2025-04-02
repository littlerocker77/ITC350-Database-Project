/**
 * User Registration API Route
 * This file handles new user registration, including password hashing
 * and username uniqueness validation. New users are created with
 * regular user privileges (UserType 0) by default.
 */

import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { hash } from 'bcryptjs';

/**
 * POST /api/auth/register
 * Registers a new user in the system with secure password handling.
 * 
 * Request Body:
 * - username: Desired username (string)
 * - password: User's password (string)
 * 
 * Returns:
 * - Success: JSON with success message
 * - Error: JSON with error message and appropriate status code
 * 
 * Response Body (Success):
 * - success: true
 * 
 * Security Features:
 * - Password hashing using bcryptjs with salt rounds of 10
 * - Username uniqueness validation
 * - Default user type set to 0 (regular user)
 * 
 * Error Responses:
 * - 400: Missing username or password
 * - 400: Username already taken
 * - 500: Server error during registration
 */
export async function POST(request: Request) {
  try {
    // Extract registration data from request body
    const body = await request.json();
    const { username, password } = body;

    // Validate required fields
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Check if username is already taken
    const [existingUser]: any = await db.query(
      'SELECT UserID FROM UserTable WHERE UserName = ?',
      [username]
    );

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'Username is already taken' },
        { status: 400 }
      );
    }

    // Hash the password using bcryptjs for secure storage
    const hashedPassword = await hash(password, 10);

    // Insert new user into database with default user type 0
    await db.query(
      'INSERT INTO UserTable (UserName, Password, UserType) VALUES (?, ?, 0)',
      [username, hashedPassword]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
} 