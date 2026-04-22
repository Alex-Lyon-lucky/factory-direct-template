// app/admin/pages/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useProducts, Block, PageHeaderConfig, PageContent } from '../../context/ProductContext';

const TiptapEditor = dynamic(() => import('../products/TiptapEditor'), { 
  ssr: false,
  loading: () => <div className="p-10 bg-slate-50 rounded-3xl animate-pulse text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">载入编辑器...</div>
});

const DEFAULT_HEADER: PageHeaderConfig = {
  title: 'Page Title',
  subtitle: 'Description goes here',
  bgImg: '',
  bgColor: 'bg-[#0a0f1d]',
  textColor: 'text-white',
  height: 'standard',
  align: 'center'
};

const INITIAL_PAGES: PageContent = {
  home: [],
  about: { header: { ...DEFAULT_HEADER, title: 'About Us' }, blocks: [] },
  products: { header: { ...DEFAULT_HEADER, title: 'Product Center' } },
  news: { header: { ...DEFAULT_HEADER, title: 'News & Media' } },
  inquiry: { header: { ...DEFAULT_HEADER, title: 'Inquiry Now' } },
  contact: { header: { ...DEFAULT_HEADER, title: 'Contact Us' }, title: '', description: '' }
};

const BLOCK_TYPES = [
  { type: 'Hero', label: '首屏视窗 (Hero)', icon: 'fas fa-bolt' },
  { type: 'SplitAbout', label: '1:1 左右分栏 (Video/About)', icon: 'fas fa-play-circle' },
  { type: 'Category', label: '产品分类格子 (灵活行列)', icon: 'fas fa-th-large' },
  { type: 'FeaturedProduct', label: '热门产品橱窗', icon: 'fas fa-star' },
  { type: 'NewArrivals', label: '新品发布模块', icon: 'fas fa-fire' },
  { type: 'Stats', label: '工厂实力数据', icon: 'fas fa-chart-bar' },
  { type: 'Trust', label: '资质荣誉墙', icon: 'fas fa-certificate' },
  { type: 'FAQ', label: 'FAQ 问叠问答', icon: 'fas fa-question-circle' },
  { type: 'Inquiry', label: '快捷询盘表单', icon: 'fas fa-envelope-open-text' },
  { type: 'Process', label: 'B2B 合作流程', icon: 'fas fa-sync' },
  { type: 'FactoryShowcase', label: '工厂实景展示', icon: 'fas fa-industry' },
  { type: 'RichText', label: '富文本/HTML 内容块', icon: 'fas fa-align-left' }
];

