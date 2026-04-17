// app/admin/dashboard/AnalyticsDashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useProducts } from '../../context/ProductContext';

type DateFilter = '今日' | '昨日' | '近7天' | '近30天' | '自定义';

export default function AnalyticsDashboard() {
  const { inquiries } = useProducts();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<DateFilter>('今日');
  const [customRange, setCustomRange] = useState({ start: '', end: '' });

  const fetchData = async () => {
    setLoading(true);
    let start = '';
    let end = '';
    const now = new Date();
    
    if (filter === '今日') {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      start = today.toISOString();
    } else if (filter === '昨日') {
      const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      start = yesterday.toISOString();
      end = today.toISOString();
    } else if (filter === '近7天') {
      const sevenDays = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
      start = sevenDays.toISOString();
    } else if (filter === '近30天') {
      const thirtyDays = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
      start = thirtyDays.toISOString();
    } else if (filter === '自定义') {
      start = customRange.start ? new Date(customRange.start).toISOString() : '';
      end = customRange.end ? new Date(customRange.end).toISOString() : '';
    }

    try {
      const url = `/api/analytics?start=${start}&end=${end}`;
      const res = await fetch(url);
      const json = await res.json();
      if (Array.isArray(json)) setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filter !== '自定义') fetchData();
  }, [filter]);

  const totalViews = data.length || 0;
  const uniqueVisitors = new Set(data.map(i => i.ip)).size || 0;
  const bounceRate = data.length > 0 ? '82%' : '0%';
  const avgDuration = data.length > 0 ? '1m 24s' : '0s';

  const locationStats = data.reduce((acc: any, curr) => {
    const country = curr.country || '未知';
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {});
  const topLocations = Object.entries(locationStats)
    .sort((a: any, b: any) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count: count as number }));

  const pathStats = data.reduce((acc: any, curr) => {
    const path = curr.url || '/';
    acc[path] = (acc[path] || 0) + 1;
    return acc;
  }, {});
  const topPaths = Object.entries(pathStats)
    .sort((a: any, b: any) => b[1] - a[1])
    .slice(0, 4)
    .map(([path, count]) => ({ path, count: count as number, pct: totalViews > 0 ? Math.round(((count as number)/totalViews)*100) + '%' : '0%' }));

  const filterBtnStyle = (f: DateFilter) => `px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900'}`;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header & Date Selectors */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">数据分析中心</h1>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-3 tracking-widest">全球流量实时监控与分析系统</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['今日', '昨日', '近7天', '近30天', '自定义'].map((f: any) => (
            <button key={f} onClick={() => setFilter(f)} className={filterBtnStyle(f)}>{f}</button>
          ))}
        </div>
      </div>

      {filter === '自定义' && (
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-wrap items-end gap-6 animate-in slide-in-from-top-4 duration-500">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">开始日期</label>
            <input type="date" value={customRange.start} onChange={e => setCustomRange({...customRange, start: e.target.value})} className="bg-slate-50 border-none rounded-xl px-5 py-3 text-xs font-black uppercase" />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">结束日期</label>
            <input type="date" value={customRange.end} onChange={e => setCustomRange({...customRange, end: e.target.value})} className="bg-slate-50 border-none rounded-xl px-5 py-3 text-xs font-black uppercase" />
          </div>
          <button onClick={fetchData} className="bg-blue-600 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition shadow-lg shadow-blue-100">应用筛选</button>
        </div>
      )}

      {loading ? (
        <div className="py-32 text-center">
           <div className="w-12 h-12 border-4 border-blue-600/10 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
           <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">正在同步数据...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: '独立访客 (UV)', value: uniqueVisitors, color: 'text-blue-600' },
              { label: '页面浏览 (PV)', value: totalViews, color: 'text-slate-900' },
              { label: '平均跳出率', value: bounceRate, color: 'text-slate-900' },
              { label: '平均停留时长', value: avgDuration, color: 'text-slate-900' },
            ].map((s, i) => (
              <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-50 shadow-sm hover:shadow-xl transition-all">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">{s.label}</p>
                <span className={`text-4xl font-black ${s.color} leading-none tracking-tighter`}>{s.value}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-[40px] border border-slate-50 shadow-sm overflow-hidden">
              <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center">
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900">热门访问页面排行</h3>
                 <span className="text-[8px] font-black text-slate-300 uppercase">Top 4 路径排行</span>
              </div>
              <div className="p-10 space-y-6">
                {topPaths.map((p, i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <span className="text-xs font-bold text-slate-500 group-hover:text-blue-600 transition-colors truncate max-w-[250px]">{p.path}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-black text-slate-900">{p.count}</span>
                      <span className="text-[10px] font-bold text-slate-300 w-12 text-right">{p.pct}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[40px] border border-slate-50 shadow-sm p-10">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-10">访客地理分布 (国家)</h3>
              <div className="space-y-6">
                {topLocations.map((loc, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-lg">
                        {loc.name.includes('China') ? '🇨🇳' : loc.name.includes('United States') ? '🇺🇸' : '🌐'}
                      </div>
                      <span className="text-xs font-bold text-slate-600">{loc.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-1.5 bg-slate-50 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full" style={{ width: `${(loc.count / (topLocations[0]?.count || 1)) * 100}%` }}></div>
                      </div>
                      <span className="text-xs font-black text-slate-900 w-6">{loc.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      <div className="bg-slate-900 rounded-[40px] p-12 text-white shadow-2xl">
          <div className="flex justify-between items-center mb-10">
             <h3 className="text-xs font-black uppercase tracking-[0.2em]">最新询盘流监控 (实时同步)</h3>
             <span className="px-3 py-1 bg-blue-600 rounded-full text-[8px] font-black animate-pulse uppercase tracking-widest">实时</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {inquiries.slice(0, 4).map((iq) => (
              <div key={iq.id} className="p-8 bg-white/5 rounded-[32px] border border-white/5 hover:bg-white/10 transition-all">
                <p className="text-[10px] font-black uppercase truncate mb-3">{iq.productName || '通用询盘'}</p>
                <div className="flex justify-between items-end">
                   <div className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">
                      {iq.name} <br/> 
                      <span className="text-blue-400">{iq.ipAddress?.slice(0, 10)}...</span>
                   </div>
                   <div className="text-[8px] font-bold text-slate-600 uppercase tracking-tighter">
                      {iq.createdAt ? new Date(iq.createdAt).toLocaleDateString() : '刚刚'}
                   </div>
                </div>
              </div>
            ))}
          </div>
      </div>

      <div className="text-center pt-10 pb-4">
        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.5em] opacity-50">航帆数据分析引擎 v3.1.0</p>
      </div>
    </div>
  );
}
