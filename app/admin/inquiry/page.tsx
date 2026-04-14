// app/admin/inquiry/page.tsx
'use client';

import { useProducts, Inquiry } from '../../context/ProductContext';
import { useState } from 'react';

export default function InquiryManagementPage() {
  const { inquiries, deleteInquiry } = useProducts();
  const [selectedInq, setSelectedInq] = useState<Inquiry | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除该询盘记录？')) return;
    const success = await deleteInquiry(id);
    if (success) setSelectedInq(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="flex justify-between items-end px-4">
        <div>
           <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-900 leading-none mb-2">客户询盘中心</h2>
           <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Global RFQ & Business Inquiries Inbox</p>
        </div>
        <div className="bg-white px-8 py-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6">
           <div className="text-center">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">总计</div>
              <div className="text-xl font-black text-slate-900">{inquiries.length}</div>
           </div>
           <div className="w-px h-8 bg-slate-100"></div>
           <div className="text-center">
              <div className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">待处理</div>
              <div className="text-xl font-black text-red-500">{inquiries.filter(i => i.status === 'New').length}</div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {inquiries.map(inq => (
          <div 
            key={inq.id} 
            onClick={() => setSelectedInq(inq)}
            className={`bg-white p-8 rounded-[40px] shadow-sm border transition-all duration-500 flex items-center gap-8 cursor-pointer group ${selectedInq?.id === inq.id ? 'border-blue-500 ring-4 ring-blue-50/50 shadow-2xl' : 'border-slate-100 hover:shadow-xl hover:border-blue-100'}`}
          >
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-3xl font-black shadow-xl transition-all ${inq.status === 'New' ? 'bg-blue-600 text-white shadow-blue-200' : 'bg-slate-50 text-slate-300'}`}>
               {inq.name.charAt(0)}
            </div>
            <div className="flex-1">
               <div className="flex items-center gap-4 mb-2">
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900">{inq.name}</h3>
                  {inq.status === 'New' && <span className="bg-red-500 text-white text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest animate-pulse">New RFQ</span>}
               </div>
               <div className="flex flex-wrap gap-x-8 gap-y-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <div className="flex items-center gap-2"><i className="fas fa-envelope text-blue-500"></i> {inq.email}</div>
                  {inq.company && <div className="flex items-center gap-2"><i className="fas fa-building text-slate-400"></i> {inq.company}</div>}
                  <div className="flex items-center gap-2"><i className="far fa-clock text-slate-400"></i> {new Date(inq.date).toLocaleString()}</div>
               </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-200 group-hover:bg-blue-50 group-hover:text-blue-600 transition">
               <i className="fas fa-chevron-right"></i>
            </div>
          </div>
        ))}
        {inquiries.length === 0 && (
          <div className="text-center py-32 bg-white rounded-[64px] border-2 border-dashed border-slate-100 text-slate-300 font-black uppercase tracking-widest">
             <i className="fas fa-inbox text-5xl mb-6 block opacity-20"></i>
             暂无客户询盘记录
          </div>
        )}
      </div>

      {/* 询盘详情模态框 */}
      {selectedInq && (
         <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[200] flex items-center justify-end p-6">
            <div className="bg-white h-full w-full max-w-2xl rounded-[64px] shadow-2xl flex flex-col animate-in slide-in-from-right-full duration-700 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full translate-x-32 -translate-y-32 blur-3xl"></div>
               
               <div className="p-12 border-b border-slate-50 flex justify-between items-center relative z-10">
                  <button onClick={() => setSelectedInq(null)} className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:text-red-500 transition"><i className="fas fa-times text-xl"></i></button>
                  <div className="flex gap-4">
                     <button onClick={() => handleDelete(selectedInq.id)} className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition shadow-lg shadow-red-100"><i className="fas fa-trash-alt"></i></button>
                     <a href={`mailto:${selectedInq.email}`} className="bg-blue-600 text-white px-10 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-3 shadow-xl shadow-blue-200 hover:bg-slate-900 transition">
                        <i className="fas fa-paper-plane"></i> 回复邮件
                     </a>
                  </div>
               </div>

               <div className="flex-1 p-16 overflow-y-auto no-scrollbar relative z-10">
                  <div className="mb-16">
                     <span className="text-[10px] font-black uppercase text-blue-600 tracking-[0.3em] mb-4 block">Sender Identity</span>
                     <h2 className="text-5xl font-black uppercase tracking-tighter text-slate-900 mb-6">{selectedInq.name}</h2>
                     <div className="space-y-4">
                        <div className="flex items-center gap-4 text-slate-600 font-bold"><i className="fas fa-envelope text-blue-500 w-6"></i> {selectedInq.email}</div>
                        {selectedInq.phone && <div className="flex items-center gap-4 text-slate-600 font-bold"><i className="fab fa-whatsapp text-emerald-500 w-6"></i> {selectedInq.phone}</div>}
                        {selectedInq.company && <div className="flex items-center gap-4 text-slate-600 font-bold"><i className="fas fa-building text-slate-400 w-6"></i> {selectedInq.company}</div>}
                        <div className="flex items-center gap-4 text-slate-400 font-bold text-sm"><i className="far fa-clock text-slate-300 w-6"></i> Received: {new Date(selectedInq.date).toLocaleString()}</div>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <span className="text-[10px] font-black uppercase text-blue-600 tracking-[0.3em] mb-4 block">Message Content</span>
                     <div className="bg-slate-50 p-12 rounded-[48px] border border-slate-100 relative shadow-inner">
                        <i className="fas fa-quote-left absolute top-8 left-8 text-slate-200 text-4xl opacity-50"></i>
                        <p className="text-xl font-bold text-slate-700 leading-loose relative z-10">
                           {selectedInq.message}
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      )}
    </div>
  );
}
