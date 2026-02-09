// app/api/auth/forgot-password/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import UserModel from '../../../models/User';
import PasswordResetModel from '../../../models/PasswordReset';
import crypto from 'crypto';

/**
 * POST /api/auth/forgot-password
 * Send password reset email
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate input
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find user
    const user = await UserModel.findOne({ 
      email: email.toLowerCase().trim() 
    });

    if (!user) {
      console.log('❌ Password reset requested for non-existent email:', email);
      // Still return success to prevent revealing user existence
      return NextResponse.json({
        success: true,
        message: 'If that email exists, we sent a reset link',
      });
    }

    // Generate secure random token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Set expiration to 1 hour from now
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    // Delete any existing reset tokens for this user
    await PasswordResetModel.deleteMany({ userId: user._id });

    // Create new reset token
    await PasswordResetModel.create({
      userId: user._id,
      token: resetToken,
      expiresAt,
    });

    // Create reset URL
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

    console.log('✅ Password reset token created for:', user.email);
    console.log('📧 Reset URL:', resetUrl);

    if (process.env.NODE_ENV === 'development') {
      console.log('');
      console.log('========================================');
      console.log('PASSWORD RESET LINK (Development Only):');
      console.log(resetUrl);
      console.log('========================================');
      console.log('');
    }

    return NextResponse.json({
      success: true,
      message: 'Password reset link sent to your email',
      // ONLY include this in development
      ...(process.env.NODE_ENV === 'development' && { resetUrl }),
    });

  } catch (error: any) {
    console.error('❌ Forgot password error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}