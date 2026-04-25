import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const ADMIN_PASSWORD = "neekson2-65";

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
  // 1. Check Authentication
  const session = req.cookies.get('admin_session')?.value;
  let isAuthenticated = false;

  if (session) {
    try {
      const [expiry, sig] = session.split(':');
      if (expiry && sig && Date.now() <= parseInt(expiry)) {
        const expectedSig = await getSignature(expiry);
        if (sig === expectedSig) {
          isAuthenticated = true;
        }
      }
    } catch (e) {
      // Auth failed
    }
  }

  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const { title, excerpt, content, readTime } = await req.json();
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const REPO_OWNER = "Selkie-the-goat"; 
    const REPO_NAME = "website";

    if (!GITHUB_TOKEN) {
      return NextResponse.json({ error: 'GitHub Token not configured.' }, { status: 500 });
    }

    const slug = title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    const path = `content/blog/${slug}.md`;
    
    const fileContent = `---
title: "${title}"
date: "${new Date().toISOString().split('T')[0]}"
excerpt: "${excerpt}"
readTime: "${readTime || '5 min'}"
---

${content}`;

    // Push to GitHub
    const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github+json',
      },
      body: JSON.stringify({
        message: `feat: add blog post ${title}`,
        content: Buffer.from(fileContent).toString('base64'),
      }),
    });

    if (response.ok) {
      return NextResponse.json({ success: true, slug });
    } else {
      const errorData = await response.json();
      return NextResponse.json({ error: 'GitHub API Error', details: errorData }, { status: 502 });
    }
  } catch (e) {
    return NextResponse.json({ error: 'Internal Server Error.' }, { status: 500 });
  }
}
