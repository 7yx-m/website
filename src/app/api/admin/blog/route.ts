import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // 1. Check Authentication
  const session = req.cookies.get('admin_session');
  if (session?.value !== 'true') {
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
    const response = await fetch(`https://api.api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`, {
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
