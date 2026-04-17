// app/api/inquiry/route.ts
import { NextResponse } from 'next/server';
import { supabase, mapToDB, mapToFrontend } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log(' [DEBUG] Incoming Data:', JSON.stringify(body));

    // 核心修复：手动生成一个绝对唯一的 ID (使用当前毫秒级时间戳)
    // 这样可以彻底解决 "duplicate key value violates unique constraint" 错误
    const uniqueId = Date.now(); 

    const inquiryData = {
      id: uniqueId, // 强制指定 ID
      name: body.name || 'Anonymous',
      email: body.email || 'no-email',
      phone: body.phone || '',
      company: body.company || '',
      message: body.message || '',
      product_name: body.productName || body.product_name || 'General',
      product_id: body.productId || body.product_id || null,
      producttype: body.productType || body.producttype || 'General',
      attachment: body.attachment || null,
      status: 'New',
      created_at: new Date().toISOString()
    };

    console.log(' [DEBUG] Mapped for DB with Unique ID:', uniqueId);

    const { data, error } = await supabase
      .from('inquiries')
      .insert([inquiryData])
      .select();

    if (error) {
      console.error(' [DB ERROR] Details:', error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    console.log(' [DB SUCCESS] Entry saved to Supabase with ID:', uniqueId);
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

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const { error } = await supabase
      .from('inquiries')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
