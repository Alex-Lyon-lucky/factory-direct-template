// app/admin/config/page.tsx
'use client';

import { useState, useEffect } from 'react';

interface ConfigItem {
  key: string;
  value: string;
  desc: string;
}

export default function ConfigPage() {
  const [configs, setConfigs] = useState<ConfigItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState('');

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setConfigs(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
       <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-900 leading-none">系统密钥管理</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-4 opacity-70">Cloud Infrastructure & Credentials Matrix</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 px-6 py-4 rounded-3xl flex items-center gap-4">
           <i className="fas fa-exclamation-triangle text-amber-500"></i>
           <span className="text-amber-700 text-[9px] font-black uppercase tracking-widest leading-relaxed">此页面包含敏感数据库与云端密钥，<br />请勿在公共场所或非加密网络下展示。</span>
        </div>
      </div>

      <div className="bg-white rounded-[56px] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-10 py-8 text-[10px] font-black uppercase text-slate-400 tracking-widest">变量名称 (Key)</th>
              <th className="px-10 py-8 text-[10px] font-black uppercase text-slate-400 tracking-widest">存储值 (Value)</th>
              <th className="px-10 py-8 text-[10px] font-black uppercase text-slate-400 tracking-widest">功能描述</th>
              <th className="px-10 py-8 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {configs.map((item) => (
              <tr key={item.key} className="group hover:bg-slate-50/50 transition duration-300">
                <td className="px-10 py-8">
                  <div className="font-black text-slate-900 font-mono text-xs">{item.key}</div>
                </td>
                <td className="px-10 py-8">
                  <div className="max-w-xs truncate font-mono text-xs text-slate-400 group-hover:text-blue-600 transition">
                    {item.value || '未设置 (Not Defined)'}
                  </div>
                </td>
                <td className="px-10 py-8">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{item.desc}</span>
                </td>
                <td className="px-10 py-8 text-right">
                  <button 
                    onClick={() => handleCopy(item.value, item.key)}
                    className={`px-6 py-3 rounded-2xl font-black uppercase text-[9px] tracking-widest transition-all ${copied === item.key ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-slate-100 text-slate-400 hover:bg-slate-900 hover:text-white'}`}
                  >
                    {copied === item.key ? 'COPIED!' : 'COPY VALUE'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-12 bg-slate-900 rounded-[48px] p-12 text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full translate-x-20 -translate-y-20 blur-3xl"></div>
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-md">
               <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">需要快速导出 .env.local 吗？</h3>
               <p className="text-slate-400 text-xs font-bold leading-loose opacity-70">如果你的电脑坏了或需要在新机器上开发，你可以点击右侧的一键复制，直接粘贴到你的项目根目录下，所有的数据库配置就会瞬间恢复。</p>
            </div>
            <button 
               onClick={() => {
                  const content = configs.map(c => `${c.key}=${c.value}`).join('\n');
                  handleCopy(content, 'all');
               }}
               className="bg-blue-600 hover:bg-white hover:text-slate-900 text-white px-12 py-6 rounded-[28px] font-black uppercase tracking-[0.3em] text-xs transition-all shadow-2xl shadow-blue-500/20"
            >
               {copied === 'all' ? '全部已复制！' : '一键复制完整 .env 配置'}
            </button>
         </div>
      </div>
    </div>
  );
}
