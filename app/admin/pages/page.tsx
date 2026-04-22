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
  { type: 'Category', label: '产品分类格子', icon: 'fas fa-th-large' },
  { type: 'FeaturedProduct', label: '热门产品橱窗', icon: 'fas fa-star' },
  { type: 'Stats', label: '工厂实力数据', icon: 'fas fa-chart-bar' },
  { type: 'Trust', label: '资质荣誉墙', icon: 'fas fa-certificate' },
  { type: 'FAQ', label: 'FAQ 问叠问答', icon: 'fas fa-question-circle' },
  { type: 'Inquiry', label: '快捷询盘表单', icon: 'fas fa-envelope-open-text' },
  { type: 'Process', label: 'B2B 合作流程', icon: 'fas fa-sync' },
  { type: 'FactoryShowcase', label: '工厂实景展示', icon: 'fas fa-industry' },
  { type: 'RichText', label: '富文本内容块', icon: 'fas fa-align-left' }
];

export default function PagesManagement() {
  const { pages, materials, categories, refreshData } = useProducts();
  const [localPages, setLocalPages] = useState<PageContent>(INITIAL_PAGES);
  const [activeTab, setActiveTab] = useState<keyof PageContent>('home');
  const [loading, setLoading] = useState(false);
  const [showMatPicker, setShowMatPicker] = useState<{ active: boolean, target: string }>({ active: false, target: '' });
  const [showBlockAdd, setShowBlockAdd] = useState(false);

  useEffect(() => {
    if (pages && typeof pages === 'object' && !('error' in pages)) {
      const migratedPages = { ...INITIAL_PAGES, ...pages };
      
      // Data Migration: If home is an object (old format), convert to blocks
      if (migratedPages.home && !Array.isArray(migratedPages.home)) {
        console.log('Migrating old home data to blocks...');
        const oldHome = migratedPages.home as any;
        migratedPages.home = [];
        
        if (oldHome.heroTitle || oldHome.heroImg) {
          migratedPages.home.push({ 
            id: 'migrated-hero', 
            type: 'Hero', 
            data: { 
              title: oldHome.heroTitle || '', 
              subtitle: oldHome.heroSubtitle || '', 
              img: oldHome.heroImg || '',
              advantages: oldHome.advantages || []
            } 
          });
        }
        
        if (oldHome.aboutTitle || oldHome.aboutDesc) {
          migratedPages.home.push({
            id: 'migrated-about',
            type: 'SplitAbout',
            data: {
              tag: oldHome.aboutTag || 'ABOUT US',
              title: oldHome.aboutTitle || '',
              desc: oldHome.aboutDesc || '',
              videoCover: oldHome.aboutVideoCover || '',
              videoUrl: oldHome.aboutVideoUrl || '',
              stats: oldHome.aboutStats || []
            }
          });
        }

        if (oldHome.categoryTitle) {
          migratedPages.home.push({
            id: 'migrated-cat',
            type: 'Category',
            data: {
              title: oldHome.categoryTitle || 'Product Categories',
              subtitle: oldHome.categorySubtitle || '',
              align: oldHome.categoryAlign || 'center'
            }
          });
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
      data: type === 'Hero' ? { title: '', subtitle: '', advantages: ['', '', ''], img: '' } :
            type === 'SplitAbout' ? { tag: 'ABOUT HANGFAN', title: '', desc: '', stats: [], btn1: {}, btn2: {}, videoUrl: '', videoCover: '' } :
            type === 'Stats' ? { items: [{ label: '', value: '' }] } :
            type === 'FAQ' ? { items: [{ q: '', a: '' }] } :
            type === 'Trust' ? { items: [{ img: '', title: '' }] } :
            type === 'Category' ? { title: '', subtitle: '', align: 'center' } :
            type === 'FeaturedProduct' ? { title: '', subtitle: '', count: 6 } : {}
    };

    if (activeTab === 'home') {
      setLocalPages({ ...localPages, home: [...(localPages.home || []), newBlock] });
    } else if (activeTab === 'about') {
      setLocalPages({ ...localPages, about: { ...localPages.about, blocks: [...(localPages.about.blocks || []), newBlock] } });
    }
    setShowBlockAdd(false);
  };

  const removeBlock = (id: string) => {
    if (activeTab === 'home') {
      setLocalPages({ ...localPages, home: localPages.home.filter(b => b.id !== id) });
    } else if (activeTab === 'about') {
      setLocalPages({ ...localPages, about: { ...localPages.about, blocks: localPages.about.blocks.filter(b => b.id !== id) } });
    }
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const list = activeTab === 'home' ? [...localPages.home] : [...localPages.about.blocks];
    if (direction === 'up' && index > 0) {
      [list[index], list[index - 1]] = [list[index - 1], list[index]];
    } else if (direction === 'down' && index < list.length - 1) {
      [list[index], list[index + 1]] = [list[index + 1], list[index]];
    }
    
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
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase mb-2 block">背景颜色 (Tailwind)</label>
                    <input type="text" value={config.bgColor || 'bg-[#0a0f1d]'} onChange={e => update('bgColor', e.target.value)} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-[10px] font-mono outline-none" />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase mb-2 block">文字颜色 (Tailwind)</label>
                    <input type="text" value={config.textColor || 'text-white'} onChange={e => update('textColor', e.target.value)} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-[10px] font-mono outline-none" />
                  </div>
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
      <div className="bg-white p-12 rounded-[56px] border border-slate-100 shadow-sm mb-8 relative group animate-in slide-in-from-bottom-8 duration-700">
         {/* Controls */}
         <div className="absolute top-8 right-12 flex gap-4 opacity-0 group-hover:opacity-100 transition-all">
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
               <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">ID: {block.id} / Type: {block.type}</p>
            </div>
         </div>

         <div className="space-y-8">
            {block.type === 'Hero' && (
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-4">
                     <input type="text" placeholder="主标题" value={block.data.title} onChange={e => updateBlockData(block.id, { title: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 font-black text-sm outline-none" />
                     <textarea placeholder="副标题" value={block.data.subtitle} onChange={e => updateBlockData(block.id, { subtitle: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-xs outline-none" />
                  </div>
                  <div onClick={() => setShowMatPicker({ active: true, target: `block.${block.id}.img` })} className="relative aspect-video rounded-3xl bg-slate-50 border-2 border-dashed border-slate-100 flex items-center justify-center cursor-pointer">
                     {block.data.img ? <Image src={block.data.img} alt="" fill className="object-cover rounded-3xl" /> : <i className="fas fa-image text-slate-200"></i>}
                  </div>
               </div>
            )}

            {block.type === 'SplitAbout' && (
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-4">
                     <input type="text" placeholder="小标签 (e.g. ABOUT HANGFAN)" value={block.data.tag} onChange={e => updateBlockData(block.id, { tag: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-[10px] font-black uppercase outline-none" />
                     <input type="text" placeholder="大标题" value={block.data.title} onChange={e => updateBlockData(block.id, { title: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 font-black text-sm outline-none" />
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
               <div className="grid grid-cols-2 gap-8">
                  <input type="text" placeholder="标题" value={block.data.title} onChange={e => updateBlockData(block.id, { title: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 font-black text-sm outline-none" />
                  <input type="text" placeholder="副标题" value={block.data.subtitle} onChange={e => updateBlockData(block.id, { subtitle: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-xs outline-none" />
               </div>
            )}

            {block.type === 'FAQ' && (
              <div className="space-y-4">
                {(block.data.items || []).map((item: any, i: number) => (
                  <div key={i} className="flex gap-4 items-start bg-slate-50 p-6 rounded-2xl relative group/item">
                    <button onClick={() => {
                      const newItems = block.data.items.filter((_: any, idx: number) => idx !== i);
                      updateBlockData(block.id, { items: newItems });
                    }} className="absolute top-2 right-2 text-slate-300 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition"><i className="fas fa-times-circle"></i></button>
                    <div className="flex-1 space-y-3">
                      <input type="text" placeholder="问题" value={item.q} onChange={e => {
                        const newItems = [...block.data.items];
                        newItems[i].q = e.target.value;
                        updateBlockData(block.id, { items: newItems });
                      }} className="w-full bg-white border-none rounded-xl px-4 py-2 font-black text-xs outline-none" />
                      <textarea placeholder="回答" value={item.a} onChange={e => {
                        const newItems = [...block.data.items];
                        newItems[i].a = e.target.value;
                        updateBlockData(block.id, { items: newItems });
                      }} className="w-full bg-white border-none rounded-xl px-4 py-2 text-xs outline-none" />
                    </div>
                  </div>
                ))}
                <button onClick={() => updateBlockData(block.id, { items: [...(block.data.items || []), { q: '', a: '' }] })} className="w-full py-4 border-2 border-dashed border-slate-100 rounded-2xl text-[10px] font-black uppercase text-slate-400 hover:bg-slate-50 transition">添加问答对</button>
              </div>
            )}

            {block.type === 'Inquiry' && (
              <div className="p-10 bg-blue-50 rounded-3xl border border-blue-100 text-center">
                 <i className="fas fa-envelope-open-text text-3xl text-blue-600 mb-4"></i>
                 <p className="text-xs font-black uppercase text-blue-900 tracking-widest">询盘表单模块 (无需额外配置)</p>
                 <p className="text-[10px] text-blue-500 mt-2">该模块将自动渲染标准的 B2B 询盘入口</p>
              </div>
            )}
         </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-32">
      {/* Navbar */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-[100] px-12 py-6 flex justify-between items-center shadow-sm">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900">积木化装修中心 (Pro)</h2>
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mt-1">自由添加、删除、排序全站模块</p>
        </div>
        <button onClick={handleSave} disabled={loading} className="bg-blue-600 text-white px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200 hover:scale-105 active:scale-95 transition-all">
          {loading ? '正在同步模块...' : '保存全站布局'}
        </button>
      </div>

      <div className="max-w-[1600px] mx-auto px-12 mt-12">
        <div className="flex gap-4 mb-12 overflow-x-auto no-scrollbar pb-2">
           {(['home', 'about', 'products', 'news', 'inquiry', 'contact'] as const).map(id => (
             <button key={id} onClick={() => setActiveTab(id)} className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === id ? 'bg-slate-900 text-white' : 'bg-white text-slate-400 hover:bg-slate-50'}`}>
               {id === 'home' ? '首页布局' : id === 'about' ? '关于我们' : id === 'products' ? '产品列表页' : id === 'news' ? '新闻页' : id === 'inquiry' ? '询盘页' : '联系我们'}
             </button>
           ))}
        </div>

        {/* Specialized Header Editor for all pages except Home (Home has its own Hero) */}
        {activeTab !== 'home' && localPages[activeTab] && (
          <HeaderEditor config={(localPages[activeTab] as any).header || DEFAULT_HEADER} path={`${activeTab}.header`} />
        )}

        {/* Dynamic Block List for Home and About */}
        {(activeTab === 'home' || activeTab === 'about') && (
           <div className="space-y-4">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-xl font-black uppercase text-slate-900 tracking-tighter">当前页面积木序列</h3>
                 <button onClick={() => setShowBlockAdd(true)} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
                    + 添加新功能积木
                 </button>
              </div>

              {(activeTab === 'home' ? localPages.home : (localPages.about?.blocks || [])).map((block, i) => (
                <BlockEditor key={block.id} block={block} index={i} />
              ))}

              {((activeTab === 'home' ? localPages.home : localPages.about?.blocks) || []).length === 0 && (
                <div className="py-32 bg-white rounded-[56px] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-300">
                   <i className="fas fa-cubes text-6xl mb-6"></i>
                   <p className="font-black uppercase text-xs tracking-[0.4em]">当前页面为空，请点击上方按钮添加第一个积木</p>
                </div>
              )}
           </div>
        )}

        {/* Simple Fields for Contact Page */}
        {activeTab === 'contact' && localPages.contact && (
          <div className="bg-white p-12 rounded-[56px] border border-slate-100 shadow-sm animate-in fade-in duration-700">
             <h3 className="text-xl font-black uppercase text-slate-900 mb-10">联系引导文案</h3>
             <input type="text" value={localPages.contact.title} onChange={e => setLocalPages({...localPages, contact: {...localPages.contact, title: e.target.value}})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-black text-sm mb-6 outline-none" />
             <textarea rows={4} value={localPages.contact.description} onChange={e => setLocalPages({...localPages, contact: {...localPages.contact, description: e.target.value}})} className="w-full bg-slate-50 border-none rounded-[28px] px-8 py-6 font-medium text-sm leading-relaxed outline-none" />
          </div>
        )}
      </div>

      {/* Block Selector Modal */}
      {showBlockAdd && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[300] flex items-center justify-center p-12">
           <div className="bg-white w-full max-w-4xl rounded-[64px] shadow-2xl p-16 animate-in zoom-in duration-500">
              <div className="flex justify-between items-center mb-12">
                 <h3 className="text-3xl font-black uppercase text-slate-900 tracking-tighter">选择要添加的积木</h3>
                 <button onClick={() => setShowBlockAdd(false)} className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400"><i className="fas fa-times"></i></button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                 {BLOCK_TYPES.map(bt => (
                   <button key={bt.type} onClick={() => addBlock(bt.type as any)} className="flex flex-col items-center gap-6 p-10 bg-slate-50 rounded-[40px] hover:bg-blue-600 hover:text-white group transition-all">
                      <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-2xl text-blue-600 group-hover:scale-110 transition shadow-sm"><i className={bt.icon}></i></div>
                      <span className="font-black uppercase text-[10px] tracking-widest">{bt.label}</span>
                   </button>
                 ))}
              </div>
           </div>
        </div>
      )}

      {/* Material Picker Modal (Persistent logic) */}
      {showMatPicker.active && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[400] flex items-center justify-center p-12">
           <div className="bg-white w-full max-w-6xl rounded-[80px] shadow-2xl h-full max-h-[900px] flex flex-col overflow-hidden relative">
              <div className="p-12 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-4xl font-black uppercase text-slate-900 tracking-tighter">选择素材</h3>
                  <button onClick={() => setShowMatPicker({ active: false, target: '' })} className="w-16 h-16 bg-slate-50 rounded-[28px] flex items-center justify-center text-slate-400 hover:text-red-500 transition"><i className="fas fa-times text-xl"></i></button>
              </div>
              <div className="flex-1 overflow-y-auto p-12 no-scrollbar">
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 pb-12">
                       {materials.map((mat) => (
                         <div key={mat.id} onClick={() => {
                             const target = showMatPicker.target;
                             if (target.startsWith('block.')) {
                               const [, id, field] = target.split('.');
                               updateBlockData(id, { [field]: mat.url });
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
                           className="group flex flex-col items-center gap-3 cursor-pointer"
                         >
                            <div className="relative aspect-square w-full rounded-[40px] overflow-hidden border-4 border-white shadow-sm group-hover:shadow-2xl group-hover:border-blue-200 transition-all bg-white p-4">
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
