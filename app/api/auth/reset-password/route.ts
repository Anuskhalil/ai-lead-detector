// app/api/auth/reset-password/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb';
import UserModel from '../../../models/User';
import PasswordResetModel from '../../../models/PasswordReset';
import bcrypt from 'bcryptjs';

/**
 * POST /api/auth/reset-password
 * Reset user's password using token
 */
export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    // Validate input
    if (!token || !password) {
      return NextResponse.json(
        { success: false, error: 'Token and password are required' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      return NextResponse.json(
        { success: false, error: 'Password must contain uppercase, lowercase, and numbers' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find and validate reset token
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
        { success: false, error: 'Reset link has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Find user
    const user = await UserModel.findById(resetToken.userId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user's password
    user.password = hashedPassword;
    await user.save();

    // Delete the used reset token
    await PasswordResetModel.deleteOne({ _id: resetToken._id });

    // Delete all other reset tokens for this user
    await PasswordResetModel.deleteMany({ userId: user._id });

    console.log('✅ Password reset successful for user:', user.email);

    return NextResponse.json({
      success: true,
      message: 'Password reset successful',
    });

  } catch (error: any) {
    console.error('❌ Password reset error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reset password' },
      { status: 500 }
    );
  }
}