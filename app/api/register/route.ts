// app/api/register/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../lib/mongodb';
import UserModel from '../../models/User';
import bcrypt from 'bcryptjs';

/**
 * POST /api/register
 * Register a new user with enhanced validation
 */
export async function POST(request: NextRequest) {
  try {
    const { name, email, password, marketingEmails } = await request.json();
    
    // Check required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'All fields are required' 
        },
        { status: 400 }
      );
    }

    // Validate name length
    if (name.trim().length < 2) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Name must be at least 2 characters' 
        },
        { status: 400 }
      );
    }

    if (name.trim().length > 100) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Name must not exceed 100 characters' 
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Please provide a valid email address' 
        },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Password must be at least 8 characters' 
        },
        { status: 400 }
      );
    }

    // Optional: Check password complexity
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Password must contain uppercase, lowercase, and numbers' 
        },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await UserModel.findOne({ 
      email: email.toLowerCase().trim() 
    });

    if (existingUser) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'An account with this email already exists' 
        },
        { status: 400 }
      );
    }

    const saltRounds = 12; // Increased from 10 for better security
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await UserModel.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      marketingEmails: marketingEmails || false,
    });

    console.log('✅ User registered successfully:', user.email);

    // ============================================
    // 6. SEND WELCOME EMAIL (Optional)
    // ============================================
    // TODO: Send welcome email here if needed
    // if (user.marketingEmails) {
    //   await sendWelcomeEmail(user.email, user.name);
    // }

    return NextResponse.json({
      success: true,
      message: 'Account created successfully! Please sign in.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        marketingEmails: user.marketingEmails,
      },
    });

  } catch (error: any) {
    console.error('❌ Registration error:', error);

    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'An account with this email already exists' 
        },
        { status: 400 }
      );
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors)
        .map((err: any) => err.message)
        .join(', ');
      
      return NextResponse.json(
        { 
          success: false, 
          error: message 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Registration failed. Please try again.' 
      },
      { status: 500 }
    );
  }
}