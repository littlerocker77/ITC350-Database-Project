import { NextResponse } from 'next/server';
import { db } from '../../lib/db';
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');
    const genre = searchParams.get('genre');
    
    let query = `
      SELECT 
        vg.GameID,
        vg.GameName,
        CAST(vg.Price AS DECIMAL(10,2)) as Price,
        vg.Rating,
        vg.Genre,
        vg.Quantity,
        vgp.Platform
      FROM VideoGame vg
      JOIN VideoGame_Platform vgp ON vg.PlatformID = vgp.PlatformID
      WHERE 1=1
    `;
    
    const queryParams: any[] = [];
    
    if (platform) {
      query += ' AND vgp.Platform = ?';
      queryParams.push(platform);
    }
    
    if (genre) {
      query += ' AND vg.Genre = ?';
      queryParams.push(genre);
    }

    const [rows]: any = await db.query(query, queryParams);
    
    // Format the price as a number
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { GameName, Price, Rating, Genre, Quantity, Platform } = body;

    // Start a transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // First get the PlatformID from VideoGame_Platform table
      const [platformResult]: any = await connection.query(
        'SELECT PlatformID FROM VideoGame_Platform WHERE Platform = ?',
        [Platform]
      );

      if (!platformResult.length) {
        throw new Error('Invalid platform selected');
      }

      const platformId = platformResult[0].PlatformID;

      // Insert into VideoGame table with PlatformID
      const [result]: any = await connection.query(
        'INSERT INTO VideoGame (GameName, Price, Rating, Genre, Quantity, PlatformID) VALUES (?, ?, ?, ?, ?, ?)',
        [GameName, Price, Rating, Genre, Quantity, platformId]
      );

      await connection.commit();
      connection.release();

      return NextResponse.json({ success: true, gameId: result.insertId });
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('Failed to add game:', error);
    return NextResponse.json(
      { error: 'Failed to add game' },
      { status: 500 }
    );
  }
} 