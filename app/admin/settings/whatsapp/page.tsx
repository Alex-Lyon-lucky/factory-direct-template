// app/admin/settings/whatsapp/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WhatsAppSettings() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [newPhone, setNewPhone] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/whatsapp-accounts');
      if (res.ok) {
        const data = await res.json();
        setAccounts(data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAccounts(); }, []);

  const addAccount = async () => {
    if (!newPhone) return alert('请输入电话号码');
    // 去除空格和特殊字符，只保留数字
    const cleanPhone = newPhone.replace(/\D/g, '');
    
    try {
      const res = await fetch('/api/whatsapp-accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone, label: newLabel || 'Customer Service' })
      });
      if (res.ok) {
        setNewPhone(''); setNewLabel('');
        fetchAccounts();
      }
    } catch (e) { console.error(e); }
  };

  const deleteAccount = async (id: number) => {
    if (!confirm('确定删除此客服账号吗？')) return;
    try {
      const res = await fetch(`/api/whatsapp-accounts?id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) fetchAccounts();
    } catch (e) { console.error(e); }
  };

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/whatsapp-accounts`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive: !currentStatus })
      });
      if (res.ok) fetchAccounts();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in slide-in-from-bottom-8 duration-700 pb-20 px-4">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-5xl font-black uppercase tracking-tighter text-slate-900 leading-none">WhatsApp 分流系统</h2>
           <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] mt-2 tracking-[0.3em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]"></span> 多账号轮流随机分发，规避封号风险
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* 左侧：添加面板 */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white p-12 rounded-[56px] shadow-sm border border-slate-100">
              <h3 className="text-[10px] font-black uppercase text-green-600 tracking-[0.3em] mb-10 flex items-center gap-4">
                 <div className="w-10 h-10 rounded-2xl bg-green-50 flex items-center justify-center text-[#25D366]"><i className="fab fa-whatsapp"></i></div> 新增客服号
              </h3>
              <div className="space-y-6">
                 <div>
                    <label className="block text-[9px] font-black uppercase text-slate-400 mb-3 tracking-[0.3em] ml-1">WhatsApp 账号 (带国家代码)</label>
                    <input 
                      type="text" 
                      value={newPhone}
                      onChange={e => setNewPhone(e.target.value)}
                      placeholder="如: 8613800000000"
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-black text-sm focus:ring-4 ring-green-500/10 transition-all"
                    />
                    <p className="text-[8px] text-slate-400 mt-2 ml-1">直接填写数字，系统会自动过滤空格。如中国号前缀加 86</p>
                 </div>
                 <div>
                    <label className="block text-[9px] font-black uppercase text-slate-400 mb-3 tracking-[0.3em] ml-1">客服显示名称 (仅后台可见)</label>
                    <input 
                      type="text" 
                      value={newLabel}
                      onChange={e => setNewLabel(e.target.value)}
                      placeholder="例如: 业务员 A - 张小姐"
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-black text-sm focus:ring-4 ring-green-500/10 transition-all"
                    />
                 </div>
                 <button onClick={addAccount} className="w-full bg-[#25D366] text-white py-5 rounded-[24px] font-black uppercase text-[10px] tracking-widest shadow-xl shadow-green-500/20 hover:bg-slate-900 transition-all active:scale-95">添加到分流池</button>
              </div>
           </div>
        </div>

        {/* 右侧：列表面板 */}
        <div className="lg:col-span-8 space-y-6">
           {loading ? (
             <div className="py-20 text-center animate-pulse">
                <i className="fab fa-whatsapp text-4xl text-slate-100 mb-4"></i>
                <p className="text-[10px] font-black uppercase text-slate-200 tracking-widest">正在加载分流池数据...</p>
             </div>
           ) : accounts.map(acc => (
              <div key={acc.id} className={`bg-white p-10 rounded-[48px] shadow-sm border flex flex-wrap items-center justify-between gap-8 group hover:shadow-2xl transition-all duration-500 ${!acc.is_active ? 'opacity-50 grayscale' : 'border-slate-100'}`}>
                 <div className="flex items-center gap-8">
                    <div className={`w-20 h-20 rounded-[28px] flex items-center justify-center transition-all ${acc.is_active ? 'bg-green-50 text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white' : 'bg-slate-100 text-slate-300'}`}>
                       <i className="fab fa-whatsapp text-3xl"></i>
                    </div>
                    <div>
                       <div className="flex items-center gap-4 mb-1">
                          <h4 className="text-2xl font-black uppercase tracking-tighter text-slate-900">{acc.label}</h4>
                          <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${acc.is_active ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                             {acc.is_active ? '启用中' : '已停用'}
                          </span>
                       </div>
                       <p className="text-sm font-black text-blue-600 tracking-widest">+{acc.phone}</p>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-4">
                    <button 
                      onClick={() => toggleStatus(acc.id, acc.is_active)}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition shadow-sm ${acc.is_active ? 'bg-slate-50 text-slate-400 hover:text-green-600 hover:bg-green-50' : 'bg-green-500 text-white'}`}
                      title={acc.is_active ? "停用" : "启用"}
                    >
                       <i className={`fas ${acc.is_active ? 'fa-pause' : 'fa-play'} text-xs`}></i>
                    </button>
                    <button 
                      onClick={() => deleteAccount(acc.id)}
                      className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition shadow-sm"
                    >
                       <i className="fas fa-trash text-xs"></i>
                    </button>
                 </div>
              </div>
           ))}
           
           {!loading && accounts.length === 0 && (
              <div className="bg-slate-50 rounded-[48px] p-24 text-center border-4 border-dashed border-slate-100">
                 <i className="fab fa-whatsapp text-6xl text-slate-200 mb-6"></i>
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">分流池空空如也，请先添加客服号</p>
              </div>
           )}
        </div>
      </div>
    </div>
  );
}
