/**
 * User Service
 * This module provides centralized user management functionality.
 */

import { hash } from 'bcryptjs';
import { withTransaction, query } from '../lib/db';
import { Connection } from 'mysql2/promise';

interface UserUpdateData {
  username?: string;
  password?: string;
}

/**
 * Updates a user's profile information
 * @param userId The ID of the user to update
 * @param data The data to update
 * @returns true if update was successful
 */
export async function updateUser(userId: number, data: UserUpdateData): Promise<boolean> {
  return withTransaction(async (connection: Connection) => {
    if (data.username) {
      await updateUsername(connection, userId, data.username);
    }

    if (data.password) {
      await updatePassword(connection, userId, data.password);
    }

    return true;
  });
}

/**
 * Updates a user's username
 * @param connection The database connection
 * @param userId The ID of the user
 * @param username The new username
 */
async function updateUsername(
  connection: Connection,
  userId: number,
  username: string
): Promise<void> {
  // Check if username exists
  const [existingUser]: any = await connection.query(
    'SELECT UserID FROM UserTable WHERE UserName = ? AND UserID != ?',
    [username, userId]
  );

  if (existingUser.length > 0) {
    throw new Error('Username is already taken');
  }

  await connection.query(
    'UPDATE UserTable SET UserName = ? WHERE UserID = ?',
    [username, userId]
  );
}

/**
 * Updates a user's password
 * @param connection The database connection
 * @param userId The ID of the user
 * @param password The new password
 */
async function updatePassword(
  connection: Connection,
  userId: number,
  password: string
): Promise<void> {
  const hashedPassword = await hash(password, 10);
  await connection.query(
    'UPDATE UserTable SET Password = ? WHERE UserID = ?',
    [hashedPassword, userId]
  );
}

/**
 * Checks if a username exists
 * @param username The username to check
 * @returns true if username exists
 */
export async function usernameExists(username: string): Promise<boolean> {
  const [rows]: any = await query(
    'SELECT UserID FROM UserTable WHERE UserName = ?',
    [username]
  );
  return rows.length > 0;
}

/**
 * Creates a new user
 * @param username The username
 * @param password The password
 * @param userType The user type (0 for regular user, 1 for admin)
 * @returns The ID of the created user
 */
export async function createUser(
  username: string,
  password: string,
  userType: number = 0
): Promise<number> {
  const hashedPassword = await hash(password, 10);
  const [result]: any = await query(
    'INSERT INTO UserTable (UserName, Password, UserType) VALUES (?, ?, ?)',
    [username, hashedPassword, userType]
  );
  return result.insertId;
} 