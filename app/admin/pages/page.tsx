// app/admin/pages/page.tsx
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
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

// --- Sub-components (Defined outside to prevent focus loss) ---

const ColorField = ({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) => (
  <div className="flex flex-col gap-1.5 flex-1 min-w-[120px]">
    <label className="text-[8px] font-black uppercase text-slate-400 tracking-widest">{label}</label>
    <div className="flex gap-2">
       <input type="color" value={value?.startsWith('#') ? value : '#ffffff'} onChange={e => onChange(e.target.value)} className="w-8 h-8 rounded-lg overflow-hidden border-none cursor-pointer" />
       <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder="#HEX or Tailwind" className="flex-1 bg-slate-50 border-none rounded-lg px-3 py-1 text-[10px] font-mono outline-none" />
    </div>
  </div>
);

const HeaderEditor = ({ config, path, setLocalPages, setShowMatPicker }: any) => {
  const update = (field: keyof PageHeaderConfig, val: any) => {
    const keys = path.split('.');
    setLocalPages((prev: any) => {
      const updated = JSON.parse(JSON.stringify(prev));
      let current: any = updated;
      for (let i = 0; i < keys.length - 1; i++) current = current[keys[i]];
      current[keys[keys.length - 1]] = { ...current[keys[keys.length - 1]], [field]: val };
      return updated;
    });
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

const BlockEditor = ({ block, index, moveBlock, removeBlock, updateBlockData, setShowMatPicker, products, categories }: any) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    return products.filter((p: any) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [products, searchTerm]);

  return (
    <div className="bg-white p-12 rounded-[56px] border border-slate-100 shadow-sm mb-8 relative group animate-in slide-in-from-bottom-8 duration-700 overflow-hidden">
       {/* Visual Handle */}
       <div className="absolute top-0 left-0 bottom-0 w-2 bg-blue-600 opacity-20 group-hover:opacity-100 transition-opacity" />
       
       {/* Controls */}
       <div className="absolute top-8 right-12 flex gap-4 opacity-0 group-hover:opacity-100 transition-all z-20">
          <button onClick={() => moveBlock(index, 'up')} className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition"><i className="fas fa-arrow-up"></i></button>
          <button onClick={() => moveBlock(index, 'down')} className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition"><i className="fas fa-arrow-down"></i></button>
          <button onClick={() => removeBlock(block.id)} className="w-10 h-10 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition"><i className="fas fa-trash"></i></button>
       </div>

       {/* Block Info */}
       <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
             <i className={BLOCK_TYPES.find(t => t.type === block.type)?.icon || 'fas fa-cube'}></i>
          </div>
          <div>
             <h4 className="font-black uppercase text-slate-900 text-sm tracking-tight">{BLOCK_TYPES.find(t => t.type === block.type)?.label}</h4>
             <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Customizable Section / {block.type}</p>
          </div>
       </div>

       {/* Common Fields: Title, Subtitle, Colors, Align */}
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

       {/* Block-specific Fields */}
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
                   {block.data.img ? <Image src={block.data.img} alt="" fill className="object-cover group-hover:scale-110 transition duration-700" /> : <i className="fas fa-image text-slate-200 text-2xl"></i>}
                </div>
             </div>
          )}

          {block.type === 'SplitAbout' && (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-4">
                   <input type="text" placeholder="小标签" value={block.data.tag} onChange={e => updateBlockData(block.id, { tag: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-[10px] font-black uppercase outline-none" />
                   <textarea rows={4} placeholder="描述文案" value={block.data.desc} onChange={e => updateBlockData(block.id, { desc: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-xs outline-none" />
                </div>
                <div className="space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                      <div onClick={() => setShowMatPicker({ active: true, target: `block.${block.id}.videoCover` })} className="relative aspect-video rounded-2xl bg-slate-50 border-2 border-dashed border-slate-100 flex items-center justify-center cursor-pointer group overflow-hidden">
                         {block.data.videoCover ? <Image src={block.data.videoCover} alt="" fill className="object-cover" /> : <i className="fas fa-image text-slate-200"></i>}
                      </div>
                      <div onClick={() => setShowMatPicker({ active: true, target: `block.${block.id}.videoUrl` })} className="relative aspect-video rounded-2xl bg-slate-50 border-2 border-dashed border-slate-100 flex items-center justify-center cursor-pointer group overflow-hidden">
                         {block.data.videoUrl ? <div className="text-[10px] font-mono p-2 break-all">{block.data.videoUrl}</div> : <div className="text-center"><i className="fas fa-video text-slate-200"></i><p className="text-[8px] text-slate-300">点击上传/选择视频</p></div>}
                      </div>
                   </div>
                   <input type="text" placeholder="或者粘贴视频链接" value={block.data.videoUrl} onChange={e => updateBlockData(block.id, { videoUrl: e.target.value })} className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-[10px] font-mono outline-none" />
                </div>
             </div>
          )}

          {block.type === 'Category' && (
             <div className="space-y-6">
                <label className="text-[8px] font-black uppercase text-slate-400">选择要显示的分类及其图片</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   {categories.map((cat: any) => (
                      <div key={cat.id} className="p-4 bg-slate-50 rounded-3xl space-y-4 relative group/cat">
                         <button onClick={() => {
                           const cur = block.data.categories || [];
                           const isSel = cur.includes(cat.value);
                           updateBlockData(block.id, { categories: isSel ? cur.filter((v: string) => v !== cat.value) : [...cur, cat.value] });
                         }} className={`w-full py-2 rounded-xl text-[8px] font-black uppercase tracking-tighter transition ${block.data.categories?.includes(cat.value) ? 'bg-blue-600 text-white' : 'bg-white text-slate-400 shadow-sm hover:bg-slate-100'}`}>
                           {cat.name}
                         </button>
                         <div onClick={() => setShowMatPicker({ active: true, target: `block.${block.id}.images.${cat.value}` })} className="relative aspect-square rounded-2xl bg-white border border-slate-100 flex items-center justify-center cursor-pointer overflow-hidden group">
                            {block.data.images?.[cat.value] ? <Image src={block.data.images[cat.value]} alt="" fill className="object-cover group-hover:scale-110 transition duration-500" /> : <i className="fas fa-plus text-slate-200 text-[10px]"></i>}
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          )}

          {(block.type === 'FeaturedProduct' || block.type === 'NewArrivals') && (
             <div className="p-8 bg-slate-50 rounded-3xl space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="搜索并匹配产品..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-xs outline-none focus:ring-2 ring-blue-500/20" 
                  />
                  <select value={block.data.cols || 3} onChange={e => updateBlockData(block.id, { cols: parseInt(e.target.value) })} className="bg-white border border-slate-100 rounded-xl px-4 py-3 text-xs outline-none">
                    <option value={2}>每行 2 个</option>
                    <option value={3}>每行 3 个</option>
                    <option value={4}>每行 4 个</option>
                  </select>
                </div>
                <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto p-4 bg-white rounded-2xl border border-slate-100 no-scrollbar">
                   {filteredProducts.map((p: any) => (
                     <button key={p.id} onClick={() => {
                       const cur = block.data.productIds || [];
                       const sId = p.id.toString();
                       const limit = (block.data.cols || 3) * (block.data.cols || 3);
                       if (!cur.includes(sId) && cur.length >= limit) {
                          alert(`当前布局最多选择 ${limit} 个产品`);
                          return;
                       }
                       updateBlockData(block.id, { productIds: cur.includes(sId) ? cur.filter((id: string) => id !== sId) : [...cur, sId] });
                     }} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition ${block.data.productIds?.includes(p.id.toString()) ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>
                       {p.name}
                     </button>
                   ))}
                   {filteredProducts.length === 0 && <p className="text-[10px] text-slate-300 font-bold uppercase w-full text-center py-4">未找到匹配产品</p>}
                </div>
             </div>
          )}

          {block.type === 'Process' && (
             <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(block.data.steps || []).map((step: any, i: number) => (
                    <div key={i} className="p-6 bg-slate-50 rounded-3xl relative group/step space-y-4 border border-transparent hover:border-slate-200 transition-all">
                      <button onClick={() => updateBlockData(block.id, { steps: block.data.steps.filter((_: any, idx: number) => idx !== i) })} className="absolute top-4 right-4 w-8 h-8 bg-red-50 text-red-400 rounded-lg hover:bg-red-500 hover:text-white opacity-0 group-hover/step:opacity-100 transition flex items-center justify-center"><i className="fas fa-trash text-[10px]"></i></button>
                      <div className="flex gap-4">
                         <div onClick={() => setShowMatPicker({ active: true, target: `block.${block.id}.steps.${i}.icon` })} className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center cursor-pointer border border-slate-100 overflow-hidden group">
                            {step.icon?.startsWith('http') ? <Image src={step.icon} alt="" width={40} height={40} className="object-contain" /> : <i className={`${step.icon || 'fas fa-cog'} text-slate-300 group-hover:text-blue-500 transition`}></i>}
                         </div>
                         <div className="flex-1 space-y-2">
                           <input type="text" placeholder="步骤标题" value={step.title} onChange={e => {
                             const ns = [...block.data.steps]; ns[i].title = e.target.value; updateBlockData(block.id, { steps: ns });
                           }} className="w-full bg-white border border-slate-100 rounded-xl px-4 py-2 font-black text-xs outline-none focus:ring-2 ring-blue-500/10" />
                           <input type="text" placeholder="图标类名或URL" value={step.icon} onChange={e => {
                             const ns = [...block.data.steps]; ns[i].icon = e.target.value; updateBlockData(block.id, { steps: ns });
                           }} className="w-full bg-white border border-slate-100 rounded-xl px-4 py-2 text-[10px] font-mono outline-none focus:ring-2 ring-blue-500/10" />
                         </div>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => updateBlockData(block.id, { steps: [...(block.data.steps || []), { title: '', icon: '' }] })} className="h-32 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 transition-all group">
                     <i className="fas fa-plus mb-2 group-hover:scale-125 transition"></i>
                     <span className="text-[10px] font-black uppercase tracking-widest">增加流程步骤</span>
                  </button>
                </div>
             </div>
          )}

          {block.type === 'Stats' && (
             <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(block.data.items || []).map((item: any, i: number) => (
                    <div key={i} className="p-6 bg-slate-50 rounded-3xl space-y-4 text-center group/stat relative border border-transparent hover:border-slate-200 transition-all">
                       <button onClick={() => updateBlockData(block.id, { items: block.data.items.filter((_: any, idx: number) => idx !== i) })} className="absolute top-2 right-2 w-6 h-6 bg-red-50 text-red-500 opacity-0 group-hover/stat:opacity-100 transition rounded flex items-center justify-center"><i className="fas fa-times text-[10px]"></i></button>
                       <input type="text" placeholder="数值 (e.g. 50+)" value={item.value} onChange={e => {
                         const ni = [...block.data.items]; ni[i].value = e.target.value; updateBlockData(block.id, { items: ni });
                       }} className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 font-black text-xl outline-none text-center focus:ring-2 ring-blue-500/10" />
                       <input type="text" placeholder="描述" value={item.label} onChange={e => {
                         const ni = [...block.data.items]; ni[i].label = e.target.value; updateBlockData(block.id, { items: ni });
                       }} className="w-full bg-white border border-slate-100 rounded-xl px-4 py-2 text-[10px] font-bold outline-none text-center focus:ring-2 ring-blue-500/10" />
                    </div>
                  ))}
                  <button onClick={() => updateBlockData(block.id, { items: [...(block.data.items || []), { label: '', value: '' }] })} className="aspect-square rounded-3xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-all group"><i className="fas fa-plus group-hover:scale-125 transition"></i></button>
                </div>
             </div>
          )}

          {block.type === 'Trust' && (
             <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                   {(block.data.items || []).map((item: any, i: number) => (
                      <div key={i} className="relative group/trust">
                         <div onClick={() => setShowMatPicker({ active: true, target: `block.${block.id}.items.${i}.img` })} className="aspect-square bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-100 flex items-center justify-center cursor-pointer overflow-hidden group">
                            {item.img ? <Image src={item.img} alt="" fill className="object-contain p-4 group-hover:scale-110 transition" /> : <i className="fas fa-certificate text-slate-200 text-xl"></i>}
                         </div>
                         <button onClick={() => updateBlockData(block.id, { items: block.data.items.filter((_: any, idx: number) => idx !== i) })} className="absolute -top-2 -right-2 w-8 h-8 bg-white text-red-500 shadow-lg rounded-xl flex items-center justify-center opacity-0 group-hover/trust:opacity-100 transition"><i className="fas fa-times text-[10px]"></i></button>
                      </div>
                   ))}
                   <button onClick={() => updateBlockData(block.id, { items: [...(block.data.items || []), { img: '' }] })} className="aspect-square rounded-[32px] border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 hover:bg-slate-50 transition"><i className="fas fa-plus"></i></button>
                </div>
             </div>
          )}

          {block.type === 'FAQ' && (
             <div className="space-y-6">
                <div className="space-y-4">
                   {(block.data.items || []).map((item: any, i: number) => (
                      <div key={i} className="p-8 bg-slate-50 rounded-[40px] relative group/faq space-y-4 border border-transparent hover:border-slate-200 transition-all">
                         <button onClick={() => updateBlockData(block.id, { items: block.data.items.filter((_: any, idx: number) => idx !== i) })} className="absolute top-6 right-8 text-red-400 hover:text-red-500 opacity-0 group-hover/faq:opacity-100 transition"><i className="fas fa-trash-alt"></i></button>
                         <input type="text" placeholder="问题 (Question)" value={item.q} onChange={e => {
                           const ni = [...block.data.items]; ni[i].q = e.target.value; updateBlockData(block.id, { items: ni });
                         }} className="w-full bg-white border border-slate-100 rounded-2xl px-6 py-4 font-black text-xs outline-none focus:ring-2 ring-blue-500/10" />
                         <textarea rows={3} placeholder="回答 (Answer)" value={item.a} onChange={e => {
                           const ni = [...block.data.items]; ni[i].a = e.target.value; updateBlockData(block.id, { items: ni });
                         }} className="w-full bg-white border border-slate-100 rounded-3xl px-8 py-6 text-xs outline-none focus:ring-2 ring-blue-500/10" />
                      </div>
                   ))}
                   <button onClick={() => updateBlockData(block.id, { items: [...(block.data.items || []), { q: '', a: '' }] })} className="w-full py-8 rounded-[40px] border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-all group">
                      <i className="fas fa-plus mr-4 group-hover:scale-125 transition"></i>
                      <span className="text-[10px] font-black uppercase tracking-widest">添加 FAQ 条目</span>
                   </button>
                </div>
             </div>
          )}

          {block.type === 'Inquiry' && (
             <div className="bg-slate-50 p-8 rounded-[40px] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-400">
                <i className="fas fa-envelope-open-text text-4xl mb-4"></i>
                <p className="text-[10px] font-black uppercase tracking-widest">询盘表单模块 (字段固定: 姓名/邮箱/电话/需求)</p>
                <div className="mt-6 flex gap-4">
                   <input type="text" placeholder="提交按钮文案" value={block.data.submitLabel || 'SEND INQUIRY'} onChange={e => updateBlockData(block.id, { submitLabel: e.target.value })} className="bg-white border-none rounded-xl px-4 py-2 font-black text-[10px] outline-none" />
                   <input type="text" placeholder="成功提示语" value={block.data.successMsg || 'THANK YOU!'} onChange={e => updateBlockData(block.id, { successMsg: e.target.value })} className="bg-white border-none rounded-xl px-4 py-2 font-black text-[10px] outline-none" />
                </div>
             </div>
          )}

          {block.type === 'FactoryShowcase' && (
             <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   {(block.data.images || []).map((img: string, i: number) => (
                      <div key={i} className="relative group/showcase aspect-video rounded-3xl bg-slate-50 border border-slate-100 overflow-hidden cursor-pointer" onClick={() => setShowMatPicker({ active: true, target: `block.${block.id}.images.${i}` })}>
                         {img ? <Image src={img} alt="" fill className="object-cover group-hover:scale-110 transition duration-700" /> : <i className="fas fa-plus text-slate-200"></i>}
                         <button onClick={(e) => { e.stopPropagation(); updateBlockData(block.id, { images: block.data.images.filter((_: any, idx: number) => idx !== i) }) }} className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-lg opacity-0 group-hover/showcase:opacity-100 transition flex items-center justify-center"><i className="fas fa-times text-[10px]"></i></button>
                      </div>
                   ))}
                   <button onClick={() => updateBlockData(block.id, { images: [...(block.data.images || []), ''] })} className="aspect-video rounded-3xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 hover:bg-slate-50 transition"><i className="fas fa-plus"></i></button>
                </div>
             </div>
          )}

          {block.type === 'RichText' && (
             <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 shadow-inner">
                <TiptapEditor content={block.data.content} onChange={v => updateBlockData(block.id, { content: v })} onImageClick={() => setShowMatPicker({ active: true, target: `block.${block.id}.content` })} />
             </div>
          )}
       </div>
    </div>
  );
};

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
      
      // Migration Logic for legacy structures
      if (migratedPages.home && !Array.isArray(migratedPages.home)) {
        const oldHome = migratedPages.home as any;
        migratedPages.home = [];
        if (oldHome.heroTitle) {
          migratedPages.home.push({ id: 'mig-hero', type: 'Hero', data: { title: oldHome.heroTitle, subtitle: oldHome.heroSubtitle, img: oldHome.heroImg, advantages: oldHome.advantages || [] } });
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
        ...(type === 'Hero' ? { advantages: ['8.8/10.9/12.9 GRADE SPECIALIST', 'FULL SCALE OEM CAPABILITIES', 'GLOBAL LOGISTICS NETWORK', 'ISO 9001:2015 CERTIFIED'], img: '' } :
            type === 'SplitAbout' ? { tag: 'SINCE 1995', desc: 'Long description...', stats: [], videoUrl: '', videoCover: '' } :
            type === 'Category' ? { categories: [], images: {} } :
            type === 'FeaturedProduct' || type === 'NewArrivals' ? { count: 6, productIds: [], cols: 3 } :
            type === 'Stats' ? { items: [{ label: 'EXPORT COUNTRIES', value: '50+' }] } :
            type === 'Trust' ? { items: [] } :
            type === 'FAQ' ? { items: [] } :
            type === 'Inquiry' ? { submitLabel: 'SEND INQUIRY', successMsg: 'THANK YOU!' } :
            type === 'FactoryShowcase' ? { images: [] } :
            type === 'Process' ? { steps: [{ title: 'DESIGN', icon: 'fas fa-drafting-compass' }] } :
            type === 'RichText' ? { content: '<h2>Custom Content</h2>' } : {})
      }
    };

    if (activeTab === 'home') setLocalPages({ ...localPages, home: [...localPages.home, newBlock] });
    else if (activeTab === 'about') setLocalPages({ ...localPages, about: { ...localPages.about, blocks: [...(localPages.about.blocks || []), newBlock] } });
    setShowBlockAdd(false);
  };

  const removeBlock = useCallback((id: string) => {
    if (activeTab === 'home') setLocalPages(prev => ({ ...prev, home: prev.home.filter(b => b.id !== id) }));
    else if (activeTab === 'about') setLocalPages(prev => ({ ...prev, about: { ...prev.about, blocks: prev.about.blocks.filter(b => b.id !== id) } }));
  }, [activeTab]);

  const moveBlock = useCallback((index: number, direction: 'up' | 'down') => {
    const list = activeTab === 'home' ? [...localPages.home] : [...localPages.about.blocks];
    if (direction === 'up' && index > 0) [list[index], list[index - 1]] = [list[index - 1], list[index]];
    else if (direction === 'down' && index < list.length - 1) [list[index], list[index + 1]] = [list[index + 1], list[index]];
    
    if (activeTab === 'home') setLocalPages(prev => ({ ...prev, home: list }));
    else setLocalPages(prev => ({ ...prev, about: { ...prev.about, blocks: list } }));
  }, [activeTab, localPages]);

  const updateBlockData = useCallback((id: string, newData: any) => {
    if (activeTab === 'home') {
      setLocalPages(prev => ({
        ...prev,
        home: prev.home.map(b => b.id === id ? { ...b, data: { ...b.data, ...newData } } : b)
      }));
    } else if (activeTab === 'about') {
      setLocalPages(prev => ({
        ...prev,
        about: {
          ...prev.about,
          blocks: prev.about.blocks.map(b => b.id === id ? { ...b, data: { ...b.data, ...newData } } : b)
        }
      }));
    }
  }, [activeTab]);

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
          <HeaderEditor 
            config={localPages[activeTab as keyof PageContent].header} 
            path={`${activeTab}.header`} 
            setLocalPages={setLocalPages}
            setShowMatPicker={setShowMatPicker}
          />
        )}

        {(activeTab === 'home' || activeTab === 'about') && (
           <div className="space-y-6">
              {(activeTab === 'home' ? localPages.home : localPages.about.blocks || []).map((block, i) => (
                <BlockEditor 
                  key={block.id} 
                  block={block} 
                  index={i} 
                  moveBlock={moveBlock}
                  removeBlock={removeBlock}
                  updateBlockData={updateBlockData}
                  setShowMatPicker={setShowMatPicker}
                  products={products}
                  categories={categories}
                />
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

      {/* Block Adder Modal */}
      {showBlockAdd && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[400] flex items-center justify-center p-12">
           <div className="bg-white w-full max-w-5xl rounded-[80px] shadow-2xl p-16 animate-in zoom-in-95 duration-500 relative">
              <button onClick={() => setShowBlockAdd(false)} className="absolute top-12 right-12 w-16 h-16 bg-slate-50 rounded-[28px] flex items-center justify-center text-slate-400 hover:text-red-500 transition"><i className="fas fa-times text-xl"></i></button>
              <h3 className="text-4xl font-black uppercase text-slate-900 mb-4 tracking-tighter">选择积木模块</h3>
              <p className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-12">点击下方模块类型立即添加到当前页面</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                 {BLOCK_TYPES.map(type => (
                   <button key={type.type} onClick={() => addBlock(type.type as Block['type'])} className="p-8 rounded-[48px] bg-slate-50 hover:bg-slate-900 hover:text-white transition-all flex flex-col items-center gap-6 group">
                      <div className="w-20 h-20 bg-white group-hover:bg-white/10 rounded-[32px] flex items-center justify-center text-3xl transition-all shadow-sm">
                         <i className={type.icon}></i>
                      </div>
                      <div className="text-center">
                        <p className="font-black uppercase text-xs tracking-tight">{type.label}</p>
                        <p className="text-[8px] font-black opacity-40 uppercase tracking-widest mt-1">{type.type}</p>
                      </div>
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
                               const subSubField = parts[4];
                               
                               const blockList = activeTab === 'home' ? localPages.home : localPages.about.blocks;
                               const block = blockList.find(b => b.id === blockId);
                               
                               if (block) {
                                  let newData = JSON.parse(JSON.stringify(block.data));
                                  if (subSubField) {
                                     // block.id.steps.0.icon
                                     if (Array.isArray(newData[field])) {
                                        newData[field][parseInt(subField)] = { ...newData[field][parseInt(subField)], [subSubField]: mat.url };
                                     }
                                  } else if (subField) {
                                     // block.id.images.0 or block.id.images.key
                                     if (Array.isArray(newData[field])) {
                                        newData[field][parseInt(subField)] = mat.url;
                                     } else {
                                        newData[field] = { ...newData[field], [subField]: mat.url };
                                     }
                                  } else {
                                     newData[field] = mat.url;
                                  }
                                  updateBlockData(blockId, newData);
                               }
                             } else {
                               const keys = target.split('.');
                               setLocalPages((prev: any) => {
                                 const updated = JSON.parse(JSON.stringify(prev));
                                 let current: any = updated;
                                 for (let i = 0; i < keys.length - 1; i++) current = current[keys[i]];
                                 current[keys[keys.length - 1]] = mat.url;
                                 return updated;
                               });
                             }
                             setShowMatPicker({ active: false, target: '' });
                           }}
                           className="group flex flex-col items-center gap-4 cursor-pointer"
                         >
                            <div className="relative aspect-square w-full rounded-[48px] overflow-hidden border-4 border-white shadow-sm group-hover:shadow-2xl group-hover:border-blue-200 transition-all bg-white p-6">
                               {mat.resource_type === 'video' ? (
                                  <div className="flex flex-col items-center justify-center h-full gap-2">
                                     <i className="fas fa-video text-slate-300 text-3xl"></i>
                                     <span className="text-[8px] font-black text-slate-400">VIDEO</span>
                                  </div>
                               ) : (
                                  <Image src={mat.url} alt="" fill className="object-contain p-4" />
                               )}
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
