// app/admin/inquiry/page.tsx
'use client';

import { useState } from 'react';
import { useProducts } from '../../context/ProductContext';

export default function InquiryManagement() {
  const { inquiries, deleteInquiry } = useProducts();
  const [filterStatus, setFilterStatus] = useState('All');

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in slide-in-from-bottom-8 duration-700 pb-20 px-4">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-5xl font-black uppercase tracking-tighter text-slate-900 leading-none">客户询盘管理</h2>
           <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] mt-2 tracking-[0.3em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> 实时收集全球采购商意向，提升转化率
           </p>
        </div>
        <div className="bg-white border border-slate-100 rounded-3xl p-2 flex gap-2 shadow-sm">
           {['All', 'Unread', 'Processed'].map(s => (
              <button 
                key={s} 
                onClick={() => setFilterStatus(s)}
                className={`px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition ${filterStatus === s ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
              >
                {s === 'All' ? '全部询盘' : s === 'Unread' ? '待处理' : '已处理'}
              </button>
           ))}
        </div>
      </div>

      <div className="bg-white rounded-[56px] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-10 py-8 text-[10px] font-black uppercase text-slate-400 tracking-widest">客户信息 / 来源</th>
              <th className="px-10 py-8 text-[10px] font-black uppercase text-slate-400 tracking-widest">产品需求</th>
              <th className="px-10 py-8 text-[10px] font-black uppercase text-slate-400 tracking-widest">留言内容</th>
              <th className="px-10 py-8 text-[10px] font-black uppercase text-slate-400 tracking-widest">提交时间</th>
              <th className="px-10 py-8 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">管理</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {inquiries.map(iq => (
              <tr key={iq.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-10 py-10">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-black text-xs">
                         {iq.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                         <div className="font-black text-slate-900 text-sm uppercase">{iq.name}</div>
                         <div className="text-[10px] font-bold text-blue-600 lowercase">{iq.email}</div>
                      </div>
                   </div>
                </td>
                <td className="px-10 py-10">
                   <div className="bg-slate-50 px-4 py-2 rounded-xl inline-block">
                      <div className="text-[10px] font-black uppercase text-slate-900 truncate max-w-[150px]">{iq.productName}</div>
                   </div>
                </td>
                <td className="px-10 py-10">
                   <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2 max-w-xs">{iq.message}</p>
                </td>
                <td className="px-10 py-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                   {iq.createdAt || 'RECENTLY'}
                </td>
                <td className="px-10 py-10 text-right">
                   <button 
                     onClick={() => { if(confirm('确定永久删除此询盘记录？')) deleteInquiry(iq.id); }}
                     className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition"
                   >
                      <i className="fas fa-trash-alt text-xs"></i>
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {inquiries.length === 0 && (
           <div className="py-40 text-center">
              <i className="fas fa-inbox text-6xl text-slate-100 mb-6"></i>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-200">暂无客户询盘信息</p>
           </div>
        )}
      </div>
    </div>
  );
}
