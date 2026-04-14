// app/api/pages/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase, mapToFrontend, mapToDB } from '@/lib/supabase';

const filePath = path.join(process.cwd(), 'data/pages.json');
const isCloud = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

export async function GET() {
  if (isCloud) {
    const { data, error } = await supabase.from('pages').select('*').eq('id', 1).single();
    if (!error && data) return NextResponse.json(mapToFrontend(data));
    console.error('Supabase Pages GET error:', error);
  }
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ error: 'Pages not found' }, { status: 404 });
  }
}

export async function POST(request: Request) {
  try {
    const pages = await request.json();

    if (isCloud) {
      const { error } = await supabase.from('pages').upsert({ ...mapToDB(pages), id: 1 });
      if (!error) return NextResponse.json({ success: true, pages });
      console.error('Supabase Pages POST error:', error);
    }

    fs.writeFileSync(filePath, JSON.stringify(pages, null, 2));
    return NextResponse.json({ success: true, pages });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to save pages' }, { status: 500 });
  }
}
