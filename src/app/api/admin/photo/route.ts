import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

const ADMIN_PASSWORD = "neekson2-65";

export async function POST(req: NextRequest) {
  // 1. Check Authentication
  const session = req.cookies.get('admin_session')?.value;
  let isAuthenticated = false;

  if (session) {
    try {
      const expiry = parseInt(session);
      if (!isNaN(expiry) && Date.now() <= expiry) {
        isAuthenticated = true;
      }
    } catch (e) {
      // Auth failed
    }
  }

  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;

    if (!file || !title) {
      return NextResponse.json({ error: 'File and Title are required.' }, { status: 400 });
    }

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const REPO_OWNER = "Selkie-the-goat";
    const REPO_NAME = "website";

    // 2. Prepare the filename based on title
    const slug = title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    const extension = file.name.split('.').pop() || 'jpg';
    const filename = `${slug}.${extension}`;
    const imagePath = `public/images/${filename}`;
    
    // 3. Convert file to Base64
    const bytes = await file.arrayBuffer();
    const base64Content = Buffer.from(bytes).toString('base64');

    // 4. Upload Image to GitHub
    const uploadRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${imagePath}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `camera: upload new photo "${title}"`,
        content: base64Content,
      }),
    });

    if (!uploadRes.ok) {
      const error = await uploadRes.json();
      return NextResponse.json({ error: 'GitHub Image Upload Failed', details: error }, { status: 502 });
    }

    return NextResponse.json({ 
      success: true, 
      path: `/images/${filename}`,
      message: "Image uploaded to repository. It will appear after the next build."
    });

  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
