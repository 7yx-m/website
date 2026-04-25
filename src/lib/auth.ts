/**
 * Secure JWT verification using Web Crypto API (Native to Cloudflare Edge)
 * Extremely minimal implementation to avoid dependency issues.
 */

const uint8ArrayToBase64Url = (arr: Uint8Array) => {
  let bin = '';
  for (let i = 0; i < arr.byteLength; i++) {
    bin += String.fromCharCode(arr[i]);
  }
  return btoa(bin)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

const base64UrlToUint8Array = (str: string) => {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  const bin = atob(str);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    arr[i] = bin.charCodeAt(i);
  }
  return arr;
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
  const header = { alg: 'HS256', typ: 'JWT' };
  const headerStr = uint8ArrayToBase64Url(new TextEncoder().encode(JSON.stringify(header)));
  const payloadStr = uint8ArrayToBase64Url(new TextEncoder().encode(JSON.stringify({
    ...payload,
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24)
  })));

  const key = await getSecretKey(secret);
  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(`${headerStr}.${payloadStr}`)
  );
  
  const signatureStr = uint8ArrayToBase64Url(new Uint8Array(signatureBuffer));
  return `${headerStr}.${payloadStr}.${signatureStr}`;
};

export const verifyToken = async (token: string | undefined, secret: string | undefined) => {
  if (!token || !secret) return false;
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    const [headerStr, payloadStr, signatureStr] = parts;
    const key = await getSecretKey(secret);
    const signature = base64UrlToUint8Array(signatureStr);
    
    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signature,
      new TextEncoder().encode(`${headerStr}.${payloadStr}`)
    );
    
    if (!isValid) return false;
    
    const payload = JSON.parse(new TextDecoder().decode(base64UrlToUint8Array(payloadStr)));
    return payload.exp > Math.floor(Date.now() / 1000);
  } catch (e) {
    return false;
  }
};
