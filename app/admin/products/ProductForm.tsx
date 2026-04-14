// app/admin/products/ProductForm.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProducts, Product } from '../../context/ProductContext';

export default function ProductForm({ initialData }: { initialData?: Product }) {
  const router = useRouter();
  const { categories, materials, updateProduct, refreshData } = useProducts();
  const [form, setForm] = useState<Partial<Product>>({
    name: '', cat: '', img: '', gallery: [], spec: 'M6 - M36', description: '', price: '', stock: '', keywords: ['', '', '', '', ''], seoTitle: '', seoDescription: '', seoSlug: '', alt: ''
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [showMatPicker, setShowMatPicker] = useState<{ active: boolean, target: 'main' | 'gallery' }>({ active: false, target: 'main' });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'main' | 'gallery') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(target);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (target === 'main') {
          setForm(prev => ({ ...prev, img: data.url }));
        } else {
          setForm(prev => ({ ...prev, gallery: [...(prev.gallery || []), data.url] }));
        }
        // 同时保存到素材库以便以后复用
        await fetch('/api/materials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: file.name, url: data.url, type: 'image' })
        });
        refreshData();
      } else {
        alert('上传失败，请检查网络或密钥配置');
      }
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
        keywords: initialData.keywords && initialData.keywords.length >= 5 ? initialData.keywords.slice(0, 5) : [...(initialData.keywords || []), '', '', '', '', ''].slice(0, 5)
      });
    }
  }, [initialData]);

  const handleSubmit = async () => {
    if (!form.name || !form.cat || !form.img) return alert('请填写必要的产品信息 (名称、分类、图片)');
    setLoading(true);
    
    const productData = {
      ...form,
      id: initialData ? initialData.id : Date.now(),
      seoSlug: form.seoSlug || form.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      gallery: form.gallery || [],
      keywords: (form.keywords || []).filter(k => k.trim() !== '')
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
      alert(initialData ? '产品更新成功' : '产品录入成功');
      router.push('/admin/products');
    } else {
      alert('保存失败，请重试');
    }
    setLoading(false);
  };

  const toggleGalleryImg = (url: string) => {
    const current = form.gallery || [];
    if (current.includes(url)) {
      setForm({...form, gallery: current.filter(u => u !== url)});
    } else {
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
            <h2 className="text-5xl font-black uppercase tracking-tighter">{initialData ? 'EDIT PRODUCT' : 'NEW PRODUCT'}</h2>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] mt-2 tracking-[0.3em] flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> ENGINE FOR GLOBAL HARDWARE DISTRIBUTION
            </p>
         </div>
         <div className="flex gap-4">
            <button onClick={() => router.back()} className="px-8 py-4 rounded-2xl font-black uppercase text-[10px] text-slate-400 hover:text-slate-900 transition tracking-widest">CANCEL</button>
            <button onClick={handleSubmit} disabled={loading} className="bg-blue-600 text-white px-12 py-5 rounded-[24px] font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-blue-500/20 hover:bg-slate-900 transition-all active:scale-95 disabled:opacity-50">
              {loading ? 'PROCESSING...' : (initialData ? 'SAVE CHANGES' : 'PUBLISH PRODUCT')}
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 px-6">
        {/* 左侧主要表单 */}
        <div className="lg:col-span-8 space-y-10">
          <div className="bg-white p-12 rounded-[56px] shadow-sm border border-slate-100">
            <h3 className="text-[10px] font-black uppercase text-blue-600 tracking-[0.3em] mb-12 flex items-center gap-4">
               <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center"><i className="fas fa-layer-group"></i></div> CORE SPECIFICATIONS
            </h3>
            <div className="space-y-10">
              <div>
                <label className="block text-[9px] font-black uppercase text-slate-400 mb-3 tracking-[0.3em] ml-1">Official Product Name</label>
                <input 
                  type="text" 
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const updates: any = { name };
                    if (!form.seoTitle || form.seoTitle === `${form.name} | High Fasteners Industrial`) {
                      updates.seoTitle = `${name} | High Fasteners Industrial`;
                    }
                    if (!form.seoSlug || form.seoSlug === form.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')) {
                      updates.seoSlug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                    }
                    if (!form.alt || form.alt === form.name) {
                      updates.alt = name;
                    }
                    setForm({...form, ...updates});
                  }}
                  className="w-full bg-slate-50 border-none rounded-[28px] px-10 py-6 font-black text-3xl uppercase focus:ring-4 ring-blue-500/10 transition-all tracking-tight" 
                  placeholder="EX: DIN933 HEX BOLT..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                     <label className="block text-[9px] font-black uppercase text-slate-400 mb-3 tracking-[0.3em] ml-1">Market Category</label>
                     <select 
                       value={form.cat}
                       onChange={(e) => setForm({...form, cat: e.target.value})}
                       className="w-full bg-slate-50 border-none rounded-[24px] px-8 py-5 font-black uppercase text-sm text-slate-700 appearance-none focus:ring-4 ring-blue-500/10"
                     >
                       <option value="">SELECT CATEGORY</option>
                       {categories.map(c => <option key={c.id} value={c.value}>{c.name}</option>)}
                     </select>
                  </div>
                  <div>
                     <label className="block text-[9px] font-black uppercase text-slate-400 mb-3 tracking-[0.3em] ml-1">Global Standard (Specs)</label>
                     <input 
                       type="text" 
                       value={form.spec}
                       onChange={(e) => setForm({...form, spec: e.target.value})}
                       className="w-full bg-slate-50 border-none rounded-[24px] px-8 py-5 font-black uppercase text-sm text-slate-700 focus:ring-4 ring-blue-500/10" 
                       placeholder="M6 - M36, DIN 933"
                     />
                  </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-12 rounded-[56px] shadow-sm border border-slate-100">
            <h3 className="text-[10px] font-black uppercase text-blue-600 tracking-[0.3em] mb-12 flex items-center gap-4">
               <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center"><i className="fas fa-search"></i></div> SEO & SEARCH OPTIMIZATION
            </h3>
            <div className="space-y-10">
              {/* Google Preview Inside Form for better workflow */}
              <div className="bg-slate-900 rounded-[40px] p-10 text-white overflow-hidden shadow-2xl mb-12 relative border-4 border-slate-800">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full translate-x-24 -translate-y-24 blur-3xl"></div>
                 <h4 className="text-[9px] font-black uppercase text-blue-400 tracking-[0.4em] mb-8 relative z-10 flex items-center gap-2"><i className="fab fa-google"></i> Real-time Google Preview</h4>
                 <div className="bg-white rounded-[24px] p-8 relative z-10 text-slate-900 border border-slate-200">
                    <div className="text-[11px] text-[#202124] mb-1 opacity-60">highfasteners.com › products › {form.seoSlug || '...'}</div>
                    <h4 className="text-[#1a0dab] text-xl font-medium mb-1 hover:underline leading-tight">{form.seoTitle || form.name || 'Your Meta Title'}</h4>
                    <p className="text-[#4d5156] text-[13px] leading-relaxed line-clamp-2">{form.seoDescription || 'Factory Direct high-precision fasteners...'}</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div>
                    <label className="block text-[9px] font-black uppercase text-slate-400 mb-3 tracking-[0.3em] ml-1">Meta Title</label>
                    <input type="text" value={form.seoTitle} onChange={e => setForm({...form, seoTitle: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-sm text-slate-700" placeholder="Product Title + Brand" />
                 </div>
                 <div>
                    <label className="block text-[9px] font-black uppercase text-slate-400 mb-3 tracking-[0.3em] ml-1">Custom Slug</label>
                    <input type="text" value={form.seoSlug} onChange={e => setForm({...form, seoSlug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-black tracking-widest text-xs text-blue-600" />
                 </div>
              </div>

              <div>
                 <label className="block text-[9px] font-black uppercase text-slate-400 mb-3 tracking-[0.3em] ml-1">Meta Description</label>
                 <textarea rows={3} value={form.seoDescription} onChange={e => setForm({...form, seoDescription: e.target.value})} className="w-full bg-slate-50 border-none rounded-[28px] px-8 py-5 font-bold text-sm text-slate-700 leading-relaxed" placeholder="A compelling summary for Google..."></textarea>
              </div>

              {/* 5 SEO Keywords */}
              <div>
                 <label className="block text-[9px] font-black uppercase text-slate-400 mb-6 tracking-[0.3em] ml-1">5 Core Keywords for Detail Page</label>
                 <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[0,1,2,3,4].map(i => (
                       <div key={i} className="relative group">
                          <input 
                           type="text"
                           value={form.keywords?.[i] || ''}
                           onChange={e => handleKeywordChange(i, e.target.value)}
                           placeholder={`Key ${i+1}`}
                           className="w-full bg-slate-50 border-none rounded-xl px-5 py-4 font-black text-[10px] uppercase tracking-widest text-slate-900 focus:bg-white focus:ring-4 ring-blue-500/10 transition-all shadow-sm"
                          />
                          <div className="absolute -top-2 -right-2 w-5 h-5 bg-slate-900 text-white rounded-full flex items-center justify-center text-[8px] font-black">{i+1}</div>
                       </div>
                    ))}
                 </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-12 rounded-[56px] shadow-sm border border-slate-100">
            <h3 className="text-[10px] font-black uppercase text-blue-600 tracking-[0.3em] mb-12 flex items-center gap-4">
               <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center"><i className="fas fa-file-alt"></i></div> RICH DESCRIPTION
            </h3>
            <div className="border-4 border-slate-50 rounded-[40px] overflow-hidden focus-within:border-blue-100 transition shadow-inner">
                <textarea 
                  rows={15}
                  value={form.description}
                  onChange={(e) => setForm({...form, description: e.target.value})}
                  className="w-full border-none px-10 py-10 focus:ring-0 text-slate-700 leading-loose font-medium text-lg"
                  placeholder="Enter detailed product description, technical data, applications... HTML supported."
                ></textarea>
            </div>
          </div>
        </div>

        {/* 右侧侧边栏 */}
        <div className="lg:col-span-4 space-y-10">
           {/* Media Management */}
           <div className="bg-white p-12 rounded-[64px] shadow-sm border border-slate-100 sticky top-32">
              <h3 className="text-[10px] font-black uppercase text-blue-600 tracking-[0.3em] mb-12 flex items-center gap-4">
                 <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center"><i className="fas fa-images"></i></div> MEDIA ASSETS
              </h3>
              
              <div className="space-y-12">
                 {/* Main Image */}
                 <div>
                    <div className="flex justify-between items-center mb-6">
                       <label className="text-[9px] font-black uppercase text-slate-400 tracking-[0.3em] ml-1">Featured Image</label>
                       <span className="text-[8px] font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase">Primary</span>
                    </div>
                    <div className="flex gap-4">
                       <div 
                         onClick={() => setShowMatPicker({ active: true, target: 'main' })}
                         className="relative flex-1 aspect-square rounded-[48px] overflow-hidden bg-slate-50 border-4 border-dashed border-slate-100 flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/20 transition-all group shadow-inner"
                       >
                          {form.img ? (
                             <>
                               <Image src={form.img} alt="" fill className="object-contain p-8 group-hover:scale-110 transition-transform duration-1000" />
                               <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                  <div className="bg-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl">LIBRARY</div>
                               </div>
                             </>
                          ) : (
                             <div className="text-center">
                                <i className="fas fa-layer-group text-3xl text-slate-200 mb-2 group-hover:text-blue-200 transition"></i>
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Library</p>
                             </div>
                          )}
                       </div>
                       <label className={`relative flex-1 aspect-square rounded-[48px] overflow-hidden bg-blue-600 border-4 border-blue-100 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-900 hover:border-slate-800 transition-all shadow-xl shadow-blue-500/10 group ${uploading === 'main' ? 'animate-pulse opacity-70' : ''}`}>
                          <i className={`fas ${uploading === 'main' ? 'fa-spinner fa-spin' : 'fa-cloud-upload-alt'} text-3xl text-white mb-2`}></i>
                          <p className="text-[8px] font-black text-white uppercase tracking-widest">{uploading === 'main' ? 'Uploading' : 'Upload'}</p>
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'main')} />
                       </label>
                    </div>
                 </div>

                 {/* Gallery Images */}
                 <div>
                    <div className="flex justify-between items-center mb-6">
                       <label className="text-[9px] font-black uppercase text-slate-400 tracking-[0.3em] ml-1">Image Gallery</label>
                       <span className="text-[8px] font-black bg-slate-50 text-slate-400 px-3 py-1 rounded-full uppercase">{form.gallery?.length || 0} / 6</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                       {form.gallery?.map((g, i) => (
                          <div key={i} className="relative aspect-square rounded-[24px] overflow-hidden bg-slate-50 border border-slate-100 group shadow-sm">
                             <Image src={g} alt="" fill className="object-contain p-3" />
                             <button 
                              onClick={(e) => { e.stopPropagation(); toggleGalleryImg(g); }}
                              className="absolute top-2 right-2 w-7 h-7 rounded-xl bg-red-500 text-white text-[10px] opacity-0 group-hover:opacity-100 transition shadow-lg flex items-center justify-center"
                             ><i className="fas fa-times"></i></button>
                          </div>
                       ))}
                       {(!form.gallery || form.gallery.length < 6) && (
                          <div className="contents">
                             <button 
                               onClick={() => setShowMatPicker({ active: true, target: 'gallery' })}
                               className="aspect-square rounded-[24px] border-4 border-dashed border-slate-50 flex items-center justify-center text-slate-200 hover:border-blue-200 hover:text-blue-200 transition-all hover:bg-slate-50"
                             >
                                <i className="fas fa-layer-group text-lg"></i>
                             </button>
                             <label className={`aspect-square rounded-[24px] bg-blue-50 border-2 border-blue-100 flex items-center justify-center text-blue-400 hover:bg-blue-600 hover:text-white cursor-pointer transition-all ${uploading === 'gallery' ? 'animate-pulse' : ''}`}>
                                <i className={`fas ${uploading === 'gallery' ? 'fa-spinner fa-spin' : 'fa-plus'} text-lg`}></i>
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'gallery')} />
                             </label>
                          </div>
                       )}
                    </div>
                 </div>

                 <div className="pt-6 border-t border-slate-50">
                    <label className="block text-[9px] font-black uppercase text-slate-400 mb-3 tracking-[0.3em] ml-1">Asset Alt Label (SEO)</label>
                    <input type="text" value={form.alt} onChange={e => setForm({...form, alt: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-black text-xs text-slate-900 tracking-widest" placeholder="EX: STAINLESS STEEL BOLTS" />
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Enhanced Material Picker Modal */}
      {showMatPicker.active && (
         <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[200] flex items-center justify-center p-6 md:p-12">
            <div className="bg-white w-full max-w-6xl rounded-[80px] shadow-2xl h-full max-h-[900px] flex flex-col overflow-hidden animate-in zoom-in duration-700 relative">
               <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full translate-x-32 -translate-y-32 blur-[100px]"></div>
               <div className="p-12 border-b border-slate-100 flex justify-between items-center relative z-10">
                  <div>
                    <h3 className="text-4xl font-black uppercase text-slate-900 tracking-tighter leading-none">Global Asset Library</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-3 flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-blue-600"></span> SELECT {showMatPicker.target === 'main' ? 'FEATURED' : 'GALLERY'} MEDIA
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
                         } else {
                            toggleGalleryImg(mat.url);
                         }
                      }}
                      className={`relative aspect-square rounded-[40px] overflow-hidden cursor-pointer border-4 transition-all duration-500 bg-white p-4 shadow-sm hover:shadow-2xl hover:-translate-y-2 ${
                         (showMatPicker.target === 'main' && form.img === mat.url) || (showMatPicker.target === 'gallery' && form.gallery?.includes(mat.url))
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
                     <span className="text-[10px] font-black uppercase tracking-widest text-center px-4">Manage Library</span>
                  </Link>
               </div>

               <div className="p-12 border-t border-slate-100 flex justify-between items-center bg-white relative z-10">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-300">{materials.length} ASSETS AVAILABLE</div>
                  <button onClick={() => setShowMatPicker({ active: false, target: 'main' })} className="bg-slate-900 text-white px-16 py-6 rounded-[32px] font-black uppercase tracking-[0.4em] text-xs shadow-2xl shadow-slate-300 hover:bg-blue-600 transition-all active:scale-95">CONFIRM SELECTION</button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
}
