// app/api/categories/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabase';

const filePath = path.join(process.cwd(), 'data/categories.json');
const isCloud = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

const getLocalCategories = () => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const saveLocalCategories = (categories: any[]) => {
  fs.writeFileSync(filePath, JSON.stringify(categories, null, 2));
};

export async function GET() {
  if (isCloud) {
    const { data, error } = await supabase.from('categories').select('*').order('id', { ascending: true });
    if (!error) return NextResponse.json(data);
    console.error('Supabase Categories GET error:', error);
  }
  return NextResponse.json(getLocalCategories());
}

export async function POST(request: Request) {
  try {
    const categories = await request.json();

    if (isCloud) {
      const { error } = await supabase.from('categories').upsert(categories);
      if (!error) return NextResponse.json({ success: true, categories });
      console.error('Supabase Categories POST error:', error);
    }

    saveLocalCategories(categories);
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to save categories' }, { status: 500 });
  }
}
