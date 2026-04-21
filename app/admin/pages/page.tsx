// app/admin/pages/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useProducts, PageContent } from '../../context/ProductContext';

const TiptapEditor = dynamic(() => import('../products/TiptapEditor'), { 
  ssr: false,
  loading: () => <div className="p-10 bg-slate-50 rounded-3xl animate-pulse text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">正在加载富文本编辑器...</div>
});

export default function PagesManagement() {
  const { pages, materials, refreshData } = useProducts();
  const [localPages, setLocalPages] = useState<PageContent | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'contact' | 'others'>('home');
  const [loading, setLoading] = useState(false);
  const [showMatPicker, setShowMatPicker] = useState<{ active: boolean, target: string }>({ active: false, target: '' });
  const [lastSelectedAboutImg, setLastSelectedAboutImg] = useState<string | null>(null);

  useEffect(() => {
    if (pages) {
      try {
        const updatedPages = JSON.parse(JSON.stringify(pages)) as PageContent;
        
        // 彻底确保所有层级的字段都存在，避免访问 undefined
        if (!updatedPages.home) updatedPages.home = { 
          heroTitle: '', heroSubtitle: '', advantages: [], categoryTitle: '', categorySubtitle: '', stats: [] 
        } as any;
        
        if (!updatedPages.home.categoryImages) updatedPages.home.categoryImages = {};
        if (!updatedPages.home.advantages) updatedPages.home.advantages = [];
        if (!updatedPages.home.stats) updatedPages.home.stats = [
          { label: 'Years Experience', value: '20+' },
          { label: 'Global Clients', value: '500+' },
          { label: 'Countries Served', value: '80+' },
          { label: 'Industry Awards', value: '50+' }
        ];
        if (!updatedPages.home.trustItems) updatedPages.home.trustItems = [];
        if (!updatedPages.home.faq) updatedPages.home.faq = [];
        if (!updatedPages.home.featuredCount) updatedPages.home.featuredCount = 6;
        
        if (!updatedPages.about) updatedPages.about = { title: '', content: '', heroImg: '' };
        if (updatedPages.about.content === undefined) updatedPages.about.content = '';
        
        if (!updatedPages.contact) updatedPages.contact = { title: '', description: '' };
        if (!updatedPages.products) updatedPages.products = { title: '', subtitle: '' } as any;
        if (!updatedPages.news) updatedPages.news = { title: '', subtitle: '' } as any;
        
        setLocalPages(updatedPages);
      } catch (e) {
        console.error("Critical error in initializing pages data:", e);
      }
    }
  }, [pages]);

  const handleSave = async () => {
    if (!localPages) return;
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
        alert('保存失败，请稍后重试');
      }
    } catch (e) {
      console.error(e);
      alert('保存出错');
    } finally {
      setLoading(false);
    }
  };

  if (!localPages || !localPages.home || !localPages.about || !localPages.contact) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-blue-600 rounded-[32px] mx-auto flex items-center justify-center text-white text-3xl animate-bounce">
            <i className="fas fa-sync-alt"></i>
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900">正在同步站点配置...</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">初次加载或数据同步中，请稍候</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in slide-in-from-bottom-8 duration-700 pb-20 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
           <h2 className="text-5xl font-black uppercase tracking-tighter text-slate-900 leading-none">页面内容管理</h2>
           <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] mt-4 tracking-[0.3em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> 装修独立站的前端展示模块与文案
           </p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={loading}
          className="bg-slate-900 text-white px-12 py-5 rounded-[24px] font-black uppercase text-[10px] tracking-[0.3em] shadow-2xl shadow-slate-200 hover:bg-blue-600 transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50"
        >
          {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>}
          <span>保存全站更新</span>
        </button>
      </div>

      {/* 选项卡导航 */}
      <div className="flex bg-white p-3 rounded-[32px] shadow-sm border border-slate-100 w-fit">
        {(['home', 'about', 'contact', 'others'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-400 hover:text-slate-900'}`}
          >
            {tab === 'home' ? '首页装修' : tab === 'about' ? '关于我们' : tab === 'contact' ? '联系我们' : '其他页面'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-12">
        {activeTab === 'home' && (
          <div className="space-y-10">
            {/* 1. Hero Section */}
            <div className="bg-white p-12 rounded-[56px] shadow-sm border border-slate-100">
               <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 mb-10 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600"><i className="fas fa-bolt"></i></div> 
                  1. 首页 Hero 轮播模块
               </h3>
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div>
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-4 tracking-[0.3em]">主标题 (Hero Title)</label>
                      <input 
                        type="text" 
                        value={localPages.home.heroTitle || ''}
                        onChange={e => setLocalPages({...localPages, home: {...localPages.home, heroTitle: e.target.value}})}
                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-black text-sm focus:ring-4 ring-blue-500/10 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-4 tracking-[0.3em]">副标题 (Hero Subtitle)</label>
                      <textarea 
                        rows={4}
                        value={localPages.home.heroSubtitle || ''}
                        onChange={e => setLocalPages({...localPages, home: {...localPages.home, heroSubtitle: e.target.value}})}
                        className="w-full bg-slate-50 border-none rounded-[28px] px-8 py-6 font-medium text-sm leading-relaxed focus:ring-4 ring-blue-500/10 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-4 tracking-[0.3em]">核心优势 (Advantages - 每行一个)</label>
                      <textarea 
                        rows={4}
                        value={(localPages.home.advantages || []).join('\n')}
                        onChange={e => setLocalPages({...localPages, home: {...localPages.home, advantages: e.target.value.split('\n')}})}
                        placeholder="例如: 8.8/10.9/12.9 GRADE SPECIALIST"
                        className="w-full bg-slate-50 border-none rounded-[28px] px-8 py-6 font-black text-[10px] uppercase tracking-widest leading-loose focus:ring-4 ring-blue-500/10 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-6">
                     <label className="block text-[9px] font-black uppercase text-slate-400 mb-4 tracking-[0.3em]">首页头图 (Hero Image)</label>
                     <div 
                        onClick={() => setShowMatPicker({ active: true, target: 'home.heroImg' })}
                        className="relative aspect-video rounded-[48px] overflow-hidden bg-slate-50 border-4 border-dashed border-slate-100 flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/20 transition-all group shadow-inner"
                     >
                        {localPages.home.heroImg ? (
                          <Image src={localPages.home.heroImg} alt="Hero" fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
                        ) : (
                          <i className="fas fa-plus text-slate-200 text-4xl"></i>
                        )}
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                           <span className="bg-white text-slate-900 px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">更换素材库图片</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* 2. Category Section */}
            <div className="bg-white p-12 rounded-[56px] shadow-sm border border-slate-100">
               <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 mb-10 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600"><i className="fas fa-th-large"></i></div> 
                  2. 产品分类模块 (适配布局)
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                  <div>
                    <label className="block text-[9px] font-black uppercase text-slate-400 mb-4 tracking-[0.3em]">模块主标题</label>
                    <input 
                      type="text" 
                      value={localPages.home.categoryTitle || 'Featured Categories'}
                      onChange={e => setLocalPages({...localPages, home: {...localPages.home, categoryTitle: e.target.value}})}
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-black text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black uppercase text-slate-400 mb-4 tracking-[0.3em]">模块简短介绍</label>
                    <input 
                      type="text" 
                      value={localPages.home.categorySubtitle || 'Premium Selection for Global Infrastructure'}
                      onChange={e => setLocalPages({...localPages, home: {...localPages.home, categorySubtitle: e.target.value}})}
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-xs"
                    />
                  </div>
               </div>
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {categories.map(cat => (
                    <div key={cat.id} className="space-y-4">
                      <div 
                        onClick={() => setShowMatPicker({ active: true, target: `home.categoryImages[${cat.value}]` })}
                        className="relative aspect-[4/5] rounded-[32px] overflow-hidden bg-slate-50 border border-slate-100 cursor-pointer hover:border-blue-400 transition-all group"
                      >
                        {localPages.home.categoryImages?.[cat.value] ? (
                          <Image src={localPages.home.categoryImages[cat.value]} alt={cat.name} fill className="object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 gap-2">
                            <i className="fas fa-image text-xl"></i>
                            <span className="text-[8px] font-black uppercase tracking-tighter">设置封面图</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                          <span className="text-[8px] text-white font-black uppercase">更换</span>
                        </div>
                      </div>
                      <p className="text-center font-black uppercase text-[10px] tracking-widest text-slate-900">{cat.name}</p>
                    </div>
                  ))}
               </div>
            </div>

            {/* 3. Featured Products Section */}
            <div className="bg-white p-12 rounded-[56px] shadow-sm border border-slate-100">
               <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 mb-10 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600"><i className="fas fa-star"></i></div> 
                  3. 优质产品推荐模块
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  <div>
                    <label className="block text-[9px] font-black uppercase text-slate-400 mb-4 tracking-[0.3em]">模块主标题</label>
                    <input 
                      type="text" 
                      value={localPages.home.featuredTitle || 'High Precision Fasteners'}
                      onChange={e => setLocalPages({...localPages, home: {...localPages.home, featuredTitle: e.target.value}})}
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-black text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[9px] font-black uppercase text-slate-400 mb-4 tracking-[0.3em]">模块简短介绍</label>
                    <input 
                      type="text" 
                      value={localPages.home.featuredSubtitle || 'Engineered for Performance and Durability'}
                      onChange={e => setLocalPages({...localPages, home: {...localPages.home, featuredSubtitle: e.target.value}})}
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-xs"
                    />
                  </div>
               </div>
               <div className="mt-8">
                  <label className="block text-[9px] font-black uppercase text-slate-400 mb-4 tracking-[0.3em]">展示产品数量 (默认 6)</label>
                  <select 
                    value={localPages.home.featuredCount || 6}
                    onChange={e => setLocalPages({...localPages, home: {...localPages.home, featuredCount: parseInt(e.target.value)}})}
                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-black text-sm"
                  >
                    <option value={4}>4 个 (2x2)</option>
                    <option value={6}>6 个 (3x2)</option>
                    <option value={8}>8 个 (4x2)</option>
                  </select>
               </div>
            </div>

            {/* 4. Video & Stats Section */}
            <div className="bg-white p-12 rounded-[56px] shadow-sm border border-slate-100">
               <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 mb-10 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center text-red-600"><i className="fas fa-play"></i></div> 
                  4. 视频介绍与核心数据 (Stats)
               </h3>
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-4 tracking-[0.3em]">视频标题</label>
                      <input 
                        type="text" 
                        value={localPages.home.videoTitle || 'Inside Our Factory'}
                        onChange={e => setLocalPages({...localPages, home: {...localPages.home, videoTitle: e.target.value}})}
                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-black text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-4 tracking-[0.3em]">视频 YouTube URL / MP4 URL</label>
                      <input 
                        type="text" 
                        placeholder="https://..."
                        value={localPages.home.videoUrl || ''}
                        onChange={e => setLocalPages({...localPages, home: {...localPages.home, videoUrl: e.target.value}})}
                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-4 tracking-[0.3em]">右侧文字介绍</label>
                      <textarea 
                        rows={6}
                        value={localPages.home.videoText || ''}
                        onChange={e => setLocalPages({...localPages, home: {...localPages.home, videoText: e.target.value}})}
                        className="w-full bg-slate-50 border-none rounded-[28px] px-8 py-6 font-medium text-sm leading-relaxed"
                      />
                    </div>
                  </div>
                  <div className="space-y-8">
                    <label className="block text-[9px] font-black uppercase text-slate-400 mb-2 tracking-[0.3em]">核心优势数据 (Stats)</label>
                    <div className="grid grid-cols-2 gap-4">
                      {(localPages.home.stats || []).map((stat, i) => (
                        <div key={i} className="bg-slate-50 p-6 rounded-3xl space-y-3">
                           <input 
                             type="text" 
                             value={stat.value} 
                             onChange={e => {
                               const newStats = [...(localPages.home.stats || [])];
                               newStats[i].value = e.target.value;
                               setLocalPages({...localPages, home: {...localPages.home, stats: newStats}});
                             }}
                             className="w-full bg-transparent border-none p-0 font-black text-2xl text-blue-600"
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
            </div>

            {/* 5. Trust (Certificates/Exhibition) Section */}
            <div className="bg-white p-12 rounded-[56px] shadow-sm border border-slate-100">
               <div className="flex justify-between items-center mb-10">
                  <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 flex items-center gap-4">
                     <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600"><i className="fas fa-award"></i></div> 
                     5. 实力展示 (证书/展会/资质)
                  </h3>
                  <button 
                    onClick={() => setLocalPages({
                      ...localPages,
                      home: {
                        ...localPages.home,
                        trustItems: [...(localPages.home.trustItems || []), { img: '', title: '新证书/展会', desc: '简短描述' }]
                      }
                    } as PageContent)}
                    className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-emerald-700 transition shadow-lg"
                  >
                    <i className="fas fa-plus"></i> 添加项
                  </button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {(localPages.home.trustItems || []).map((item, i) => (
                    <div key={i} className="bg-slate-50 p-8 rounded-[40px] space-y-6 relative group">
                       <button 
                         onClick={() => {
                           const newTrust = (localPages.home.trustItems || []).filter((_, idx) => idx !== i);
                           setLocalPages({...localPages, home: {...localPages.home, trustItems: newTrust}});
                         }}
                         className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center text-red-500 opacity-0 group-hover:opacity-100 transition shadow-sm z-10"
                       >
                         <i className="fas fa-times"></i>
                       </button>
                       <div 
                         onClick={() => setShowMatPicker({ active: true, target: `home.trustItems[${i}]` })}
                         className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-slate-200 cursor-pointer flex items-center justify-center"
                       >
                          {item.img ? <Image src={item.img} alt="" fill className="object-contain p-4" /> : <i className="fas fa-image text-slate-200 text-2xl"></i>}
                       </div>
                       <input 
                         type="text" 
                         value={item.title}
                         onChange={e => {
                           const newTrust = [...(localPages.home.trustItems || [])];
                           newTrust[i].title = e.target.value;
                           setLocalPages({...localPages, home: {...localPages.home, trustItems: newTrust}});
                         }}
                         className="w-full bg-transparent border-none p-0 font-black uppercase text-xs text-slate-900 tracking-widest text-center"
                       />
                       <input 
                         type="text" 
                         value={item.desc}
                         onChange={e => {
                           const newTrust = [...(localPages.home.trustItems || [])];
                           newTrust[i].desc = e.target.value;
                           setLocalPages({...localPages, home: {...localPages.home, trustItems: newTrust}});
                         }}
                         className="w-full bg-transparent border-none p-0 text-[10px] font-bold text-slate-400 text-center"
                       />
                    </div>
                  ))}
                  {(localPages.home.trustItems || []).length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-300 font-black uppercase text-[10px] tracking-[0.4em]">
                       点击右上角“添加项”开始装修
                    </div>
                  )}
               </div>
            </div>

            {/* 6. FAQ Section */}
            <div className="bg-white p-12 rounded-[56px] shadow-sm border border-slate-100">
               <div className="flex justify-between items-center mb-10">
                  <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 flex items-center gap-4">
                     <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600"><i className="fas fa-question-circle"></i></div> 
                     6. 常见问题解答 (FAQ)
                  </h3>
                  <button 
                    onClick={() => setLocalPages({
                      ...localPages,
                      home: {
                        ...localPages.home,
                        faq: [...(localPages.home.faq || []), { q: '这是一个新问题？', a: '这是问题的详细解答，客户点击后展开。' }]
                      }
                    } as PageContent)}
                    className="bg-purple-600 text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-purple-700 transition shadow-lg"
                  >
                    <i className="fas fa-plus"></i> 添加问题
                  </button>
               </div>
               <div className="space-y-6">
                  {(localPages.home.faq || []).map((faq, i) => (
                    <div key={i} className="bg-slate-50 p-8 rounded-[32px] space-y-4 group relative">
                       <button 
                         onClick={() => {
                           const newFaq = (localPages.home.faq || []).filter((_, idx) => idx !== i);
                           setLocalPages({...localPages, home: {...localPages.home, faq: newFaq}});
                         }}
                         className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center text-red-500 opacity-0 group-hover:opacity-100 transition shadow-sm z-10"
                       >
                         <i className="fas fa-times"></i>
                       </button>
                       <input 
                         type="text" 
                         value={faq.q}
                         onChange={e => {
                           const newFaq = [...(localPages.home.faq || [])];
                           newFaq[i].q = e.target.value;
                           setLocalPages({...localPages, home: {...localPages.home, faq: newFaq}});
                         }}
                         placeholder="输入问题..."
                         className="w-full bg-transparent border-none p-0 font-black text-slate-900 text-sm tracking-tight"
                       />
                       <textarea 
                         rows={2}
                         value={faq.a}
                         onChange={e => {
                           const newFaq = [...(localPages.home.faq || [])];
                           newFaq[i].a = e.target.value;
                           setLocalPages({...localPages, home: {...localPages.home, faq: newFaq}});
                         }}
                         placeholder="输入答案内容..."
                         className="w-full bg-transparent border-none p-0 text-xs font-medium text-slate-500 leading-relaxed"
                       />
                    </div>
                  ))}
                  {(localPages.home.faq || []).length === 0 && (
                    <div className="py-12 text-center text-slate-300 font-black uppercase text-[10px] tracking-[0.4em]">
                       点击右上角“添加问题”开始装修
                    </div>
                  )}
               </div>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="space-y-10">
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
                      content={localPages.about.content} 
                      onChange={val => setLocalPages({...localPages, about: {...localPages.about, content: val}})}
                      onOpenLibrary={() => setShowMatPicker({ active: true, target: 'about.content' })}
                      lastSelectedImage={lastSelectedAboutImg || undefined}
                    />
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="space-y-10">
            <div className="bg-white p-12 rounded-[56px] shadow-sm border border-slate-100">
               <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 mb-10 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600"><i className="fas fa-envelope"></i></div> 
                  联系我们页面配置
               </h3>
               <div className="space-y-8 max-w-2xl">
                  <div>
                    <label className="block text-[9px] font-black uppercase text-slate-400 mb-4 tracking-[0.3em]">主标题</label>
                    <input 
                      type="text" 
                      value={localPages.contact.title}
                      onChange={e => setLocalPages({...localPages, contact: {...localPages.contact, title: e.target.value}})}
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-black text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black uppercase text-slate-400 mb-4 tracking-[0.3em]">引导文案</label>
                    <textarea 
                      rows={4}
                      value={localPages.contact.description}
                      onChange={e => setLocalPages({...localPages, contact: {...localPages.contact, description: e.target.value}})}
                      className="w-full bg-slate-50 border-none rounded-[28px] px-8 py-6 font-medium text-sm leading-relaxed"
                    />
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'others' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="bg-white p-12 rounded-[56px] shadow-sm border border-slate-100">
                <h3 className="text-lg font-black uppercase tracking-tighter text-slate-900 mb-8 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400"><i className="fas fa-boxes-stacked"></i></div> 
                  产品列表页
                </h3>
                <div className="space-y-6">
                  <input 
                    type="text" 
                    placeholder="标题"
                    value={localPages.products.title}
                    onChange={e => setLocalPages({...localPages, products: {...localPages.products, title: e.target.value}})}
                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-black text-sm"
                  />
                  <input 
                    type="text" 
                    placeholder="副标题"
                    value={localPages.products.subtitle}
                    onChange={e => setLocalPages({...localPages, products: {...localPages.products, subtitle: e.target.value}})}
                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-xs"
                  />
                </div>
              </div>

              <div className="bg-white p-12 rounded-[56px] shadow-sm border border-slate-100">
                <h3 className="text-lg font-black uppercase tracking-tighter text-slate-900 mb-8 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400"><i className="fas fa-newspaper"></i></div> 
                  新闻动态页
                </h3>
                <div className="space-y-6">
                  <input 
                    type="text" 
                    placeholder="标题"
                    value={localPages.news.title}
                    onChange={e => setLocalPages({...localPages, news: {...localPages.news, title: e.target.value}})}
                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-black text-sm"
                  />
                  <input 
                    type="text" 
                    placeholder="副标题"
                    value={localPages.news.subtitle}
                    onChange={e => setLocalPages({...localPages, news: {...localPages.news, subtitle: e.target.value}})}
                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 素材库选择器 */}
      {showMatPicker.active && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[200] flex items-center justify-center p-6 md:p-12">
           <div className="bg-white w-full max-w-6xl rounded-[80px] shadow-2xl h-full max-h-[900px] flex flex-col overflow-hidden animate-in zoom-in duration-700 relative">
              <div className="p-12 border-b border-slate-100 flex justify-between items-center relative z-10">
                 <div>
                   <h3 className="text-4xl font-black uppercase text-slate-900 tracking-tighter leading-none">素材库选择器</h3>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-3">为页面模块选择视觉素材</p>
                 </div>
                 <button onClick={() => setShowMatPicker({ active: false, target: '' })} className="w-16 h-16 bg-slate-50 rounded-[28px] flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition shadow-sm"><i className="fas fa-times text-xl"></i></button>
              </div>
              <div className="flex-1 overflow-y-auto p-12 no-scrollbar">
                 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 pb-12">
                      {materials.map((mat) => (
                        <div key={mat.id} onClick={() => {
                            const target = showMatPicker.target;
                            
                            if (target === 'about.content') {
                              setLastSelectedAboutImg(mat.url);
                              setTimeout(() => setLastSelectedAboutImg(null), 100);
                            } else if (target.startsWith('home.categoryImages[')) {
                              const catValue = target.match(/\[(.*?)\]/)?.[1];
                              if (catValue) {
                                setLocalPages({
                                  ...localPages,
                                  home: {
                                    ...localPages.home,
                                    categoryImages: {
                                      ...(localPages.home.categoryImages || {}),
                                      [catValue]: mat.url
                                    }
                                  }
                                } as PageContent);
                              }
                            } else if (target.startsWith('home.trustItems[')) {
                               const idx = parseInt(target.match(/\[(\d+)\]/)?.[1] || '0');
                               const newTrust = [...(localPages.home.trustItems || [])];
                               if (newTrust[idx]) {
                                 newTrust[idx] = { ...newTrust[idx], img: mat.url };
                                 setLocalPages({
                                   ...localPages,
                                   home: { ...localPages.home, trustItems: newTrust }
                                 } as PageContent);
                               }
                            } else {
                              const parts = target.split('.');
                              const page = parts[0] as keyof PageContent;
                              const field = parts[1];
                              
                              setLocalPages({
                                ...localPages,
                                [page]: {
                                  ...localPages[page],
                                  [field]: mat.url
                                }
                              } as PageContent);
                            }
                            setShowMatPicker({ active: false, target: '' });
                          }}
                          className="relative aspect-square rounded-[40px] overflow-hidden cursor-pointer border-4 border-white transition-all duration-500 bg-white p-4 shadow-sm hover:shadow-2xl hover:-translate-y-2 hover:border-blue-200"
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
