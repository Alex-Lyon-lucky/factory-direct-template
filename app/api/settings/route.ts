// app/api/settings/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase, mapToFrontend, mapToDB } from '@/lib/supabase';

const filePath = path.join(process.cwd(), 'data/settings.json');
const isCloud = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

export async function GET() {
  if (isCloud) {
    const { data, error } = await supabase.from('settings').select('*').eq('id', 1).single();
    if (!error && data) return NextResponse.json(mapToFrontend(data));
    console.error('Supabase Settings GET error:', error);
  }
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ error: 'Settings not found' }, { status: 404 });
  }
}

export async function POST(request: Request) {
  try {
    const settings = await request.json();

    if (isCloud) {
      const { error } = await supabase.from('settings').upsert({ ...mapToDB(settings), id: 1 });
      if (!error) return NextResponse.json({ success: true, settings });
      console.error('Supabase Settings POST error:', error);
    }

    fs.writeFileSync(filePath, JSON.stringify(settings, null, 2));
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to save settings' }, { status: 500 });
  }
}
