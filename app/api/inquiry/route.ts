// app/api/inquiry/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase, mapToFrontend, mapToDB } from '@/lib/supabase';

const filePath = path.join(process.cwd(), 'data/inquiries.json');

// 诊断信息：这会在 Vercel 的 Runtime Logs 中显示
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const isCloud = !!supabaseUrl && !supabaseUrl.includes('placeholder-url');

export async function GET() {
  if (isCloud) {
    const { data, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
    if (!error) return NextResponse.json(mapToFrontend(data));
    console.error(' [DB ERROR] GET /api/inquiry:', error.message);
  }
  
  // 本地降级逻辑（仅限开发环境）
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const newInquiry = await request.json();
    const inquiryWithId = { ...newInquiry, id: newInquiry.id || Date.now() };

    console.log(' [DEBUG] Incoming Inquiry:', inquiryWithId.email);

    if (isCloud) {
      console.log(' [DB INFO] Attempting Supabase Insert...');
      const { error } = await supabase.from('inquiries').insert([mapToDB(inquiryWithId)]);
      
      if (!error) {
        console.log(' [DB SUCCESS] Inquiry saved to Supabase');
        return NextResponse.json({ success: true, inquiry: inquiryWithId });
      }

      // 如果是云端报错，直接打印并返回
      console.error(' [DB ERROR] Supabase Insert Failed:', error.message);
      return NextResponse.json({ 
        success: false, 
        error: `Database Error: ${error.message}`,
        details: 'Check RLS policies or table schema.' 
      }, { status: 400 });
    }

    // 本地开发环境逻辑
    if (process.env.NODE_ENV === 'development') {
      try {
        const data = fs.readFileSync(filePath, 'utf8');
        const inquiries = JSON.parse(data);
        inquiries.unshift(inquiryWithId);
        fs.writeFileSync(filePath, JSON.stringify(inquiries, null, 2));
        return NextResponse.json({ success: true, inquiry: inquiryWithId });
      } catch (e) {
        console.error('Local save failed:', e);
      }
    }

    return NextResponse.json({ success: false, error: 'Cloud storage not configured' }, { status: 500 });

  } catch (error) {
    console.error(' [SERVER ERROR] POST /api/inquiry:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  if (isCloud) {
    const { error } = await supabase.from('inquiries').delete().eq('id', id);
    if (!error) return NextResponse.json({ success: true });
    console.error(' [DB ERROR] DELETE /api/inquiry:', error.message);
  }
  return NextResponse.json({ success: false, error: 'Action not supported in this environment' }, { status: 400 });
}
