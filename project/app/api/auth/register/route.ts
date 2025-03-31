import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { hash } from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Check if username already exists
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

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Insert new user (default to regular user type 0)
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