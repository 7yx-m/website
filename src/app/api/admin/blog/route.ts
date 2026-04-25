import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = 'onlynyxs/website';
const GITHUB_BRANCH = 'main';

function isAuthenticated(req: NextRequest): boolean {
  const cookieValue = req.cookies.get('admin_session')?.value;
  if (!cookieValue) return false;
  const expiry = parseInt(cookieValue, 10);
  if (isNaN(expiry)) return false;
  return Date.now() <= expiry;
}

// Edge-safe ArrayBuffer → base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }

  if (!GITHUB_TOKEN) {
    return NextResponse.json({ error: 'SERVER_MISCONFIGURED', details: 'GITHUB_TOKEN not set' }, { status: 500 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: 'PARSE_ERROR', details: 'Could not parse form data' }, { status: 400 });
  }

  const file = formData.get('file') as File | null;
  const title = formData.get('title') as string | null;

  if (!file || !title) {
    return NextResponse.json({ error: 'MISSING_FIELDS', details: 'file and title are required' }, { status: 400 });
  }

  // Generate filename from title
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const filename = `${slug}.${extension}`;
  const imagePath = `public/images/${filename}`;

  // Convert file to base64 (Edge-safe — no Buffer)
  const arrayBuffer = await file.arrayBuffer();
  const base64Content = arrayBufferToBase64(arrayBuffer);

  // Check if file already exists (need SHA to overwrite)
  let existingSha: string | undefined;
  try {
    const checkRes = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${imagePath}?ref=${GITHUB_BRANCH}`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
      }
    );
    if (checkRes.ok) {
      const existing = await checkRes.json() as { sha: string };
      existingSha = existing.sha;
    }
  } catch {
    // File doesn't exist yet — fine
  }

  const uploadRes = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/${imagePath}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({
        message: `camera: upload photo "${title}"`,
        content: base64Content,
        branch: GITHUB_BRANCH,
        ...(existingSha ? { sha: existingSha } : {}),
      }),
    }
  );

  if (!uploadRes.ok) {
    const err = await uploadRes.json().catch(() => ({})) as { message?: string };
    return NextResponse.json(
      { error: 'GITHUB_ERROR', details: err.message || `HTTP ${uploadRes.status}` },
      { status: 502 }
    );
  }

  return NextResponse.json({
    success: true,
    path: `/images/${filename}`,
    message: 'Photo uploaded. It will appear after the next build.',
  });
}