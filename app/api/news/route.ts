// app/api/news/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase, mapToFrontend, mapToDB } from '@/lib/supabase';

const filePath = path.join(process.cwd(), 'data/news.json');
const isCloud = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

const getLocalNews = () => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const saveLocalNews = (news: any[]) => {
  fs.writeFileSync(filePath, JSON.stringify(news, null, 2));
};

export async function GET() {
  if (isCloud) {
    const { data, error } = await supabase.from('news').select('*').order('date', { ascending: false });
    if (!error) return NextResponse.json(mapToFrontend(data));
    console.error('Supabase News GET error:', error);
  }
  return NextResponse.json(getLocalNews());
}

export async function POST(request: Request) {
  try {
    const newArticle = await request.json();
    const articleWithId = { ...newArticle, id: newArticle.id || Date.now() };

    if (isCloud) {
      const { error } = await supabase.from('news').insert([mapToDB(articleWithId)]);
      if (!error) return NextResponse.json({ success: true, article: articleWithId });
      console.error('Supabase News POST error:', error);
    }

    const news = getLocalNews();
    news.unshift(articleWithId);
    saveLocalNews(news);
    return NextResponse.json({ success: true, article: articleWithId });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to save article' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const updatedArticle = await request.json();

    if (isCloud) {
      const { error } = await supabase.from('news').update(mapToDB(updatedArticle)).eq('id', updatedArticle.id);
      if (!error) return NextResponse.json({ success: true, article: updatedArticle });
      console.error('Supabase News PUT error:', error);
    }

    let news = getLocalNews();
    news = news.map((a: any) => a.id === updatedArticle.id ? updatedArticle : a);
    saveLocalNews(news);
    return NextResponse.json({ success: true, article: updatedArticle });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update article' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (isCloud) {
      const { error } = await supabase.from('news').delete().eq('id', id);
      if (!error) return NextResponse.json({ success: true });
      console.error('Supabase News DELETE error:', error);
    }

    let news = getLocalNews();
    news = news.filter((a: any) => a.id !== id);
    saveLocalNews(news);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete article' }, { status: 500 });
  }
}
