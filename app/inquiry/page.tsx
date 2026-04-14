// app/inquiry/page.tsx
'use client';

import { useState } from 'react';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import { useProducts } from '../context/ProductContext';

export default function InquiryPage() {
  const { settings, pages } = useProducts();
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', company: '', message: '', productType: 'Standard Bolts'
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          date: new Date().toISOString(),
          status: 'New'
        })
      });
      if (res.ok) {
        setSent(true);
        setFormData({ name: '', email: '', phone: '', company: '', message: '', productType: 'Standard Bolts' });
      }
    } catch (e) { console.error(e); }
    setSending(false);
  };

  const fallbackInquiry = {
    title: "Direct Factory Quotation",
    subtitle: "Streamlined B2B Sourcing for Global Hardware Distributors.",
    headerHeight: 220,
    bgMode: "color",
    bgColor: "#0f172a"
  };

  const headerData = pages?.inquiry ? { ...fallbackInquiry, ...pages.inquiry } : fallbackInquiry;

  return (
    <Layout>
      <PageHeader data={headerData} />

      <section className="max-w-7xl mx-auto px-6 py-24 md:-mt-16 relative z-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
         <div className="bg-white rounded-[64px] shadow-2xl overflow-hidden border border-slate-100 grid lg:grid-cols-2">
            
            <div className="bg-slate-900 p-16 md:p-20 text-white relative flex flex-col justify-center">
               <div className="absolute inset-0 bg-blue-600/5 mix-blend-overlay"></div>
               <div className="relative z-10 space-y-12">
                  <h3 className="text-xs font-black uppercase text-blue-400 tracking-[0.4em] mb-4">Direct Advantage</h3>
                  <h2 className="text-5xl font-black uppercase tracking-tighter leading-none mb-4">Precision Quotes <br />Within 24 Hours</h2>
                  <p className="text-slate-400 font-medium text-lg leading-loose max-w-md opacity-80">Our engineering team provides technical support and professional hardware solutions for your industrial infrastructure projects.</p>
                  
                  <div className="space-y-6 pt-6">
                     <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 bg-blue-600 rounded-[18px] flex items-center justify-center text-xl shadow-xl shadow-blue-500/10"><i className="fas fa-check"></i></div>
                        <span className="font-black uppercase text-[10px] tracking-widest">ISO 9001 Certified Quality Control</span>
                     </div>
                     <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 bg-blue-600 rounded-[18px] flex items-center justify-center text-xl shadow-xl shadow-blue-500/10"><i className="fas fa-truck-fast"></i></div>
                        <span className="font-black uppercase text-[10px] tracking-widest">Global Logistics Supply Network</span>
                     </div>
                  </div>

                  <div className="pt-12 border-t border-white/10">
                     <div className="flex items-center gap-4 text-blue-400 font-black uppercase text-[9px] tracking-[0.4em] mb-4">
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div> GLOBAL SALES DESK
                     </div>
                     <p className="text-3xl font-black tracking-tighter">{settings?.whatsapp || '+86 123 4567 8901'}</p>
                     <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px] mt-2">{settings?.contactEmail || 'sales@highfasteners.com'}</p>
                  </div>
               </div>
            </div>

            <div className="p-16 md:p-20 bg-white">
               {sent ? (
                  <div className="h-full flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
                     <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl mb-8 shadow-2xl shadow-blue-100 rotate-12">
                        <i className="fas fa-paper-plane"></i>
                     </div>
                     <h3 className="text-4xl font-black uppercase text-slate-900 mb-4 tracking-tighter leading-none">Inquiry Received!</h3>
                     <p className="text-slate-500 font-bold text-xs uppercase tracking-widest max-w-xs mx-auto opacity-70">Our sales engineers are processing your request. Check your inbox within 24 hours.</p>
                     <button onClick={() => setSent(false)} className="mt-10 bg-slate-900 text-white px-10 py-5 rounded-[24px] font-black uppercase tracking-widest text-xs shadow-xl shadow-slate-200 hover:-translate-y-1 transition-all">Send Another</button>
                  </div>
               ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                     <div className="space-y-6">
                        <h4 className="text-[10px] font-black uppercase text-blue-600 tracking-[0.4em] mb-10">Request Project Quotation</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <input required type="text" placeholder="YOUR NAME" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border-none rounded-[20px] px-8 py-5 font-black uppercase text-[10px] focus:ring-4 ring-blue-500/10 shadow-inner" />
                           <input required type="email" placeholder="BUSINESS EMAIL" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 border-none rounded-[20px] px-8 py-5 font-black lowercase text-[10px] focus:ring-4 ring-blue-500/10 shadow-inner" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <input type="text" placeholder="WHATSAPP / PHONE" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-50 border-none rounded-[20px] px-8 py-5 font-black uppercase text-[10px] focus:ring-4 ring-blue-500/10 shadow-inner" />
                           <select value={formData.productType} onChange={e => setFormData({...formData, productType: e.target.value})} className="w-full bg-slate-50 border-none rounded-[20px] px-8 py-5 font-black uppercase text-[10px] focus:ring-4 ring-blue-500/10 shadow-inner appearance-none">
                              <option>Standard Bolts</option>
                              <option>High Strength Nuts</option>
                              <option>Custom OEM Parts</option>
                           </select>
                        </div>
                        <textarea required rows={5} placeholder="PROJECT REQUIREMENTS..." value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full bg-slate-50 border-none rounded-[32px] px-8 py-8 font-bold text-slate-700 text-sm focus:ring-4 ring-blue-500/10 shadow-inner" />
                     </div>
                     <button disabled={sending} className="w-full bg-blue-600 text-white py-6 rounded-[32px] font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-slate-900 transition-all active:scale-95 disabled:opacity-50 shadow-blue-500/10">
                        {sending ? 'TRANSMITTING...' : 'SEND INQUIRY TO FACTORY'}
                     </button>
                  </form>
               )}
            </div>
         </div>
      </section>
    </Layout>
  );
}
