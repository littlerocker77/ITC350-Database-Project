import { NextResponse } from 'next/server';
import { db } from '../../lib/db';

export async function GET() {
  try {
    const [platforms]: any = await db.query('SELECT Platform FROM VideoGame_Platform ORDER BY Platform');
    return NextResponse.json(platforms.map((p: any) => p.Platform));
  } catch (error) {
    console.error('Failed to fetch platforms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch platforms' },
      { status: 500 }
    );
  }
} 