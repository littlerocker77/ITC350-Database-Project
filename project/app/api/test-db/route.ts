import { NextResponse } from 'next/server';
import { db, testConnection } from '../../lib/db';

export async function GET() {
  try {
    // First test the connection
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Failed to establish database connection');
    }

    // If connected, try a simple query
    const [result] = await db.query('SELECT 1 as test');
    
    return NextResponse.json({
      status: 'Database connected successfully',
      result,
      connection_info: {
        host: '172.16.33.5',
        database: 'peeegames',
        user: 'blueteam'
      }
    });
  } catch (error: any) {
    console.error('Database connection error:', error);
    return NextResponse.json({
      error: 'Failed to connect to database',
      details: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    }, { status: 500 });
  }
} 