// app/api/inquiry/route.ts
import { NextResponse } from 'next/server';
import { supabase, mapToDB, mapToFrontend } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log(' [DEBUG] Incoming Data:', JSON.stringify(body));

    // 核心字段映射（确保转为全小写，匹配 Supabase 默认行为）
    const inquiryData = {
      name: body.name || 'Anonymous',
      email: body.email || 'no-email',
      phone: body.phone || '',
      company: body.company || '',
      message: body.message || '',
      producttype: body.productType || body.producttype || 'General',
      attachment: body.attachment || null,
      status: 'New',
      created_at: new Date().toISOString()
    };

    console.log(' [DEBUG] Mapped for DB:', JSON.stringify(inquiryData));

    // 执行插入
    const { data, error } = await supabase
      .from('inquiries')
      .insert([inquiryData])
      .select();

    if (error) {
      console.error(' [DB ERROR] Details:', error.message);
      console.error(' [DB ERROR] Code:', error.code);
      console.error(' [DB ERROR] Hint:', error.hint);

      return NextResponse.json({ 
        success: false, 
        error: error.message,
        hint: error.hint
      }, { status: 400 });
    }

    console.log(' [DB SUCCESS] Entry saved to Supabase');
    return NextResponse.json({ success: true, data: data });

  } catch (err: any) {
    console.error(' [CRITICAL ERROR]:', err.message);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  const { data, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(mapToFrontend(data));
}
