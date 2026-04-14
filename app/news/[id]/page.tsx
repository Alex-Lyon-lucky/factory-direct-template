// app/news/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { useProducts, NewsArticle } from '../../context/ProductContext';

export default function NewsDetailPage() {
  const params = useParams();
  const { news } = useProducts();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (news.length > 0) {
      const found = news.find(n => n.id.toString() === params.id || n.seoSlug === params.id);
      if (found) setArticle(found);
      setLoading(false);
    }
  }, [params.id, news]);

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center font-black uppercase text-slate-300">Loading Story...</div>;
  if (!article) return <div className="min-h-screen bg-white flex flex-col items-center justify-center">
    <h2 className="text-4xl font-black uppercase text-slate-900 mb-6">Story Not Found</h2>
    <Link href="/news" className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest">Back to News</Link>
  </div>;

  return (
    <Layout>
      {/* Schema.org for News */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "BlogPosting",
            "headline": article.seoTitle || article.title,
            "image": article.img,
            "datePublished": article.date,
            "author": { "@type": "Person", "name": article.author || "High Fasteners" },
            "publisher": { "@type": "Organization", "name": "High Fasteners" }
          })
        }}
      />

      <div className="bg-slate-50 py-4 px-6 border-b border-slate-100">
        <div className="max-w-7xl mx-auto flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <i className="fas fa-chevron-right text-[8px]"></i>
          <Link href="/news" className="hover:text-blue-600">News</Link>
          <i className="fas fa-chevron-right text-[8px]"></i>
          <span className="text-slate-900">{article.title}</span>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 py-20 lg:py-32">
        <header className="mb-20 animate-in slide-in-from-bottom-12 duration-1000">
           <div className="flex items-center gap-4 mb-8">
              <span className="bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-lg shadow-xl shadow-blue-100">{article.category}</span>
              <span className="text-slate-300 font-bold uppercase tracking-widest text-[10px]">{new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
           </div>
           <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-slate-900 leading-[0.85] mb-12">
             {article.title}
           </h1>
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 border border-slate-100"><i className="far fa-user text-xl"></i></div>
              <div>
                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Written By</p>
                 <p className="text-lg font-black uppercase text-slate-900 leading-none">{article.author}</p>
              </div>
           </div>
        </header>

        <div className="relative aspect-video rounded-[64px] overflow-hidden shadow-2xl mb-24 animate-in zoom-in duration-1000">
           <Image src={article.img} alt={article.title} fill className="object-cover" priority />
           <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
        </div>

        <div className="prose prose-slate max-w-none backend-rich-text text-xl font-medium text-slate-600 leading-relaxed mb-32" dangerouslySetInnerHTML={{ __html: article.content }}></div>
        
        <div className="border-t border-slate-100 pt-16 flex flex-col md:flex-row justify-between items-center gap-10">
           <div className="flex gap-4">
              <Link href="/news" className="bg-slate-900 text-white px-10 py-5 rounded-[28px] font-black uppercase tracking-widest text-xs shadow-xl shadow-slate-200">Back to News Feed</Link>
              <button className="w-14 h-14 bg-slate-50 rounded-[24px] border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 transition shadow-sm"><i className="fas fa-share-alt"></i></button>
           </div>
           
           <Link href="/contact" className="flex items-center gap-6 group">
              <div className="text-right">
                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1 group-hover:text-blue-600 transition">Interested in our hardware?</p>
                 <p className="text-lg font-black uppercase text-slate-900 group-hover:text-blue-600 transition">Contact For Direct Quote</p>
              </div>
              <div className="w-16 h-16 bg-blue-600 text-white rounded-[28px] flex items-center justify-center text-xl shadow-2xl shadow-blue-100 group-hover:rotate-12 transition-all group-active:scale-95"><i className="fas fa-paper-plane"></i></div>
           </Link>
        </div>
      </article>

      {/* READ MORE - SIMILAR ARTICLES */}
      <section className="bg-slate-50 py-32 px-4 border-t border-slate-100">
         <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-16">
               <div>
                  <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-900 leading-none">Next Stories</h2>
                  <div className="w-24 h-2 bg-blue-600 mt-4"></div>
               </div>
               <Link href="/news" className="text-xs font-black uppercase text-blue-600 hover:underline tracking-widest">All Insights &rarr;</Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
               {news.filter(n => n.id.toString() !== params.id).slice(0, 3).map(n => (
                  <Link key={n.id} href={`/news/${n.id}`} className="bg-white p-10 rounded-[56px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group">
                     <div className="aspect-[16/10] relative rounded-[40px] overflow-hidden mb-8 shadow-inner">
                        <Image src={n.img} alt={n.title} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                     </div>
                     <div className="px-2">
                        <h4 className="text-2xl font-black uppercase text-slate-900 leading-tight group-hover:text-blue-600 transition mb-6 line-clamp-2">{n.title}</h4>
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{new Date(n.date).toLocaleDateString()}</span>
                     </div>
                  </Link>
               ))}
            </div>
         </div>
      </section>
    </Layout>
  );
}
