// app/news/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import { useProducts } from '../context/ProductContext';

export default function NewsPage() {
  const { news, pages } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNews, setFilteredNews] = useState(news);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredNews(news);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredNews(news.filter(n => 
        n.title.toLowerCase().includes(term) || 
        (n.excerpt && n.excerpt.toLowerCase().includes(term)) ||
        n.category.toLowerCase().includes(term)
      ));
    }
  }, [searchTerm, news]);

  const fallbackNews = {
    title: "Factory Insights & Knowledge",
    subtitle: "Latest technical guides and industry trends for professionals.",
    headerHeight: 220,
    bgMode: "color",
    bgColor: "#0f172a"
  };

  const headerData = pages?.news ? { ...fallbackNews, ...pages.news } : fallbackNews;

  return (
    <Layout>
      <PageHeader data={headerData} />

      <main className="max-w-7xl mx-auto px-6 py-16 flex-1 w-full min-h-screen">
        <div className="flex justify-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="max-w-2xl w-full relative group">
             <i className="fas fa-search absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 text-sm group-focus-within:text-blue-500 transition-colors"></i>
             <input 
              type="text" 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="SEARCH ARTICLES..." 
              className="w-full bg-slate-50 border-none text-slate-900 rounded-[20px] pl-14 pr-6 py-5 font-black text-[10px] focus:bg-white focus:ring-4 ring-blue-500/10 transition-all tracking-widest uppercase shadow-sm shadow-slate-100"
             />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-in slide-in-from-bottom-8 duration-700">
          {filteredNews.map((article) => (
            <Link 
              key={article.id} 
              href={`/news/${article.id}`}
              className="bg-white rounded-[48px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col group cursor-pointer"
            >
              <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                <Image 
                  src={article.img} 
                  alt={article.title} 
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md text-slate-900 text-center px-5 py-3 rounded-[24px] shadow-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <span className="block text-xl font-black leading-none">{article.day || new Date(article.date).getDate()}</span>
                  <span className="block text-[8px] font-black uppercase mt-1 tracking-widest opacity-60">
                    {article.month || new Date(article.date).toLocaleString('en-US', { month: 'short' })}
                  </span>
                </div>
              </div>
              
              <div className="p-10 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-4">
                   <div className="w-6 h-1 bg-blue-600"></div>
                   <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest">{article.category}</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase leading-tight group-hover:text-blue-600 transition duration-300 mb-4 line-clamp-2 tracking-tight">
                  {article.title}
                </h3>
                <p className="text-slate-500 text-[11px] line-clamp-3 font-medium leading-relaxed opacity-70 mb-8">
                  {article.excerpt || article.content.replace(/<[^>]*>/g, '').substring(0, 150)}
                </p>
                <div className="mt-auto pt-6 flex justify-between items-center border-t border-slate-50">
                   <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">By {article.author}</span>
                   <span className="text-[8px] font-black uppercase text-blue-600 group-hover:translate-x-2 transition-transform tracking-widest">
                     Details &rarr;
                   </span>
                </div>
              </div>
            </Link>
          ))}
          {filteredNews.length === 0 && (
            <div className="col-span-full py-32 text-center bg-slate-50 rounded-[64px] border-2 border-dashed border-slate-200 text-slate-300 font-black uppercase tracking-widest">
               No matches found
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
}
