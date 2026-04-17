// app/api/inquiry/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { mapToDB, mapToFrontend } from '@/lib/supabase';

// 使用 service_role key（服务端专用，高权限，绕过 RLS）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export async function GET() {
  console.log('[DB INFO] GET /api/inquiry - Fetching inquiries...');
  const { data, error } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[DB ERROR] GET /api/inquiry failed:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(mapToFrontend(data) || []);
}

export async function POST(request: Request) {
  try {
    const newInquiry = await request.json();
    console.log('[DB INFO] POST /api/inquiry - Received inquiry from:', newInquiry.email);

    // 关键修复：确保字段名转为小写以匹配 Supabase，同时添加时间戳
    const inquiryToInsert = mapToDB({
      ...newInquiry,
      created_at: new Date().toISOString(),
      status: newInquiry.status || 'New'
    });

    const { data, error } = await supabase
      .from('inquiries')
      .insert([inquiryToInsert])
      .select()
      .single();

    if (error) {
      console.error('[DB ERROR] Supabase Insert Failed:', error.message);
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        code: error.code 
      }, { status: 400 });
    }

    console.log('[DB SUCCESS] Inquiry saved successfully, ID:', data.id);
    return NextResponse.json({ success: true, inquiry: mapToFrontend(data) });

  } catch (error: any) {
    console.error('[SERVER ERROR] POST /api/inquiry crashed:', error.message);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal Server Error',
      details: error.message 
    }, { status: 500 });
  }
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
