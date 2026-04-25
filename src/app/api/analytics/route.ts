import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const { section } = await req.json();
  const ANALYTICS = (process.env as any).ANALYTICS;

  if (!ANALYTICS) {
    return NextResponse.json({ error: 'KV Namespace not bound.' }, { status: 500 });
  }

  try {
    const key = `view_count_${section || 'total'}`;
    const current = await ANALYTICS.get(key);
    const newVal = (parseInt(current || '0')) + 1;
    await ANALYTICS.put(key, newVal.toString());

    return NextResponse.json({ success: true, count: newVal });
  } catch (e) {
    return NextResponse.json({ error: 'Analytics failure.' }, { status: 500 });
  }
}

export async function GET() {
  const ANALYTICS = (process.env as any).ANALYTICS;
  if (!ANALYTICS) return NextResponse.json({ error: 'KV Not Bound' }, { status: 500 });

  const sections = ['hero', 'projects', 'blog', 'photography', 'about', 'total'];
  const stats: Record<string, string> = {};

  for (const s of sections) {
    stats[s] = (await ANALYTICS.get(`view_count_${s}`)) || '0';
  }

  return NextResponse.json(stats);
}
