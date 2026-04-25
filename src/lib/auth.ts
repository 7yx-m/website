/**
 * Secure JWT verification using Web Crypto API (Native to Cloudflare Edge)
 */

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

export const verifyToken = async (token: string | undefined, secret: string | undefined) => {
  if (!token || !secret) return false;
  
  try {
    const [header, payload, signature] = token.split('.');
    if (!header || !payload || !signature) return false;

    const key = await getSecretKey(secret);
    
    // Reconstruct signature from base64url
    const sigStr = signature.replace(/-/g, '+').replace(/_/g, '/');
    const sigBin = atob(sigStr);
    const sigArr = new Uint8Array(sigBin.length);
    for (let i = 0; i < sigBin.length; i++) sigArr[i] = sigBin.charCodeAt(i);
    
    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      sigArr,
      new TextEncoder().encode(`${header}.${payload}`)
    );
    
    if (!isValid) return false;
    
    const decodedPayload = JSON.parse(atob(payload));
    return decodedPayload.exp > Math.floor(Date.now() / 1000);
  } catch (e) {
    console.error('JWT Verification Error:', e);
    return false;
  }
};
