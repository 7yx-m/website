import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (!ADMIN_PASSWORD) {
      console.error('ADMIN_PASSWORD environment variable is not set.');
      return NextResponse.json(
        { error: 'SERVER_CONFIGURATION_ERROR' },
        { status: 500 }
      );
    }

    if (password === ADMIN_PASSWORD) {
      const response = NextResponse.json({ success: true });
      
      response.cookies.set('admin_session', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      });

      return response;
    }

    return NextResponse.json({ error: 'INVALID_ACCESS_KEY' }, { status: 401 });
  } catch (e) {
    return NextResponse.json({ error: 'MALFORMED_REQUEST' }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  const session = req.cookies.get('admin_session');
  return NextResponse.json({ authenticated: session?.value === 'true' });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('admin_session');
  return response;
}