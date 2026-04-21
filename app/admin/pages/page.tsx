// app/admin/pages/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useProducts, PageContent } from '../../context/ProductContext';
import TiptapEditor from '../products/TiptapEditor';

export default function PagesManagement() {
  const { pages, materials, refreshData } = useProducts();
  const [localPages, setLocalPages] = useState<PageContent | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'contact' | 'others'>('home');
  const [loading, setLoading] = useState(false);
  const [showMatPicker, setShowMatPicker] = useState<{ active: boolean, target: string }>({ active: false, target: '' });
  const [lastSelectedAboutImg, setLastSelectedAboutImg] = useState<string | null>(null);

  useEffect(() => {
    if (pages) {
      setLocalPages(pages);
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

  if (!localPages) return <div className="p-20 text-center font-black uppercase text-slate-300 animate-pulse">正在加载页面配置...</div>;

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
            <div className="bg-white p-12 rounded-[56px] shadow-sm border border-slate-100">
               <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 mb-10 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600"><i className="fas fa-bolt"></i></div> 
                  首页 Hero 轮播模块
               </h3>
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div>
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-4 tracking-[0.3em]">主标题 (Hero Title)</label>
                      <input 
                        type="text" 
                        value={localPages.home.heroTitle}
                        onChange={e => setLocalPages({...localPages, home: {...localPages.home, heroTitle: e.target.value}})}
                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-black text-sm focus:ring-4 ring-blue-500/10 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-4 tracking-[0.3em]">副标题 (Hero Subtitle)</label>
                      <textarea 
                        rows={4}
                        value={localPages.home.heroSubtitle}
                        onChange={e => setLocalPages({...localPages, home: {...localPages.home, heroSubtitle: e.target.value}})}
                        className="w-full bg-slate-50 border-none rounded-[28px] px-8 py-6 font-medium text-sm leading-relaxed focus:ring-4 ring-blue-500/10 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-4 tracking-[0.3em]">核心优势 (Advantages - 每行一个)</label>
                      <textarea 
                        rows={4}
                        value={localPages.home.advantages.join('\n')}
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
                      onImageClick={() => setShowMatPicker({ active: true, target: 'about.content' })}
                      insertedImage={lastSelectedAboutImg}
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
                            const parts = showMatPicker.target.split('.');
                            const page = parts[0] as keyof PageContent;
                            const field = parts[1];
                            
                            if (field === 'content') {
                              setLastSelectedAboutImg(mat.url);
                              setTimeout(() => setLastSelectedAboutImg(null), 100);
                            } else {
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
