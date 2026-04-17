// app/api/inquiry/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { mapToDB, mapToFrontend } from '@/lib/supabase';

// 1. 初始化高权限客户端
// 注意：SUPABASE_SERVICE_ROLE_KEY 必须在 Vercel 环境变量中配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('[DB INFO] Received inquiry from:', body.email || body.name);

    // 2. 字段映射：将前端的 camelCase (productType) 转为 DB 的 lowercase (producttype)
    // 同时补全必要字段
    const inquiryData = mapToDB({
      ...body,
      created_at: new Date().toISOString(),
      status: body.status || 'new',
    });

    console.log('[DB INFO] Attempting high-privilege insert...');

    const { data, error } = await supabase
      .from('inquiries')
      .insert([inquiryData])
      .select()
      .single();

    if (error) {
      console.error('[DB ERROR] Insert failed:', error.message);
      return NextResponse.json({
        success: false,
        error: error.message,
        code: error.code,
        hint: 'If error is 403/401, check if SUPABASE_SERVICE_ROLE_KEY is correctly set in Vercel'
      }, { status: 400 });
    }

    console.log('[DB SUCCESS] Inquiry inserted successfully, ID:', data.id);
    return NextResponse.json({ success: true, data: mapToFrontend(data) });

  } catch (err: any) {
    console.error('[SERVER ERROR] POST /api/inquiry crashed:', err.message);
    return NextResponse.json({
      success: false,
      error: 'Internal Server Error',
      details: err.message
    }, { status: 500 });
  }
}

export async function GET() {
  console.log('[DB INFO] GET /api/inquiry - Fetching data...');
  const { data, error } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[DB ERROR] GET failed:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 返回给前端时再转回 camelCase 格式
  return NextResponse.json(mapToFrontend(data) || []);
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const { error } = await supabase.from('inquiries').delete().eq('id', id);

    if (error) {
      console.error('[DB ERROR] DELETE failed:', error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Delete failed' }, { status: 500 });
  }
}
