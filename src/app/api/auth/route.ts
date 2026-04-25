import { NextRequest, NextResponse } from 'next/server';
import { getSignature, verifySession } from '@/lib/auth';

export const runtime = 'edge';

const ADMIN_PASSWORD = "neekson2-65";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { password } = body;

    if (password === ADMIN_PASSWORD) {
      const expiry = Date.now() + 86400000; // 24 hours
      const sig = await getSignature(expiry.toString());
      const sessionValue = `${expiry}:${sig}`;

      const response = NextResponse.json({ success: true });
      
      response.cookies.set('admin_session', sessionValue, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24,
        path: '/',
      });

      return response;
    }

    return NextResponse.json({ error: 'INVALID_KEY' }, { status: 401 });
  } catch (e: any) {
    return NextResponse.json({ 
      error: 'AUTH_FAILED', 
      details: e?.message || String(e) 
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = req.cookies.get('admin_session')?.value;
    const isValid = await verifySession(session);
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
