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
    
    // 如果没有 hash，我们无法去重，但我们会尝试通过 URL 去重
    if (isCloud) {
      // 检查是否已存在相同 URL 或 Hash 的素材
      const { data: existing } = await supabase
        .from('materials')
        .select('*')
        .or(`url.eq.${newMaterial.url}${newMaterial.hash ? `,hash.eq.${newMaterial.hash}` : ''}`)
        .maybeSingle();

      if (existing) {
        return NextResponse.json({ success: true, material: existing, isDuplicate: true });
      }

      // 准备插入的数据，移除 id 让 Supabase 自动生成
      const { id, ...insertData } = newMaterial;
      const finalInsertData = {
        ...insertData,
        date: insertData.date || new Date().toISOString().split('T')[0]
      };

      const { data: inserted, error } = await supabase.from('materials').insert([finalInsertData]).select().single();
      if (!error) return NextResponse.json({ success: true, material: inserted });
      console.error('Supabase POST error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // 本地模式去重逻辑
    const materials = getLocalMaterials();
    const isLocalDuplicate = materials.find((m: any) => m.url === newMaterial.url || (newMaterial.hash && m.hash === newMaterial.hash));
    
    if (isLocalDuplicate) {
      return NextResponse.json({ success: true, material: isLocalDuplicate, isDuplicate: true });
    }

    const materialWithId = { 
      ...newMaterial, 
      id: newMaterial.id || Date.now(),
      date: new Date().toISOString().split('T')[0]
    };
    materials.unshift(materialWithId);
    saveLocalMaterials(materials);
    return NextResponse.json({ success: true, material: materialWithId });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to save material' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    console.log('Updating material with data:', data);
    const { id, ...updateData } = data;
    
    if (!id) return NextResponse.json({ success: false, error: 'Missing ID' }, { status: 400 });

    if (isCloud) {
      // 移除 id，因为 Supabase 不允许更新主键
      const { error } = await supabase
        .from('materials')
        .update(updateData)
        .eq('id', id);
      
      if (!error) return NextResponse.json({ success: true });
      console.error('Supabase PUT error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const materials = getLocalMaterials();
    const index = materials.findIndex((m: any) => m.id === id);
    if (index === -1) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });

    materials[index] = { ...materials[index], ...updateData };
    saveLocalMaterials(materials);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
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
