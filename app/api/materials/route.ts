// app/api/materials/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabase';

// Local storage fallback (current mode)
const filePath = path.join(process.cwd(), 'data/materials.json');
const isCloud = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

const getLocalMaterials = () => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const saveLocalMaterials = (materials: any[]) => {
  fs.writeFileSync(filePath, JSON.stringify(materials, null, 2));
};

export async function GET() {
  if (isCloud) {
    const { data, error } = await supabase.from('materials').select('*').order('date', { ascending: false });
    if (!error) return NextResponse.json(data);
    console.error('Supabase GET error:', error);
  }
  return NextResponse.json(getLocalMaterials());
}

export async function POST(request: Request) {
  try {
    const newMaterial = await request.json();
    const materialWithId = { 
      ...newMaterial, 
      id: newMaterial.id || Date.now(),
      date: new Date().toISOString().split('T')[0]
    };

    if (isCloud) {
      const { error } = await supabase.from('materials').insert([materialWithId]);
      if (!error) return NextResponse.json({ success: true, material: materialWithId });
      console.error('Supabase POST error:', error);
    }

    const materials = getLocalMaterials();
    materials.unshift(materialWithId);
    saveLocalMaterials(materials);
    return NextResponse.json({ success: true, material: materialWithId });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to save material' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (isCloud) {
      const { error } = await supabase.from('materials').delete().eq('id', id);
      if (!error) return NextResponse.json({ success: true });
      console.error('Supabase DELETE error:', error);
    }

    let materials = getLocalMaterials();
    materials = materials.filter((m: any) => m.id !== id);
    saveLocalMaterials(materials);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete material' }, { status: 500 });
  }
}
