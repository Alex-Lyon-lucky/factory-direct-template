// app/admin/pages/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useProducts, PageContent } from '../../context/ProductContext';

// 强制禁用 SSR，解决编辑器加载冲突
const TiptapEditor = dynamic(() => import('../products/TiptapEditor'), { 
  ssr: false,
  loading: () => <div className="p-10 bg-slate-50 rounded-3xl animate-pulse text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">正在加载编辑器组件...</div>
});

// 定义默认数据结构，防止页面因字段缺失崩溃
const DEFAULT_PAGES: PageContent = {
  home: {
    heroTitle: '', heroSubtitle: '', advantages: [], 
    categoryTitle: '', categorySubtitle: '', categoryImages: {},
    featuredTitle: '', featuredSubtitle: '', featuredCount: 6,
    videoTitle: '', videoSubtitle: '', videoUrl: '', videoDesc: '',
    stats: [{ label: 'Years Experience', value: '20+' }, { label: 'Global Clients', value: '500+' }],
    trustTitle: '', trustSubtitle: '', trustItems: [], faq: []
  },
  about: { title: '', content: '', heroImg: '' },
  contact: { title: '', description: '' },
  products: { title: '', subtitle: '' },
  news: { title: '', subtitle: '' },
  inquiry: { title: '', subtitle: '' }
};

