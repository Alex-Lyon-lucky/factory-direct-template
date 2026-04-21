// app/admin/products/ProductForm.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProducts, Product } from '../../context/ProductContext';
import TiptapEditor from './TiptapEditor';

export default function ProductForm({ initialData }: { initialData?: Product }) {
  const router = useRouter();
  const { categories, materials, updateProduct, refreshData } = useProducts();
  const [form, setForm] = useState<Partial<Product>>({
    name: '', cat: '', img: '', gallery: [], galleryAlts: [], spec: 'M6 - M36', description: '', price: '', stock: '', keywords: ['', '', '', '', ''], seoTitle: '', seoDescription: '', seoSlug: '', alt: '', sortOrder: 0, summary: '', specs: [], companyProfile: '', technicalDrawings: ''
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [showMatPicker, setShowMatPicker] = useState<{ active: boolean, target: 'main' | 'gallery' | 'editor' | 'drawings' | 'company' }>({ active: false, target: 'main' });
  const [lastSelectedEditorImg, setLastSelectedEditorImg] = useState<string | null>(null);
  const [lastSelectedDrawingsImg, setLastSelectedDrawingsImg] = useState<string | null>(null);
  const [lastSelectedCompanyImg, setLastSelectedCompanyImg] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setForm({ 
        ...initialData, 
        gallery: initialData.gallery || [], 
        galleryAlts: initialData.galleryAlts || [],
        keywords: initialData.keywords || ['', '', '', '', ''], 
        specs: initialData.specs || [] 
      });
    }
  }, [initialData]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'main' | 'gallery' | 'editor' | 'drawings' | 'company') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(target);
    const fileArray = Array.from(files);
    const uploadPromises = fileArray.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        await fetch('/api/materials', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: file.name, url: data.url, type: 'image', hash: data.hash, category: '产品图' }) });
        return data.url;
      }
      return null;
    });
    try {
      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(url => url !== null) as string[];
      if (target === 'main') setForm(prev => ({ ...prev, img: successfulUploads[0] || prev.img }));
      else if (target === 'gallery') setForm(prev => {
        const newGallery = [...(prev.gallery || []), ...successfulUploads].slice(0, 6);
        const newAlts = [...(prev.galleryAlts || [])];
        successfulUploads.forEach(() => {
          if (newAlts.length < 6) newAlts.push('');
        });
        return { ...prev, gallery: newGallery, galleryAlts: newAlts.slice(0, 6) };
      });
      else if (target === 'editor') setLastSelectedEditorImg(successfulUploads[0]);
      else if (target === 'drawings') setLastSelectedDrawingsImg(successfulUploads[0]);
      else if (target === 'company') setLastSelectedCompanyImg(successfulUploads[0]);
    } finally {
      setUploading(null);
      refreshData();
    }
  };

  const toggleGalleryImg = (url: string) => {
    setForm(prev => {
      const newGallery = prev.gallery || [];
      const newAlts = prev.galleryAlts || [];
      if (newGallery.includes(url)) {
        const idx = newGallery.indexOf(url);
        return { ...prev, gallery: newGallery.filter(u => u !== url), galleryAlts: newAlts.filter((_, i) => i !== idx) };
      } else {
        if (newGallery.length >= 6) return prev;
        return { ...prev, gallery: [...newGallery, url], galleryAlts: [...newAlts, ''] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await updateProduct(form as Product);
    if (success) router.push('/admin/products');
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-7xl mx-auto pb-32 space-y-12 animate-in fade-in duration-700">
        {/* 顶部发布条 */}
        <div className="flex justify-between items-center px-4 sticky top-0 z-50 bg-[#f8fafc]/80 backdrop-blur-md py-4">
            <div className="flex items-center gap-6">
               <Link href="/admin/products" className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-900 transition shadow-sm border border-slate-100"><i className="fas fa-chevron-left text-xs"></i></Link>
               <div>
                 <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900 leading-none">产品编辑器</h2>
                 <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mt-2">Product SEO & Content Management</p>
               </div>
            </div>
            <button type="submit" disabled={loading} className="bg-slate-900 text-white px-12 py-5 rounded-[28px] font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl shadow-slate-200 hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-50">
               {loading ? '正在同步数据...' : '发布产品更改'}
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 px-4">
            {/* 左侧主要内容 */}
            <div className="lg:col-span-8 space-y-12">
                {/* 1. 基础信息卡片 */}
                <div className="bg-white p-12 rounded-[56px] shadow-sm border border-slate-100">
                    <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 mb-10 flex items-center gap-4">
                       <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600"><i className="fas fa-box"></i></div> 基础核心信息
                    </h3>
                    <div className="space-y-8">
                       <div>
                          <label className="block text-[9px] font-black uppercase text-slate-400 mb-4 tracking-[0.3em] ml-1">产品名称 (Product Name)</label>
                          <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-black text-sm focus:ring-4 focus:ring-blue-50 transition" />
                       </div>
                       <div className="grid grid-cols-2 gap-8">
                          <div>
                             <label className="block text-[9px] font-black uppercase text-slate-400 mb-4 tracking-[0.3em] ml-1">所属分类</label>
                             <select value={form.cat} onChange={e => setForm({...form, cat: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-black text-xs appearance-none cursor-pointer">
                                <option value="">选择产品分类</option>
                                {categories.map(c => <option key={c.id} value={c.value}>{c.name}</option>)}
                             </select>
                          </div>
                          <div>
                             <label className="block text-[9px] font-black uppercase text-slate-400 mb-4 tracking-[0.3em] ml-1">排序权重 (0最大)</label>
                             <input type="number" value={form.sortOrder} onChange={e => setForm({...form, sortOrder: parseInt(e.target.value)})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-black text-sm" />
                          </div>
                       </div>
                       <div>
                          <label className="block text-[9px] font-black uppercase text-slate-400 mb-4 tracking-[0.3em] ml-1">核心卖点简介 (Short Summary)</label>
                          <textarea rows={3} value={form.summary} onChange={e => setForm({...form, summary: e.target.value})} className="w-full bg-slate-50 border-none rounded-[28px] px-8 py-6 font-medium text-sm leading-relaxed" placeholder="简述产品的核心优势，将展示在列表页和详情页头部" />
                       </div>
                    </div>
                </div>

                {/* 2. 富文本详细介绍 */}
                <div className="bg-white p-12 rounded-[56px] shadow-sm border border-slate-100">
                    <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 mb-10 flex items-center gap-4">
                       <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600"><i className="fas fa-file-alt"></i></div> 产品详细描述 (Rich Text)
                    </h3>
                    <div className="relative group">
                       <TiptapEditor 
                         content={form.description || ''} 
                         onChange={val => setForm({...form, description: val})} 
                         onOpenLibrary={() => setShowMatPicker({ active: true, target: 'editor' })}
                         lastSelectedImage={lastSelectedEditorImg || undefined}
                       />
                       <div className="absolute top-4 right-4 flex gap-2">
                          <button type="button" onClick={() => setShowMatPicker({ active: true, target: 'editor' })} className="w-12 h-12 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 transition"><i className="fas fa-image"></i></button>
                       </div>
                    </div>
                </div>
            </div>

            {/* 右侧侧边栏 */}
            <div className="lg:col-span-4 space-y-12">
                {/* 主图上传 */}
                <div className="bg-white p-10 rounded-[56px] shadow-sm border border-slate-100">
                    <label className="block text-[9px] font-black uppercase text-slate-400 mb-6 tracking-[0.3em] ml-1 text-center">产品主图 (Aspect 1:1)</label>
                    <div 
                      onClick={() => setShowMatPicker({ active: true, target: 'main' })}
                      className="group relative aspect-square bg-slate-50 rounded-[48px] overflow-hidden border-2 border-dashed border-slate-100 flex items-center justify-center cursor-pointer transition-all hover:border-blue-200"
                    >
                        {form.img ? (
                           <>
                             <Image src={form.img} alt="Product" fill className="object-cover group-hover:scale-110 transition duration-700" />
                             <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                <span className="bg-white px-6 py-3 rounded-xl font-black text-[10px] uppercase">更换图片</span>
                             </div>
                           </>
                        ) : (
                           <div className="text-center">
                              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 text-slate-200 group-hover:text-blue-600 transition"><i className="fas fa-cloud-upload-alt text-2xl"></i></div>
                              <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest">点击选择或上传</p>
                           </div>
                        )}
                    </div>
                </div>

                {/* 媒体素材库 Picker */}
                {showMatPicker.active && (
                   <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[200] flex items-center justify-center p-6 md:p-12">
                      <div className="bg-white w-full max-w-6xl rounded-[80px] shadow-2xl h-full max-h-[900px] flex flex-col overflow-hidden animate-in zoom-in duration-700 relative">
                         <div className="p-12 border-b border-slate-100 flex justify-between items-center relative z-10">
                            <div>
                              <h3 className="text-4xl font-black uppercase text-slate-900 tracking-tighter leading-none">素材中心库</h3>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-3">选择一张图片作为产品素材</p>
                            </div>
                            <button onClick={() => setShowMatPicker({ active: false, target: 'main' })} className="w-16 h-16 bg-slate-50 rounded-[28px] flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition shadow-sm"><i className="fas fa-times text-xl"></i></button>
                         </div>
                         <div className="flex-1 overflow-y-auto p-12 no-scrollbar">
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 pb-12">
                               {materials.map((mat) => (
                                  <div key={mat.id} onClick={() => {
                                      if (showMatPicker.target === 'main') { setForm({ ...form, img: mat.url }); setShowMatPicker({ active: false, target: 'main' }); }
                                      else if (showMatPicker.target === 'gallery') { toggleGalleryImg(mat.url); }
                                      else if (showMatPicker.target === 'editor') { setLastSelectedEditorImg(mat.url); setShowMatPicker({ active: false, target: 'main' }); }
                                      else if (showMatPicker.target === 'drawings') { setLastSelectedDrawingsImg(mat.url); setShowMatPicker({ active: false, target: 'main' }); }
                                      else if (showMatPicker.target === 'company') { setLastSelectedCompanyImg(mat.url); setShowMatPicker({ active: false, target: 'main' }); }
                                    }}
                                    className="group flex flex-col items-center gap-3 cursor-pointer"
                                  >
                                    <div className={`relative aspect-square w-full rounded-[40px] overflow-hidden border-4 transition-all duration-500 bg-white p-4 shadow-sm group-hover:shadow-2xl ${((showMatPicker.target === 'main' && form.img === mat.url) || (showMatPicker.target === 'gallery' && form.gallery?.includes(mat.url))) ? 'border-blue-600 ring-8 ring-blue-50' : 'border-white group-hover:border-blue-200'}`}>
                                      <Image src={mat.url} alt="" fill className="object-contain p-4" />
                                      {((showMatPicker.target === 'main' && form.img === mat.url) || (showMatPicker.target === 'gallery' && form.gallery?.includes(mat.url))) && ( <div className="absolute top-4 right-4 w-8 h-8 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-xs shadow-2xl animate-in zoom-in duration-300"><i className="fas fa-check"></i></div> )}
                                    </div>
                                    <span className="text-[9px] font-black uppercase text-slate-400 truncate w-full text-center tracking-widest px-2 group-hover:text-blue-600 transition-colors">
                                        {mat.name}
                                    </span>
                                  </div>
                               ))}
                            </div>
                         </div>
                         <div className="p-12 border-t border-slate-100 flex justify-between items-center bg-white relative z-10">
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-300">共 {materials.length} 个可用素材</div>
                            <button onClick={() => setShowMatPicker({ active: false, target: 'main' })} className="bg-slate-900 text-white px-16 py-6 rounded-[32px] font-black uppercase tracking-[0.4em] text-xs shadow-2xl shadow-slate-300 hover:bg-blue-600 transition-all active:scale-95">确定并返回</button>
                         </div>
                      </div>
                   </div>
                )}
            </div>
        </div>
    </form>
  );
}
