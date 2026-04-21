// app/admin/pages/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useProducts, PageContent } from '../../context/ProductContext';

const TiptapEditor = dynamic(() => import('../products/TiptapEditor'), { 
  ssr: false,
  loading: () => <div className="p-10 bg-slate-50 rounded-3xl animate-pulse text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">载入编辑器...</div>
});

const DEFAULT_PAGES: PageContent = {
  home: {
    heroTitle: '', heroSubtitle: '', advantages: ['', '', '', ''], 
    categoryTitle: '', categorySubtitle: '', categoryImages: {},
    featuredTitle: '', featuredSubtitle: '', featuredCount: 6,
    videoTitle: '', videoSubtitle: '', videoUrl: '', videoDesc: '',
    stats: [{ label: '', value: '' }, { label: '', value: '' }, { label: '', value: '' }, { label: '', value: '' }],
    trustTitle: '', trustSubtitle: '', trustItems: [], faq: []
  },
  about: { title: '', content: '', heroImg: '' },
  contact: { title: '', description: '' },
  products: { title: '', subtitle: '' },
  news: { title: '', subtitle: '' },
  inquiry: { title: '', subtitle: '' }
};

export default function PagesManagement() {
  const { pages, materials, categories, refreshData } = useProducts();
  const [localPages, setLocalPages] = useState<PageContent>(DEFAULT_PAGES);
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'contact' | 'others'>('home');
  const [loading, setLoading] = useState(false);
  const [showMatPicker, setShowMatPicker] = useState<{ active: boolean, target: string }>({ active: false, target: '' });
  const [lastSelectedAboutImg, setLastSelectedAboutImg] = useState<string | null>(null);

  useEffect(() => {
    if (pages && typeof pages === 'object' && !('error' in pages)) {
      try {
        const dbData = JSON.parse(JSON.stringify(pages));
        setLocalPages({
          ...DEFAULT_PAGES,
          ...dbData,
          home: { ...DEFAULT_PAGES.home, ...dbData.home }
        });
      } catch (e) { console.error(e); }
    }
  }, [pages]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(localPages)
      });
      if (res.ok) { await refreshData(); alert('全站装修已更新！'); }
    } catch (e) { alert('保存失败'); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-32">
      {/* 顶部发布条 */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-[100] px-12 py-6 flex justify-between items-center shadow-sm">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900">高级装修中心</h2>
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mt-1">每一处细节均可自定义</p>
        </div>
        <button onClick={handleSave} disabled={loading} className="bg-blue-600 text-white px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200 hover:scale-105 active:scale-95 transition-all disabled:opacity-50">
          {loading ? '同步中...' : '发布全站更改'}
        </button>
      </div>

      <div className="max-w-[1600px] mx-auto px-12 mt-12">
        {/* Tab 导航 */}
        <div className="flex gap-4 mb-12">
           {['home', 'about', 'contact', 'others'].map(id => (
             <button key={id} onClick={() => setActiveTab(id as any)} className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === id ? 'bg-slate-900 text-white shadow-2xl' : 'bg-white text-slate-400 hover:bg-slate-50'}`}>
               {id === 'home' ? '首页模块' : id === 'about' ? '关于我们' : id === 'contact' ? '联系页面' : '列表/新闻'}
             </button>
           ))}
        </div>

        {activeTab === 'home' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* 1. Hero & Advantages */}
            <div className="bg-white p-12 rounded-[56px] shadow-sm border border-slate-100">
               <h3 className="text-xl font-black uppercase text-slate-900 mb-10 flex items-center gap-4"><i className="fas fa-bolt text-blue-600"></i> Hero 视窗与四大优势</h3>
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <input type="text" placeholder="主标题" value={localPages.home.heroTitle} onChange={e => setLocalPages({...localPages, home: {...localPages.home, heroTitle: e.target.value}})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-black text-sm" />
                    <textarea rows={3} placeholder="副标题" value={localPages.home.heroSubtitle} onChange={e => setLocalPages({...localPages, home: {...localPages.home, heroSubtitle: e.target.value}})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-medium text-sm" />
                    <div className="grid grid-cols-2 gap-4">
                      {localPages.home.advantages.map((adv, i) => (
                        <input key={i} type="text" placeholder={`优势点 ${i+1}`} value={adv} onChange={e => {
                          const newAdv = [...localPages.home.advantages];
                          newAdv[i] = e.target.value;
                          setLocalPages({...localPages, home: {...localPages.home, advantages: newAdv}});
                        }} className="bg-blue-50/50 border-none rounded-xl px-4 py-3 text-[10px] font-black uppercase" />
                      ))}
                    </div>
                  </div>
                  <div onClick={() => setShowMatPicker({ active: true, target: 'home.heroImg' })} className="relative aspect-[21/9] rounded-3xl overflow-hidden bg-slate-50 border-2 border-dashed border-slate-100 flex items-center justify-center cursor-pointer">
                    {localPages.home.heroImg ? <Image src={localPages.home.heroImg} alt="" fill className="object-cover" /> : <i className="fas fa-image text-slate-200 text-3xl"></i>}
                  </div>
               </div>
            </div>

            {/* 2. Category Settings (重点) */}
            <div className="bg-white p-12 rounded-[56px] shadow-sm border border-slate-100">
               <h3 className="text-xl font-black uppercase text-slate-900 mb-10 flex items-center gap-4"><i className="fas fa-th-large text-emerald-600"></i> 产品分类装修 (支持 3/5 自动布局)</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                  <input type="text" placeholder="分类板块标题" value={localPages.home.categoryTitle} onChange={e => setLocalPages({...localPages, home: {...localPages.home, categoryTitle: e.target.value}})} className="bg-slate-50 border-none rounded-2xl px-6 py-4 font-black text-sm" />
                  <input type="text" placeholder="分类板块副标题" value={localPages.home.categorySubtitle} onChange={e => setLocalPages({...localPages, home: {...localPages.home, categorySubtitle: e.target.value}})} className="bg-slate-50 border-none rounded-2xl px-6 py-4 font-medium text-sm" />
               </div>
               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {categories.map(cat => (
                    <div key={cat.id} className="space-y-4">
                       <div onClick={() => setShowMatPicker({ active: true, target: `home.categoryImages[${cat.value}]` })} className="relative aspect-square rounded-3xl overflow-hidden bg-slate-50 border-2 border-dashed border-slate-100 flex items-center justify-center cursor-pointer">
                         {localPages.home.categoryImages?.[cat.value] ? <Image src={localPages.home.categoryImages[cat.value]} alt="" fill className="object-cover" /> : <i className="fas fa-plus text-slate-200"></i>}
                       </div>
                       <p className="text-center text-[10px] font-black uppercase text-slate-400">{cat.name}</p>
                    </div>
                  ))}
               </div>
            </div>

            {/* 3. Stats & Video */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               <div className="bg-white p-12 rounded-[56px] shadow-sm border border-slate-100">
                  <h4 className="font-black uppercase text-xs text-slate-900 mb-8">工厂实力数据 (Stats)</h4>
                  <div className="grid grid-cols-2 gap-6">
                    {localPages.home.stats?.map((stat, i) => (
                      <div key={i} className="bg-slate-50 p-6 rounded-2xl">
                         <input type="text" value={stat.value} onChange={e => {
                           const newStats = [...(localPages.home.stats || [])];
                           newStats[i].value = e.target.value;
                           setLocalPages({...localPages, home: {...localPages.home, stats: newStats}});
                         }} className="w-full bg-transparent border-none p-0 text-xl font-black text-blue-600 mb-1" />
                         <input type="text" value={stat.label} onChange={e => {
                           const newStats = [...(localPages.home.stats || [])];
                           newStats[i].label = e.target.value;
                           setLocalPages({...localPages, home: {...localPages.home, stats: newStats}});
                         }} className="w-full bg-transparent border-none p-0 text-[10px] font-black uppercase text-slate-400 tracking-widest" />
                      </div>
                    ))}
                  </div>
               </div>
               <div className="bg-white p-12 rounded-[56px] shadow-sm border border-slate-100">
                  <h4 className="font-black uppercase text-xs text-slate-900 mb-8">视频介绍模块</h4>
                  <div className="space-y-4">
                     <input type="text" placeholder="视频 URL (Youtube/Cloudinary)" value={localPages.home.videoUrl} onChange={e => setLocalPages({...localPages, home: {...localPages.home, videoUrl: e.target.value}})} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-xs font-medium" />
                     <input type="text" placeholder="视频大标题" value={localPages.home.videoTitle} onChange={e => setLocalPages({...localPages, home: {...localPages.home, videoTitle: e.target.value}})} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-black" />
                  </div>
               </div>
            </div>

            {/* 4. Trust Items (资质荣誉) */}
            <div className="bg-white p-12 rounded-[56px] shadow-sm border border-slate-100">
               <div className="flex justify-between items-center mb-10">
                  <h3 className="text-xl font-black uppercase text-slate-900">资质荣誉与证书 (Trust Items)</h3>
                  <button onClick={() => setLocalPages({...localPages, home: {...localPages.home, trustItems: [...(localPages.home.trustItems || []), {img: '', title: '', desc: ''}]}})} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest">添加证书</button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {localPages.home.trustItems?.map((item, i) => (
                    <div key={i} className="group relative bg-slate-50 p-8 rounded-[40px] border border-transparent hover:border-blue-100 transition-all">
                       <button onClick={() => {
                         const newItems = localPages.home.trustItems?.filter((_, idx) => idx !== i);
                         setLocalPages({...localPages, home: {...localPages.home, trustItems: newItems}});
                       }} className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition shadow-lg z-10"><i className="fas fa-times"></i></button>
                       <div onClick={() => setShowMatPicker({ active: true, target: `home.trustItems[${i}].img` })} className="relative aspect-square w-24 mx-auto mb-6 bg-white rounded-2xl shadow-sm flex items-center justify-center overflow-hidden cursor-pointer">
                          {item.img ? <Image src={item.img} alt="" fill className="object-contain p-2" /> : <i className="fas fa-certificate text-slate-200"></i>}
                       </div>
                       <input type="text" placeholder="证书/荣誉名称" value={item.title} onChange={e => {
                          const newItems = [...(localPages.home.trustItems || [])];
                          newItems[i].title = e.target.value;
                          setLocalPages({...localPages, home: {...localPages.home, trustItems: newItems}});
                       }} className="w-full bg-transparent border-none p-0 text-center font-black text-slate-900 text-sm mb-2" />
                       <input type="text" placeholder="简短描述" value={item.desc} onChange={e => {
                          const newItems = [...(localPages.home.trustItems || [])];
                          newItems[i].desc = e.target.value;
                          setLocalPages({...localPages, home: {...localPages.home, trustItems: newItems}});
                       }} className="w-full bg-transparent border-none p-0 text-center font-medium text-slate-400 text-[10px]" />
                    </div>
                  ))}
               </div>
            </div>

            {/* 5. FAQ 折叠问答 */}
            <div className="bg-white p-12 rounded-[56px] shadow-sm border border-slate-100">
               <div className="flex justify-between items-center mb-10">
                  <h3 className="text-xl font-black uppercase text-slate-900">FAQ 常见问题解答</h3>
                  <button onClick={() => setLocalPages({...localPages, home: {...localPages.home, faq: [...(localPages.home.faq || []), {q: '', a: ''}]}})} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest">添加问题</button>
               </div>
               <div className="space-y-4">
                  {localPages.home.faq?.map((f, i) => (
                    <div key={i} className="bg-slate-50 p-8 rounded-3xl relative group">
                       <button onClick={() => {
                         const newFaq = localPages.home.faq?.filter((_, idx) => idx !== i);
                         setLocalPages({...localPages, home: {...localPages.home, faq: newFaq}});
                       }} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition"><i className="fas fa-trash"></i></button>
                       <input type="text" placeholder="问题内容" value={f.q} onChange={e => {
                         const newFaq = [...(localPages.home.faq || [])];
                         newFaq[i].q = e.target.value;
                         setLocalPages({...localPages, home: {...localPages.home, faq: newFaq}});
                       }} className="w-full bg-transparent border-none p-0 font-black text-slate-900 text-sm mb-4" />
                       <textarea placeholder="回答内容" value={f.a} onChange={e => {
                         const newFaq = [...(localPages.home.faq || [])];
                         newFaq[i].a = e.target.value;
                         setLocalPages({...localPages, home: {...localPages.home, faq: newFaq}});
                       }} className="w-full bg-transparent border-none p-0 text-xs font-medium text-slate-500 leading-relaxed" />
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}

        {/* 关于我们 & 其他 (保持之前的稳定性结构) */}
        {activeTab === 'about' && (
          <div className="bg-white p-12 rounded-[56px] shadow-sm border border-slate-100 animate-in fade-in duration-700">
             <h3 className="text-xl font-black uppercase text-slate-900 mb-10">关于我们详述</h3>
             <div className="space-y-10">
                <input type="text" value={localPages.about.title} onChange={e => setLocalPages({...localPages, about: {...localPages.about, title: e.target.value}})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-black text-sm" />
                <div onClick={() => setShowMatPicker({ active: true, target: 'about.heroImg' })} className="relative aspect-[21/9] rounded-3xl overflow-hidden bg-slate-50 border-2 border-dashed border-slate-100 flex items-center justify-center cursor-pointer">
                  {localPages.about.heroImg ? <Image src={localPages.about.heroImg} alt="" fill className="object-cover" /> : <i className="fas fa-image text-slate-200"></i>}
                </div>
                <TiptapEditor content={localPages.about.content || ''} onChange={val => setLocalPages({...localPages, about: {...localPages.about, content: val}})} onOpenLibrary={() => setShowMatPicker({ active: true, target: 'about.content' })} lastSelectedImage={lastSelectedAboutImg || undefined} />
             </div>
          </div>
        )}

        {activeTab === 'contact' && (
           <div className="bg-white p-12 rounded-[56px] border border-slate-100 shadow-sm animate-in fade-in duration-700">
              <h3 className="text-xl font-black uppercase text-slate-900 mb-10">联系引导配置</h3>
              <input type="text" value={localPages.contact.title} onChange={e => setLocalPages({...localPages, contact: {...localPages.contact, title: e.target.value}})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-black text-sm mb-6" />
              <textarea rows={4} value={localPages.contact.description} onChange={e => setLocalPages({...localPages, contact: {...localPages.contact, description: e.target.value}})} className="w-full bg-slate-50 border-none rounded-[28px] px-8 py-6 font-medium text-sm leading-relaxed" />
           </div>
        )}

        {activeTab === 'others' && (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="bg-white p-12 rounded-[56px] border border-slate-100 shadow-sm">
                 <h4 className="font-black uppercase text-xs text-slate-400 mb-8">产品中心页</h4>
                 <input type="text" value={localPages.products.title} onChange={e => setLocalPages({...localPages, products: {...localPages.products, title: e.target.value}})} className="w-full bg-slate-50 border-none rounded-xl px-6 py-4 font-black text-sm mb-4" />
                 <input type="text" value={localPages.products.subtitle || ''} onChange={e => setLocalPages({...localPages, products: {...localPages.products, subtitle: e.target.value}})} className="w-full bg-slate-50 border-none rounded-xl px-6 py-4 font-bold text-xs" />
              </div>
              <div className="bg-white p-12 rounded-[56px] border border-slate-100 shadow-sm">
                 <h4 className="font-black uppercase text-xs text-slate-400 mb-8">新闻动态页</h4>
                 <input type="text" value={localPages.news.title} onChange={e => setLocalPages({...localPages, news: {...localPages.news, title: e.target.value}})} className="w-full bg-slate-50 border-none rounded-xl px-6 py-4 font-black text-sm mb-4" />
                 <input type="text" value={localPages.news.subtitle || ''} onChange={e => setLocalPages({...localPages, news: {...localPages.news, subtitle: e.target.value}})} className="w-full bg-slate-50 border-none rounded-xl px-6 py-4 font-bold text-xs" />
              </div>
           </div>
        )}
      </div>

      {/* 增强型素材选择逻辑 */}
      {showMatPicker.active && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[200] flex items-center justify-center p-6 md:p-12">
           <div className="bg-white w-full max-w-6xl rounded-[80px] shadow-2xl h-full max-h-[900px] flex flex-col overflow-hidden relative">
              <div className="p-12 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-4xl font-black uppercase text-slate-900 tracking-tighter">素材库</h3>
                  <button onClick={() => setShowMatPicker({ active: false, target: '' })} className="w-16 h-16 bg-slate-50 rounded-[28px] flex items-center justify-center text-slate-400 hover:text-red-500 transition"><i className="fas fa-times text-xl"></i></button>
              </div>
              <div className="flex-1 overflow-y-auto p-12 no-scrollbar">
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 pb-12">
                       {materials.map((mat) => (
                         <div key={mat.id} onClick={() => {
                             const target = showMatPicker.target;
                             if (target === 'about.content') {
                               setLastSelectedAboutImg(mat.url);
                               setTimeout(() => setLastSelectedAboutImg(null), 100);
                             } else if (target.includes('categoryImages[')) {
                               const catValue = target.match(/\[(.*?)\]/)?.[1];
                               if (catValue) {
                                 setLocalPages({...localPages, home: {...localPages.home, categoryImages: {...(localPages.home.categoryImages || {}), [catValue]: mat.url}}});
                               }
                             } else if (target.includes('trustItems[')) {
                               const idx = parseInt(target.match(/\[(\d+)\]/)?.[1] || '0');
                               const newTrust = [...(localPages.home.trustItems || [])];
                               if (newTrust[idx]) {
                                 newTrust[idx].img = mat.url;
                                 setLocalPages({...localPages, home: {...localPages.home, trustItems: newTrust}});
                               }
                             } else {
                               const [p, f] = target.split('.');
                               setLocalPages({...localPages, [p]: { ...localPages[p as keyof PageContent], [f]: mat.url }});
                             }
                             setShowMatPicker({ active: false, target: '' });
                           }}
                           className="relative aspect-square rounded-[40px] overflow-hidden cursor-pointer border-4 border-white shadow-sm hover:shadow-2xl transition-all bg-white p-4"
                         >
                           <Image src={mat.url} alt="" fill className="object-contain p-4" />
                        </div>
                     ))}
                  </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}