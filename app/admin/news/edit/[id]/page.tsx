// app/admin/news/edit/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useProducts, NewsArticle } from '../../../../context/ProductContext';
import NewsForm from '../../NewsForm';

export default function EditNewsPage() {
  const params = useParams();
  const id = parseInt(params.id as string);
  const { news } = useProducts();
  const article = news.find(n => n.id === id);

  if (!article && news.length > 0) return <div className="p-20 text-center font-black uppercase italic text-slate-300">文章未找到</div>;
  if (news.length === 0) return <div className="p-20 text-center font-black uppercase italic text-slate-300">正在加载文章数据...</div>;

  return <NewsForm initialData={article} />;
}
