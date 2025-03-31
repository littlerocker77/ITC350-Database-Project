import { SignJWT, jwtVerify } from 'jose';
import { db } from './db';
import { RowDataPacket } from 'mysql2';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');

export interface User {
  id: number;
  username: string;
  userType: number;
}

interface UserRow extends RowDataPacket {
  UserID: number;
  UserName: string;
  UserType: number;
}

export async function authenticate(username: string, password: string): Promise<{ token: string; user: User } | null> {
  try {
    const [rows] = await db.execute<UserRow[]>(
      'SELECT UserID, UserName, UserType FROM UserTable WHERE UserName = ? AND Password = ?',
      [username, password]
    );

    if (!rows.length) {
      return null;
    }

    const userData: User = {
      id: rows[0].UserID,
      username: rows[0].UserName,
      userType: rows[0].UserType
    };

    const token = await new SignJWT({ ...userData })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(JWT_SECRET);

    return { token, user: userData };
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

export async function verifyToken(token: string): Promise<User | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      id: payload.id as number,
      username: payload.username as string,
      userType: payload.userType as number
    };
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

export function isAdmin(user: User | null): boolean {
  return user?.userType === 1;
}

export function canModifyInventory(user: User | null): boolean {
  return isAdmin(user);
} 