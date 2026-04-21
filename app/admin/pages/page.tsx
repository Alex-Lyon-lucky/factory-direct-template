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
  about: { 
    title: '', content: '', heroImg: '',
    videoTitle: '', videoSubtitle: '', videoUrl: '', videoDesc: '',
    serviceTitle: 'Professional Service', 
    serviceSubtitle: 'Providing you with comprehensive and professional pre-sales and after-sales services',
    serviceContent: '', serviceImg: '',
    partnersTitle: 'Our Strategic Partners', partnersSubtitle: '', partners: []
  },
  contact: { title: '', description: '' },
  products: { title: '', subtitle: '' },
  news: { title: '', subtitle: '' },
  inquiry: { title: '', subtitle: '' }
};

const PagesManagement = () => {
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
          home: { 
            ...DEFAULT_PAGES.home, 
            ...dbData.home,
            advantages: dbData.home?.advantages || DEFAULT_PAGES.home.advantages,
            stats: dbData.home?.stats || DEFAULT_PAGES.home.stats,
            trustItems: dbData.home?.trustItems || [],
            faq: dbData.home?.faq || []
          },
          about: {
            ...DEFAULT_PAGES.about,
            ...dbData.about,
            partners: dbData.about?.partners || []
          }
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
      if (res.ok) { await refreshData(); alert('✅ 全站装修已成功发布！'); }
    } catch (e) { alert('❌ 保存失败'); } finally { setLoading(false); }
  };

  const updateField = (path: string, val: any) => {
    const keys = path.split('.');
    const updated = JSON.parse(JSON.stringify(localPages));
    let current: any = updated;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = val;
    setLocalPages(updated);
  };

  const TitleConfig = ({ prefix }: { prefix: string }) => {
    // prefix is 'home.category' or 'about.service'
    const parts = prefix.split('.');
    const parentKey = parts[0]; 
    const section = parts[1];
    
    const parentData = (localPages as any)[parentKey] || {};
    const title = parentData[`${section}Title`];
    const subtitle = parentData[`${section}Subtitle`];
    const color = parentData[`${section}TitleColor`];
    const subColor = parentData[`${section}SubtitleColor`];
    const align = parentData[`${section}Align`] || 'center';

    return (
      <div className="bg-slate-50/50 p-8 rounded-3xl border border-slate-100 mb-10 space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">模块标题/副标题配置 (通用)</h4>
          <div className="flex bg-white rounded-xl p-1 shadow-sm border border-slate-100">
            {(['left', 'center', 'right'] as const).map(a => (
              <button 
                key={a}
                onClick={() => updateField(`${parentKey}.${section}Align`, a)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${align === a ? 'bg-slate-900 text-white' : 'text-slate-300 hover:text-slate-900'}`}
              >
                <i className={`fas fa-align-${a}`}></i>
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-4">
              <label className="block text-[8px] font-black uppercase text-slate-400 tracking-widest">主标题内容</label>
              <input 
                type="text" 
                value={title || ''} 
                onChange={e => updateField(`${parentKey}.${section}Title`, e.target.value)}
                placeholder="不填则不显示"
                className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm font-black"
              />
              <div className="flex items-center gap-3">
                <label className="text-[8px] font-black uppercase text-slate-400">颜色 (Tailwind Class)</label>
                <input 
                  type="text" 
                  value={color || 'text-slate-900'} 
                  onChange={e => updateField(`${parentKey}.${section}TitleColor`, e.target.value)}
                  placeholder="如: text-blue-600"
                  className="flex-1 bg-white border border-slate-100 rounded-lg px-3 py-1 text-[10px] font-mono"
                />
              </div>
           </div>
           <div className="space-y-4">
              <label className="block text-[8px] font-black uppercase text-slate-400 tracking-widest">副标题内容</label>
              <input 
                type="text" 
                value={subtitle || ''} 
                onChange={e => updateField(`${parentKey}.${section}Subtitle`, e.target.value)}
                placeholder="不填则不显示"
                className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-xs font-bold"
              />
              <div className="flex items-center gap-3">
                <label className="text-[8px] font-black uppercase text-slate-400">颜色 (Tailwind Class)</label>
                <input 
                  type="text" 
                  value={subColor || 'text-slate-400'} 
                  onChange={e => updateField(`${parentKey}.${section}SubtitleColor`, e.target.value)}
                  placeholder="如: text-slate-400"
                  className="flex-1 bg-white border border-slate-100 rounded-lg px-3 py-1 text-[10px] font-mono"
                />
              </div>
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-32">
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-[100] px-12 py-6 flex justify-between items-center shadow-sm">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900">超级装修中心</h2>
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mt-1">可视化控制全站内容</p>
        </div>
        <button onClick={handleSave} disabled={loading} className="bg-blue-600 text-white px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200 hover:scale-105 active:scale-95 transition-all">
          {loading ? '正在同步...' : '立即发布更改'}
        </button>
      </div>

      <div className="max-w-[1600px] mx-auto px-12 mt-12">
        <div className="flex gap-4 mb-12">
           {['home', 'about', 'contact', 'others'].map(id => (
             <button key={id} onClick={() => setActiveTab(id as any)} className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === id ? 'bg-slate-900 text-white' : 'bg-white text-slate-400 hover:bg-slate-50'}`}>
               {id === 'home' ? '首页装修' : id === 'about' ? '关于我们' : id === 'contact' ? '联系我们' : '其它页面'}
             </button>
           ))}
        </div>

        {activeTab === 'home' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* 1. Hero 视窗 */}
            <div className="bg-white p-12 rounded-[56px] shadow-sm border border-slate-100">
               <h3 className="text-xl font-black uppercase text-slate-900 mb-10 flex items-center gap-4"><i className="fas fa-bolt text-blue-600"></i> Hero 视窗 (首屏)</h3>
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <input type="text" placeholder="主标题" value={localPages.home.heroTitle} onChange={e => updateField('home.heroTitle', e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-black text-sm" />
                    <textarea rows={3} placeholder="副标题" value={localPages.home.heroSubtitle} onChange={e => updateField('home.heroSubtitle', e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-medium text-sm" />
                    <div className="grid grid-cols-2 gap-4">
                      {localPages.home.advantages.map((adv, i) => (
                        <input key={i} type="text" placeholder={`优势点 ${i+1}`} value={adv} onChange={e => {
                          const newAdv = [...localPages.home.advantages];
                          newAdv[i] = e.target.value;
                          updateField('home.advantages', newAdv);
                        }} className="bg-blue-50/50 border-none rounded-xl px-4 py-3 text-[10px] font-black uppercase" />
                      ))}
                    </div>
                  </div>
                  <div onClick={() => setShowMatPicker({ active: true, target: 'home.heroImg' })} className="relative aspect-[21/9] rounded-3xl overflow-hidden bg-slate-50 border-2 border-dashed border-slate-100 flex items-center justify-center cursor-pointer">
                    {localPages.home.heroImg ? <Image src={localPages.home.heroImg} alt="" fill className="object-cover" /> : <i className="fas fa-image text-slate-200 text-3xl"></i>}
                  </div>
               </div>
            </div>

            {/* 2. 分类装修 */}
            <div className="bg-white p-12 rounded-[56px] shadow-sm border border-slate-100">
               <h3 className="text-xl font-black uppercase text-slate-900 mb-10 flex items-center gap-4"><i className="fas fa-th-large text-emerald-600"></i> 产品分类模块</h3>
               <TitleConfig prefix="home.category" />
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

            {/* 3. 热门产品 */}
            <div className="bg-white p-12 rounded-[56px] shadow-sm border border-slate-100">
               <h3 className="text-xl font-black uppercase text-slate-900 mb-10 flex items-center gap-4"><i className="fas fa-star text-amber-500"></i> 热门产品展示模块</h3>
               <TitleConfig prefix="home.featured" />
               <div className="max-w-xs">
                  <label className="block text-[9px] font-black uppercase text-slate-400 mb-4 tracking-[0.3em]">展示产品数量</label>
                  <input type="number" value={localPages.home.featuredCount || 6} onChange={e => updateField('home.featuredCount', parseInt(e.target.value))} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-black text-sm" />
               </div>
            </div>

            {/* 4. 数据模块 */}
            <div className="bg-white p-12 rounded-[56px] shadow-sm border border-slate-100">
               <h3 className="text-xl font-black uppercase text-slate-900 mb-10 flex items-center gap-4"><i className="fas fa-chart-bar text-indigo-500"></i> 工厂数据统计模块</h3>
               <TitleConfig prefix="home.stats" />
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {localPages.home.stats?.map((stat, i) => (
                  <div key={i} className="bg-slate-50 p-6 rounded-2xl">
                      <input type="text" value={stat.value} onChange={e => {
                        const newStats = [...(localPages.home.stats || [])];
                        newStats[i].value = e.target.value;
                        updateField('home.stats', newStats);
                      }} className="w-full bg-transparent border-none p-0 text-xl font-black text-blue-600 mb-1" />
                      <input type="text" value={stat.label} onChange={e => {
                        const newStats = [...(localPages.home.stats || [])];
                        newStats[i].label = e.target.value;
                        updateField('home.stats', newStats);
                      }} className="w-full bg-transparent border-none p-0 text-[10px] font-black uppercase text-slate-400 tracking-widest" />
                  </div>
                ))}
              </div>
            </div>

            {/* 5. 视频介绍 */}
            <div className="bg-white p-12 rounded-[56px] shadow-sm border border-slate-100">
               <h3 className="text-xl font-black uppercase text-slate-900 mb-10 flex items-center gap-4"><i className="fas fa-play-circle text-red-500"></i> 视频介绍模块</h3>
               <TitleConfig prefix="home.video" />
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <label className="block text-[9px] font-black uppercase text-slate-400 tracking-widest">视频 URL</label>
                     <input type="text" placeholder="Youtube/Cloudinary URL" value={localPages.home.videoUrl} onChange={e => updateField('home.videoUrl', e.target.value)} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-xs font-medium" />
                  </div>
                  <div className="space-y-4">
                     <label className="block text-[9px] font-black uppercase text-slate-400 tracking-widest">视频短描述</label>
                     <textarea rows={2} placeholder="视频短评" value={localPages.home.videoDesc} onChange={e => updateField('home.videoDesc', e.target.value)} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-xs" />
                  </div>
               </div>
            </div>

            {/* 6. 证书荣誉 */}
            <div className="bg-white p-12 rounded-[56px] shadow-sm border border-slate-100">
               <h3 className="text-xl font-black uppercase text-slate-900 mb-10 flex items-center gap-4"><i className="fas fa-certificate text-amber-600"></i> 资质荣誉模块</h3>
               <TitleConfig prefix="home.trust" />
               <div className="flex justify-end mb-8">
                  <button onClick={() => updateField('home.trustItems', [...(localPages.home.trustItems || []), {img: '', title: '', desc: ''}])} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest">添加证书</button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {localPages.home.trustItems?.map((item, i) => (
                    <div key={i} className="group relative bg-slate-50 p-8 rounded-[40px] border border-transparent hover:border-blue-100 transition-all">
                       <button onClick={() => {
                         const newItems = localPages.home.trustItems?.filter((_, idx) => idx !== i);
                         updateField('home.trustItems', newItems);
                       }} className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition shadow-lg z-10"><i className="fas fa-times"></i></button>
                       <div onClick={() => setShowMatPicker({ active: true, target: `home.trustItems[${i}].img` })} className="relative aspect-square w-24 mx-auto mb-6 bg-white rounded-2xl shadow-sm flex items-center justify-center cursor-pointer">
                          {item.img ? <Image src={item.img} alt="" fill className="object-contain p-2" /> : <i className="fas fa-certificate text-slate-200"></i>}
                       </div>
                       <input type="text" placeholder="证书名称" value={item.title} onChange={e => {
                          const newItems = [...(localPages.home.trustItems || [])];
                          newItems[i].title = e.target.value;
                          updateField('home.trustItems', newItems);
                       }} className="w-full bg-transparent border-none p-0 text-center font-black text-slate-900 text-sm mb-2" />
                    </div>
                  ))}
               </div>
            </div>

            {/* 7. FAQ 系统 */}
            <div className="bg-white p-12 rounded-[56px] shadow-sm border border-slate-100">
               <h3 className="text-xl font-black uppercase text-slate-900 mb-10 flex items-center gap-4"><i className="fas fa-question-circle text-blue-500"></i> FAQ 问答模块</h3>
               <TitleConfig prefix="home.faq" />
               <div className="flex justify-end mb-8">
                  <button onClick={() => updateField('home.faq', [...(localPages.home.faq || []), {q: '', a: ''}])} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest">添加问答</button>
               </div>
               <div className="space-y-4">
                  {localPages.home.faq?.map((f, i) => (
                    <div key={i} className="bg-slate-50 p-8 rounded-3xl relative group">
                       <button onClick={() => {
                         const newFaq = localPages.home.faq?.filter((_, idx) => idx !== i);
                         updateField('home.faq', newFaq);
                       }} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition"><i className="fas fa-trash"></i></button>
                       <input type="text" placeholder="输入问题" value={f.q} onChange={e => {
                         const newFaq = [...(localPages.home.faq || [])];
                         newFaq[i].q = e.target.value;
                         updateField('home.faq', newFaq);
                       }} className="w-full bg-transparent border-none p-0 font-black text-slate-900 text-sm mb-4" />
                       <textarea placeholder="输入回答" value={f.a} onChange={e => {
                         const newFaq = [...(localPages.home.faq || [])];
                         newFaq[i].a = e.target.value;
                         updateField('home.faq', newFaq);
                       }} className="w-full bg-transparent border-none p-0 text-xs font-medium text-slate-500 leading-relaxed" />
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="space-y-12 animate-in fade-in duration-700">
             <div className="bg-white p-12 rounded-[56px] shadow-sm border border-slate-100">
                <h3 className="text-xl font-black uppercase text-slate-900 mb-10">关于我们详述</h3>
                <div className="space-y-10">
                   <input type="text" value={localPages.about.title} onChange={e => updateField('about.title', e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-black text-sm" />
                   <div onClick={() => setShowMatPicker({ active: true, target: 'about.heroImg' })} className="relative aspect-[21/9] rounded-3xl overflow-hidden bg-slate-50 border-2 border-dashed border-slate-100 flex items-center justify-center cursor-pointer">
                     {localPages.about.heroImg ? <Image src={localPages.about.heroImg} alt="" fill className="object-cover" /> : <i className="fas fa-image text-slate-200"></i>}
                   </div>
                   <TiptapEditor content={localPages.about.content || ''} onChange={val => updateField('about.content', val)} onOpenLibrary={() => setShowMatPicker({ active: true, target: 'about.content' })} lastSelectedImage={lastSelectedAboutImg || undefined} />
                </div>
             </div>

             <div className="bg-white p-12 rounded-[56px] shadow-sm border border-slate-100">
                <h3 className="text-xl font-black uppercase text-slate-900 mb-10 flex items-center gap-4"><i className="fas fa-user-shield text-blue-600"></i> 专业服务模块 (Professional Service)</h3>
                <TitleConfig prefix="about.service" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-4">
                      <label className="block text-[9px] font-black uppercase text-slate-400 tracking-widest">服务补充文案 / 列表</label>
                      <textarea rows={4} value={localPages.about.serviceContent || ''} onChange={e => updateField('about.serviceContent', e.target.value)} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-xs font-medium" />
                   </div>
                   <div className="space-y-4">
                      <label className="block text-[9px] font-black uppercase text-slate-400 tracking-widest">服务配图</label>
                      <div onClick={() => setShowMatPicker({ active: true, target: 'about.serviceImg' })} className="relative aspect-video rounded-2xl overflow-hidden bg-slate-50 border-2 border-dashed border-slate-100 flex items-center justify-center cursor-pointer">
                         {localPages.about.serviceImg ? <Image src={localPages.about.serviceImg} alt="" fill className="object-cover" /> : <i className="fas fa-plus text-slate-200"></i>}
                      </div>
                   </div>
                </div>
             </div>

             <div className="bg-white p-12 rounded-[56px] shadow-sm border border-slate-100">
                <h3 className="text-xl font-black uppercase text-slate-900 mb-10 flex items-center gap-4"><i className="fas fa-handshake text-orange-500"></i> 战略合作伙伴 (Partners)</h3>
                <TitleConfig prefix="about.partners" />
                <div className="flex justify-end mb-8">
                   <button onClick={() => updateField('about.partners', [...(localPages.about.partners || []), {img: '', name: '', desc: ''}])} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest">添加伙伴</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
                   {localPages.about.partners?.map((item, i) => (
                     <div key={i} className="group relative bg-slate-50 p-6 rounded-[32px] border border-transparent hover:border-blue-100 transition-all">
                        <button onClick={() => {
                          const newPartners = localPages.about.partners?.filter((_, idx) => idx !== i);
                          updateField('about.partners', newPartners);
                        }} className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition shadow-lg z-10"><i className="fas fa-times"></i></button>
                        <div onClick={() => setShowMatPicker({ active: true, target: `about.partners[${i}].img` })} className="relative aspect-square w-full mx-auto mb-4 bg-white rounded-2xl shadow-sm flex items-center justify-center overflow-hidden cursor-pointer">
                           {item.img ? <Image src={item.img} alt="" fill className="object-contain p-2" /> : <i className="fas fa-handshake text-slate-200"></i>}
                        </div>
                        <input type="text" placeholder="品牌名" value={item.name} onChange={e => {
                           const newPartners = [...(localPages.about.partners || [])];
                           newPartners[i].name = e.target.value;
                           updateField('about.partners', newPartners);
                        }} className="w-full bg-transparent border-none p-0 text-center font-black text-slate-900 text-[10px] mb-1" />
                     </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {activeTab === 'contact' && (
           <div className="bg-white p-12 rounded-[56px] border border-slate-100 shadow-sm animate-in fade-in duration-700">
              <h3 className="text-xl font-black uppercase text-slate-900 mb-10">联系引导配置</h3>
              <input type="text" value={localPages.contact.title} onChange={e => updateField('contact.title', e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-black text-sm mb-6" />
              <textarea rows={4} value={localPages.contact.description} onChange={e => updateField('contact.description', e.target.value)} className="w-full bg-slate-50 border-none rounded-[28px] px-8 py-6 font-medium text-sm leading-relaxed" />
           </div>
        )}

        {activeTab === 'others' && (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="bg-white p-12 rounded-[56px] border border-slate-100 shadow-sm">
                 <h4 className="font-black uppercase text-xs text-slate-400 mb-8">产品中心页</h4>
                 <input type="text" value={localPages.products.title} onChange={e => updateField('products.title', e.target.value)} className="w-full bg-slate-50 border-none rounded-xl px-6 py-4 font-black text-sm mb-4" />
                 <input type="text" value={localPages.products.subtitle || ''} onChange={e => updateField('products.subtitle', e.target.value)} className="w-full bg-slate-50 border-none rounded-xl px-6 py-4 font-bold text-xs" />
              </div>
              <div className="bg-white p-12 rounded-[56px] border border-slate-100 shadow-sm">
                 <h4 className="font-black uppercase text-xs text-slate-400 mb-8">新闻动态页</h4>
                 <input type="text" value={localPages.news.title} onChange={e => updateField('news.title', e.target.value)} className="w-full bg-slate-50 border-none rounded-xl px-6 py-4 font-black text-sm mb-4" />
                 <input type="text" value={localPages.news.subtitle || ''} onChange={e => updateField('news.subtitle', e.target.value)} className="w-full bg-slate-50 border-none rounded-xl px-6 py-4 font-bold text-xs" />
              </div>
           </div>
        )}
      </div>

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
                                 const updatedCats = { ...(localPages.home.categoryImages || {}), [catValue]: mat.url };
                                 updateField('home.categoryImages', updatedCats);
                               }
                             } else if (target.includes('trustItems[')) {
                               const idx = parseInt(target.match(/\[(\d+)\]/)?.[1] || '0');
                               const newTrust = [...(localPages.home.trustItems || [])];
                               if (newTrust[idx]) {
                                 newTrust[idx].img = mat.url;
                                 updateField('home.trustItems', newTrust);
                               }
                             } else if (target.includes('partners[')) {
                               const idx = parseInt(target.match(/\[(\d+)\]/)?.[1] || '0');
                               const newPartners = [...(localPages.about.partners || [])];
                               if (newPartners[idx]) {
                                 newPartners[idx].img = mat.url;
                                 updateField('about.partners', newPartners);
                               }
                             } else {
                               updateField(target, mat.url);
                             }
                             setShowMatPicker({ active: false, target: '' });
                           }}
                           className="group flex flex-col items-center gap-3 cursor-pointer"
                         >
                            <div className="relative aspect-square w-full rounded-[40px] overflow-hidden border-4 border-white shadow-sm group-hover:shadow-2xl group-hover:border-blue-200 transition-all bg-white p-4">
                              <Image src={mat.url} alt="" fill className="object-contain p-4" />
                            </div>
                            <span className="text-[9px] font-black uppercase text-slate-400 truncate w-full text-center tracking-widest px-2 group-hover:text-blue-600 transition-colors">
                                {mat.name}
                            </span>
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

export default PagesManagement;
