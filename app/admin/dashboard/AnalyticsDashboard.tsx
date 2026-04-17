'use client';

import React from 'react';
import { useProducts } from '../../context/ProductContext';

export default function AnalyticsDashboard() {
  const { inquiries, products } = useProducts();

  // Mock data for analytics (can be extended with real tracker later)
  const stats = [
    { label: 'Visitors', value: '44', change: '+4%', trend: 'up' },
    { label: 'Sessions', value: '44', change: '+4%', trend: 'up' },
    { label: 'Pageviews', value: '54', change: '+12%', trend: 'up' },
    { label: 'Bounce Rate', value: '93%', change: '-4%', trend: 'down' },
    { label: 'Avg. Duration', value: '2s', change: '+11%', trend: 'up' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Hangfan Analytics</h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-2 tracking-widest">Real-time Performance Intelligence Dashboard</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white border border-slate-100 rounded-2xl px-6 py-3 flex items-center gap-4 shadow-sm">
            <i className="fas fa-calendar-alt text-blue-600 text-xs"></i>
            <span className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Last 24 Hours</span>
          </div>
          <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200">Filters</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-50 shadow-sm group hover:shadow-xl transition-all">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">{s.label}</p>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-black text-slate-900 leading-none">{s.value}</span>
              <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${s.trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {s.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Traffic Chart Placeholder */}
      <div className="bg-white p-10 rounded-[48px] border border-slate-50 shadow-sm">
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Traffic Velocity (Hourly)</h3>
          <div className="flex gap-4 text-[9px] font-black uppercase tracking-widest">
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-600"></span> Visitors</div>
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-200"></span> Pageviews</div>
          </div>
        </div>
        <div className="h-48 flex items-end gap-2 px-2">
          {[40, 60, 45, 90, 65, 30, 85, 40, 70, 50, 95, 40, 60, 80, 45, 30, 90, 55, 75, 45, 60, 85, 40, 50].map((h, i) => (
            <div key={i} className="flex-1 group relative">
              <div style={{ height: `${h}%` }} className="bg-blue-600/10 rounded-t-lg group-hover:bg-blue-600 transition-all duration-500"></div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-bold text-slate-300 opacity-0 group-hover:opacity-100">{i}:00</div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pages & Sources */}
        <div className="bg-white rounded-[40px] border border-slate-50 shadow-sm overflow-hidden">
          <div className="flex border-b border-slate-50">
            {['Pages', 'Sources', 'Entry URL'].map((tab, i) => (
              <button key={i} className={`flex-1 py-6 text-[10px] font-black uppercase tracking-widest transition-all ${i === 0 ? 'bg-slate-50 text-blue-600' : 'text-slate-400 hover:text-slate-900'}`}>{tab}</button>
            ))}
          </div>
          <div className="p-8 space-y-4">
            {[
              { path: '/products/high-strength-bolt', count: 18, pct: '33.3%' },
              { path: '/', count: 12, pct: '22.2%' },
              { path: '/contact', count: 8, pct: '14.8%' },
              { path: '/news', count: 5, pct: '9.3%' },
            ].map((p, i) => (
              <div key={i} className="flex items-center justify-between group">
                <span className="text-xs font-bold text-slate-500 group-hover:text-blue-600 transition-colors truncate max-w-[200px]">{p.path}</span>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-black text-slate-900">{p.count}</span>
                  <span className="text-[10px] font-bold text-slate-300 w-12 text-right">{p.pct}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Locations */}
        <div className="bg-white rounded-[40px] border border-slate-50 shadow-sm p-8">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8 ml-2">Top Locations</h3>
          <div className="space-y-6">
            {[
              { name: 'Singapore', code: 'SG', count: 12, flag: '🇸🇬' },
              { name: 'China', code: 'CN', count: 9, flag: '🇨🇳' },
              { name: 'United States', code: 'US', count: 7, flag: '🇺🇸' },
              { name: 'Japan', code: 'JP', count: 4, flag: '🇯🇵' },
              { name: 'Hong Kong', code: 'HK', count: 3, flag: '🇭🇰' },
            ].map((loc, i) => (
              <div key={i} className="flex items-center justify-between px-2">
                <div className="flex items-center gap-4">
                  <span className="text-xl">{loc.flag}</span>
                  <span className="text-xs font-bold text-slate-600">{loc.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-1.5 bg-slate-50 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full" style={{ width: `${(loc.count / 12) * 100}%` }}></div>
                  </div>
                  <span className="text-xs font-black text-slate-900 w-6">{loc.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Live Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl shadow-slate-200">
          <div className="flex justify-between items-center mb-8">
             <h3 className="text-xs font-black uppercase tracking-[0.2em]">Live Inquiries</h3>
             <span className="px-3 py-1 bg-blue-600 rounded-full text-[8px] font-black animate-pulse">LIVE</span>
          </div>
          <div className="space-y-6">
            {inquiries.slice(0, 4).map((iq) => (
              <div key={iq.id} className="flex gap-4 items-start border-b border-white/5 pb-4 last:border-0">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[10px] font-black shrink-0">
                  {iq.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black uppercase truncate">{iq.productName || 'General Inquiry'}</p>
                  <p className="text-[9px] text-slate-500 mt-1 uppercase tracking-widest">{iq.createdAt ? new Date(iq.createdAt).toLocaleDateString() : 'Just Now'}</p>
                </div>
              </div>
            ))}
            {inquiries.length === 0 && <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center py-10 opacity-30">Waiting for leads...</p>}
          </div>
        </div>

        {/* Heatmap Placeholder */}
        <div className="lg:col-span-8 bg-white rounded-[40px] border border-slate-50 shadow-sm p-10">
           <div className="flex justify-between items-center mb-10">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Traffic Heatmap</h3>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Activity density by hour & day</p>
           </div>
           <div className="grid grid-cols-24 gap-1 h-32">
              {Array.from({ length: 168 }).map((_, i) => (
                <div 
                  key={i} 
                  className="rounded-sm transition-colors hover:ring-2 ring-blue-500 cursor-help"
                  style={{ 
                    backgroundColor: `rgba(37, 99, 235, ${0.05 + Math.random() * 0.8})`,
                  }}
                ></div>
              ))}
           </div>
           <div className="mt-6 pt-6 border-t border-slate-50 flex justify-between text-[8px] font-black text-slate-300 uppercase tracking-widest px-2">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
           </div>
        </div>
      </div>

      <div className="text-center pt-10 pb-4">
        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.5em] opacity-50">Hangfan Analytics Engine - Data Analysis v3.0.3</p>
      </div>
    </div>
  );
}
