/**
 * File Upload API Route
 * This file handles file uploads for the application, specifically for game images.
 * It includes authentication checks and secure file handling.
 */

import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { cookies } from 'next/headers';
import { verifyToken } from '../../lib/auth';

/**
 * POST /api/upload
 * Handles file uploads with authentication and authorization checks.
 * Only authenticated users with userType 1 (admin) can upload files.
 * 
 * Authentication:
 * - Requires a valid JWT token in cookies
 * - User must have userType 1 (admin privileges)
 * 
 * Request:
 * - FormData with a 'file' field containing the file to upload
 * 
 * Returns:
 * - Success: JSON with the URL to access the uploaded file
 * - Error: JSON with error message and appropriate status code
 * 
 * Error Responses:
 * - 401: Not authenticated (no token)
 * - 403: Unauthorized (not admin)
 * - 400: No file uploaded
 * - 500: Server error during upload
 */
export async function POST(request: Request) {
  try {
    // Get the authentication token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    // Check if user is authenticated
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Verify token and check user permissions
    const user = await verifyToken(token.value);
    if (!user || user.userType !== 1) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Extract file from form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    // Validate file presence
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Convert file to buffer for storage
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate a unique filename to prevent collisions
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const filename = `${uniqueSuffix}-${file.name}`;
    
    // Save file to the public/uploads directory
    const path = join(process.cwd(), 'public/uploads', filename);
    await writeFile(path, buffer);

    // Return the public URL for accessing the file
    return NextResponse.json({ 
      url: `/uploads/${filename}` 
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
} 