/**
 * Inventory API Route Handler
 * This module handles PUT and DELETE requests for individual games in the inventory.
 * It includes authentication checks and database operations for updating and deleting games.
 */

import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { verifyToken } from '../../../lib/auth';
import { cookies } from 'next/headers';

/**
 * PUT /api/inventory/[id]
 * Updates an existing game in the inventory.
 * Requires admin authentication.
 * 
 * @param request Request object containing the updated game data
 * @param params Object containing the game ID from the URL
 * @returns NextResponse with success status or error message
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verify user authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Verify admin privileges
    const user = await verifyToken(token.value);
    if (!user || user.userType !== 1) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Extract game data from request body
    const body = await request.json();
    const { GameName, Price, Rating, Genre, Quantity, Platform, ImageUrl } = body;
    const id = params.id;

    console.log('API: Updating game with data:', { id, GameName, Price, Rating, Genre, Quantity, Platform, ImageUrl });

    // Start a database transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Get the PlatformID from the VideoGame_Platform table
      const [platformResult]: any = await connection.query(
        'SELECT PlatformID FROM VideoGame_Platform WHERE Platform = ?',
        [Platform]
      );

      if (!platformResult.length) {
        throw new Error('Invalid platform selected');
      }

      const platformId = platformResult[0].PlatformID;

      // Update the game in the database
      await connection.query(
        'UPDATE VideoGame SET GameName = ?, Price = ?, Rating = ?, Genre = ?, Quantity = ?, PlatformID = ?, ImageUrl = ? WHERE GameID = ?',
        [GameName, Price, Rating, Genre, Quantity, platformId, ImageUrl || null, id]
      );

      console.log('API: Game updated successfully');

      // Commit the transaction
      await connection.commit();
      connection.release();

      return NextResponse.json({ success: true });
    } catch (error) {
      // Rollback the transaction on error
      console.error('API: Transaction error:', error);
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error) {
    // Handle any errors that occur during the update process
    console.error('API: Failed to update game:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update game' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/inventory/[id]
 * Deletes a game from the inventory.
 * Requires admin authentication.
 * 
 * @param request Request object (not used)
 * @param params Object containing the game ID from the URL
 * @returns NextResponse with success status or error message
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verify user authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Verify admin privileges
    const user = await verifyToken(token.value);
    if (!user || user.userType !== 1) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Delete the game from the database
    await db.query('DELETE FROM VideoGame WHERE GameID = ?', [params.id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    // Handle any errors that occur during the deletion process
    console.error('Failed to delete game:', error);
    return NextResponse.json(
      { error: 'Failed to delete game' },
      { status: 500 }
    );
  }
} 