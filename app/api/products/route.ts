// app/api/products/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase, mapToFrontend, mapToDB } from '@/lib/supabase';

const filePath = path.join(process.cwd(), 'data/products.json');
const isCloud = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

const getLocalProducts = () => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const saveLocalProducts = (products: any[]) => {
  fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
};

export async function GET() {
  if (isCloud) {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (!error) return NextResponse.json(mapToFrontend(data));
    console.error('Supabase Products GET error:', error);
  }
  return NextResponse.json(getLocalProducts());
}

export async function POST(request: Request) {
  try {
    const newProduct = await request.json();
    const productWithId = { ...newProduct, id: newProduct.id || Date.now() };

    if (isCloud) {
      const { error } = await supabase.from('products').insert([mapToDB(productWithId)]);
      if (!error) return NextResponse.json({ success: true, product: productWithId });
      console.error('Supabase Products POST error:', error);
    }

    const products = getLocalProducts();
    products.unshift(productWithId);
    saveLocalProducts(products);
    return NextResponse.json({ success: true, product: productWithId });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to save product' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const updatedProduct = await request.json();

    if (isCloud) {
      const { error } = await supabase.from('products').update(mapToDB(updatedProduct)).eq('id', updatedProduct.id);
      if (!error) return NextResponse.json({ success: true, product: updatedProduct });
      console.error('Supabase Products PUT error:', error);
    }

    let products = getLocalProducts();
    products = products.map((p: any) => p.id === updatedProduct.id ? updatedProduct : p);
    saveLocalProducts(products);
    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (isCloud) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (!error) return NextResponse.json({ success: true });
      console.error('Supabase Products DELETE error:', error);
    }

    let products = getLocalProducts();
    products = products.filter((p: any) => p.id !== id);
    saveLocalProducts(products);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 500 });
  }
}
