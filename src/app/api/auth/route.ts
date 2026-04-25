import { NextRequest, NextResponse } from 'next/server';
import { getSecretKey, verifyToken } from '@/lib/auth';

export const runtime = 'edge';

const createToken = async (secret: string) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ 
    admin: true, 
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours
  }));
  
  const key = await getSecretKey(secret);
  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(`${header}.${payload}`)
  );
  
  const signature = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
    
  return `${header}.${payload}.${signature}`;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { password } = body;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || (globalThis as any).ADMIN_PASSWORD;

    if (!ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'SERVER_CONFIG_ERROR' }, { status: 500 });
    }

    if (password === ADMIN_PASSWORD) {
      const token = await createToken(ADMIN_PASSWORD);
      const response = NextResponse.json({ success: true });
      
      response.cookies.set('admin_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24,
        path: '/',
      });

      return response;
    }

    return NextResponse.json({ error: 'INVALID_KEY' }, { status: 401 });
  } catch (e) {
    return NextResponse.json({ error: 'AUTH_FAILED' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get('admin_session')?.value;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || (globalThis as any).ADMIN_PASSWORD;

  if (await verifyToken(token, ADMIN_PASSWORD)) {
    return NextResponse.json({ authenticated: true });
  }
  
  return NextResponse.json({ authenticated: false });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('admin_session');
  return response;
}
