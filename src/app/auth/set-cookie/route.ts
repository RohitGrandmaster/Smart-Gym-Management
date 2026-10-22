import { NextRequest, NextResponse } from 'next/server';
import { StatusCodes } from 'http-status-codes';

export async function POST(req: NextRequest) {
  const { token, refreshToken, user } = await req.json();
  if (!token) return NextResponse.json({ error: 'No token' }, { status: StatusCodes.BAD_REQUEST });

  const res = NextResponse.json({ success: true });

  res.cookies.set('gymsmart_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 15, // 15 minutes matching backend access token
    path: '/',
  });

  if (refreshToken) {
    res.cookies.set('gymsmart_refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days matching backend refresh token
      path: '/',
    });
  }

  if (user) {
    res.cookies.set('gymsmart_user', JSON.stringify({ name: user?.name, email: user?.email, role: user?.role, tenantId: user?.tenantId }), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
  }

  return res;
}

