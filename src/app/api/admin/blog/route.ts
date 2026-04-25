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

// Edge-safe string → base64
function stringToBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
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

  let body: { title?: string; excerpt?: string; content?: string; readTime?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'PARSE_ERROR', details: 'Could not parse JSON body' }, { status: 400 });
  }

  const { title, excerpt = '', content, readTime = '5 min read' } = body;

  if (!title || !content) {
    return NextResponse.json({ error: 'MISSING_FIELDS', details: 'title and content are required' }, { status: 400 });
  }

  // Generate slug from title
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  // Format date as YYYY.MM.DD to match existing posts
  const now = new Date();
  const date = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;

  // Build markdown file with frontmatter
  const markdown = `---
title: "${title.replace(/"/g, '\\"')}"
date: "${date}"
excerpt: "${excerpt.replace(/"/g, '\\"')}"
readTime: "${readTime}"
---
${content}`;

  const filePath = `content/blog/${slug}.md`;
  const base64Content = stringToBase64(markdown);

  // Check if file already exists (need SHA to overwrite)
  let existingSha: string | undefined;
  try {
    const checkRes = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}?ref=${GITHUB_BRANCH}`,
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
    `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({
        message: `blog: publish "${title}"`,
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
    slug,
    message: 'Blog post published. It will appear after the next build.',
  });
}