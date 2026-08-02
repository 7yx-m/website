import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const ADMIN_PASSWORD = "Neek$on2065";

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch (parseErr) {
      return NextResponse.json({ 
        error: 'PARSE_ERROR',
        details: 'Could not parse JSON body'
      }, { status: 400 });
    }

    const { password } = body;

    if (password === ADMIN_PASSWORD) {
      // Create a session token with expiry timestamp
      const expiryTime = Date.now() + 86400000; // 24 hours
      const sessionValue = expiryTime.toString();

      const response = NextResponse.json({ success: true });
      
      // Set the session cookie - no options that might fail
      response.cookies.set('admin_session', sessionValue);
      
      return response;
    }

    return NextResponse.json({ 
      error: 'INVALID_KEY',
      received: password ? `"${password}"` : 'null',
      expected: `"N---------5"`
    }, { status: 401 });
  } catch (e: any) {
    return NextResponse.json({ 
      error: 'AUTH_CRASH', 
      details: String(e?.message || e) 
    }, { status: 500 });
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
  } catch (e) {
    return NextResponse.json({ authenticated: false });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('admin_session');
  return response;
}