export default function PagesManagement() {
  const { pages, materials, refreshData } = useProducts();
  // 初始值直接给默认对象，不再给 null，这样页面能秒开
  const [localPages, setLocalPages] = useState<PageContent>(DEFAULT_PAGES);
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'contact' | 'others'>('home');
  const [loading, setLoading] = useState(false);
  const [showMatPicker, setShowMatPicker] = useState<{ active: boolean, target: string }>({ active: false, target: '' });
  const [lastSelectedAboutImg, setLastSelectedAboutImg] = useState<string | null>(null);

  // 当数据库数据加载完成后，进行合并
  useEffect(() => {
    if (pages && typeof pages === 'object' && !('error' in pages)) {
      try {
        const dbPages = JSON.parse(JSON.stringify(pages));
        setLocalPages({
          ...DEFAULT_PAGES,
          ...dbPages,
          home: { ...DEFAULT_PAGES.home, ...dbPages.home },
          about: { ...DEFAULT_PAGES.about, ...dbPages.about },
          contact: { ...DEFAULT_PAGES.contact, ...dbPages.contact },
          products: { ...DEFAULT_PAGES.products, ...dbPages.products },
          news: { ...DEFAULT_PAGES.news, ...dbPages.news }
        });
      } catch (e) {
        console.error("Data merge error:", e);
      }
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
      if (res.ok) {
        await refreshData();
        alert('页面内容已成功保存！');
      } else {
        alert('保存失败，请检查网络');
      }
    } catch (e) {
      alert('保存出错');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24">
      {/* 顶部控制条 */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-[100] px-12 py-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900">页面装修中心</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-1">可视化管理全站内容展示</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleSave}
            disabled={loading}
            className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? '正在保存...' : '立即发布更改'}
          </button>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-12 mt-12">
        {/* Tab 导航 */}
        <div className="flex gap-4 mb-12">
           {[
             { id: 'home', label: '首页装修', icon: 'fa-home' },
             { id: 'about', label: '关于我们', icon: 'fa-info-circle' },
             { id: 'contact', label: '联系页面', icon: 'fa-envelope' },
             { id: 'others', label: '其他页面', icon: 'fa-ellipsis-h' }
           ].map(tab => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-2xl' : 'bg-white text-slate-400 hover:bg-slate-50'}`}
             >
               <i className={`fas ${tab.icon}`}></i> {tab.label}
             </button>
           ))}
        </div>

        {/* 首页装修 */}
        {activeTab === 'home' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* HERO 配置 */}
            <div className="bg-white p-12 rounded-[56px] shadow-sm border border-slate-100">
               <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 mb-10 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600"><i className="fas fa-bolt"></i></div> 
                  Hero 顶部视窗配置
               </h3>
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-8">
                     <div>
                       <label className="block text-[9px] font-black uppercase text-slate-400 mb-4 tracking-[0.3em]">主标题 (Hero Title)</label>
                       <input 
                         type="text" 
                         value={localPages.home.heroTitle}
                         onChange={e => setLocalPages({...localPages, home: {...localPages.home, heroTitle: e.target.value}})}
                         className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-black text-sm"
                       />
                     </div>
                     <div>
                       <label className="block text-[9px] font-black uppercase text-slate-400 mb-4 tracking-[0.3em]">副标题 (Hero Subtitle)</label>
                       <textarea 
                         rows={3}
                         value={localPages.home.heroSubtitle}
                         onChange={e => setLocalPages({...localPages, home: {...localPages.home, heroSubtitle: e.target.value}})}
                         className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-medium text-sm"
                       />
                     </div>
                  </div>
                  <div className="space-y-6">
                    <label className="block text-[9px] font-black uppercase text-slate-400 mb-4 tracking-[0.3em]">背景图 / 封面图</label>
                    <div 
                      onClick={() => setShowMatPicker({ active: true, target: 'home.heroImg' })}
                      className="relative aspect-[21/9] rounded-3xl overflow-hidden bg-slate-50 border-2 border-dashed border-slate-100 flex items-center justify-center cursor-pointer group"
                    >
                      {localPages.home.heroImg ? (
                        <Image src={localPages.home.heroImg} alt="Hero" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                      ) : (
                        <div className="text-center">
                          <i className="fas fa-plus text-slate-200 text-2xl mb-2"></i>
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">选择素材</p>
                        </div>
                      )}
                    </div>
                  </div>
               </div>
            </div>

            {/* 核心数据模块 */}
            <div className="bg-white p-12 rounded-[56px] shadow-sm border border-slate-100">
               <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 mb-10 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600"><i className="fas fa-chart-line"></i></div> 
                  工厂实力数据 (Stats)
               </h3>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {(localPages.home.stats || []).map((stat, i) => (
                    <div key={i} className="bg-slate-50 p-8 rounded-3xl">
                       <input 
                         type="text" 
                         value={stat.value}
                         onChange={e => {
                           const newStats = [...(localPages.home.stats || [])];
                           newStats[i].value = e.target.value;
                           setLocalPages({...localPages, home: {...localPages.home, stats: newStats}});
                         }}
                         className="w-full bg-transparent border-none p-0 text-2xl font-black text-blue-600 mb-2"
                       />
                       <input 
                         type="text" 
                         value={stat.label}
                         onChange={e => {
                           const newStats = [...(localPages.home.stats || [])];
                           newStats[i].label = e.target.value;
                           setLocalPages({...localPages, home: {...localPages.home, stats: newStats}});
                         }}
                         className="w-full bg-transparent border-none p-0 text-[10px] font-black uppercase text-slate-400 tracking-widest"
                       />
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}

        {/* 关于我们装修 */}
        {activeTab === 'about' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-white p-12 rounded-[56px] shadow-sm border border-slate-100">
                <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 mb-10 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600"><i className="fas fa-info-circle"></i></div> 
                  关于我们页面配置
                </h3>
                <div className="space-y-10">
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                     <div>
                       <label className="block text-[9px] font-black uppercase text-slate-400 mb-4 tracking-[0.3em]">页面标题</label>
                       <input 
                         type="text" 
                         value={localPages.about.title}
                         onChange={e => setLocalPages({...localPages, about: {...localPages.about, title: e.target.value}})}
                         className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-black text-sm"
                       />
                     </div>
                     <div className="space-y-6">
                       <label className="block text-[9px] font-black uppercase text-slate-400 mb-4 tracking-[0.3em]">顶部横幅图</label>
                       <div 
                         onClick={() => setShowMatPicker({ active: true, target: 'about.heroImg' })}
                         className="relative aspect-[21/9] rounded-3xl overflow-hidden bg-slate-50 border-2 border-dashed border-slate-100 flex items-center justify-center cursor-pointer"
                       >
                         {localPages.about.heroImg ? (
                           <Image src={localPages.about.heroImg} alt="About" fill className="object-cover" />
                         ) : (
                           <i className="fas fa-plus text-slate-200"></i>
                         )}
                       </div>
                     </div>
                   </div>
                   <div>
                     <label className="block text-[9px] font-black uppercase text-slate-400 mb-6 tracking-[0.3em]">公司介绍详述 (Rich Text)</label>
                     <TiptapEditor 
                       content={localPages.about.content || ''} 
                       onChange={val => setLocalPages({...localPages, about: {...localPages.about, content: val}})}
                       onOpenLibrary={() => setShowMatPicker({ active: true, target: 'about.content' })}
                       lastSelectedImage={lastSelectedAboutImg || undefined}
                     />
                   </div>
                </div>
            </div>
          </div>
        )}

        {/* 其他页面简单的配置 */}
        {activeTab === 'contact' && (
           <div className="bg-white p-12 rounded-[56px] shadow-sm border border-slate-100 animate-in fade-in duration-700">
              <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 mb-10">联系我们配置</h3>
              <div className="space-y-8 max-w-2xl">
                <input 
                  type="text" 
                  value={localPages.contact.title}
                  onChange={e => setLocalPages({...localPages, contact: {...localPages.contact, title: e.target.value}})}
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-black text-sm"
                  placeholder="标题"
                />
                <textarea 
                  rows={4}
                  value={localPages.contact.description}
                  onChange={e => setLocalPages({...localPages, contact: {...localPages.contact, description: e.target.value}})}
                  className="w-full bg-slate-50 border-none rounded-[28px] px-8 py-6 font-medium text-sm leading-relaxed"
                  placeholder="引导描述"
                />
              </div>
           </div>
        )}

        {activeTab === 'others' && (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in fade-in duration-700">
              <div className="bg-white p-12 rounded-[56px] border border-slate-100 shadow-sm">
                 <h4 className="font-black uppercase text-[10px] tracking-[0.3em] text-slate-400 mb-8">产品列表页</h4>
                 <input 
                   type="text" 
                   value={localPages.products?.title || ''}
                   onChange={e => setLocalPages({...localPages, products: {...(localPages.products || {}), title: e.target.value} as any})}
                   className="w-full bg-slate-50 border-none rounded-xl px-6 py-4 font-black text-sm mb-4"
                   placeholder="主标题"
                 />
              </div>
              <div className="bg-white p-12 rounded-[56px] border border-slate-100 shadow-sm">
                 <h4 className="font-black uppercase text-[10px] tracking-[0.3em] text-slate-400 mb-8">新闻动态页</h4>
                 <input 
                   type="text" 
                   value={localPages.news?.title || ''}
                   onChange={e => setLocalPages({...localPages, news: {...(localPages.news || {}), title: e.target.value} as any})}
                   className="w-full bg-slate-50 border-none rounded-xl px-6 py-4 font-black text-sm"
                   placeholder="主标题"
                 />
              </div>
           </div>
        )}
      </div>

      {/* 素材库选择器 - 保持原有逻辑 */}
      {showMatPicker.active && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[200] flex items-center justify-center p-6 md:p-12">
           <div className="bg-white w-full max-w-6xl rounded-[80px] shadow-2xl h-full max-h-[900px] flex flex-col overflow-hidden relative">
              <div className="p-12 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-4xl font-black uppercase text-slate-900 tracking-tighter">素材库选择器</h3>
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
                             } else {
                               const parts = target.split('.');
                               const page = parts[0] as keyof PageContent;
                               const field = parts[1];
                               setLocalPages({
                                 ...localPages,
                                 [page]: { ...localPages[page], [field]: mat.url }
                               });
                             }
                             setShowMatPicker({ active: false, target: '' });
                           }}
                           className="relative aspect-square rounded-[40px] overflow-hidden cursor-pointer border-4 border-white shadow-sm hover:shadow-2xl hover:-translate-y-2 hover:border-blue-200 transition-all bg-white p-4"
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