// app/admin/material/page.tsx
'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useProducts, MaterialAsset } from '../../context/ProductContext';

export default function MaterialLibraryPage() {
  const { materials, deleteMaterial, updateMaterial, refreshData } = useProducts();
  const [editingMaterial, setEditingMaterial] = useState<MaterialAsset | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMaterial, setNewMaterial] = useState({ name: '', url: '', type: 'image' });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setNewMaterial({
          ...newMaterial,
          url: data.url,
          name: newMaterial.name || file.name.split('.')[0]
        });
      } else {
        alert('上传失败: ' + (data.error || '未知错误'));
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('上传过程中发生错误');
    } finally {
      setUploading(false);
    }
  };

  const handleAdd = async () => {
    if (!newMaterial.name || !newMaterial.url) return alert('请填写名称并上传图片或填写 URL');
    try {
      const res = await fetch('/api/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMaterial)
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewMaterial({ name: '', url: '', type: 'image' });
        refreshData();
      }
    } catch (e) { console.error(e); }
  };

  const handleUpdate = async () => {
    if (!editingMaterial) return;
    const success = await updateMaterial(editingMaterial);
    if (success) setEditingMaterial(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除该素材？')) return;
    await deleteMaterial(id);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center px-4">
        <div>
           <h2 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 leading-none mb-2">素材库中心</h2>
           <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2 italic">Global Media Assets Management</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-10 py-5 rounded-3xl font-black uppercase italic tracking-widest text-sm shadow-xl shadow-blue-200 hover:bg-blue-700 transition"
        >
          + 上传新素材
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 px-4">
        {materials.map(img => (
          <div key={img.id} className="bg-white p-4 rounded-[40px] shadow-sm border border-slate-100 group hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
             <div className="aspect-square relative rounded-[28px] overflow-hidden mb-4 shadow-inner bg-slate-50">
                <Image src={img.url} alt={img.name} fill className="object-contain p-2 group-hover:scale-110 transition duration-700" />
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                   <button 
                    onClick={() => setEditingMaterial(img)}
                    className="w-10 h-10 rounded-xl bg-white text-slate-900 flex items-center justify-center hover:bg-blue-600 hover:text-white transition shadow-lg"
                   >
                    <i className="fas fa-pencil-alt text-xs"></i>
                   </button>
                   <button 
                    onClick={() => handleDelete(img.id)}
                    className="w-10 h-10 rounded-xl bg-white text-slate-900 flex items-center justify-center hover:bg-red-500 hover:text-white transition shadow-lg"
                   >
                    <i className="fas fa-trash text-xs"></i>
                   </button>
                </div>
             </div>
             <div className="px-2">
                <div className="text-[10px] font-black uppercase text-slate-900 truncate italic">{img.name}</div>
                <div className="text-[8px] font-bold text-slate-300 uppercase tracking-tighter mt-1">{img.type} 素材 | {img.date}</div>
             </div>
          </div>
        ))}
        <div 
          onClick={() => setShowAddModal(true)}
          className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[40px] aspect-square flex flex-col items-center justify-center text-slate-300 cursor-pointer hover:border-blue-400 hover:text-blue-400 transition group"
        >
           <i className="fas fa-plus-circle text-3xl mb-3 group-hover:scale-110 transition"></i>
           <span className="text-[10px] font-black uppercase tracking-widest">添加文件</span>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-[48px] p-12 shadow-2xl animate-in zoom-in duration-300">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black italic uppercase text-slate-900">新增素材资产</h3>
                  <button onClick={() => setShowAddModal(false)} className="text-slate-300 hover:text-slate-900"><i className="fas fa-times"></i></button>
               </div>
               
               <div className="space-y-6">
                  <div>
                     <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">素材名称</label>
                     <input 
                       type="text" 
                       value={newMaterial.name}
                       onChange={e => setNewMaterial({...newMaterial, name: e.target.value})}
                       placeholder="例如: 8.8级螺栓主图"
                       className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold"
                     />
                  </div>

                  <div>
                     <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">图片来源</label>
                     
                     {/* Upload Area */}
                     <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full aspect-video rounded-[32px] border-4 border-dashed border-slate-100 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:border-blue-200 hover:bg-blue-50/30 transition-all group overflow-hidden relative"
                     >
                        {uploading ? (
                           <div className="flex flex-col items-center gap-4">
                              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 italic">Uploading...</span>
                           </div>
                        ) : newMaterial.url ? (
                           <>
                              <Image src={newMaterial.url} alt="Preview" fill className="object-contain p-4" />
                              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                 <span className="bg-white px-6 py-2 rounded-xl font-black text-[10px] uppercase italic tracking-widest">更换图片</span>
                              </div>
                           </>
                        ) : (
                           <>
                              <i className="fas fa-cloud-upload-alt text-3xl text-slate-200 mb-2 group-hover:scale-110 group-hover:text-blue-200 transition"></i>
                              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest group-hover:text-blue-300">点击上传物理文件</span>
                           </>
                        )}
                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                     </div>

                     <div className="relative mt-6">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                        <div className="relative flex justify-center text-[8px] font-black uppercase tracking-[0.4em] italic text-slate-300"><span className="bg-white px-4">或者输入 URL</span></div>
                     </div>

                     <input 
                       type="text" 
                       value={newMaterial.url}
                       onChange={e => setNewMaterial({...newMaterial, url: e.target.value})}
                       placeholder="https://..."
                       className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-blue-600 mt-4 text-xs"
                     />
                  </div>

                  <div className="flex gap-4 pt-6">
                     <button onClick={handleAdd} disabled={uploading} className="flex-1 bg-blue-600 text-white py-5 rounded-[24px] font-black uppercase italic text-xs tracking-widest shadow-xl shadow-blue-500/20 hover:bg-slate-900 transition-all disabled:opacity-50">确认发布至素材库</button>
                  </div>
               </div>
            </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingMaterial && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-[48px] p-12 shadow-2xl animate-in zoom-in duration-300">
               <h3 className="text-2xl font-black italic uppercase mb-8 text-slate-900">编辑素材信息</h3>
               <div className="space-y-6">
                  <div>
                     <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">素材名称</label>
                     <input 
                       type="text" 
                       value={editingMaterial.name}
                       onChange={e => setEditingMaterial({...editingMaterial, name: e.target.value})}
                       className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold"
                     />
                  </div>
                  <div>
                     <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">素材 URL</label>
                     <input 
                       type="text" 
                       value={editingMaterial.url}
                       onChange={e => setEditingMaterial({...editingMaterial, url: e.target.value})}
                       className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-blue-600"
                     />
                  </div>
                  <div className="flex gap-4 pt-6">
                     <button onClick={() => setEditingMaterial(null)} className="flex-1 py-4 font-black uppercase italic text-xs text-slate-400 tracking-widest">取消</button>
                     <button onClick={handleUpdate} className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black uppercase italic text-xs tracking-widest shadow-xl shadow-slate-200">保存修改</button>
                  </div>
               </div>
            </div>
        </div>
      )}
    </div>
  );
}
