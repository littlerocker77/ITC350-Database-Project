import { hash, compare } from 'bcryptjs';
import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: '172.16.33.5',
  user: 'peeegamesdbadmin',
  password: 'peeegames',
  database: 'peeegames'
});

export async function authenticateUser(username: string, password: string) {
  try {
    const [rows]: any = await db.query(
      'SELECT UserID, Password, UserType, UserName FROM User WHERE UserName = ?',
      [username]
    );

    if (rows.length === 0) {
      return null;
    }

    const user = rows[0];
    const isValid = await compare(password, user.Password);

    if (!isValid) {
      return null;
    }

    return {
      id: user.UserID,
      username: user.UserName,
      userType: user.UserType
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
} 