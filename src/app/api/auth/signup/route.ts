import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from '../../../../lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      email, 
      password, 
      name, 
      role, 
      phone, 
      location, 
      bio, 
      specialty, 
      category 
    } = body;

    // Validate required fields
    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: 'Email, password, name, and role are required' },
        { status: 400 }
      );
    }

    // Validate role
    if (!['CUSTOMER', 'ARTISAN'].includes(role)) {
      return NextResponse.json(
        { error: 'Role must be either CUSTOMER or ARTISAN' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Register user
    const result = await registerUser({
      email,
      password,
      name,
      role,
      phone,
      location,
      bio,
      specialty,
      category,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    // Set HTTP-only cookie with JWT token
    const response = NextResponse.json({
      success: true,
      user: result.user,
      message: 'Registration successful'
    });

    // Set secure cookie with JWT token
    response.cookies.set('auth-token', result.token!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