export default function PagesManagement() {
  const { pages, materials, categories, products, refreshData } = useProducts();
  const [localPages, setLocalPages] = useState<PageContent>(INITIAL_PAGES);
  const [activeTab, setActiveTab] = useState<keyof PageContent>('home');
  const [loading, setLoading] = useState(false);
  const [showMatPicker, setShowMatPicker] = useState<{ active: boolean, target: string }>({ active: false, target: '' });
  const [showBlockAdd, setShowBlockAdd] = useState(false);

  useEffect(() => {
    if (pages && typeof pages === 'object' && !('error' in pages)) {
      const migratedPages = { ...INITIAL_PAGES, ...pages };
      
      // Migration Logic
      if (migratedPages.home && !Array.isArray(migratedPages.home)) {
        const oldHome = migratedPages.home as any;
        migratedPages.home = [];
        if (oldHome.heroTitle) {
          migratedPages.home.push({ id: 'mig-hero', type: 'Hero', data: { title: oldHome.heroTitle, subtitle: oldHome.heroSubtitle, img: oldHome.heroImg, advantages: oldHome.advantages || [] } });
        }
        if (oldHome.aboutTitle) {
          migratedPages.home.push({ id: 'mig-about', type: 'SplitAbout', data: { tag: oldHome.aboutTag, title: oldHome.aboutTitle, desc: oldHome.aboutDesc, videoCover: oldHome.aboutVideoCover, stats: oldHome.aboutStats || [] } });
        }
      }
      setLocalPages(migratedPages);
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
      if (res.ok) { await refreshData(); alert('✅ 全站积木化装修已发布！'); }
    } catch (e) { alert('❌ 保存失败'); } finally { setLoading(false); }
  };

  const addBlock = (type: Block['type']) => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      data: {
        bgColor: '#ffffff',
        titleColor: '#0f172a',
        subtitleColor: '#64748b',
        textColor: '#334155',
        align: 'center',
        title: type === 'Hero' ? 'ENGINEERED FOR EXTREME PERFORMANCE' : 'SECTION TITLE',
        subtitle: 'Sub-description text goes here',
        tag: 'FACTORY DIRECT EXCELLENCE',
        btn1Label: 'VIEW COLLECTIONS',
        btn2Label: 'CONTACT SALES',
        bgColor: type === 'Hero' ? '#0a0f1d' : '#ffffff',
        titleColor: type === 'Hero' ? '#ffffff' : '#0f172a',
        subtitleColor: type === 'Hero' ? '#94a3b8' : '#64748b',
        textColor: type === 'Hero' ? '#94a3b8' : '#334155',
        ...(type === 'Hero' ? { advantages: ['8.8/10.9/12.9 GRADE SPECIALIST', 'FULL SCALE OEM CAPABILITIES', 'GLOBAL LOGISTICS NETWORK', 'ISO 9001:2015 CERTIFIED'], img: '' } :
            type === 'SplitAbout' ? { tag: 'SINCE 1995', desc: 'Long description...', stats: [], videoUrl: '', videoCover: '' } :
            type === 'Category' ? { categories: [], images: {} } :
            type === 'FeaturedProduct' ? { count: 6, productIds: [] } :
            type === 'Stats' ? { items: [{ label: 'EXPORT COUNTRIES', value: '50+' }] } :
            type === 'Trust' ? { items: [] } :
            type === 'FAQ' ? { items: [] } :
            type === 'RichText' ? { content: '<h2>Custom Content</h2>' } : {})
      }
    };

    if (activeTab === 'home') setLocalPages({ ...localPages, home: [...localPages.home, newBlock] });
    else if (activeTab === 'about') setLocalPages({ ...localPages, about: { ...localPages.about, blocks: [...(localPages.about.blocks || []), newBlock] } });
    setShowBlockAdd(false);
  };

  const removeBlock = (id: string) => {
    if (activeTab === 'home') setLocalPages({ ...localPages, home: localPages.home.filter(b => b.id !== id) });
    else if (activeTab === 'about') setLocalPages({ ...localPages, about: { ...localPages.about, blocks: localPages.about.blocks.filter(b => b.id !== id) } });
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const list = activeTab === 'home' ? [...localPages.home] : [...localPages.about.blocks];
    if (direction === 'up' && index > 0) [list[index], list[index - 1]] = [list[index - 1], list[index]];
    else if (direction === 'down' && index < list.length - 1) [list[index], list[index + 1]] = [list[index + 1], list[index]];
    
    if (activeTab === 'home') setLocalPages({ ...localPages, home: list });
    else setLocalPages({ ...localPages, about: { ...localPages.about, blocks: list } });
  };

  const updateBlockData = (id: string, newData: any) => {
    if (activeTab === 'home') {
      setLocalPages({ ...localPages, home: localPages.home.map(b => b.id === id ? { ...b, data: { ...b.data, ...newData } } : b) });
    } else if (activeTab === 'about') {
      setLocalPages({ ...localPages, about: { ...localPages.about, blocks: localPages.about.blocks.map(b => b.id === id ? { ...b, data: { ...b.data, ...newData } } : b) } });
    }
  };

  const ColorField = ({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) => (
    <div className="flex flex-col gap-1.5 flex-1 min-w-[120px]">
      <label className="text-[8px] font-black uppercase text-slate-400 tracking-widest">{label}</label>
      <div className="flex gap-2">
         <input type="color" value={value?.startsWith('#') ? value : '#ffffff'} onChange={e => onChange(e.target.value)} className="w-8 h-8 rounded-lg overflow-hidden border-none cursor-pointer" />
         <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder="#HEX or Tailwind" className="flex-1 bg-slate-50 border-none rounded-lg px-3 py-1 text-[10px] font-mono outline-none" />
      </div>
    </div>
  );

  const HeaderEditor = ({ config, path }: { config: PageHeaderConfig, path: string }) => {
    const update = (field: keyof PageHeaderConfig, val: any) => {
      const keys = path.split('.');
      const updated = JSON.parse(JSON.stringify(localPages));
      let current: any = updated;
      for (let i = 0; i < keys.length - 1; i++) current = current[keys[i]];
      current[keys[keys.length - 1]] = { ...current[keys[keys.length - 1]], [field]: val };
      setLocalPages(updated);
    };

    return (
      <div className="bg-white p-12 rounded-[56px] border border-slate-100 shadow-sm mb-12 animate-in fade-in duration-700">
         <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-black uppercase text-slate-900 tracking-tighter">页面顶部横幅 (Banner) 配置</h3>
            <div className="flex gap-2">
              {['compact', 'standard', 'hero'].map(h => (
                <button key={h} onClick={() => update('height', h)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition ${config.height === h ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400'}`}>
                  {h}
                </button>
              ))}
            </div>
         </div>
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
               <input type="text" placeholder="主标题" value={config.title} onChange={e => update('title', e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-black text-sm outline-none" />
               <input type="text" placeholder="副标题" value={config.subtitle || ''} onChange={e => update('subtitle', e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-xs outline-none" />
               <div className="grid grid-cols-2 gap-4">
                  <ColorField label="背景颜色" value={config.bgColor || ''} onChange={v => update('bgColor', v)} />
                  <ColorField label="文字颜色" value={config.textColor || ''} onChange={v => update('textColor', v)} />
               </div>
            </div>
            <div className="space-y-4">
               <label className="text-[9px] font-black text-slate-400 uppercase block">背景图片</label>
               <div onClick={() => setShowMatPicker({ active: true, target: `${path}.bgImg` })} className="relative aspect-[21/9] rounded-3xl overflow-hidden bg-slate-50 border-2 border-dashed border-slate-100 flex items-center justify-center cursor-pointer group">
                  {config.bgImg ? <Image src={config.bgImg} alt="" fill className="object-cover group-hover:scale-105 transition duration-700" /> : <i className="fas fa-image text-slate-200 text-2xl"></i>}
               </div>
            </div>
         </div>
      </div>
    );
  };

  const BlockEditor = ({ block, index }: { block: Block, index: number }) => {
    return (
      <div className="bg-white p-12 rounded-[56px] border border-slate-100 shadow-sm mb-8 relative group animate-in slide-in-from-bottom-8 duration-700 overflow-hidden">
         {/* Sidebar Accent */}
         <div className="absolute top-0 left-0 bottom-0 w-2 bg-blue-600 opacity-20 group-hover:opacity-100 transition-opacity" />

         {/* Controls */}
         <div className="absolute top-8 right-12 flex gap-4 opacity-0 group-hover:opacity-100 transition-all z-20">
            <button onClick={() => moveBlock(index, 'up')} className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition"><i className="fas fa-arrow-up"></i></button>
            <button onClick={() => moveBlock(index, 'down')} className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition"><i className="fas fa-arrow-down"></i></button>
            <button onClick={() => removeBlock(block.id)} className="w-10 h-10 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition"><i className="fas fa-trash"></i></button>
         </div>

         <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
               <i className={BLOCK_TYPES.find(t => t.type === block.type)?.icon || 'fas fa-cube'}></i>
            </div>
            <div>
               <h4 className="font-black uppercase text-slate-900 text-sm tracking-tight">{BLOCK_TYPES.find(t => t.type === block.type)?.label}</h4>
               <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Customizable Section / {block.type}</p>
            </div>
         </div>

         {/* Common Settings: Title, Subtitle, Colors */}
         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12 border-b border-slate-50 pb-12">
            <div className="lg:col-span-2 space-y-4">
               <div className="flex gap-4">
                 <input type="text" placeholder="模块大标题" value={block.data.title || ''} onChange={e => updateBlockData(block.id, { title: e.target.value })} className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-3 font-black text-xs outline-none" />
                 <select value={block.data.align || 'center'} onChange={e => updateBlockData(block.id, { align: e.target.value })} className="bg-slate-50 border-none rounded-xl px-4 py-3 text-[10px] font-black uppercase outline-none cursor-pointer">
                    <option value="left">左对齐</option>
                    <option value="center">居中对齐</option>
                    <option value="right">右对齐</option>
                 </select>
               </div>
               <input type="text" placeholder="模块副标题" value={block.data.subtitle || ''} onChange={e => updateBlockData(block.id, { subtitle: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-[10px] font-bold outline-none" />
            </div>
            <div className="lg:col-span-2 flex flex-wrap gap-4">
               <ColorField label="背景颜色" value={block.data.bgColor || ''} onChange={v => updateBlockData(block.id, { bgColor: v })} />
               <ColorField label="标题颜色" value={block.data.titleColor || ''} onChange={v => updateBlockData(block.id, { titleColor: v })} />
               <ColorField label="副标题色" value={block.data.subtitleColor || ''} onChange={v => updateBlockData(block.id, { subtitleColor: v })} />
               <ColorField label="正文颜色" value={block.data.textColor || ''} onChange={v => updateBlockData(block.id, { textColor: v })} />
            </div>
         </div>

         {/* Content Settings */}
         <div className="space-y-8">
            {block.type === 'Hero' && (
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-4">
                     <input type="text" placeholder="标签文案 (FACTORY DIRECT...)" value={block.data.tag} onChange={e => updateBlockData(block.id, { tag: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl px-4 py-2 text-[10px] font-black uppercase outline-none" />
                     <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="按钮1文字" value={block.data.btn1Label} onChange={e => updateBlockData(block.id, { btn1Label: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl px-4 py-2 text-[10px] font-bold outline-none" />
                        <input type="text" placeholder="按钮2文字" value={block.data.btn2Label} onChange={e => updateBlockData(block.id, { btn2Label: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl px-4 py-2 text-[10px] font-bold outline-none" />
                     </div>
                     <label className="text-[8px] font-black uppercase text-slate-400">优势列表 (Advantages)</label>
                     {(block.data.advantages || []).map((adv: string, i: number) => (
                       <input key={i} type="text" value={adv} onChange={e => {
                         const news = [...block.data.advantages];
                         news[i] = e.target.value;
                         updateBlockData(block.id, { advantages: news });
                       }} className="w-full bg-slate-50 border-none rounded-xl px-4 py-2 text-[10px] font-bold outline-none" />
                     ))}
                  </div>
                  <div onClick={() => setShowMatPicker({ active: true, target: `block.${block.id}.img` })} className="relative aspect-video rounded-[40px] bg-slate-50 border-2 border-dashed border-slate-100 flex items-center justify-center cursor-pointer overflow-hidden group">
                     {block.data.img ? <Image src={block.data.img} alt="" fill className="object-cover group-hover:scale-110 transition duration-700" /> : <i className="fas fa-image text-slate-200"></i>}
                  </div>
               </div>
            )}

            {block.type === 'SplitAbout' && (
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-4">
                     <input type="text" placeholder="小标签 (e.g. ABOUT HANGFAN)" value={block.data.tag} onChange={e => updateBlockData(block.id, { tag: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-[10px] font-black uppercase outline-none" />
                     <textarea rows={4} placeholder="描述文案" value={block.data.desc} onChange={e => updateBlockData(block.id, { desc: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-xs outline-none" />
                  </div>
                  <div className="space-y-4">
                     <div onClick={() => setShowMatPicker({ active: true, target: `block.${block.id}.videoCover` })} className="relative aspect-video rounded-3xl bg-slate-50 border-2 border-dashed border-slate-100 flex items-center justify-center cursor-pointer group">
                        {block.data.videoCover ? <Image src={block.data.videoCover} alt="" fill className="object-cover rounded-3xl" /> : <i className="fas fa-video text-slate-200"></i>}
                        <div className="absolute inset-0 flex items-center justify-center"><div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl text-blue-600"><i className="fas fa-play ml-1"></i></div></div>
                     </div>
                     <input type="text" placeholder="视频 URL (Youtube/Cloudinary)" value={block.data.videoUrl} onChange={e => updateBlockData(block.id, { videoUrl: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-[10px] font-mono outline-none" />
                  </div>
               </div>
            )}

            {block.type === 'Category' && (
               <div className="space-y-6">
                  <label className="text-[8px] font-black uppercase text-slate-400">选择要显示的分类及其图片</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     {categories.map(cat => (
                        <div key={cat.id} className="p-4 bg-slate-50 rounded-3xl space-y-4 relative">
                           <button onClick={() => {
                             const cur = block.data.categories || [];
                             const isSel = cur.includes(cat.value);
                             updateBlockData(block.id, { categories: isSel ? cur.filter((v: string) => v !== cat.value) : [...cur, cat.value] });
                           }} className={`w-full py-2 rounded-xl text-[8px] font-black uppercase tracking-tighter ${block.data.categories?.includes(cat.value) ? 'bg-blue-600 text-white' : 'bg-white text-slate-400 shadow-sm'}`}>
                             {cat.name}
                           </button>
                           <div onClick={() => setShowMatPicker({ active: true, target: `block.${block.id}.images.${cat.value}` })} className="relative aspect-square rounded-2xl bg-white border border-slate-100 flex items-center justify-center cursor-pointer overflow-hidden">
                              {block.data.images?.[cat.value] ? <Image src={block.data.images[cat.value]} alt="" fill className="object-cover" /> : <i className="fas fa-plus text-slate-200 text-[10px]"></i>}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            )}

            {block.type === 'FeaturedProduct' && (
               <div className="p-8 bg-slate-50 rounded-3xl">
                  <label className="text-[9px] font-black text-slate-400 uppercase mb-4 block">勾选橱窗产品 (不勾选则自动显示)</label>
                  <div className="flex flex-wrap gap-2">
                     {products.map(p => (
                       <button key={p.id} onClick={() => {
                         const cur = block.data.productIds || [];
                         const sId = p.id.toString();
                         updateBlockData(block.id, { productIds: cur.includes(sId) ? cur.filter((id: string) => id !== sId) : [...cur, sId] });
                       }} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition ${block.data.productIds?.includes(p.id.toString()) ? 'bg-blue-600 text-white' : 'bg-white text-slate-400 shadow-sm'}`}>
                         {p.name}
                       </button>
                     ))}
                  </div>
               </div>
            )}

            {block.type === 'RichText' && (
               <div className="space-y-4">
                  <label className="text-[9px] font-black text-slate-400 uppercase">富文本/HTML 编辑器</label>
                  <TiptapEditor 
                    content={block.data.content || ''} 
                    onChange={v => updateBlockData(block.id, { content: v })}
                    onImageClick={() => setShowMatPicker({ active: true, target: `block.${block.id}.content` })}
                  />
               </div>
            )}
            
            {block.type === 'Stats' && (
               <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                     {(block.data.items || []).map((item: any, i: number) => (
                       <div key={i} className="p-4 bg-slate-50 rounded-2xl space-y-3 relative group/stat">
                          <button onClick={() => updateBlockData(block.id, { items: block.data.items.filter((_: any, idx: number) => idx !== i) })} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover/stat:opacity-100 transition"><i className="fas fa-times"></i></button>
                          <input type="text" placeholder="数值 (e.g. 50+)" value={item.value} onChange={e => {
                            const ni = [...block.data.items]; ni[i].value = e.target.value; updateBlockData(block.id, { items: ni });
                          }} className="w-full bg-white border-none rounded-lg px-3 py-2 font-black text-sm outline-none" />
                          <input type="text" placeholder="标签" value={item.label} onChange={e => {
                            const ni = [...block.data.items]; ni[i].label = e.target.value; updateBlockData(block.id, { items: ni });
                          }} className="w-full bg-white border-none rounded-lg px-3 py-2 text-[10px] font-bold outline-none" />
                       </div>
                     ))}
                     <button onClick={() => updateBlockData(block.id, { items: [...(block.data.items || []), { label: '', value: '' }] })} className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 hover:bg-slate-50 transition"><i className="fas fa-plus"></i></button>
                  </div>
               </div>
            )}
         </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-32">
      {/* Navbar - Sticky with Action Buttons */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-[100] px-12 py-6 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-8">
           <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900">积木化装修中心 (Pro)</h2>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mt-1">完全掌控每一个像素和模块</p>
           </div>
           <div className="flex gap-4">
              {(['home', 'about', 'products', 'news', 'inquiry', 'contact'] as const).map(id => (
                <button key={id} onClick={() => setActiveTab(id)} className={`px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === id ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400 hover:bg-white'}`}>
                  {id === 'home' ? '首页' : id === 'about' ? '关于' : id === 'products' ? '产品' : id === 'news' ? '文章' : id === 'inquiry' ? '询盘' : '联系'}
                </button>
              ))}
           </div>
        </div>
        <div className="flex gap-4">
           <button onClick={() => setShowBlockAdd(true)} className="bg-white border-2 border-slate-900 text-slate-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
              + 添加积木模块
           </button>
           <button onClick={handleSave} disabled={loading} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200 hover:scale-105 active:scale-95 transition-all">
            {loading ? '正在同步...' : '发布全站装修'}
           </button>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-12 mt-12">
        {activeTab !== 'home' && (
          <HeaderEditor config={localPages[activeTab as keyof PageContent].header} path={`${activeTab}.header`} />
        )}

        {(activeTab === 'home' || activeTab === 'about') && (
           <div className="space-y-6">
              {(activeTab === 'home' ? localPages.home : localPages.about.blocks || []).map((block, i) => (
                <BlockEditor key={block.id} block={block} index={i} />
              ))}
              {((activeTab === 'home' ? localPages.home : localPages.about.blocks) || []).length === 0 && (
                <div className="py-40 bg-white rounded-[64px] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-300">
                   <i className="fas fa-cubes text-6xl mb-6"></i>
                   <p className="font-black uppercase text-[10px] tracking-[0.4em]">当前页面为空，点击上方按钮开始积木装修</p>
                </div>
              )}
           </div>
        )}

        {activeTab === 'contact' && (
          <div className="bg-white p-16 rounded-[64px] border border-slate-100 shadow-sm animate-in fade-in duration-700">
             <h3 className="text-2xl font-black uppercase text-slate-900 mb-10 tracking-tighter">联系引导文案</h3>
             <input type="text" value={localPages.contact.title} onChange={e => setLocalPages({...localPages, contact: {...localPages.contact, title: e.target.value}})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-black text-sm mb-6 outline-none focus:bg-white transition-all" />
             <textarea rows={6} value={localPages.contact.description} onChange={e => setLocalPages({...localPages, contact: {...localPages.contact, description: e.target.value}})} className="w-full bg-slate-50 border-none rounded-[32px] px-8 py-6 font-medium text-sm leading-relaxed outline-none focus:bg-white transition-all" />
          </div>
        )}
      </div>

      {/* Selector Modal */}
      {showBlockAdd && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[300] flex items-center justify-center p-12">
           <div className="bg-white w-full max-w-5xl rounded-[64px] shadow-2xl p-16 animate-in zoom-in duration-500 overflow-y-auto max-h-[90vh] no-scrollbar">
              <div className="flex justify-between items-center mb-12">
                 <h3 className="text-3xl font-black uppercase text-slate-900 tracking-tighter">选择积木</h3>
                 <button onClick={() => setShowBlockAdd(false)} className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400"><i className="fas fa-times"></i></button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                 {BLOCK_TYPES.map(bt => (
                   <button key={bt.type} onClick={() => addBlock(bt.type as any)} className="flex flex-col items-center gap-6 p-10 bg-slate-50 rounded-[48px] hover:bg-blue-600 hover:text-white group transition-all">
                      <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-2xl text-blue-600 group-hover:scale-110 transition shadow-sm"><i className={bt.icon}></i></div>
                      <span className="font-black uppercase text-[10px] tracking-widest">{bt.label}</span>
                   </button>
                 ))}
              </div>
           </div>
        </div>
      )}

      {/* Material Picker */}
      {showMatPicker.active && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[400] flex items-center justify-center p-12">
           <div className="bg-white w-full max-w-6xl rounded-[80px] shadow-2xl h-full max-h-[900px] flex flex-col overflow-hidden relative animate-in slide-in-from-bottom-12 duration-500">
              <div className="p-12 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-4xl font-black uppercase text-slate-900 tracking-tighter">素材中心</h3>
                  <button onClick={() => setShowMatPicker({ active: false, target: '' })} className="w-16 h-16 bg-slate-50 rounded-[28px] flex items-center justify-center text-slate-400 hover:text-red-500 transition"><i className="fas fa-times text-xl"></i></button>
              </div>
              <div className="flex-1 overflow-y-auto p-12 no-scrollbar">
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 pb-12">
                       {materials.map((mat) => (
                         <div key={mat.id} onClick={() => {
                             const target = showMatPicker.target;
                             if (target.startsWith('block.')) {
                               const parts = target.split('.');
                               const blockId = parts[1];
                               const field = parts[2];
                               const subField = parts[3];
                               
                               const block = (activeTab === 'home' ? localPages.home : localPages.about.blocks).find(b => b.id === blockId);
                               if (block) {
                                  let newData = { ...block.data };
                                  if (subField) {
                                     newData[field] = { ...newData[field], [subField]: mat.url };
                                  } else {
                                     newData[field] = mat.url;
                                  }
                                  updateBlockData(blockId, newData);
                               }
                             } else {
                               const keys = target.split('.');
                               const updated = JSON.parse(JSON.stringify(localPages));
                               let current: any = updated;
                               for (let i = 0; i < keys.length - 1; i++) current = current[keys[i]];
                               current[keys[keys.length - 1]] = mat.url;
                               setLocalPages(updated);
                             }
                             setShowMatPicker({ active: false, target: '' });
                           }}
                           className="group flex flex-col items-center gap-4 cursor-pointer"
                         >
                            <div className="relative aspect-square w-full rounded-[48px] overflow-hidden border-4 border-white shadow-sm group-hover:shadow-2xl group-hover:border-blue-200 transition-all bg-white p-6">
                              <Image src={mat.url} alt="" fill className="object-contain p-4" />
                            </div>
                            <span className="text-[9px] font-black uppercase text-slate-400 truncate w-full text-center tracking-widest px-2 group-hover:text-blue-600 transition-colors">{mat.name}</span>
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
