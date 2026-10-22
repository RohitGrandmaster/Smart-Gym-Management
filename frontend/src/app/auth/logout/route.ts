// RESPONSIBILITY: Encapsulates logic, UI, or types for this module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: route.ts handles the logic and UI for its corresponding feature.
import { NextRequest, NextResponse } from 'next/server';
import { AuthUrlConfig } from '@/app/auth/auth_url_config';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function POST(req: NextRequest) {
  const token = req.cookies.get('gymsmart_token')?.value;
  if (token) {
    try {
      await fetch(`${BASE_URL}${AuthUrlConfig.BACKEND_API.LOGOUT}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch {
      // Ignore backend logout errors, just clear local cookies
    }
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set('gymsmart_token', '', { httpOnly: true, maxAge: 0, path: '/' });
  res.cookies.set('gymsmart_refresh_token', '', { httpOnly: true, maxAge: 0, path: '/' });
  res.cookies.set('gymsmart_user', '', { httpOnly: false, maxAge: 0, path: '/' });

  return res;
}

