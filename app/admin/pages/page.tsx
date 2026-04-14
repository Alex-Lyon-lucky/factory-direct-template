// app/admin/pages/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useProducts } from '../../context/ProductContext';

export default function PageManagementPage() {
  const { materials } = useProducts();
  const [pages, setPages] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [showMatPicker, setShowMatPicker] = useState<{ active: boolean, target: string }>({ active: false, target: '' });

  useEffect(() => {
    fetch('/api/pages')
      .then(res => res.json())
      .then(data => {
        setPages(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pages)
      });
      if (res.ok) alert('页面内容配置已成功发布更新！');
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const openPicker = (target: string) => {
     setShowMatPicker({ active: true, target });
  };

  const selectImg = (url: string) => {
     const [page, field] = showMatPicker.target.split('.');
     setPages({
        ...pages,
        [page]: { ...pages[page], [field]: url }
     });
     setShowMatPicker({ active: false, target: '' });
  };

  const updateField = (page: string, field: string, val: any) => {
    setPages({
      ...pages,
      [page]: { ...pages[page], [field]: val }
    });
  };

  if (loading) return <div className="p-20 text-center font-black uppercase text-slate-300">正在载入页面内容设置...</div>;

  const currentData = pages[activeTab] || {};

  return (
    <div className="max-w-7xl mx-auto animate-in slide-in-from-bottom-8 duration-700 pb-20 px-6">
      <div className="flex justify-between items-end mb-12">
        <div>
           <h2 className="text-5xl font-black uppercase tracking-tighter text-slate-900 leading-none mb-2">CMS 页面内容管理</h2>
           <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] tracking-[0.3em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> GLOBAL CONTENT MANAGEMENT SYSTEM
           </p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-blue-600 text-white px-12 py-5 rounded-[24px] font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-blue-500/20 hover:bg-slate-900 transition-all active:scale-95"
        >
          {saving ? 'PROCESSING...' : 'PUBLISH CHANGES'}
        </button>
      </div>

      <div className="flex gap-4 mb-12 overflow-x-auto pb-4 no-scrollbar">
         {['home', 'about', 'products', 'news', 'contact', 'inquiry'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-10 py-5 rounded-[24px] font-black uppercase text-xs tracking-widest transition-all ${activeTab === tab ? 'bg-slate-900 text-white shadow-2xl shadow-slate-200 -translate-y-1' : 'bg-white text-slate-400 border border-slate-100 hover:border-slate-300'}`}
            >
              {tab.toUpperCase()} PAGE
            </button>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
         {/* Main Content Area */}
         <div className="lg:col-span-8 bg-white p-12 rounded-[56px] shadow-sm border border-slate-100">
            <h3 className="text-[10px] font-black uppercase text-blue-600 tracking-[0.3em] mb-12 flex items-center gap-4">
               <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-xs"><i className="fas fa-edit"></i></div> {activeTab.toUpperCase()} CONTENT SECTIONS
            </h3>
            
            <div className="space-y-10">
               <div>
                  <label className="block text-[9px] font-black uppercase text-slate-400 mb-3 tracking-[0.3em] ml-1">Main Header Title</label>
                  <input type="text" value={currentData.title || currentData.heroTitle || ''} 
                    onChange={e => updateField(activeTab, activeTab === 'home' ? 'heroTitle' : 'title', e.target.value)} 
                    className="w-full bg-slate-50 border-none rounded-[28px] px-10 py-6 font-black text-2xl uppercase focus:ring-4 ring-blue-500/10 transition-all tracking-tight" />
               </div>
               <div>
                  <label className="block text-[9px] font-black uppercase text-slate-400 mb-3 tracking-[0.3em] ml-1">Header Subtitle / Value Prop</label>
                  <textarea rows={activeTab === 'about' ? 10 : 3} value={currentData.description || currentData.heroSubtitle || currentData.subtitle || currentData.content || ''} 
                    onChange={e => updateField(activeTab, activeTab === 'home' ? 'heroSubtitle' : activeTab === 'about' ? 'content' : activeTab === 'contact' ? 'description' : 'subtitle', e.target.value)} 
                    className="w-full bg-slate-50 border-none rounded-[28px] px-10 py-6 font-bold text-slate-600 leading-relaxed" />
               </div>
               
               {activeTab === 'home' && (
                  <div>
                     <label className="block text-[9px] font-black uppercase text-slate-400 mb-6 tracking-[0.3em] ml-1">Core Industrial Advantages</label>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {pages.home.advantages.map((adv: any, i: number) => (
                           <div key={i} className="relative group">
                              <input 
                                 type="text" 
                                 value={adv} 
                                 onChange={e => {
                                    const newAdv = [...pages.home.advantages];
                                    newAdv[i] = e.target.value;
                                    updateField('home', 'advantages', newAdv);
                                 }} 
                                 className="w-full bg-slate-50 border-none rounded-2xl px-8 py-5 font-black uppercase text-xs focus:ring-4 ring-blue-500/10 transition-all shadow-sm" 
                              />
                              <div className="absolute -top-2 -right-2 w-5 h-5 bg-slate-900 text-white rounded-full flex items-center justify-center text-[8px] font-black">{i+1}</div>
                           </div>
                        ))}
                     </div>
                  </div>
               )}
            </div>
         </div>

         {/* Sidebar: Header Styles & Media */}
         <div className="lg:col-span-4 space-y-10">
            <div className="bg-white p-10 rounded-[64px] shadow-sm border border-slate-100 sticky top-32">
               <h3 className="text-[10px] font-black uppercase text-blue-600 tracking-[0.3em] mb-10 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center"><i className="fas fa-layer-group"></i></div> HEADER STYLING
               </h3>

               <div className="space-y-8">
                  {/* Height Control */}
                  <div>
                     <label className="block text-[9px] font-black uppercase text-slate-400 mb-3 tracking-[0.3em] ml-1">Header Height (px)</label>
                     <div className="flex items-center gap-4">
                        <input 
                          type="range" min="150" max="600" step="10"
                          value={currentData.headerHeight || 200}
                          onChange={e => updateField(activeTab, 'headerHeight', parseInt(e.target.value))}
                          className="flex-1 accent-blue-600"
                        />
                        <span className="font-black text-xs text-slate-900 w-12">{currentData.headerHeight || 200}px</span>
                     </div>
                  </div>

                  {/* BG Mode */}
                  <div>
                     <label className="block text-[9px] font-black uppercase text-slate-400 mb-3 tracking-[0.3em] ml-1">Background Mode</label>
                     <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1 rounded-2xl">
                        <button 
                          onClick={() => updateField(activeTab, 'bgMode', 'image')}
                          className={`py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${currentData.bgMode === 'image' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >IMAGE</button>
                        <button 
                          onClick={() => updateField(activeTab, 'bgMode', 'color')}
                          className={`py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${currentData.bgMode === 'color' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >SOLID COLOR</button>
                     </div>
                  </div>

                  {/* BG Color */}
                  <div>
                     <label className="block text-[9px] font-black uppercase text-slate-400 mb-3 tracking-[0.3em] ml-1">Background Color</label>
                     <div className="flex gap-4">
                        <input 
                          type="color" 
                          value={currentData.bgColor || '#0f172a'}
                          onChange={e => updateField(activeTab, 'bgColor', e.target.value)}
                          className="w-12 h-12 rounded-xl border-none cursor-pointer overflow-hidden"
                        />
                        <input 
                          type="text" 
                          value={currentData.bgColor || '#0f172a'}
                          onChange={e => updateField(activeTab, 'bgColor', e.target.value)}
                          className="flex-1 bg-slate-50 border-none rounded-xl px-4 font-bold text-xs text-slate-600 uppercase"
                        />
                     </div>
                  </div>

                  {/* Image Picker */}
                  {currentData.bgMode === 'image' && (
                     <div>
                        <div className="flex justify-between items-center mb-6 pt-4 border-t border-slate-50">
                           <label className="text-[9px] font-black uppercase text-slate-400 tracking-[0.3em] ml-1">Hero Image</label>
                        </div>
                        <div 
                          onClick={() => openPicker(`${activeTab}.heroImg`)}
                          className="relative aspect-[16/9] rounded-[32px] overflow-hidden bg-slate-50 border-4 border-dashed border-slate-100 flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/20 transition-all group shadow-inner"
                        >
                           {currentData.heroImg ? (
                              <>
                                <Image src={currentData.heroImg} alt="" fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                   <div className="bg-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl">CHANGE MEDIA</div>
                                </div>
                              </>
                           ) : (
                              <div className="text-center">
                                 <i className="fas fa-cloud-upload-alt text-4xl text-slate-200 mb-4 group-hover:text-blue-200 transition"></i>
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Library Access</p>
                              </div>
                           )}
                        </div>
                     </div>
                  )}
               </div>

               <div className="mt-12 bg-slate-900 rounded-[32px] p-8 text-white">
                  <h4 className="text-[9px] font-black uppercase text-blue-400 tracking-[0.3em] mb-4">Design Advice</h4>
                  <p className="text-[9px] font-bold text-slate-400 leading-relaxed uppercase">Current B2B trends favor cleaner headers (200px-300px) with smaller, more professional typography and solid brand colors.</p>
               </div>
            </div>
         </div>
      </div>

      {/* Material Picker Modal */}
      {showMatPicker.active && (
         <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[200] flex items-center justify-center p-6 md:p-12">
            <div className="bg-white w-full max-w-6xl rounded-[80px] shadow-2xl h-full max-h-[900px] flex flex-col overflow-hidden animate-in zoom-in duration-700 relative">
               <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full translate-x-32 -translate-y-32 blur-[100px]"></div>
               <div className="p-12 border-b border-slate-100 flex justify-between items-center relative z-10">
                  <div>
                    <h3 className="text-4xl font-black uppercase text-slate-900 tracking-tighter leading-none">Global Asset Library</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-3 flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-blue-600"></span> SELECT PAGE HERO MEDIA
                    </p>
                  </div>
                  <button onClick={() => setShowMatPicker({ active: false, target: '' })} className="w-16 h-16 bg-slate-50 rounded-[28px] flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition shadow-sm"><i className="fas fa-times text-xl"></i></button>
               </div>
               
               <div className="flex-1 overflow-y-auto p-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 no-scrollbar relative z-10 bg-slate-50/30">
                  {materials.map(mat => (
                     <div 
                      key={mat.id} 
                      onClick={() => selectImg(mat.url)}
                      className="relative aspect-square rounded-[40px] overflow-hidden cursor-pointer border-4 transition-all duration-500 bg-white p-4 shadow-sm hover:shadow-2xl hover:-translate-y-2 border-white hover:border-blue-200"
                     >
                        <Image src={mat.url} alt="" fill className="object-contain p-4 transition-transform duration-700 hover:scale-110" />
                     </div>
                  ))}
               </div>

               <div className="p-12 border-t border-slate-100 flex justify-end items-center bg-white relative z-10">
                  <button onClick={() => setShowMatPicker({ active: false, target: '' })} className="bg-slate-900 text-white px-16 py-6 rounded-[32px] font-black uppercase tracking-[0.4em] text-xs shadow-2xl shadow-slate-300 hover:bg-blue-600 transition-all active:scale-95">CANCEL SELECTION</button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
}
