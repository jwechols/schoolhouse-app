import { getStore } from '@netlify/blobs';
import { todayCT } from '@/lib/now-ct';

const ALL_KIDS = ['titus', 'mercy', 'lois', 'truma'];

function corsHeaders(origin: string | null) {
  const allowed = ['https://homeward.echols.family', 'https://learning.echols.family'];
  const ao = origin && (allowed.includes(origin) || origin.startsWith('http://localhost')) ? origin : 'https://homeward.echols.family';
  return {
    'Access-Control-Allow-Origin': ao,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export async function OPTIONS(req: Request) {
  return new Response(null, { status: 204, headers: corsHeaders(req.headers.get('origin')) });
}

export async function GET(req: Request) {
  const headers = corsHeaders(req.headers.get('origin'));
  try {
    const store = getStore('kid-progress');
    const today = todayCT();
    const results = await Promise.all(
      ALL_KIDS.map(async (kidId) => {
        try {
          const data = await store.get(`${kidId}-${today}`, { type: 'json' });
          return data ?? { kidId, date: today };
        } catch {
          return { kidId, date: today };
        }
      })
    );
    return Response.json(results, { headers });
  } catch {
    return Response.json(ALL_KIDS.map((kidId) => ({ kidId })), { headers });
  }
}

export async function POST(req: Request) {
  const headers = corsHeaders(req.headers.get('origin'));
  try {
    const body = await req.json() as Record<string, unknown>;
    if (!body.kidId) return Response.json({ ok: false }, { headers });
    const store = getStore('kid-progress');
    const today = todayCT();
    const key = `${body.kidId}-${today}`;
    let existing: Record<string, unknown> = {};
    try { existing = (await store.get(key, { type: 'json' })) ?? {}; } catch { /* new entry */ }
    const merged = { ...existing, ...body, date: today, lastUpdated: new Date().toISOString() };
    await store.set(key, JSON.stringify(merged));
    return Response.json({ ok: true }, { headers });
  } catch {
    return Response.json({ ok: false }, { status: 200, headers });
  }
}
