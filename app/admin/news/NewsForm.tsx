// app/admin/news/NewsForm.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProducts, NewsArticle } from '../../context/ProductContext';

export default function NewsForm({ initialData }: { initialData?: NewsArticle }) {
  const router = useRouter();
  const { materials, updateNews, refreshData } = useProducts();
  const [form, setForm] = useState<Partial<NewsArticle>>({
    title: '', content: '', category: 'Industry Knowledge', img: '', keywords: [], seoTitle: '', seoDescription: '', seoSlug: ''
  });
  const [loading, setLoading] = useState(false);
  const [showMatPicker, setShowMatPicker] = useState(false);

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const handleSubmit = async () => {
    if (!form.title || !form.content) return alert('请填写标题和内容');
    setLoading(true);

    const now = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const articleData = {
      ...form,
      id: initialData ? initialData.id : Date.now(),
      date: initialData ? initialData.date : now.toISOString().split('T')[0],
      day: initialData ? initialData.day : String(now.getDate()).padStart(2, '0'),
      month: initialData ? initialData.month : months[now.getMonth()],
      author: "管理员",
      views: initialData ? initialData.views : "0",
      excerpt: form.content?.replace(/<[^>]*>/g, '').substring(0, 150) + "...",
      seoSlug: form.seoSlug || form.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    } as NewsArticle;

    const success = initialData ? await updateNews(articleData) : await (async () => {
      const res = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articleData)
      });
      if(res.ok) { refreshData(); return true; }
      return false;
    })();

    if (success) {
      alert(initialData ? '文章更新成功' : '文章发布成功');
      router.push('/admin/news');
    } else {
      alert('保存失败，请重试');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in slide-in-from-bottom-8 duration-700 pb-20">
       <div className="flex justify-between items-center px-6">
         <div>
            <h2 className="text-5xl font-black italic uppercase tracking-tighter">{initialData ? 'EDIT ARTICLE' : 'COMPOSE NEWS'}</h2>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] mt-2 italic tracking-[0.3em] flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> CORPORATE INSIGHTS & GLOBAL HUB
            </p>
         </div>
         <div className="flex gap-4">
            <button onClick={() => router.back()} className="px-8 py-4 rounded-2xl font-black uppercase text-[10px] italic text-slate-400 hover:text-slate-900 transition tracking-widest">CANCEL</button>
            <button onClick={handleSubmit} disabled={loading} className="bg-blue-600 text-white px-12 py-5 rounded-[24px] font-black uppercase italic tracking-[0.2em] text-xs shadow-2xl shadow-blue-500/20 hover:bg-slate-900 transition-all active:scale-95 disabled:opacity-50">
               {loading ? 'PUBLISHING...' : (initialData ? 'SAVE CHANGES' : 'PUBLISH NOW')}
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 px-6">
        <div className="lg:col-span-8 space-y-10">
           <div className="bg-white p-12 rounded-[56px] shadow-sm border border-slate-100">
              <h3 className="text-[10px] font-black uppercase text-blue-600 tracking-[0.3em] mb-12 flex items-center gap-4">
                 <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-xs"><i className="fas fa-pen-nib"></i></div> CORE EDITORIAL
              </h3>
              <div className="space-y-10">
                <div>
                  <label className="block text-[9px] font-black uppercase text-slate-400 mb-3 tracking-[0.3em] ml-1">Article Headline *</label>
                  <input 
                    type="text" 
                    value={form.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      const updates: any = { title };
                      if (!form.seoTitle || form.seoTitle === `${form.title} | Factory News & Industry Insights`) {
                        updates.seoTitle = `${title} | Factory News & Industry Insights`;
                      }
                      if (!form.seoSlug || form.seoSlug === form.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')) {
                        updates.seoSlug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                      }
                      setForm({...form, ...updates});
                    }}
                    className="w-full bg-slate-50 border-none rounded-[28px] px-10 py-6 font-black text-3xl uppercase italic focus:ring-4 ring-blue-500/10 transition-all tracking-tight" 
                    placeholder="ENTER HEADLINE..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                       <label className="block text-[9px] font-black uppercase text-slate-400 mb-3 tracking-[0.3em] ml-1">Content Category</label>
                       <select 
                         value={form.category}
                         onChange={(e) => setForm({...form, category: e.target.value})}
                         className="w-full bg-slate-50 border-none rounded-[24px] px-8 py-5 font-black uppercase italic text-sm text-slate-700 appearance-none focus:ring-4 ring-blue-500/10"
                       >
                         <option>Industry Knowledge</option>
                         <option>Company Update</option>
                         <option>Exhibition</option>
                         <option>Technical Guide</option>
                       </select>
                    </div>
                    <div>
                       <label className="block text-[9px] font-black uppercase text-slate-400 mb-3 tracking-[0.3em] ml-1">SEO Slug</label>
                       <input 
                         type="text" 
                         value={form.seoSlug}
                         onChange={(e) => setForm({...form, seoSlug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                         className="w-full bg-slate-50 border-none rounded-[24px] px-8 py-5 font-black uppercase italic text-xs tracking-widest text-blue-600 focus:ring-4 ring-blue-500/10" 
                       />
                    </div>
                </div>

                <div className="bg-slate-900 rounded-[40px] p-10 text-white overflow-hidden shadow-2xl relative border-4 border-slate-800">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full translate-x-24 -translate-y-24 blur-3xl"></div>
                    <h4 className="text-[9px] font-black uppercase text-blue-400 tracking-[0.4em] mb-8 relative z-10 flex items-center gap-2"><i className="fab fa-google"></i> Real-time Google Preview</h4>
                    <div className="bg-white rounded-[24px] p-8 relative z-10 text-slate-900 border border-slate-200">
                        <div className="text-[11px] text-[#202124] mb-1 opacity-60">highfasteners.com › news › {form.seoSlug || '...'}</div>
                        <h4 className="text-[#1a0dab] text-xl font-medium mb-1 hover:underline leading-tight">{form.seoTitle || form.title || 'Your Article Title'}</h4>
                        <p className="text-[#4d5156] text-[13px] leading-relaxed line-clamp-2">{form.seoDescription || 'Read our latest industry insights and company updates from High Fasteners Factory...'}</p>
                    </div>
                </div>
                
                <div>
                   <label className="block text-[9px] font-black uppercase text-slate-400 mb-3 tracking-[0.3em] ml-1">Body Content (HTML Supported) *</label>
                   <div className="border-4 border-slate-50 rounded-[40px] overflow-hidden focus-within:border-blue-100 transition shadow-inner">
                      <textarea 
                        rows={18} 
                        value={form.content}
                        onChange={(e) => setForm({...form, content: e.target.value})}
                        className="w-full border-none px-10 py-10 font-medium text-slate-700 leading-loose text-lg outline-none focus:ring-0" 
                        placeholder="Write your story here..."
                      ></textarea>
                   </div>
                </div>
              </div>
           </div>
        </div>

        <div className="lg:col-span-4 space-y-10">
            <div className="bg-white p-12 rounded-[64px] shadow-sm border border-slate-100 sticky top-32">
                <h3 className="text-[10px] font-black uppercase text-blue-600 tracking-[0.3em] mb-12 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center"><i className="fas fa-image"></i></div> FEATURED MEDIA
                </h3>
                
                <div 
                  onClick={() => setShowMatPicker(true)}
                  className="relative aspect-video rounded-[40px] overflow-hidden bg-slate-50 border-4 border-dashed border-slate-100 flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/20 transition-all group shadow-inner"
                >
                    {form.img ? (
                        <>
                        <Image src={form.img} alt="" fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                            <div className="bg-white px-8 py-3 rounded-2xl font-black italic text-[10px] uppercase tracking-widest shadow-2xl">CHANGE COVER</div>
                        </div>
                        </>
                    ) : (
                        <div className="text-center">
                            <i className="fas fa-camera text-4xl text-slate-200 mb-4 group-hover:text-blue-200 transition"></i>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select From Library</p>
                        </div>
                    )}
                </div>

                <div className="mt-12 space-y-8">
                   <div>
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-3 tracking-[0.3em] ml-1">Meta Title</label>
                      <input type="text" value={form.seoTitle} onChange={e => setForm({...form, seoTitle: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-xs text-slate-700" />
                   </div>
                   <div>
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-3 tracking-[0.3em] ml-1">Meta Description</label>
                      <textarea rows={4} value={form.seoDescription} onChange={e => setForm({...form, seoDescription: e.target.value})} className="w-full bg-slate-50 border-none rounded-3xl px-6 py-4 font-bold text-xs text-slate-700 leading-relaxed"></textarea>
                   </div>
                </div>
            </div>
        </div>
      </div>

      {/* Material Picker Modal */}
      {showMatPicker && (
         <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[200] flex items-center justify-center p-6 md:p-12">
            <div className="bg-white w-full max-w-6xl rounded-[80px] shadow-2xl h-full max-h-[900px] flex flex-col overflow-hidden animate-in zoom-in duration-700 relative">
               <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full translate-x-32 -translate-y-32 blur-[100px]"></div>
               <div className="p-12 border-b border-slate-100 flex justify-between items-center relative z-10">
                  <div>
                    <h3 className="text-4xl font-black italic uppercase text-slate-900 tracking-tighter leading-none">Global Asset Library</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-3 italic flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-blue-600"></span> SELECT FEATURED MEDIA
                    </p>
                  </div>
                  <button onClick={() => setShowMatPicker(false)} className="w-16 h-16 bg-slate-50 rounded-[28px] flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition shadow-sm"><i className="fas fa-times text-xl"></i></button>
               </div>
               
               <div className="flex-1 overflow-y-auto p-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 no-scrollbar relative z-10 bg-slate-50/30">
                  {materials.map(mat => (
                     <div 
                      key={mat.id} 
                      onClick={() => {
                         setForm({...form, img: mat.url});
                         setShowMatPicker(false);
                      }}
                      className={`relative aspect-square rounded-[40px] overflow-hidden cursor-pointer border-4 transition-all duration-500 bg-white p-4 shadow-sm hover:shadow-2xl hover:-translate-y-2 ${
                         form.img === mat.url ? 'border-blue-600 ring-8 ring-blue-50' : 'border-white hover:border-blue-200'
                      }`}
                     >
                        <Image src={mat.url} alt="" fill className="object-contain p-4 transition-transform duration-700 hover:scale-110" />
                        {form.img === mat.url && (
                           <div className="absolute top-4 right-4 w-8 h-8 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-xs shadow-2xl animate-in zoom-in duration-300"><i className="fas fa-check"></i></div>
                        )}
                     </div>
                  ))}
               </div>

               <div className="p-12 border-t border-slate-100 flex justify-end items-center bg-white relative z-10">
                  <button onClick={() => setShowMatPicker(false)} className="bg-slate-900 text-white px-16 py-6 rounded-[32px] font-black uppercase italic tracking-[0.4em] text-xs shadow-2xl shadow-slate-300 hover:bg-blue-600 transition-all active:scale-95">CONFIRM SELECTION</button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
}
