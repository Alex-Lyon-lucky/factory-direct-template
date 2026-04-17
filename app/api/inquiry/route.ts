// app/api/inquiry/route.ts
import { NextResponse } from 'next/server';
import { supabase, mapToDB, mapToFrontend } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[DB ERROR] GET /api/inquiry:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(mapToFrontend(data) || []);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('[DB INFO] Inquiry submission attempt from:', body.email);

    // 1. 数据映射
    const inquiryData = mapToDB({
      ...body,
      created_at: new Date().toISOString(),
      status: body.status || 'new',
    });

    // 诊断日志：查看实际要存的数据
    console.log('[DB INFO] Attempting to insert mapped data:', inquiryData);

    // 2. 插入数据库
    const { data, error } = await supabase
      .from('inquiries')
      .insert([inquiryData])
      .select()
      .single();

    if (error) {
      console.error('[DB ERROR] Insert failed:', error.message);
      console.error('[DB ERROR] Code:', error.code);
      console.error('[DB ERROR] Hint:', error.hint);
      
      return NextResponse.json({
        success: false,
        error: error.message,
        code: error.code,
      }, { status: 400 });
    }

    console.log('[DB SUCCESS] Inquiry ID:', data.id);
    return NextResponse.json({ success: true, data: mapToFrontend(data) });

  } catch (err: any) {
    console.error('[SERVER ERROR] POST /api/inquiry crashed:', err.message);
    return NextResponse.json({
      success: false,
      error: 'Internal Server Error',
      details: err.message,
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const { error } = await supabase.from('inquiries').delete().eq('id', id);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Delete failed' }, { status: 500 });
  }
}
