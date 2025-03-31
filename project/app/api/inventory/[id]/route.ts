import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { verifyToken } from '../../../lib/auth';
import { cookies } from 'next/headers';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = await verifyToken(token.value);
    if (!user || user.userType !== 1) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

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

      // Update the VideoGame table
      await connection.query(
        'UPDATE VideoGame SET GameName = ?, Price = ?, Rating = ?, Genre = ?, Quantity = ?, PlatformID = ? WHERE GameID = ?',
        [GameName, Price, Rating, Genre, Quantity, platformId, params.id]
      );

      await connection.commit();
      connection.release();

      return NextResponse.json({ success: true });
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('Failed to update game:', error);
    return NextResponse.json(
      { error: 'Failed to update game' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = await verifyToken(token.value);
    if (!user || user.userType !== 1) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await db.query('DELETE FROM VideoGame WHERE GameID = ?', [params.id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete game:', error);
    return NextResponse.json(
      { error: 'Failed to delete game' },
      { status: 500 }
    );
  }
} 