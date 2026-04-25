import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    
    // In production, this should be an environment variable
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (!ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Server configuration error: ADMIN_PASSWORD not set.' },
        { status: 500 }
      );
    }

    if (password === ADMIN_PASSWORD) {
      const response = NextResponse.json({ success: true, message: 'Authenticated successfully.' });
      
      // Set a secure, HTTP-only cookie
      response.cookies.set('admin_session', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      });

      return response;
    }

    return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  const session = req.cookies.get('admin_session');
  if (session?.value === 'true') {
    return NextResponse.json({ authenticated: true });
  }
  return NextResponse.json({ authenticated: false });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('admin_session');
  return response;
}
