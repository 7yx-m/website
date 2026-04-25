/**
 * Robust authentication utility for Cloudflare Edge
 */

const ADMIN_PASSWORD = "neekson2-65";

/**
 * Generates a deterministic hex signature for a given piece of data.
 */
export async function getSignature(data: string) {
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

/**
 * Verifies a session string in the format "expiry:signature"
 */
export async function verifySession(session: string | undefined) {
  if (!session) return false;

  try {
    const [expiry, sig] = session.split(':');
    if (!expiry || !sig) return false;

    // Check if session has expired
    if (Date.now() > parseInt(expiry)) return false;

    // Verify signature
    const expectedSig = await getSignature(expiry);
    return sig === expectedSig;
  } catch (e) {
    return false;
  }
}
