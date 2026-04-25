import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const ADMIN_PASSWORD = "neekson2-65";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { password } = body;

    if (password === ADMIN_PASSWORD) {
      // Create a session token with expiry timestamp
      const expiry = Date.now() + 86400000; // 24 hours
      const sessionValue = expiry.toString();

      const response = NextResponse.json({ success: true });
      
      // Set the session cookie
      response.cookies.set('admin_session', sessionValue, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24,
        path: '/',
      });

      return response;
    }

    return NextResponse.json({ 
      error: 'INVALID_KEY',
      received: password ? `"${password}"` : 'null',
      expected: `"${ADMIN_PASSWORD}"`
    }, { status: 401 });
  } catch (e: any) {
    // Return the actual error message to help us debug
    return NextResponse.json({ 
      error: 'AUTH_CRASH', 
      details: e?.message || String(e) 
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = req.cookies.get('admin_session')?.value;
    if (!session) return NextResponse.json({ authenticated: false });

    const expiry = parseInt(session);
    if (isNaN(expiry)) return NextResponse.json({ authenticated: false });

    // Validate expiry
    const isValid = Date.now() <= expiry;
    return NextResponse.json({ authenticated: isValid });
  } catch (e) {
    return NextResponse.json({ authenticated: false });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('admin_session');
  return response;
}
