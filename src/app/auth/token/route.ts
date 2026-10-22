// RESPONSIBILITY: Encapsulates logic, UI, or types for this module.
// DATA FLOW: Standard component data flow.
// RESPONSIBILITY: route.ts handles the logic and UI for its corresponding feature.
import { NextRequest, NextResponse } from 'next/server';
import { StatusCodes } from 'http-status-codes';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('gymsmart_token')?.value;
  const refreshToken = req.cookies.get('gymsmart_refresh_token')?.value;
  if (!token) return NextResponse.json({ token: null, refreshToken: null }, { status: StatusCodes.UNAUTHORIZED });
  return NextResponse.json({ token, refreshToken });
}

