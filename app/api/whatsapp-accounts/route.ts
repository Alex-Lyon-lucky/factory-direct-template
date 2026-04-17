// app/api/whatsapp-accounts/route.ts
import { NextResponse } from 'next/server';
import { supabase, mapToDB, mapToFrontend } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('whatsapp_accounts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(mapToFrontend(data));
}

export async function POST(req: Request) {
  const body = await req.json();
  const dbData = mapToDB(body);

  const { data, error } = await supabase
    .from('whatsapp_accounts')
    .insert([dbData])
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(mapToFrontend(data));
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const { id, ...rest } = body;
  const dbData = mapToDB(rest);

  const { data, error } = await supabase
    .from('whatsapp_accounts')
    .update(dbData)
    .eq('id', id)
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(mapToFrontend(data));
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

  const { error } = await supabase
    .from('whatsapp_accounts')
    .delete()
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
