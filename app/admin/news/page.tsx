// app/admin/news/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useProducts } from '../../context/ProductContext';

export default function NewsListPage() {
  const { news, deleteNews } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNews = news.filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    n.id.toString().includes(searchTerm)
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 px-4">
      <div className="flex justify-between items-center mb-12">
         <div>
            <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-900 leading-none">文章动态管理</h2>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] mt-2 tracking-[0.3em] flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> 企业洞察、行业知识与官方新闻发布
            </p>
         </div>
         <Link href="/admin/news/add" className="bg-blue-600 text-white px-10 py-5 rounded-[24px] font-black uppercase text-xs tracking-widest shadow-2xl shadow-blue-500/20 hover:bg-slate-900 transition-all active:scale-95">
           + 发布新文章
         </Link>
      </div>

      {/* 搜索栏 */}
      <div className="relative mb-12 max-w-2xl group">
         <i className="fas fa-search absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors"></i>
         <input 
           type="text" 
           placeholder="搜索文章标题或关键词..." 
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
           className="w-full bg-white border border-slate-100 rounded-[28px] pl-14 pr-8 py-5 font-bold text-sm focus:ring-4 ring-blue-500/10 transition-all outline-none shadow-sm"
         />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredNews.map(item => (
          <div key={item.id} className="bg-white rounded-[48px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
             <div className="aspect-video relative overflow-hidden bg-slate-50">
                <Image 
                  src={item.img || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800'} 
                  alt={item.title} 
                  fill 
                  className="object-cover group-hover:scale-110 transition duration-1000" 
                />
                <div className="absolute top-6 left-6 flex items-center gap-2">
                   <span className="bg-white/90 backdrop-blur px-4 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest shadow-sm">
                      {item.category}
                   </span>
                </div>
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4">
                   <Link href={`/admin/news/edit/${item.id}`} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-900 hover:bg-blue-600 hover:text-white transition shadow-xl"><i className="fas fa-edit"></i></Link>
                   <button onClick={() => { if(confirm('彻底删除此文章？')) deleteNews(item.id); }} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-900 hover:bg-red-500 hover:text-white transition shadow-xl"><i className="fas fa-trash"></i></button>
                </div>
             </div>
             <div className="p-8">
                <div className="flex items-center gap-4 text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4">
                   <span>{item.date}</span>
                   <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                   <span>{item.views} 浏览</span>
                </div>
                <h3 className="text-xl font-black uppercase text-slate-900 tracking-tight leading-tight mb-4 group-hover:text-blue-600 transition-colors line-clamp-2">
                   {item.title}
                </h3>
                <p className="text-slate-400 text-xs font-medium leading-relaxed line-clamp-2 mb-6">
                   {item.excerpt}
                </p>
                <Link href={`/news/${item.seoSlug}`} target="_blank" className="inline-flex items-center gap-2 text-[10px] font-black uppercase text-blue-600 tracking-widest hover:gap-4 transition-all">
                   预览线上效果 <i className="fas fa-external-link-alt"></i>
                </Link>
             </div>
          </div>
        ))}

        {filteredNews.length === 0 && (
           <div className="col-span-full py-40 bg-slate-50 rounded-[64px] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-200">
              <i className="fas fa-newspaper text-6xl mb-6"></i>
              <p className="font-black uppercase tracking-[0.4em]">未找到相关文章</p>
           </div>
        )}
      </div>
    </div>
  );
}
