// app/admin/material/page.tsx
'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useProducts, MaterialAsset } from '../../context/ProductContext';

export default function MaterialLibraryPage() {
  const { materials, deleteMaterial, updateMaterial, refreshData } = useProducts();
  const [editingMaterial, setEditingMaterial] = useState<MaterialAsset | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMaterial, setNewMaterial] = useState({ name: '', url: '', type: 'image', category: '产品图' });
  const [filterCat, setFilterCat] = useState('All');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 多选功能状态
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showBatchTools, setShowBatchTools] = useState(false);

  const assetCategories = ['产品图', '新闻图', 'UI图标', '其他'];

  const filteredMaterials = materials.filter(m => filterCat === 'All' || m.category === filterCat);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        
        if (data.url) {
          const type = file.type.startsWith('video/') ? 'video' : 'image';
          
          await fetch('/api/materials', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: file.name.split('.')[0],
              url: data.url,
              type: type,
              category: type === 'video' ? '其他' : '产品图',
              hash: data.hash
            })
          });
          successCount++;
        }
      } catch (error) {
        console.error('Batch upload error:', error);
      }
    }

    setUploading(false);
    refreshData();
    if (successCount > 0) alert(`成功上传 ${successCount} 个素材`);
  };

  const handleBulkCreateProducts = async () => {
    if (selectedIds.length === 0) return alert('请先选择图片');
    if (!confirm(`确定将选中的 ${selectedIds.length} 张图片直接创建为产品吗？`)) return;

    setUploading(true);
    let count = 0;
    
    for (const id of selectedIds) {
      const mat = materials.find(m => m.id === id);
      if (mat && mat.type === 'image') {
        const newProd = {
          name: mat.name || 'New Product',
          cat: 'Others',
          img: mat.url,
          spec: 'Standard Specification',
          description: 'Detailed description to be added...',
          alt: mat.name,
          sortOrder: 100
        };
        
        try {
          await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProd)
          });
          count++;
        } catch (e) { console.error(e); }
      }
    }
    
    setUploading(false);
    setSelectedIds([]);
    alert(`批量创建成功！共创建 ${count} 个产品。请前往产品列表页完善详细信息。`);
  };

  const handleUpdate = async () => {
    if (!editingMaterial) return;
    const success = await updateMaterial(editingMaterial);
    if (success) setEditingMaterial(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定彻底删除该素材？')) return;
    await deleteMaterial(id);
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const batchDelete = async () => {
    if (!confirm(`确定删除选中的 ${selectedIds.length} 个素材吗？`)) return;
    for (const id of selectedIds) {
      await deleteMaterial(id);
    }
    setSelectedIds([]);
    alert('批量删除成功');
  };

  const batchMove = async (cat: string) => {
    if (!confirm(`确定将选中的素材移动到 "${cat}" 分类吗？`)) return;
    for (const id of selectedIds) {
      const mat = materials.find(m => m.id === id);
      if (mat) {
        await updateMaterial({ ...mat, category: cat });
      }
    }
    setSelectedIds([]);
    alert('批量移动成功');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center px-4">
        <div>
           <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-900 leading-none mb-2">素材资产库</h2>
           <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">统一媒体资产管理与多端分发中心</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowBatchTools(!showBatchTools)}
            className={`px-8 py-5 rounded-3xl font-black uppercase tracking-widest text-[10px] transition-all ${showBatchTools ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-400 hover:text-slate-900'}`}
          >
            {showBatchTools ? '退出批量管理' : '批量管理模式'}
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="bg-blue-600 text-white px-10 py-5 rounded-3xl font-black uppercase tracking-widest text-sm shadow-xl shadow-blue-200 hover:bg-blue-700 transition disabled:opacity-50"
          >
            {uploading ? '正在极速上传...' : '+ 批量上传素材'}
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
            multiple
            accept="image/*,video/*"
          />
        </div>
      </div>

      {/* 批量操作工具栏 */}
      {showBatchTools && selectedIds.length > 0 && (
        <div className="mx-4 bg-slate-900 text-white p-6 rounded-[32px] flex flex-wrap items-center justify-between gap-6 animate-in slide-in-from-top-4 duration-500 shadow-2xl">
            <div className="flex items-center gap-4">
               <span className="bg-blue-600 px-4 py-1 rounded-full text-[10px] font-black uppercase">已选中 {selectedIds.length}</span>
               <button onClick={() => setSelectedIds([])} className="text-[10px] font-black uppercase text-slate-400 hover:text-white">取消全选</button>
            </div>
            <div className="flex flex-wrap items-center gap-4">
               <button onClick={handleBulkCreateProducts} className="bg-emerald-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase shadow-lg shadow-emerald-500/20 hover:bg-emerald-700">一键转为产品</button>
               <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">移动至:</span>
               <div className="flex gap-2">
                  {assetCategories.map(cat => (
                    <button key={cat} onClick={() => batchMove(cat)} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase hover:bg-white/10">{cat}</button>
                  ))}
               </div>
               <div className="w-px h-6 bg-white/10 mx-2"></div>
               <button onClick={batchDelete} className="bg-red-500 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase shadow-lg shadow-red-500/20 hover:bg-red-600">一键彻底删除</button>
            </div>
        </div>
      )}

      {/* 目录/分类筛选器 */}
      <div className="flex gap-4 px-4 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setFilterCat('All')}
            className={`px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition ${filterCat === 'All' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-100 text-slate-400 hover:text-slate-900'}`}
          >
            全部资产
          </button>
          {assetCategories.map(cat => (
             <button 
               key={cat}
               onClick={() => setFilterCat(cat)}
               className={`px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition ${filterCat === cat ? 'bg-blue-600 text-white' : 'bg-white border border-slate-100 text-slate-400 hover:text-slate-900'}`}
             >
               {cat}
             </button>
          ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 px-4">
        {filteredMaterials.map(img => (
          <div 
            key={img.id} 
            onClick={() => showBatchTools && toggleSelect(img.id)}
            className={`bg-white p-4 rounded-[40px] shadow-sm border transition-all duration-500 relative overflow-hidden group cursor-pointer ${showBatchTools && selectedIds.includes(img.id) ? 'border-blue-600 ring-8 ring-blue-50' : 'border-slate-100 hover:shadow-2xl'}`}
          >
              <div className="aspect-square relative rounded-[28px] overflow-hidden mb-4 bg-slate-50">
                {img.type === 'video' ? (
                  <video src={img.url} className="w-full h-full object-cover" />
                ) : (
                  <Image 
                    src={img.url} 
                    alt={img.name} 
                    fill 
                    sizes="(max-width: 768px) 50vw, 200px"
                    className="object-contain p-2 group-hover:scale-110 transition duration-700" 
                    loading="lazy"
                  />
                )}
                
                {img.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-8 h-8 bg-blue-600/80 rounded-full flex items-center justify-center text-white text-[10px]">
                      <i className="fas fa-play ml-0.5"></i>
                    </div>
                  </div>
                )}
                
                {/* 选中状态 */}
                {showBatchTools && selectedIds.includes(img.id) && (
                   <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl animate-in zoom-in duration-300">
                         <i className="fas fa-check text-xl"></i>
                      </div>
                   </div>
                )}

                <div className="absolute top-3 left-3">
                   <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-[7px] font-black uppercase tracking-widest text-slate-900 shadow-sm border border-slate-100">
                      {img.category || '未分类'}
                   </span>
                </div>
                {!showBatchTools && (
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setEditingMaterial(img); }}
                      className="w-10 h-10 rounded-xl bg-white text-slate-900 flex items-center justify-center hover:bg-blue-600 hover:text-white transition shadow-lg"
                    >
                      <i className="fas fa-pencil-alt text-xs"></i>
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(img.id); }}
                      className="w-10 h-10 rounded-xl bg-white text-slate-900 flex items-center justify-center hover:bg-red-500 hover:text-white transition shadow-lg"
                    >
                      <i className="fas fa-trash text-xs"></i>
                    </button>
                  </div>
                )}
              </div>
              <div className="px-2">
                 <div className="text-[10px] font-black uppercase text-slate-900 truncate">{img.name}</div>
                 <div className="text-[8px] font-bold text-slate-300 uppercase tracking-tighter mt-1">{img.type} 素材 | {img.date}</div>
              </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingMaterial && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-[48px] p-12 shadow-2xl animate-in zoom-in duration-300">
               <h3 className="text-2xl font-black uppercase mb-8 text-slate-900">编辑素材信息</h3>
               <div className="space-y-6">
                  <div>
                     <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">素材标题</label>
                     <input 
                       type="text" 
                       value={editingMaterial.name}
                       onChange={e => setEditingMaterial({...editingMaterial, name: e.target.value})}
                       className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold"
                     />
                  </div>
                  <div>
                     <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">所属分类</label>
                     <select 
                       value={editingMaterial.category || '产品图'}
                       onChange={e => setEditingMaterial({...editingMaterial, category: e.target.value})}
                       className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-xs appearance-none"
                     >
                       {assetCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                     </select>
                  </div>
                  <div>
                     <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">资源地址 (URL)</label>
                     <input 
                       type="text" 
                       value={editingMaterial.url}
                       onChange={e => setEditingMaterial({...editingMaterial, url: e.target.value})}
                       className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-blue-600"
                     />
                  </div>
                  <div className="flex gap-4 pt-6">
                     <button onClick={() => setEditingMaterial(null)} className="flex-1 py-4 font-black uppercase text-xs text-slate-400 tracking-widest">取消</button>
                     <button onClick={handleUpdate} className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-slate-200">确认修改</button>
                  </div>
               </div>
            </div>
        </div>
      )}
    </div>
  );
}
