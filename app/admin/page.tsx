// app/admin/page.tsx
'use client';

import { useProducts } from '../context/ProductContext';
import Link from 'next/link';

export default function AdminDashboard() {
  const { products, news, inquiries, categories } = useProducts();

  const stats = [
    { label: '在线产品总数', value: products.length, icon: 'fas fa-boxes-stacked', color: 'bg-blue-600', href: '/admin/products' },
    { label: '待处理询盘', value: inquiries.filter(i => i.status === 'New').length, icon: 'fas fa-envelope', color: 'bg-red-500', href: '/admin/inquiry' },
    { label: '已发布文章', value: news.length, icon: 'fas fa-newspaper', color: 'bg-slate-900', href: '/admin/news' },
    { label: '产品分类', value: categories.length, icon: 'fas fa-tags', color: 'bg-emerald-500', href: '/admin/categories' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="flex justify-between items-end px-4">
        <div>
           <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-900 leading-none mb-2">控制中心</h2>
           <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Hangfan Industrial OS Dashboard</p>
        </div>
        <div className="text-slate-400 text-xs font-bold uppercase tracking-widest bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
           Last Update: {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <Link key={i} href={stat.href} className="bg-white p-10 rounded-[48px] shadow-sm border border-slate-100 group hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
             <div className={`absolute top-0 right-0 w-32 h-32 ${stat.color} opacity-[0.03] rounded-full translate-x-12 -translate-y-12 group-hover:scale-150 transition-transform duration-700`}></div>
             <div className={`${stat.color} w-16 h-16 rounded-[24px] flex items-center justify-center text-white text-xl shadow-xl shadow-slate-100 mb-8 relative z-10`}>
                <i className={stat.icon}></i>
             </div>
             <div className="relative z-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-5xl font-black tracking-tighter text-slate-900">{stat.value}</h3>
             </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-12 rounded-[56px] shadow-sm border border-slate-100 space-y-10">
           <div className="flex justify-between items-center">
              <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900">最新询盘动态</h3>
              <Link href="/admin/inquiry" className="text-[10px] font-black uppercase text-blue-600 tracking-widest hover:underline">查看全部 &rarr;</Link>
           </div>
           
           <div className="space-y-4">
              {inquiries.slice(0, 5).map((inq, i) => (
                 <div key={i} className="flex items-center gap-6 p-6 bg-slate-50 rounded-[32px] border border-slate-50 hover:bg-white hover:border-blue-100 hover:shadow-lg transition-all cursor-pointer group">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 font-black text-xl shadow-sm group-hover:bg-blue-600 group-hover:text-white transition">{inq.name.charAt(0)}</div>
                    <div className="flex-1">
                       <div className="font-black uppercase text-slate-900 mb-1">{inq.name}</div>
                       <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{inq.email}</div>
                    </div>
                    <div className="text-right">
                       <div className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-2 inline-block ${inq.status === 'New' ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-400'}`}>{inq.status}</div>
                       <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{new Date(inq.date).toLocaleDateString()}</div>
                    </div>
                 </div>
              ))}
              {inquiries.length === 0 && <p className="text-center py-10 text-slate-300 font-bold uppercase tracking-widest text-xs">暂无待处理询盘</p>}
           </div>
        </div>

        <div className="bg-slate-900 rounded-[56px] p-12 text-white relative overflow-hidden shadow-2xl flex flex-col">
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full translate-x-20 -translate-y-20 blur-3xl"></div>
           <h3 className="text-xl font-black uppercase tracking-tighter mb-10 relative z-10 flex items-center justify-between">
              <span>实时询盘流</span>
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
           </h3>
           
           <div className="space-y-6 relative z-10 flex-1 overflow-y-auto no-scrollbar max-h-[400px]">
              {inquiries.slice(0, 4).map((inq, i) => (
                 <div key={i} className="p-5 bg-white/5 rounded-[24px] border border-white/5 hover:bg-white/10 transition-all">
                    <div className="flex justify-between items-start mb-2">
                       <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{inq.name}</span>
                       <span className="text-[8px] font-bold text-slate-500">{new Date(inq.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed font-medium">
                       {inq.message}
                    </p>
                 </div>
              ))}
              {inquiries.length === 0 && (
                 <div className="text-center py-10 opacity-30">
                    <i className="fas fa-inbox text-4xl mb-4 block"></i>
                    <p className="text-[10px] font-black uppercase tracking-widest">No Incoming Data</p>
                 </div>
              )}
           </div>

           <Link href="/admin/inquiry" className="mt-8 w-full bg-blue-600 text-white py-4 rounded-2xl text-center font-black uppercase tracking-widest text-[10px] shadow-xl shadow-blue-500/20 hover:bg-white hover:text-slate-900 transition-all relative z-10">
              进入询盘中心处理
           </Link>
        </div>
      </div>
    </div>
  );
}
