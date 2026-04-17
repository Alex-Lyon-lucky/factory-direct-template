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
    const newCategory = await request.json();
    // 确保有 ID
    const categoryWithId = { ...newCategory, id: newCategory.id || Date.now() };

    if (isCloud) {
      const { data, error } = await supabase.from('categories').insert([categoryWithId]).select();
      if (!error) return NextResponse.json({ success: true, category: data[0] });
      console.error('Supabase Categories POST error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const categories = getLocalCategories();
    categories.push(categoryWithId);
    saveLocalCategories(categories);
    return NextResponse.json({ success: true, category: categoryWithId });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to add category' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const updatedCategory = await request.json();
    if (!updatedCategory.id) return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });

    if (isCloud) {
      const { data, error } = await supabase
        .from('categories')
        .update({ name: updatedCategory.name, value: updatedCategory.value })
        .eq('id', updatedCategory.id)
        .select();
      if (!error) return NextResponse.json({ success: true, category: data[0] });
      console.error('Supabase Categories PUT error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    let categories = getLocalCategories();
    categories = categories.map((c: any) => c.id === updatedCategory.id ? updatedCategory : c);
    saveLocalCategories(categories);
    return NextResponse.json({ success: true, category: updatedCategory });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (isCloud) {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (!error) return NextResponse.json({ success: true });
      console.error('Supabase Categories DELETE error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    let categories = getLocalCategories();
    categories = categories.filter((c: any) => c.id !== id);
    saveLocalCategories(categories);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete category' }, { status: 500 });
  }
}
