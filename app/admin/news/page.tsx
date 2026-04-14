// app/admin/news/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useProducts } from '../../context/ProductContext';

export default function NewsListPage() {
  const { news, deleteNews } = useProducts();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
         <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900">文章动态管理</h2>
            <p className="text-slate-400 text-sm font-bold mt-1">发布行业知识和工厂动态，提升 SEO 流量。</p>
         </div>
         <Link href="/admin/news/add" className="bg-blue-600 text-white px-8 py-4 rounded-[20px] font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition">
           + 撰写新文章
         </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
         {news.map(article => (
           <div key={article.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-8 group hover:shadow-xl transition-all duration-500">
              <div className="w-24 h-24 relative rounded-2xl overflow-hidden flex-shrink-0">
                 <Image src={article.img} alt="" fill className="object-cover group-hover:scale-110 transition duration-700" />
              </div>
              <div className="flex-1">
                 <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">{article.category}</span>
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{article.date}</span>
                 </div>
                 <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 line-clamp-1">{article.title}</h3>
                 <p className="text-slate-400 text-sm font-bold mt-1">浏览量: {article.views} | 作者: {article.author}</p>
              </div>
              <div className="flex gap-2">
                <Link href={`/admin/news/edit/${article.id}`} className="inline-flex w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 items-center justify-center hover:bg-blue-600 hover:text-white transition shadow-sm"><i className="fas fa-edit"></i></Link>
                <button onClick={() => { if(confirm('确定删除文章？')) deleteNews(article.id); }} className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 hover:bg-red-500 hover:text-white transition shadow-sm"><i className="fas fa-trash"></i></button>
              </div>
           </div>
         ))}
         {news.length === 0 && (
            <div className="py-32 text-center text-slate-300 font-black uppercase tracking-widest bg-white rounded-[40px]">暂无文章动态</div>
         )}
      </div>
    </div>
  );
}
