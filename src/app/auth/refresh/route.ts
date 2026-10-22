// RESPONSIBILITY: Encapsulates logic, UI, or types for this module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: route.ts handles the logic and UI for its corresponding feature.
import { NextRequest, NextResponse } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { AuthUrlConfig } from '@/app/auth/auth_url_config';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get('gymsmart_refresh_token')?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: 'No refresh token' }, { status: StatusCodes.UNAUTHORIZED });
  }

  try {
    const backendRes = await fetch(`${BASE_URL}${AuthUrlConfig.BACKEND_API.REFRESH}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    if (!backendRes.ok) {
      return NextResponse.json({ error: 'Refresh failed' }, { status: StatusCodes.UNAUTHORIZED });
    }

    const json = await backendRes.json();
    const { accessToken, refreshToken: newRefreshToken } = json.data;

    const res = NextResponse.json({ success: true, accessToken });

    res.cookies.set('gymsmart_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 15, // 15 mins
      path: '/',
    });

    if (newRefreshToken) {
      res.cookies.set('gymsmart_refresh_token', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });
    }

    return res;
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid refresh token' }, { status: 401 });
  }
}

