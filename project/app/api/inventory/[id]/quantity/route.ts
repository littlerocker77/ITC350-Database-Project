import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { verifyToken } from '../../../../lib/auth';
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
    const { adjustment } = body;

    // Start a transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Get current quantity
      const [gameResult]: any = await connection.query(
        'SELECT Quantity FROM VideoGame WHERE GameID = ?',
        [params.id]
      );

      if (!gameResult.length) {
        throw new Error('Game not found');
      }

      const currentQuantity = gameResult[0].Quantity;
      const newQuantity = Math.max(0, currentQuantity + adjustment);

      // Update quantity
      await connection.query(
        'UPDATE VideoGame SET Quantity = ? WHERE GameID = ?',
        [newQuantity, params.id]
      );

      await connection.commit();
      connection.release();

      return NextResponse.json({ success: true, newQuantity });
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('Failed to adjust quantity:', error);
    return NextResponse.json(
      { error: 'Failed to adjust quantity' },
      { status: 500 }
    );
  }
} 