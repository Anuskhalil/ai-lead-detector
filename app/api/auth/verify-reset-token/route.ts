// app/api/auth/verify-reset-token/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import PasswordResetModel from '../../../models/PasswordReset';

/**
 * GET /api/auth/verify-reset-token?token=xxx
 * Verify if reset token is valid and not expired
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Reset token is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find reset token
    const resetToken = await PasswordResetModel.findOne({ token });

    if (!resetToken) {
      return NextResponse.json(
        { success: false, error: 'Invalid reset token' },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (new Date() > resetToken.expiresAt) {
      // Delete expired token
      await PasswordResetModel.deleteOne({ _id: resetToken._id });
      
      return NextResponse.json(
        { success: false, error: 'Reset link has expired' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Token is valid',
    });

  } catch (error: any) {
    console.error('❌ Token verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify token' },
      { status: 500 }
    );
  }
}