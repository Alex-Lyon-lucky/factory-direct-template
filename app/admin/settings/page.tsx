// app/admin/settings/page.tsx
'use client';

import { useState, useEffect } from 'react';

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) alert('网站基础设置已成功更新！');
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  if (loading) return <div className="p-20 text-center font-black uppercase italic text-slate-300">正在载入系统配置...</div>;

  return (
    <div className="max-w-5xl mx-auto animate-in slide-in-from-bottom-8 duration-700 pb-20">
      <div className="flex justify-between items-center mb-10 px-4">
        <div>
           <h2 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">基础设置</h2>
           <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2 italic">Site Configuration & B2B Info</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-blue-600 text-white px-10 py-5 rounded-3xl font-black uppercase italic tracking-widest text-sm shadow-xl shadow-blue-200 hover:bg-blue-700 transition disabled:opacity-50"
        >
          {saving ? '正在保存...' : '立即保存配置'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 space-y-8">
          <h3 className="text-xs font-black uppercase text-blue-600 tracking-widest mb-4 flex items-center gap-2">
             <i className="fas fa-globe"></i> 网站信息 (Site Identity)
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">网站显示名称</label>
              <input type="text" value={settings.siteName} onChange={e => setSettings({...settings, siteName: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-black text-xl uppercase italic focus:ring-2 ring-blue-500" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">首页描述 (Slogan)</label>
              <textarea rows={3} value={settings.siteDescription} onChange={e => setSettings({...settings, siteDescription: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-slate-600" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">全局 SEO 关键词</label>
              <input type="text" value={settings.seoKeywords} onChange={e => setSettings({...settings, seoKeywords: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-xs" />
            </div>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 space-y-8">
          <h3 className="text-xs font-black uppercase text-blue-600 tracking-widest mb-4 flex items-center gap-2">
             <i className="fas fa-phone"></i> 联系信息 (Contact Info)
          </h3>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">客服邮箱</label>
                <input type="text" value={settings.contactEmail} onChange={e => setSettings({...settings, contactEmail: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">联系电话</label>
                <input type="text" value={settings.contactPhone} onChange={e => setSettings({...settings, contactPhone: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">工厂地理位置</label>
              <input type="text" value={settings.address} onChange={e => setSettings({...settings, address: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-sm" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">WhatsApp 号码</label>
              <input type="text" value={settings.whatsapp} onChange={e => setSettings({...settings, whatsapp: e.target.value})} className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-sm text-blue-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
