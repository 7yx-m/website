import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    
    // Cloudflare Pages specific: check process.env AND potentially global env
    let ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD || (globalThis as any).ADMIN_PASSWORD)?.trim();

    // Fallback for local development if not set
    if (!ADMIN_PASSWORD && process.env.NODE_ENV === 'development') {
      ADMIN_PASSWORD = 'admin';
    }

    if (!ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'CONFIG_ERROR: ADMIN_PASSWORD_NOT_SET' },
        { status: 500 }
      );
    }

    if (password === ADMIN_PASSWORD) {
      const response = NextResponse.json({ success: true });
      
      response.cookies.set('admin_session', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24,
        path: '/',
      });

      return response;
    }

    return NextResponse.json({ error: 'AUTH_ERROR: INVALID_KEY' }, { status: 401 });
  } catch (e) {
    return NextResponse.json({ error: 'SYSTEM_ERROR: INVALID_REQUEST' }, { status: 400 });
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
