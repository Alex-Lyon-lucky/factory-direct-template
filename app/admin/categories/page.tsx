// app/admin/categories/page.tsx
'use client';

import { useState } from 'react';
import { useProducts } from '../../context/ProductContext';

export default function CategoryManagementPage() {
  const { categories, refreshData } = useProducts();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCat, setNewCat] = useState({ name: '', value: '' });

  const handleAddCategory = async () => {
    if (!newCat.name || !newCat.value) return alert('请填写分类名称和分类代码');
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCat)
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewCat({ name: '', value: '' });
        refreshData();
      }
    } catch (e) { console.error(e); }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('删除分类可能导致相关产品显示异常，确定继续？')) return;
    try {
      const res = await fetch('/api/categories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        refreshData();
      }
    } catch (e) { console.error(e); }
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-10 px-4">
        <div>
           <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900">产品分类体系</h2>
           <p className="text-slate-400 text-sm font-bold mt-1 tracking-widest uppercase text-[10px]">Category Management & Hierarchy</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)} 
          className="bg-blue-600 text-white px-8 py-4 rounded-[20px] font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition"
        >
          + 新增分类
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories && categories.map(cat => (
          <div key={cat.id} className="bg-white p-8 rounded-[32px] flex justify-between items-center shadow-sm border border-slate-100 hover:shadow-xl transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full translate-x-12 -translate-y-12 group-hover:bg-blue-50 transition"></div>
            <div className="relative z-10">
              <div className="font-black uppercase text-2xl text-slate-900 leading-none mb-2">{cat.name}</div>
              <div className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest inline-block">{cat.value}</div>
            </div>
            <button 
              onClick={() => handleDeleteCategory(cat.id)} 
              className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-300 hover:bg-red-500 hover:text-white transition relative z-10 flex items-center justify-center"
            >
              <i className="fas fa-trash-alt"></i>
            </button>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl animate-in zoom-in duration-300">
              <h3 className="text-2xl font-black uppercase mb-8 text-slate-900">新增分类</h3>
              <div className="space-y-6">
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">分类显示名称 (中/英)</label>
                    <input 
                      type="text" 
                      value={newCat.name}
                      onChange={e => setNewCat({...newCat, name: e.target.value})}
                      placeholder="例如: 工业螺栓 / Bolts"
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold"
                    />
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">分类内部代码 (用于 API 过滤)</label>
                    <input 
                      type="text" 
                      value={newCat.value}
                      onChange={e => setNewCat({...newCat, value: e.target.value})}
                      placeholder="例如: Bolt"
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-blue-600"
                    />
                 </div>
                 <div className="flex gap-4 pt-4">
                    <button onClick={() => setShowAddModal(false)} className="flex-1 py-4 font-black uppercase text-xs text-slate-400 tracking-widest">取消</button>
                    <button onClick={handleAddCategory} className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-100">确认添加</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
