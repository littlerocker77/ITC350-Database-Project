import mysql from 'mysql2/promise';
import { Connection } from 'mysql2/promise';

if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
  throw new Error('Database configuration not found in environment variables');
}

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

/**
 * Executes a query on the database pool
 * @param sql The SQL query to execute
 * @param params The parameters for the query
 * @returns The query results
 */
export async function query(sql: string, params: any[] = []) {
  try {
    const [results] = await db.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
}

/**
 * Executes a function within a database transaction
 * @param callback The function to execute within the transaction
 * @returns The result of the callback function
 */
export async function withTransaction<T>(callback: (connection: Connection) => Promise<T>): Promise<T> {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Test function to verify connection
export async function testConnection() {
  try {
    const connection = await db.getConnection();
    console.log('Successfully connected to database');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
} 