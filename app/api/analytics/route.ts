// app/api/analytics/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 写入数据库
    const { error } = await supabase
      .from('page_views')
      .insert([{
        url: body.url,
        referrer: body.referrer,
        browser: body.browser,
        os: body.os,
        device: body.device,
        country: body.country,
        ip: body.ip
      }]);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('API Analytics Error:', err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    let query = supabase
      .from('page_views')
      .select('*')
      .order('created_at', { ascending: false });

    if (start) {
      query = query.gte('created_at', start);
    }
    if (end) {
      query = query.lte('created_at', end);
    }

    const { data, error } = await query;

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
