// app/api/inquiry/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase, mapToFrontend, mapToDB } from '@/lib/supabase';

const filePath = path.join(process.cwd(), 'data/inquiries.json');
const isCloud = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

const getLocalInquiries = () => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const saveLocalInquiries = (inquiries: any[]) => {
  fs.writeFileSync(filePath, JSON.stringify(inquiries, null, 2));
};

export async function GET() {
  if (isCloud) {
    const { data, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
    if (!error) return NextResponse.json(mapToFrontend(data));
    console.error('Supabase Inquiries GET error:', error);
  }
  return NextResponse.json(getLocalInquiries());
}

export async function POST(request: Request) {
  try {
    const newInquiry = await request.json();
    const inquiryWithId = { ...newInquiry, id: newInquiry.id || Date.now() };

    if (isCloud) {
      const { error } = await supabase.from('inquiries').insert([mapToDB(inquiryWithId)]);
      if (!error) return NextResponse.json({ success: true, inquiry: inquiryWithId });
      console.error('Supabase Inquiries POST error:', error);
    }

    const inquiries = getLocalInquiries();
    inquiries.unshift(inquiryWithId);
    saveLocalInquiries(inquiries);
    return NextResponse.json({ success: true, inquiry: inquiryWithId });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to save inquiry' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (isCloud) {
      const { error } = await supabase.from('inquiries').delete().eq('id', id);
      if (!error) return NextResponse.json({ success: true });
      console.error('Supabase Inquiries DELETE error:', error);
    }

    let inquiries = getLocalInquiries();
    inquiries = inquiries.filter((i: any) => i.id !== id);
    saveLocalInquiries(inquiries);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete inquiry' }, { status: 500 });
  }
}
