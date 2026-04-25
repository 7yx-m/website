import { Buffer } from 'buffer';

/**
 * Secure JWT verification using Web Crypto API (Native to Cloudflare Edge)
 */

const base64UrlEncode = (arr: Uint8Array) => {
  return Buffer.from(arr).toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

const base64UrlDecode = (str: string) => {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  return new Uint8Array(Buffer.from(str, 'base64'));
};

export const getSecretKey = async (secret: string) => {
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
};

export const createToken = async (payload: any, secret: string) => {
  try {
    const header = { alg: 'HS256', typ: 'JWT' };
    const headerStr = base64UrlEncode(new TextEncoder().encode(JSON.stringify(header)));
    const payloadStr = base64UrlEncode(new TextEncoder().encode(JSON.stringify({
      ...payload,
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours
    })));

    const key = await getSecretKey(secret);
    const signatureBuffer = await crypto.subtle.sign(
      'HMAC',
      key,
      new TextEncoder().encode(`${headerStr}.${payloadStr}`)
    );
    
    const signatureStr = base64UrlEncode(new Uint8Array(signatureBuffer));
    return `${headerStr}.${payloadStr}.${signatureStr}`;
  } catch (e) {
    throw new Error(`Token creation failed: ${e instanceof Error ? e.message : String(e)}`);
  }
};

export const verifyToken = async (token: string | undefined, secret: string | undefined) => {
  if (!token || !secret) return false;
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    const [headerStr, payloadStr, signatureStr] = parts;
    const key = await getSecretKey(secret);
    const signature = base64UrlDecode(signatureStr);
    
    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signature,
      new TextEncoder().encode(`${headerStr}.${payloadStr}`)
    );
    
    if (!isValid) return false;
    
    const payloadJson = Buffer.from(base64UrlDecode(payloadStr)).toString();
    const payload = JSON.parse(payloadJson);
    return payload.exp > Math.floor(Date.now() / 1000);
  } catch (e) {
    console.error('JWT Verification Error:', e);
    return false;
  }
};
