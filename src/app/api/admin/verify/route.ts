import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest, isAuthenticated } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const sessionToken = await getSessionFromRequest(request);
    const authenticated = isAuthenticated(sessionToken);

    return NextResponse.json({
      success: true,
      authenticated
    });
  } catch (error) {
    console.error('Verify session error:', error);
    return NextResponse.json(
      { success: false, authenticated: false },
      { status: 500 }
    );
  }
}
