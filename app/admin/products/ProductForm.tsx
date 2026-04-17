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
    name: '', 
    cat: '', 
    img: '', 
    gallery: [], 
    spec: 'M6 - M36', 
    description: '', 
    price: '', 
    stock: '', 
    keywords: ['', '', '', '', ''], 
    seoTitle: '', 
    seoDescription: '', 
    seoSlug: '', 
    alt: '',
    sortOrder: 0,
    summary: '',
    specs: [],
    companyProfile: '',
    technicalDrawings: ''
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
        await fetch('/api/materials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            name: file.name, 
            url: data.url, 
            type: 'image',
            hash: data.hash,
            category: '产品图'
          })
        });
        return data.url;
      }
      return null;
    });

    try {
      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(url => url !== null) as string[];
      if (target === 'main') {
        setForm(prev => ({ ...prev, img: successfulUploads[0] || prev.img }));
      } else if (target === 'gallery') {
        setForm(prev => ({ ...prev, gallery: [...(prev.gallery || []), ...successfulUploads].slice(0, 6) }));
      } else if (target === 'editor') {
        setLastSelectedEditorImg(successfulUploads[0]);
        setTimeout(() => setLastSelectedEditorImg(null), 100);
      } else if (target === 'drawings') {
        setLastSelectedDrawingsImg(successfulUploads[0]);
        setTimeout(() => setLastSelectedDrawingsImg(null), 100);
      } else if (target === 'company') {
        setLastSelectedCompanyImg(successfulUploads[0]);
        setTimeout(() => setLastSelectedCompanyImg(null), 100);
      }
    } finally {
      setUploading(null);
    }
  };

  const toggleGalleryImg = (url: string) => {
    setForm(prev => {
      const gallery = prev.gallery || [];
      if (gallery.includes(url)) {
        return { ...prev, gallery: gallery.filter(u => u !== url) };
      } else if (gallery.length < 6) {
        return { ...prev, gallery: [...gallery, url] };
      }
      return prev;
    });
  };

  const handleKeywordChange = (index: number, val: string) => {
    const newKeywords = [...(form.keywords || ['', '', '', '', ''])];
    newKeywords[index] = val;
    setForm({ ...form, keywords: newKeywords });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.cat || !form.img) {
      alert('请填写产品名称、分类并上传主图');
      return;
    }
    setLoading(true);
    try {
      const success = await updateProduct(form as Product);
      if (success) {
        await refreshData();
        router.push('/admin/products');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-32 animate-in fade-in duration-700 px-4">
       <div className="flex justify-between items-end">
          <div>
             <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-900 leading-none mb-2">{initialData ? '编辑产品' : '发布新产品'}</h2>
             <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2 tracking-widest">Alibaba Pro Mode - Industrial SEO Standards</p>
          </div>
          <div className="flex gap-4">
             <Link href="/admin/products" className="px-10 py-5 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition shadow-sm">取消修改</Link>
             <button onClick={handleSubmit} disabled={loading} className="px-16 py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-slate-200 hover:bg-blue-600 transition-all flex items-center gap-3">
                {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
                <span>{initialData ? '保存更新' : '立即发布'}</span>
             </button>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         <div className="lg:col-span-8 space-y-10">
            {/* 媒体资产 */}
            <div className="bg-white p-12 rounded-[56px] shadow-sm border border-slate-100">
               <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 mb-10 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600"><i className="fas fa-images"></i></div> 
                  媒体资产管理 (Alibaba Pattern)
               </h3>
               
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  {/* 主图 */}
                  <div className="lg:col-span-5 space-y-6">
                     <div className="flex justify-between items-center">
                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-[0.3em]">产品主图 (1:1 Ratio)</label>
                        <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">SEO Main Image</span>
                     </div>
                     <div className="relative aspect-square rounded-[48px] overflow-hidden bg-slate-50 border-4 border-dashed border-slate-100 flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/20 transition-all group shadow-inner">
                        {form.img ? (
                          <Image src={form.img} alt={form.alt || ''} fill className="object-contain p-8 group-hover:scale-110 transition-transform duration-1000" />
                        ) : (
                          <i className="fas fa-plus text-slate-200 text-3xl"></i>
                        )}
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4">
                           <button onClick={(e) => { e.stopPropagation(); setShowMatPicker({ active: true, target: 'main' }); }} className="bg-white p-4 rounded-2xl hover:bg-blue-600 hover:text-white transition" title="从素材库选择"><i className="fas fa-layer-group"></i></button>
                           <label className="bg-white p-4 rounded-2xl hover:bg-blue-600 hover:text-white transition cursor-pointer" title="本地上传">
                              <i className="fas fa-upload"></i>
                              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'main')} />
                           </label>
                        </div>
                     </div>
                     
                     {/* 主图 Alt 标签编辑 */}
                     <div className="pt-2">
                        <label className="block text-[8px] font-black uppercase text-slate-400 mb-2 tracking-[0.2em] ml-2">Image Alt Text (SEO Keywords)</label>
                        <div className="relative">
                           <input 
                              type="text" 
                              value={form.alt} 
                              onChange={e => setForm({...form, alt: e.target.value})}
                              placeholder="Google Image SEO Keywords..."
                              className="w-full bg-slate-50 border-none rounded-2xl px-12 py-4 font-black text-[10px] uppercase text-blue-600 focus:ring-4 ring-blue-500/10 placeholder:text-slate-300 transition-all"
                           />
                           <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 text-[10px]"></i>
                        </div>
                     </div>
                  </div>

                  {/* 批量副图 */}
                  <div className="lg:col-span-7 space-y-6">
                     <div className="flex justify-between items-center">
                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-[0.3em]">轮播图 (Max 6)</label>
                        <label className="text-blue-600 text-[10px] font-black uppercase cursor-pointer hover:underline flex items-center gap-2">
                           <i className="fas fa-plus-circle"></i> 批量上传
                           <input type="file" className="hidden" multiple accept="image/*" onChange={(e) => handleFileUpload(e, 'gallery')} />
                        </label>
                     </div>
                     <div className="grid grid-cols-3 gap-4">
                        {form.gallery?.map((g, i) => (
                           <div key={i} className="relative aspect-square rounded-[32px] overflow-hidden bg-slate-50 border border-slate-100 group shadow-sm hover:shadow-xl transition-all">
                              <Image src={g} alt="" fill className="object-contain p-4" />
                              <button onClick={() => toggleGalleryImg(g)} className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-xl text-[10px] opacity-0 group-hover:opacity-100 transition shadow-lg"><i className="fas fa-times"></i></button>
                           </div>
                        ))}
                        {[...Array(Math.max(0, 6 - (form.gallery?.length || 0)))].map((_, i) => (
                           <div key={i} onClick={() => setShowMatPicker({ active: true, target: 'gallery' })} className="aspect-square rounded-[32px] border-2 border-dashed border-slate-100 flex items-center justify-center text-slate-200 hover:border-blue-200 hover:text-blue-200 cursor-pointer transition-all bg-slate-50/30">
                              <i className="fas fa-plus"></i>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>

            {/* 基本信息 */}
            <div className="bg-white p-12 rounded-[56px] shadow-sm border border-slate-100 space-y-10">
               <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white"><i className="fas fa-file-lines text-sm"></i></div> 
                  产品规格参数
               </h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                     <label className="block text-[9px] font-black uppercase text-slate-400 mb-4 tracking-[0.3em]">产品标题 (仅英文)</label>
                     <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-sm focus:ring-4 ring-blue-500/10 transition-all shadow-inner" placeholder="e.g. Hex Head Cap Screw" />
                  </div>
                  <div>
                     <label className="block text-[9px] font-black uppercase text-slate-400 mb-4 tracking-[0.3em]">所属分类</label>
                     <select value={form.cat} onChange={e => setForm({...form, cat: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-black text-[10px] uppercase focus:ring-4 ring-blue-500/10 shadow-inner appearance-none">
                        <option value="">选择分类</option>
                        {categories.map(c => <option key={c.id} value={c.value}>{c.name}</option>)}
                     </select>
                  </div>
                  <div>
                     <label className="block text-[9px] font-black uppercase text-slate-400 mb-4 tracking-[0.3em]">产品规格/尺寸范围</label>
                     <input type="text" value={form.spec} onChange={e => setForm({...form, spec: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-sm shadow-inner" placeholder="e.g. M6 - M36" />
                  </div>
                  <div>
                     <label className="block text-[9px] font-black uppercase text-slate-400 mb-4 tracking-[0.3em]">排序权重 (越小越靠前)</label>
                     <input type="number" value={form.sortOrder} onChange={e => setForm({...form, sortOrder: parseInt(e.target.value)})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-black text-sm shadow-inner" />
                  </div>
               </div>
               
               <div>
                  <label className="block text-[9px] font-black uppercase text-slate-400 mb-4 tracking-[0.3em]">Quick Summary (详情页简短描述)</label>
                  <textarea rows={3} value={form.summary} onChange={e => setForm({...form, summary: e.target.value})} className="w-full bg-slate-50 border-none rounded-[32px] px-8 py-6 font-medium text-sm leading-relaxed shadow-inner" placeholder="Short description for the quick specs area..."></textarea>
               </div>
            </div>

            {/* 富文本编辑区 */}
            <div className="bg-white p-12 rounded-[56px] shadow-sm border border-slate-100 space-y-12">
               <div>
                  <label className="block text-[9px] font-black uppercase text-slate-400 mb-6 tracking-[0.3em]">1. Product Details (详细描述)</label>
                  <TiptapEditor 
                    content={form.description || ''} 
                    onChange={val => setForm({...form, description: val})} 
                    onImageClick={() => setShowMatPicker({ active: true, target: 'editor' })}
                    insertedImage={lastSelectedEditorImg}
                  />
               </div>
               <div>
                  <label className="block text-[9px] font-black uppercase text-slate-400 mb-6 tracking-[0.3em]">2. Technical Drawings (技术图纸)</label>
                  <TiptapEditor 
                    content={form.technicalDrawings || ''} 
                    onChange={val => setForm({...form, technicalDrawings: val})} 
                    onImageClick={() => setShowMatPicker({ active: true, target: 'drawings' })}
                    insertedImage={lastSelectedDrawingsImg}
                  />
               </div>
               <div>
                  <label className="block text-[9px] font-black uppercase text-slate-400 mb-6 tracking-[0.3em]">3. Company Profile (公司介绍)</label>
                  <TiptapEditor 
                    content={form.companyProfile || ''} 
                    onChange={val => setForm({...form, companyProfile: val})} 
                    onImageClick={() => setShowMatPicker({ active: true, target: 'company' })}
                    insertedImage={lastSelectedCompanyImg}
                  />
               </div>
            </div>
         </div>

         <div className="lg:col-span-4 space-y-10">
            {/* SEO 引擎 */}
            <div className="bg-white p-12 rounded-[56px] shadow-sm border border-slate-100">
               <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 mb-10 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600"><i className="fas fa-search"></i></div> 
                  Google SEO 优化引擎
               </h3>
               
               <div className="space-y-8">
                  <div>
                     <label className="block text-[9px] font-black uppercase text-slate-400 mb-3 tracking-[0.3em]">Meta Title (页面标题)</label>
                     <input type="text" value={form.seoTitle} onChange={e => setForm({...form, seoTitle: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-xs" />
                  </div>
                  <div>
                     <label className="block text-[9px] font-black uppercase text-slate-400 mb-3 tracking-[0.3em]">URL Slug (SEO URL)</label>
                     <input type="text" value={form.seoSlug} onChange={e => setForm({...form, seoSlug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-black text-xs text-blue-600" />
                  </div>
                  <div>
                     <label className="block text-[9px] font-black uppercase text-slate-400 mb-3 tracking-[0.3em]">Meta Description</label>
                     <textarea rows={4} value={form.seoDescription} onChange={e => setForm({...form, seoDescription: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-xs leading-relaxed"></textarea>
                  </div>
                  <div>
                     <label className="block text-[9px] font-black uppercase text-slate-400 mb-4 tracking-[0.3em]">SEO Keywords (5)</label>
                     <div className="space-y-2">
                        {(form.keywords || ['', '', '', '', '']).map((kw, i) => (
                           <input key={i} type="text" value={kw} onChange={e => handleKeywordChange(i, e.target.value)} placeholder={`关键词 ${i+1}`} className="w-full bg-slate-50 border-none rounded-xl px-5 py-3 font-black text-[9px] uppercase tracking-widest" />
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         </div>
       </div>

       {/* 全局素材选择器 */}
       {showMatPicker.active && (
           <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[200] flex items-center justify-center p-6 md:p-12">
              <div className="bg-white w-full max-w-6xl rounded-[80px] shadow-2xl h-full max-h-[900px] flex flex-col overflow-hidden animate-in zoom-in duration-700 relative">
                 <div className="p-12 border-b border-slate-100 flex justify-between items-center relative z-10">
                    <div>
                      <h3 className="text-4xl font-black uppercase text-slate-900 tracking-tighter leading-none">全局素材中心库</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-3 flex items-center gap-2">
                         <span className="w-2 h-2 rounded-full bg-blue-600"></span> 正在选择素材
                      </p>
                    </div>
                    <button onClick={() => setShowMatPicker({ active: false, target: 'main' })} className="w-16 h-16 bg-slate-50 rounded-[28px] flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition shadow-sm"><i className="fas fa-times text-xl"></i></button>
                 </div>
                 
                 <div className="flex-1 overflow-y-auto p-12 no-scrollbar">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 pb-12">
                       {materials.map((mat) => (
                          <div 
                            key={mat.id} 
                            onClick={() => {
                              if (showMatPicker.target === 'main') {
                                 setForm({ ...form, img: mat.url });
                                 setShowMatPicker({ active: false, target: 'main' });
                              } else if (showMatPicker.target === 'gallery') {
                                 toggleGalleryImg(mat.url);
                              } else if (showMatPicker.target === 'editor') {
                                 setLastSelectedEditorImg(mat.url);
                                 setTimeout(() => setLastSelectedEditorImg(null), 100);
                                 setShowMatPicker({ active: false, target: 'main' });
                              } else if (showMatPicker.target === 'drawings') {
                                 setLastSelectedDrawingsImg(mat.url);
                                 setTimeout(() => setLastSelectedDrawingsImg(null), 100);
                                 setShowMatPicker({ active: false, target: 'main' });
                              } else if (showMatPicker.target === 'company') {
                                 setLastSelectedCompanyImg(mat.url);
                                 setTimeout(() => setLastSelectedCompanyImg(null), 100);
                                 setShowMatPicker({ active: false, target: 'main' });
                              }
                            }}
                            className={`relative aspect-square rounded-[40px] overflow-hidden cursor-pointer border-4 transition-all duration-500 bg-white p-4 shadow-sm hover:shadow-2xl hover:-translate-y-2 ${
                               (showMatPicker.target === 'main' && form.img === mat.url) || 
                               (showMatPicker.target === 'gallery' && form.gallery?.includes(mat.url))
                               ? 'border-blue-600 ring-8 ring-blue-50' : 'border-white hover:border-blue-200'
                            }`}
                           >
                              <Image src={mat.url} alt="" fill className="object-contain p-4 transition-transform duration-700 hover:scale-110" />
                              {((showMatPicker.target === 'main' && form.img === mat.url) || (showMatPicker.target === 'gallery' && form.gallery?.includes(mat.url))) && (
                                 <div className="absolute top-4 right-4 w-8 h-8 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-xs shadow-2xl animate-in zoom-in duration-300"><i className="fas fa-check"></i></div>
                              )}
                           </div>
                       ))}
                    </div>
                 </div>

                 <div className="p-12 border-t border-slate-100 flex justify-between items-center bg-white relative z-10">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-300">共 {materials.length} 个可用素材</div>
                    <button onClick={() => setShowMatPicker({ active: false, target: 'main' })} className="bg-slate-900 text-white px-16 py-6 rounded-[32px] font-black uppercase tracking-[0.4em] text-xs shadow-2xl shadow-slate-300 hover:bg-blue-600 transition-all active:scale-95">确定选择并返回</button>
                 </div>
              </div>
           </div>
       )}
    </div>
  );
}
