import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// ✅ Use an environment variable — set this in Cloudflare Pages dashboard
// Settings → Environment Variables → ADMIN_PASSWORD
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function POST(req: NextRequest) {
  try {
    if (!ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'SERVER_MISCONFIGURED' },
        { status: 500 }
      );
    }

    let body: { password?: string } = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: 'PARSE_ERROR', details: 'Could not parse JSON body' },
        { status: 400 }
      );
    }

    const { password } = body;

    if (password === ADMIN_PASSWORD) {
      const expiryTime = Date.now() + 86400000; // 24 hours

      // ✅ Set cookie options explicitly — required for Cloudflare Workers
      const response = NextResponse.json({ success: true });
      response.cookies.set('admin_session', expiryTime.toString(), {
        httpOnly: true,   // not accessible via JS
        secure: true,     // HTTPS only
        sameSite: 'strict',
        path: '/',
        maxAge: 86400,    // 24 hours in seconds
      });

      return response;
    }

    // ✅ Never reveal the expected password in the response
    return NextResponse.json(
      { error: 'INVALID_KEY' },
      { status: 401 }
    );
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { error: 'AUTH_CRASH', details: message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const cookieValue = req.cookies.get('admin_session')?.value;
    if (!cookieValue) {
      return NextResponse.json({ authenticated: false });
    }

    const expiryNum = parseInt(cookieValue, 10);
    if (isNaN(expiryNum)) {
      return NextResponse.json({ authenticated: false });
    }

    const isValid = Date.now() <= expiryNum;
    return NextResponse.json({ authenticated: isValid });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('admin_session');
  return response;
}