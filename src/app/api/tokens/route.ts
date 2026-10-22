import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data, error } = await supabase.from('tokens').select('*').order('created_at', { ascending: false }).limit(100);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ tokens: data ?? [] });
}

export async function POST(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  try {
    const body = await req.json();
    const { data, error } = await supabase.from('tokens').insert({
      name: body.name,
      symbol: body.ticker,
      description: body.description,
      image_url: body.imageUrl,
      status: 'active',
      market_cap: 0,
      volume_24h: 0,
      creator_id: body.creatorId,
    }).select().single();
    if (error) throw error;
    return NextResponse.json({ success: true, token: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
