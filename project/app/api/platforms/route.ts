/**
 * Gaming Platforms API Route
 * This file handles operations related to gaming platforms, specifically retrieving
 * the list of available platforms from the VideoGame_Platform table.
 */

import { NextResponse } from 'next/server';
import { db } from '../../lib/db';

/**
 * GET /api/platforms
 * Retrieves a list of all available gaming platforms from the database.
 * 
 * Returns:
 * - Array of platform names (strings) sorted alphabetically
 * - Example: ['Nintendo Switch', 'PC', 'PS5', 'Xbox Series X']
 * 
 * Error Response:
 * - 500 status code with error message if database query fails
 */
export async function GET() {
  try {
    // Query the VideoGame_Platform table to get all platforms
    // Results are ordered alphabetically for consistent display
    const [platforms]: any = await db.query('SELECT Platform FROM VideoGame_Platform ORDER BY Platform');
    
    // Map the results to return just the platform names
    return NextResponse.json(platforms.map((p: any) => p.Platform));
  } catch (error) {
    console.error('Failed to fetch platforms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch platforms' },
      { status: 500 }
    );
  }
} 