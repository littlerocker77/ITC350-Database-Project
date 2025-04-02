/**
 * Inventory Management API Routes
 * This file handles all inventory-related operations including fetching and adding video games.
 */

import { NextResponse } from 'next/server';
import { db } from '../../lib/db';

/**
 * GET /api/inventory
 * Retrieves a list of video games from the inventory with optional filtering by platform and genre.
 * 
 * Query Parameters:
 * - platform: Filter games by platform (e.g., 'PS5', 'Xbox', 'Switch')
 * - genre: Filter games by genre (e.g., 'Action', 'RPG', 'Sports')
 * 
 * Returns:
 * - Array of video games with their details
 * - Each game includes: GameID, GameName, Price, Rating, Genre, Quantity, ImageUrl, Platform
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');
    const genre = searchParams.get('genre');
    
    // Base query to join VideoGame and VideoGame_Platform tables
    let query = `
      SELECT 
        vg.GameID,
        vg.GameName,
        CAST(vg.Price AS DECIMAL(10,2)) as Price,
        vg.Rating,
        vg.Genre,
        vg.Quantity,
        vg.ImageUrl,
        vgp.Platform
      FROM VideoGame vg
      JOIN VideoGame_Platform vgp ON vg.PlatformID = vgp.PlatformID
      WHERE 1=1
    `;
    
    const queryParams: any[] = [];
    
    // Add platform filter if specified
    if (platform) {
      query += ' AND vgp.Platform = ?';
      queryParams.push(platform);
    }
    
    // Add genre filter if specified
    if (genre) {
      query += ' AND vg.Genre = ?';
      queryParams.push(genre);
    }

    const [rows]: any = await db.query(query, queryParams);
    
    // Convert price from string to number for proper JSON serialization
    const formattedRows = rows.map((row: any) => ({
      ...row,
      Price: Number(row.Price)
    }));
    
    return NextResponse.json(formattedRows);
  } catch (error) {
    console.error('Failed to fetch inventory:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/inventory
 * Adds a new video game to the inventory.
 * 
 * Request Body:
 * - GameName: Name of the video game
 * - Price: Price of the game (numeric)
 * - Rating: Game rating (numeric)
 * - Genre: Game genre (string)
 * - Quantity: Number of copies in stock
 * - Platform: Gaming platform (must match existing platform in VideoGame_Platform table)
 * - ImageUrl: URL to game's image (optional)
 * 
 * Returns:
 * - success: boolean indicating if the operation was successful
 * - gameId: ID of the newly created game
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { GameName, Price, Rating, Genre, Quantity, Platform, ImageUrl } = body;
    
    console.log('API: Received game data:', { GameName, Price, Rating, Genre, Quantity, Platform, ImageUrl });

    // Start a database transaction to ensure data consistency
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Validate and get the PlatformID from VideoGame_Platform table
      const [platformResult]: any = await connection.query(
        'SELECT PlatformID FROM VideoGame_Platform WHERE Platform = ?',
        [Platform]
      );

      if (!platformResult.length) {
        throw new Error('Invalid platform selected');
      }

      const platformId = platformResult[0].PlatformID;
      console.log('API: Found platform ID:', platformId);

      // Insert the new game into the VideoGame table
      const [result]: any = await connection.query(
        'INSERT INTO VideoGame (GameName, Price, Rating, Genre, Quantity, PlatformID, ImageUrl) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [GameName, Price, Rating, Genre, Quantity, platformId, ImageUrl || null]
      );

      console.log('API: Game added successfully with ID:', result.insertId);

      // Commit the transaction and release the connection
      await connection.commit();
      connection.release();

      return NextResponse.json({ success: true, gameId: result.insertId });
    } catch (error) {
      // Rollback the transaction in case of any errors
      console.error('API: Transaction error:', error);
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('API: Failed to add game:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to add game' },
      { status: 500 }
    );
  }
} 