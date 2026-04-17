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
        setForm(prev => {
          const newGallery = [...(prev.gallery || []), ...successfulUploads].slice(0, 6);
          return { ...prev, gallery: newGallery };
        });
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
      refreshData();
    } catch (err) {
      console.error(err);
      alert('上传发生错误');
    } finally {
      setUploading(null);
    }
  };

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        gallery: initialData.gallery || [],
        keywords: initialData.keywords && initialData.keywords.length >= 5 ? initialData.keywords.slice(0, 5) : [...(initialData.keywords || []), '', '', '', '', ''].slice(0, 5),
        specs: initialData.specs || []
      });
    }
  }, [initialData]);

  const addSpec = () => {
    setForm(prev => ({
      ...prev,
      specs: [...(prev.specs || []), { key: '', value: '' }].slice(0, 10)
    }));
  };

  const updateSpec = (index: number, field: 'key' | 'value', val: string) => {
    const newSpecs = [...(form.specs || [])];
    newSpecs[index][field] = val;
    setForm({ ...form, specs: newSpecs });
  };

  const removeSpec = (index: number) => {
    setForm(prev => ({
      ...prev,
      specs: (prev.specs || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.cat || !form.img) return alert('请填写必要的产品信息 (名称、分类、主图)');
    setLoading(true);
    
    const productData = {
      ...form,
      id: initialData ? initialData.id : Date.now(),
      seoSlug: form.seoSlug || form.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      gallery: form.gallery || [],
      keywords: (form.keywords || []).filter(k => k.trim() !== ''),
      specs: form.specs || []
    } as Product;

    const success = initialData ? await updateProduct(productData) : await (async () => {
       const res = await fetch('/api/products', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(productData)
       });
       if(res.ok) { refreshData(); return true; }
       return false;
    })();

    if (success) {
      alert(initialData ? '产品更新成功' : '产品发布成功');
      router.push('/admin/products');
    } else {
      alert('保存失败，请检查网络或配置');
    }
    setLoading(false);
  };

  const toggleGalleryImg = (url: string) => {
    const current = form.gallery || [];
    if (current.includes(url)) {
      setForm({...form, gallery: current.filter(u => u !== url)});
    } else {
      if (current.length >= 6) return alert('最多支持 6 张副图');
      setForm({...form, gallery: [...current, url]});
    }
  };

  const handleKeywordChange = (index: number, val: string) => {
    const keys = [...(form.keywords || ['', '', '', '', ''])];
    keys[index] = val;
    setForm({...form, keywords: keys});
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in slide-in-from-bottom-8 duration-700 pb-20">
      <div className="flex justify-between items-center px-6">
         <div>
            <h2 className="text-5xl font-black uppercase tracking-tighter text-slate-900 leading-none">{initialData ? '编辑产品' : '发布新产品'}</h2>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] mt-2 tracking-[0.3em] flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> 工业紧固件全球分销管理引擎
            </p>
         </div>
         <div className="flex gap-4">
            <button onClick={() => router.back()} className="px-8 py-4 rounded-2xl font-black uppercase text-[10px] text-slate-400 hover:text-slate-900 transition tracking-widest">取消返回</button>
            <button onClick={handleSubmit} disabled={loading} className="bg-blue-600 text-white px-12 py-5 rounded-[24px] font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-blue-500/20 hover:bg-slate-900 transition-all active:scale-95 disabled:opacity-50">
              {loading ? '处理中...' : (initialData ? '保存修改' : '立即发布产品')}
            </button>
         </div>
      </div>

      <div className="px-6 space-y-10">
        {/* 图片管理区域 */}
        <div className="bg-white p-12 rounded-[56px] shadow-sm border border-slate-100">
           <h3 className="text-[10px] font-black uppercase text-blue-600 tracking-[0.3em] mb-12 flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center"><i className="fas fa-images"></i></div> 媒体资产管理 (阿里巴巴模式)
           </h3>
           
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* 主图 */}
              <div className="lg:col-span-4 space-y-4">
                 <label className="text-[9px] font-black uppercase text-slate-400 tracking-[0.3em] ml-1">产品主图 (1:1 比例)</label>
                 <div className="relative aspect-square rounded-[48px] overflow-hidden bg-slate-50 border-4 border-dashed border-slate-100 flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/20 transition-all group shadow-inner">
                    {form.img ? (
                      <Image src={form.img} alt="" fill className="object-contain p-8 group-hover:scale-110 transition-transform duration-1000" />
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
              </div>

              {/* 批量副图 */}
              <div className="lg:col-span-8 space-y-4">
                 <div className="flex justify-between items-center">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-[0.3em] ml-1">产品副图轮播 (最多 6 张)</label>
                    <label className="text-blue-600 text-[10px] font-black uppercase cursor-pointer hover:underline">
                       + 批量上传图片
                       <input type="file" className="hidden" multiple accept="image/*" onChange={(e) => handleFileUpload(e, 'gallery')} />
                    </label>
                 </div>
                 <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                    {form.gallery?.map((g, i) => (
                       <div key={i} className="relative aspect-square rounded-[24px] overflow-hidden bg-slate-50 border border-slate-100 group">
                          <Image src={g} alt="" fill className="object-contain p-3" />
                          <button onClick={() => toggleGalleryImg(g)} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-lg text-[8px] opacity-0 group-hover:opacity-100 transition"><i className="fas fa-times"></i></button>
                       </div>
                    ))}
                    {[...Array(6 - (form.gallery?.length || 0))].map((_, i) => (
                       <div key={i} onClick={() => setShowMatPicker({ active: true, target: 'gallery' })} className="aspect-square rounded-[24px] border-2 border-dashed border-slate-100 flex items-center justify-center text-slate-200 hover:border-blue-200 hover:text-blue-200 cursor-pointer transition-all">
                          <i className="fas fa-plus"></i>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
            {/* 核心规格 */}
            <div className="bg-white p-12 rounded-[56px] shadow-sm border border-slate-100">
              <h3 className="text-[10px] font-black uppercase text-blue-600 tracking-[0.3em] mb-12 flex items-center gap-4">
                 <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center"><i className="fas fa-layer-group"></i></div> 核心产品规格
              </h3>
              <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <div className="md:col-span-2">
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-3 tracking-[0.3em] ml-1">官方产品名称 (英文)</label>
                      <input 
                        type="text" 
                        value={form.name}
                        onChange={(e) => setForm({...form, name: e.target.value})}
                        className="w-full bg-slate-50 border-none rounded-[24px] px-8 py-5 font-black text-xl uppercase focus:ring-4 ring-blue-500/10 transition-all" 
                        placeholder="例如: DIN933 HEX BOLT..."
                      />
                   </div>
                   <div>
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-3 tracking-[0.3em] ml-1">手动排序权重 (越小越靠前)</label>
                      <input 
                        type="number" 
                        value={form.sortOrder}
                        onChange={(e) => setForm({...form, sortOrder: parseInt(e.target.value) || 0})}
                        className="w-full bg-slate-50 border-none rounded-[24px] px-8 py-5 font-black text-xl focus:ring-4 ring-blue-500/10 transition-all" 
                        placeholder="0"
                      />
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                       <label className="block text-[9px] font-black uppercase text-slate-400 mb-3 tracking-[0.3em] ml-1">市场分类</label>
                       <select 
                         value={form.cat}
                         onChange={(e) => setForm({...form, cat: e.target.value})}
                         className="w-full bg-slate-50 border-none rounded-[24px] px-8 py-5 font-black uppercase text-sm text-slate-700 appearance-none focus:ring-4 ring-blue-500/10"
                       >
                         <option value="">选择产品类目</option>
                         {categories.map(c => <option key={c.id} value={c.value}>{c.name}</option>)}
                       </select>
                    </div>
                    <div>
                       <label className="block text-[9px] font-black uppercase text-slate-400 mb-3 tracking-[0.3em] ml-1">短描述 (详情页副标题下展示)</label>
                       <input 
                         type="text" 
                         value={form.summary}
                         onChange={(e) => setForm({...form, summary: e.target.value})}
                         className="w-full bg-slate-50 border-none rounded-[24px] px-8 py-5 font-bold text-sm text-slate-700 focus:ring-4 ring-blue-500/10" 
                         placeholder="例如: 高强度工业六角螺栓，适用于重型机械..."
                       />
                    </div>
                </div>
              </div>
            </div>

            {/* 自定义技术参数 */}
            <div className="bg-white p-12 rounded-[56px] shadow-sm border border-slate-100">
               <div className="flex justify-between items-center mb-12">
                  <h3 className="text-[10px] font-black uppercase text-blue-600 tracking-[0.3em] flex items-center gap-4">
                     <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center"><i className="fas fa-list-ul"></i></div> 技术参数明细 (Key-Value)
                  </h3>
                  <button onClick={addSpec} className="text-blue-600 text-[10px] font-black uppercase tracking-widest hover:underline">+ 添加参数行</button>
               </div>
               
               <div className="space-y-4">
                  {(form.specs || []).map((spec, i) => (
                     <div key={i} className="flex gap-4 animate-in slide-in-from-left-4 duration-300">
                        <input 
                          type="text" 
                          value={spec.key} 
                          onChange={(e) => updateSpec(i, 'key', e.target.value)}
                          placeholder="属性名 (如: Material)" 
                          className="flex-1 bg-slate-50 border-none rounded-2xl px-6 py-4 font-black uppercase text-[10px] tracking-widest"
                        />
                        <input 
                          type="text" 
                          value={spec.value} 
                          onChange={(e) => updateSpec(i, 'value', e.target.value)}
                          placeholder="属性值 (如: Carbon Steel)" 
                          className="flex-1 bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-[11px]"
                        />
                        <button onClick={() => removeSpec(i)} className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition"><i className="fas fa-minus text-xs"></i></button>
                     </div>
                  ))}
               </div>
            </div>

            {/* 富文本描述 */}
            <div className="bg-white p-12 rounded-[56px] shadow-sm border border-slate-100">
              <h3 className="text-[10px] font-black uppercase text-blue-600 tracking-[0.3em] mb-12 flex items-center gap-4">
                 <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center"><i className="fas fa-file-alt"></i></div> 产品图文详情描述 (阿里巴巴级编辑器)
              </h3>
              <div className="border-4 border-slate-50 rounded-[40px] overflow-hidden focus-within:border-blue-100 transition shadow-inner">
                  <TiptapEditor 
                    content={form.description || ''} 
                    onChange={(html) => setForm({...form, description: html})} 
                    onOpenLibrary={() => setShowMatPicker({ active: true, target: 'editor' })}
                    lastSelectedImage={lastSelectedEditorImg || undefined}
                  />
              </div>
            </div>

            {/* 产品图纸 */}
            <div className="bg-white p-12 rounded-[56px] shadow-sm border border-slate-100">
              <h3 className="text-[10px] font-black uppercase text-blue-600 tracking-[0.3em] mb-12 flex items-center gap-4">
                 <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center"><i className="fas fa-drafting-compass"></i></div> 产品详细图纸 (Technical Drawings)
              </h3>
              <div className="border-4 border-slate-50 rounded-[40px] overflow-hidden focus-within:border-blue-100 transition shadow-inner">
                  <TiptapEditor 
                    content={form.technicalDrawings || ''} 
                    onChange={(html) => setForm({...form, technicalDrawings: html})} 
                    onOpenLibrary={() => setShowMatPicker({ active: true, target: 'drawings' })}
                    lastSelectedImage={lastSelectedDrawingsImg || undefined}
                  />
              </div>
            </div>

            {/* 公司介绍 */}
            <div className="bg-white p-12 rounded-[56px] shadow-sm border border-slate-100">
              <h3 className="text-[10px] font-black uppercase text-blue-600 tracking-[0.3em] mb-12 flex items-center gap-4">
                 <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center"><i className="fas fa-building"></i></div> 公司介绍 (Company Profile)
              </h3>
              <div className="border-4 border-slate-50 rounded-[40px] overflow-hidden focus-within:border-blue-100 transition shadow-inner">
                  <TiptapEditor 
                    content={form.companyProfile || ''} 
                    onChange={(html) => setForm({...form, companyProfile: html})} 
                    onOpenLibrary={() => setShowMatPicker({ active: true, target: 'company' })}
                    lastSelectedImage={lastSelectedCompanyImg || undefined}
                  />
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-10">
             {/* SEO 引擎 */}
             <div className="bg-white p-12 rounded-[56px] shadow-sm border border-slate-100">
                <h3 className="text-[10px] font-black uppercase text-blue-600 tracking-[0.3em] mb-12 flex items-center gap-4">
                   <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center"><i className="fas fa-search"></i></div> Google SEO 优化引擎
                </h3>
                
                <div className="space-y-8">
                   <div>
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-3 tracking-[0.3em]">Meta Title (页面标题)</label>
                      <input type="text" value={form.seoTitle} onChange={e => setForm({...form, seoTitle: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-xs" />
                   </div>
                   <div>
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-3 tracking-[0.3em]">自定义 URL 路径 (Slug)</label>
                      <input type="text" value={form.seoSlug} onChange={e => setForm({...form, seoSlug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-black text-xs text-blue-600" />
                   </div>
                   <div>
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-3 tracking-[0.3em]">Meta Description (网页描述)</label>
                      <textarea rows={4} value={form.seoDescription} onChange={e => setForm({...form, seoDescription: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-xs leading-relaxed"></textarea>
                   </div>
                   <div>
                      <label className="block text-[9px] font-black uppercase text-slate-400 mb-4 tracking-[0.3em]">SEO 核心关键词 (5个)</label>
                      <div className="space-y-2">
                         {[0,1,2,3,4].map(i => (
                            <input key={i} type="text" value={form.keywords?.[i] || ''} onChange={e => handleKeywordChange(i, e.target.value)} placeholder={`关键词 ${i+1}`} className="w-full bg-slate-50 border-none rounded-xl px-5 py-3 font-black text-[9px] uppercase tracking-widest" />
                         ))}
                      </div>
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
                        <span className="w-2 h-2 rounded-full bg-blue-600"></span> 正在选择 {
                          showMatPicker.target === 'main' ? '主图' : 
                          showMatPicker.target === 'gallery' ? '副图' : 
                          showMatPicker.target === 'drawings' ? '图纸插图' :
                          showMatPicker.target === 'company' ? '公司介绍插图' :
                          '富文本插图'
                        }
                     </p>
                   </div>
                   <button onClick={() => setShowMatPicker({ active: false, target: 'main' })} className="w-16 h-16 bg-slate-50 rounded-[28px] flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition shadow-sm"><i className="fas fa-times text-xl"></i></button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 no-scrollbar relative z-10 bg-slate-50/30">
                   {materials.map(mat => (
                      <div 
                       key={mat.id} 
                       onClick={() => {
                          if(showMatPicker.target === 'main') {
                             setForm({...form, img: mat.url});
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
                          (showMatPicker.target === 'gallery' && form.gallery?.includes(mat.url)) ||
                          (showMatPicker.target === 'editor' && lastSelectedEditorImg === mat.url) ||
                          (showMatPicker.target === 'drawings' && lastSelectedDrawingsImg === mat.url) ||
                          (showMatPicker.target === 'company' && lastSelectedCompanyImg === mat.url)
                          ? 'border-blue-600 ring-8 ring-blue-50' : 'border-white hover:border-blue-200'
                       }`}
                      >
                         <Image src={mat.url} alt="" fill className="object-contain p-4 transition-transform duration-700 hover:scale-110" />
                         {((showMatPicker.target === 'main' && form.img === mat.url) || (showMatPicker.target === 'gallery' && form.gallery?.includes(mat.url))) && (
                            <div className="absolute top-4 right-4 w-8 h-8 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-xs shadow-2xl animate-in zoom-in duration-300"><i className="fas fa-check"></i></div>
                         )}
                      </div>
                   ))}
                   <Link href="/admin/material" className="aspect-square rounded-[40px] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 hover:border-blue-400 hover:text-blue-600 hover:bg-white transition-all group">
                      <i className="fas fa-plus-circle text-4xl mb-4 group-hover:scale-110 transition"></i>
                      <span className="text-[10px] font-black uppercase tracking-widest text-center px-4">管理素材库</span>
                   </Link>
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
