import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const ADMIN_PASSWORD = "neekson2-65";

/**
 * Deterministic HMAC-SHA256 signature using Web Crypto API
 */
async function getSignature(data: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(ADMIN_PASSWORD),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { password } = body;

    if (password === ADMIN_PASSWORD) {
      // Create a secure session string: "expiry:signature"
      const expiry = Date.now() + 86400000; // 24 hours
      const sig = await getSignature(expiry.toString());
      const sessionValue = `${expiry}:${sig}`;

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

    return NextResponse.json({ error: 'INVALID_KEY' }, { status: 401 });
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

    const [expiry, sig] = session.split(':');
    if (!expiry || !sig) return NextResponse.json({ authenticated: false });

    // Validate expiry and signature
    if (Date.now() > parseInt(expiry)) return NextResponse.json({ authenticated: false });
    
    const expectedSig = await getSignature(expiry);
    const isValid = sig === expectedSig;

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
