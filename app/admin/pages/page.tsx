// app/admin/pages/page.tsx
'use client';

import { useState } from 'react';
import { useProducts } from '../../context/ProductContext';

export default function PagesManagement() {
  const { categories, setCategories } = useProducts();
  const [editing, setEditing] = useState<number | null>(null);
  const [newCat, setNewCat] = useState({ name: '', value: '', description: '' });

  const addCategory = () => {
    if (!newCat.name || !newCat.value) return alert('请填写全名和路径');
    const item = { id: Date.now(), ...newCat };
    setCategories([...categories, item]);
    setNewCat({ name: '', value: '', description: '' });
  };

  const updateCategory = (id: number, field: string, val: string) => {
    setCategories(categories.map(c => c.id === id ? { ...c, [field]: val } : c));
  };

  const deleteCategory = (id: number) => {
    if (confirm('确定删除此分类吗？关联的产品将变为未分类。')) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in slide-in-from-bottom-8 duration-700 pb-20 px-4">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-5xl font-black uppercase tracking-tighter text-slate-900 leading-none">站点结构管理</h2>
           <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] mt-2 tracking-[0.3em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> 定义独立站的产品类目与导航逻辑
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white p-12 rounded-[56px] shadow-sm border border-slate-100">
              <h3 className="text-[10px] font-black uppercase text-blue-600 tracking-[0.3em] mb-10 flex items-center gap-4">
                 <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center"><i className="fas fa-plus"></i></div> 新增产品大类
              </h3>
              <div className="space-y-6">
                 <div>
                    <label className="block text-[9px] font-black uppercase text-slate-400 mb-3 tracking-[0.3em] ml-1">分类展示名称</label>
                    <input 
                      type="text" 
                      value={newCat.name}
                      onChange={e => setNewCat({...newCat, name: e.target.value})}
                      placeholder="例如: 螺栓系列"
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-black text-sm focus:ring-4 ring-blue-500/10 transition-all"
                    />
                 </div>
                 <div>
                    <label className="block text-[9px] font-black uppercase text-slate-400 mb-3 tracking-[0.3em] ml-1">URL 路径值 (Slug)</label>
                    <input 
                      type="text" 
                      value={newCat.value}
                      onChange={e => setNewCat({...newCat, value: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                      placeholder="例如: bolts"
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-black text-sm text-blue-600 focus:ring-4 ring-blue-500/10 transition-all"
                    />
                 </div>
                 <div>
                    <label className="block text-[9px] font-black uppercase text-slate-400 mb-3 tracking-[0.3em] ml-1">分类简单描述</label>
                    <textarea 
                      value={newCat.description}
                      onChange={e => setNewCat({...newCat, description: e.target.value})}
                      rows={3}
                      placeholder="关于此分类的介绍..."
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-xs leading-relaxed focus:ring-4 ring-blue-500/10 transition-all"
                    ></textarea>
                 </div>
                 <button onClick={addCategory} className="w-full bg-blue-600 text-white py-5 rounded-[24px] font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-500/20 hover:bg-slate-900 transition-all active:scale-95">添加到系统</button>
              </div>
           </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
           {categories.map(cat => (
              <div key={cat.id} className="bg-white p-10 rounded-[48px] shadow-sm border border-slate-100 flex flex-wrap items-center justify-between gap-8 group hover:shadow-2xl transition-all duration-500">
                 <div className="flex items-center gap-8">
                    <div className="w-20 h-20 bg-slate-50 rounded-[28px] flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all">
                       <i className="fas fa-folder-open text-2xl"></i>
                    </div>
                    <div>
                       {editing === cat.id ? (
                          <div className="flex gap-4">
                             <input type="text" value={cat.name} onChange={e => updateCategory(cat.id, 'name', e.target.value)} className="bg-slate-50 border-none rounded-xl px-4 py-2 font-black text-lg" />
                             <input type="text" value={cat.value} onChange={e => updateCategory(cat.id, 'value', e.target.value)} className="bg-slate-50 border-none rounded-xl px-4 py-2 font-black text-blue-600" />
                          </div>
                       ) : (
                          <>
                             <h4 className="text-2xl font-black uppercase tracking-tighter text-slate-900 mb-1">{cat.name}</h4>
                             <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">路径标识: /{cat.value}</p>
                          </>
                       )}
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setEditing(editing === cat.id ? null : cat.id)}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition shadow-sm ${editing === cat.id ? 'bg-green-500 text-white' : 'bg-slate-50 text-slate-400 hover:text-slate-900'}`}
                    >
                       <i className={`fas ${editing === cat.id ? 'fa-check' : 'fa-pencil-alt'} text-xs`}></i>
                    </button>
                    <button 
                      onClick={() => deleteCategory(cat.id)}
                      className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition shadow-sm"
                    >
                       <i className="fas fa-trash text-xs"></i>
                    </button>
                 </div>
              </div>
           ))}
           
           {categories.length === 0 && (
              <div className="bg-slate-50 rounded-[48px] p-24 text-center border-4 border-dashed border-slate-100">
                 <i className="fas fa-folder-open text-6xl text-slate-200 mb-6"></i>
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">暂无任何产品分类，请先在左侧添加</p>
              </div>
           )}
        </div>
      </div>
    </div>
  );
}
