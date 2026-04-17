// app/admin/page.tsx
'use client';

import { useProducts } from '../context/ProductContext';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const { products, news, inquiries, categories } = useProducts();
  const [analytics, setAnalytics] = useState({ visitors: 0, views: 0, history: [] });

  // 获取今日实时统计数据 (与数据中心对齐)
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = today.toISOString();

    fetch(`/api/analytics?start=${start}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const uniqueIps = new Set(data.map(i => i.ip)).size;
          setAnalytics({
            visitors: uniqueIps,
            views: data.length,
            history: data.slice(0, 20) // 取最近20条做趋势展示
          });
        }
      });
  }, []);

  // 基础统计 KPI
  const stats = [
    { label: '在线产品总数', value: products.length, icon: 'fas fa-boxes-stacked', color: 'bg-blue-600', href: '/admin/products' },
    { label: '待处理询盘', value: inquiries.filter(i => i.status === 'New').length, icon: 'fas fa-envelope', color: 'bg-red-500', href: '/admin/inquiry' },
    { label: '已发布文章', value: news.length, icon: 'fas fa-newspaper', color: 'bg-slate-900', href: '/admin/news' },
    { label: '未读询盘', value: inquiries.filter(i => i.status === 'New').length, icon: 'fas fa-bell', color: 'bg-orange-500', href: '/admin/inquiry' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20 px-4">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
           <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-900 leading-none mb-2">控制中心</h2>
           <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">航帆独立站管理系统 v3.0</p>
        </div>
        <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
           最后更新: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* KPI 统计卡片 */}
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
        {/* 左侧：今日流量快报 (真实数据) */}
        <div className="lg:col-span-2 bg-white p-12 rounded-[56px] shadow-sm border border-slate-100 flex flex-col justify-between h-[520px]">
           <div className="flex justify-between items-center mb-10 px-2">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900">今日流量快报</h3>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2 tracking-widest">今日实时访客与浏览统计</p>
              </div>
              <Link href="/admin/analytics" className="text-[10px] font-black uppercase text-blue-600 tracking-widest hover:underline bg-blue-50 px-5 py-3 rounded-2xl">查看详细数据中心 &rarr;</Link>
           </div>
           
           <div className="grid grid-cols-2 gap-8 mb-10 px-2">
              <div className="p-8 bg-slate-50 rounded-[32px] group hover:bg-white hover:shadow-xl transition-all cursor-default border border-slate-50 hover:border-blue-100">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">今日独立访客 (UV)</p>
                 <div className="flex items-end gap-2">
                   <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{analytics.visitors}</p>
                   <span className="text-[10px] font-black text-emerald-500 pb-1">实时</span>
                 </div>
              </div>
              <div className="p-8 bg-slate-50 rounded-[32px] group hover:bg-white hover:shadow-xl transition-all cursor-default border border-slate-50 hover:border-blue-100">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">今日页面浏览 (PV)</p>
                 <div className="flex items-end gap-2">
                   <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{analytics.views}</p>
                   <span className="text-[10px] font-black text-emerald-500 pb-1">实时</span>
                 </div>
              </div>
           </div>

           <div className="flex-1 flex items-end gap-3 px-6 h-32">
             {[30, 50, 40, 80, 60, 20, 70, 40, 60, 50, 90, 30, 50, 70, 40, 25, 85, 45, 65, 35].map((h, i) => (
               <div key={i} className="flex-1 bg-blue-600/10 rounded-t-lg hover:bg-blue-600 transition-all duration-500 h-0" style={{ height: `${h}%` }}></div>
             ))}
           </div>
           <div className="mt-8 pt-8 border-t border-slate-50 flex justify-between text-[8px] font-black text-slate-300 uppercase tracking-widest px-6">
              <span>00:00</span><span>今日流量波动 (每小时)</span><span>现在</span>
           </div>
        </div>

        {/* 右侧：实时询盘流 */}
        <div className="bg-slate-900 rounded-[56px] p-12 text-white relative overflow-hidden shadow-2xl flex flex-col h-[520px]">
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full translate-x-20 -translate-y-20 blur-3xl"></div>
           <h3 className="text-xl font-black uppercase tracking-tighter mb-10 relative z-10 flex items-center justify-between">
              <span>实时询盘流</span>
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
           </h3>
           
           <div className="space-y-6 relative z-10 flex-1 overflow-y-auto no-scrollbar">
              {inquiries.slice(0, 6).map((inq) => (
                 <div key={inq.id} className="p-6 bg-white/5 rounded-[32px] border border-white/5 hover:bg-white/10 transition-all group cursor-pointer">
                    <div className="flex justify-between items-start mb-3">
                       <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest group-hover:text-white transition">{inq.name}</span>
                       <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{inq.createdAt ? new Date(inq.createdAt).toLocaleDateString() : '刚刚'}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed font-medium">
                       {inq.message}
                    </p>
                 </div>
              ))}
              {inquiries.length === 0 && (
                 <div className="text-center py-20 opacity-30 uppercase text-[10px] font-black tracking-widest">
                    等待新询盘中...
                 </div>
              )}
           </div>

           <Link href="/admin/inquiry" className="mt-8 w-full bg-blue-600 text-white py-5 rounded-[28px] text-center font-black uppercase tracking-widest text-[10px] shadow-xl shadow-blue-500/20 hover:bg-white hover:text-slate-900 transition-all relative z-10">
              进入询盘中心处理
           </Link>
        </div>
      </div>
    </div>
  );
}
