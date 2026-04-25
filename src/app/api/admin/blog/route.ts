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

export async function POST(req: NextRequest) {
  // 1. Check session cookie
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }

  // 2. Check GitHub token is configured
  if (!GITHUB_TOKEN) {
    return NextResponse.json({ error: 'SERVER_MISCONFIGURED', details: 'GITHUB_TOKEN not set' }, { status: 500 });
  }

  // 3. Parse request body
  let body: { title?: string; slug?: string; content?: string; excerpt?: string; readTime?: string; date?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'PARSE_ERROR', details: 'Could not parse JSON body' }, { status: 400 });
  }

  const { title, slug, content, excerpt, readTime, date } = body;

  if (!title || !slug || !content) {
    return NextResponse.json({ error: 'MISSING_FIELDS', details: 'title, slug, and content are required' }, { status: 400 });
  }

  // 4. Build the markdown file with frontmatter
  const postDate = date || new Date().toISOString().split('T')[0];
  const markdown = `---
title: "${title.replace(/"/g, '\\"')}"
date: "${postDate}"
excerpt: "${(excerpt || '').replace(/"/g, '\\"')}"
readTime: "${readTime || '5 min read'}"
---

${content}`;

  const filePath = `content/blog/${slug}.md`;
  const encodedContent = btoa(unescape(encodeURIComponent(markdown)));

  // 5. Check if file already exists (to get its SHA for update)
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
    // File doesn't exist yet — that's fine
  }

  // 6. Commit the file to GitHub
  const commitRes = await fetch(
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
        content: encodedContent,
        branch: GITHUB_BRANCH,
        ...(existingSha ? { sha: existingSha } : {}),
      }),
    }
  );

  if (!commitRes.ok) {
    const err = await commitRes.json().catch(() => ({})) as { message?: string };
    return NextResponse.json(
      { error: 'GITHUB_ERROR', details: err.message || `HTTP ${commitRes.status}` },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true, slug, path: filePath });
}

export async function DELETE(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }

  if (!GITHUB_TOKEN) {
    return NextResponse.json({ error: 'SERVER_MISCONFIGURED' }, { status: 500 });
  }

  let body: { slug?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'PARSE_ERROR' }, { status: 400 });
  }

  const { slug } = body;
  if (!slug) {
    return NextResponse.json({ error: 'MISSING_FIELDS', details: 'slug is required' }, { status: 400 });
  }

  const filePath = `content/blog/${slug}.md`;

  // Get the file SHA (required by GitHub API to delete)
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

  if (!checkRes.ok) {
    return NextResponse.json({ error: 'NOT_FOUND', details: `${slug}.md does not exist` }, { status: 404 });
  }

  const { sha } = await checkRes.json() as { sha: string };

  const deleteRes = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({
        message: `blog: delete "${slug}"`,
        sha,
        branch: GITHUB_BRANCH,
      }),
    }
  );

  if (!deleteRes.ok) {
    const err = await deleteRes.json().catch(() => ({})) as { message?: string };
    return NextResponse.json({ error: 'GITHUB_ERROR', details: err.message }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}