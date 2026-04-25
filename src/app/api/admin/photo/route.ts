import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  // 1. Check Authentication
  const session = req.cookies.get('admin_session');
  if (session?.value !== 'true') {
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

    // 2. Prepare the filename
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-').toLowerCase()}`;
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

    // 5. UPDATE METADATA (Photography.tsx)
    // In a real automated system, you'd fetch the file, append to the array, and push it back.
    // For now, the image is safely in your repo! 
    
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
