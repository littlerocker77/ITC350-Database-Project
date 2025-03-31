import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '../../../lib/auth';
import { db } from '../../../lib/db';
import { hash } from 'bcryptjs';

export async function PUT(request: Request) {
  try {
    // Verify user is authenticated
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = await verifyToken(token.value);
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, username, password } = body;

    // Verify user is updating their own profile
    if (user.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Start a transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      if (username) {
        // Check if username is already taken
        const [existingUser]: any = await connection.query(
          'SELECT UserID FROM UserTable WHERE UserName = ? AND UserID != ?',
          [username, userId]
        );

        if (existingUser.length > 0) {
          throw new Error('Username is already taken');
        }

        // Update username
        await connection.query(
          'UPDATE UserTable SET UserName = ? WHERE UserID = ?',
          [username, userId]
        );
      }

      if (password) {
        // Hash the new password
        const hashedPassword = await hash(password, 10);
        
        // Update password
        await connection.query(
          'UPDATE UserTable SET Password = ? WHERE UserID = ?',
          [hashedPassword, userId]
        );
      }

      await connection.commit();
      connection.release();

      return NextResponse.json({ success: true });
    } catch (error) {
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