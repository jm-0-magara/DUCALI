import { NextRequest, NextResponse } from 'next/server';
import { validateToken, generateJWT } from '../../../../lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Get token from cookie or header
    const token = request.cookies.get('auth-token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    // Validate existing token
    const result = await validateToken(token);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      );
    }

    // Generate new token
    const newToken = generateJWT({
      userId: result.user!.id,
      email: result.user!.email,
      role: result.user!.role,
    });

    // Set new token in cookie
    const response = NextResponse.json({
      success: true,
      user: result.user,
      message: 'Token refreshed successfully'
    });

    response.cookies.set('auth-token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
