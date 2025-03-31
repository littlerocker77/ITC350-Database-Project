import { SignJWT, jwtVerify } from 'jose';
import { db } from './db';
import { compare } from 'bcryptjs';
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
  Password: string;
}

export async function authenticate(username: string, password: string): Promise<{ token: string; user: User } | null> {
  try {
    const [rows] = await db.execute<UserRow[]>(
      'SELECT UserID, UserName, UserType, Password FROM UserTable WHERE UserName = ?',
      [username]
    );

    if (!rows.length) {
      return null;
    }

    const user = rows[0];
    const isValidPassword = await compare(password, user.Password);

    if (!isValidPassword) {
      return null;
    }

    const userData: User = {
      id: user.UserID,
      username: user.UserName,
      userType: user.UserType
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