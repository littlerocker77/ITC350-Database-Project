/**
 * Game Service
 * This module provides centralized game management functionality.
 */

import { withTransaction, query } from '../lib/db';
import { Connection } from 'mysql2/promise';
import { VideoGame, GameFormData } from '../types/types';

/**
 * Fetches games from the inventory with optional filtering
 * @param platform Optional platform filter
 * @param genre Optional genre filter
 * @returns Array of games
 */
export async function fetchGames(platform?: string, genre?: string): Promise<VideoGame[]> {
  let sql = `
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
  
  const params: any[] = [];
  
  if (platform) {
    sql += ' AND vgp.Platform = ?';
    params.push(platform);
  }
  
  if (genre) {
    sql += ' AND vg.Genre = ?';
    params.push(genre);
  }

  const [rows]: any = await query(sql, params);
  return rows.map((row: any) => ({
    ...row,
    Price: Number(row.Price)
  }));
}

/**
 * Adds a new game to the inventory
 * @param gameData The game data to add
 * @returns The ID of the created game
 */
export async function addGame(gameData: GameFormData): Promise<number> {
  return withTransaction(async (connection: Connection) => {
    const platformId = await getPlatformId(connection, gameData.Platform);
    if (!platformId) {
      throw new Error('Invalid platform selected');
    }

    const [result]: any = await connection.query(
      'INSERT INTO VideoGame (GameName, Price, Rating, Genre, Quantity, PlatformID, ImageUrl) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        gameData.GameName,
        gameData.Price,
        gameData.Rating,
        gameData.Genre,
        gameData.Quantity,
        platformId,
        gameData.ImageUrl || null
      ]
    );

    return result.insertId;
  });
}

/**
 * Updates an existing game in the inventory
 * @param gameId The ID of the game to update
 * @param gameData The updated game data
 * @returns true if update was successful
 */
export async function updateGame(gameId: number, gameData: GameFormData): Promise<boolean> {
  return withTransaction(async (connection: Connection) => {
    const platformId = await getPlatformId(connection, gameData.Platform);
    if (!platformId) {
      throw new Error('Invalid platform selected');
    }

    await connection.query(
      'UPDATE VideoGame SET GameName = ?, Price = ?, Rating = ?, Genre = ?, Quantity = ?, PlatformID = ?, ImageUrl = ? WHERE GameID = ?',
      [
        gameData.GameName,
        gameData.Price,
        gameData.Rating,
        gameData.Genre,
        gameData.Quantity,
        platformId,
        gameData.ImageUrl || null,
        gameId
      ]
    );

    return true;
  });
}

/**
 * Deletes a game from the inventory
 * @param gameId The ID of the game to delete
 * @returns true if deletion was successful
 */
export async function deleteGame(gameId: number): Promise<boolean> {
  await query('DELETE FROM VideoGame WHERE GameID = ?', [gameId]);
  return true;
}

/**
 * Updates the quantity of a game
 * @param gameId The ID of the game
 * @param adjustment The quantity adjustment
 * @returns The new quantity
 */
export async function updateGameQuantity(gameId: number, adjustment: number): Promise<number> {
  return withTransaction(async (connection: Connection) => {
    const [gameResult]: any = await connection.query(
      'SELECT Quantity FROM VideoGame WHERE GameID = ?',
      [gameId]
    );

    if (!gameResult.length) {
      throw new Error('Game not found');
    }

    const currentQuantity = gameResult[0].Quantity;
    const newQuantity = Math.max(0, currentQuantity + adjustment);

    await connection.query(
      'UPDATE VideoGame SET Quantity = ? WHERE GameID = ?',
      [newQuantity, gameId]
    );

    return newQuantity;
  });
}

/**
 * Gets the platform ID for a given platform name
 * @param connection The database connection
 * @param platform The platform name
 * @returns The platform ID or null if not found
 */
async function getPlatformId(connection: Connection, platform: string): Promise<number | null> {
  const [result]: any = await connection.query(
    'SELECT PlatformID FROM VideoGame_Platform WHERE Platform = ?',
    [platform]
  );
  return result.length ? result[0].PlatformID : null;
}

/**
 * Fetches all unique platforms
 * @returns Array of platform names
 */
export async function fetchPlatforms(): Promise<string[]> {
  const [rows]: any = await query(
    'SELECT DISTINCT Platform FROM VideoGame_Platform ORDER BY Platform'
  );
  return rows.map((row: any) => row.Platform);
} 