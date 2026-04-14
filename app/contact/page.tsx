// app/contact/page.tsx
'use client';

import { useState } from 'react';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import { useProducts } from '../context/ProductContext';

export default function ContactPage() {
  const { pages } = useProducts();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const fallbackContact = {
    title: "Start Your Industrial Partnership Today",
    description: "Our dedicated engineering team is ready to discuss your specific requirements. We provide rapid prototyping and high-volume manufacturing solutions.",
    headerHeight: 200,
    bgMode: "color",
    bgColor: "#0f172a"
  };

  const headerData = pages?.contact ? { ...fallbackContact, ...pages.contact } : fallbackContact;

  return (
    <Layout>
      <PageHeader data={headerData} />

      <main className="max-w-7xl mx-auto px-6 py-24 flex-1 w-full animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <div className="flex flex-col justify-center">
            <h3 className="text-xs font-black uppercase text-blue-600 tracking-[0.4em] mb-6">Global Distribution Hub</h3>
            <h2 className="text-4xl md:text-5xl font-black uppercase text-slate-900 tracking-tighter mb-8 leading-none">Connect with our factory experts</h2>
            <p className="text-slate-500 text-lg leading-loose font-medium mb-12 opacity-80">We maintain the highest standards of hardware production. Our engineering support team is available for technical consultations regarding special materials and custom specs.</p>
            
            <div className="space-y-10">
              <div className="flex items-center gap-6 group cursor-pointer">
                <div className="w-16 h-16 rounded-[24px] bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm group-hover:shadow-xl group-hover:rotate-6"><i className="fas fa-phone-alt"></i></div>
                <div>
                  <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Customer Support</h4>
                  <p className="text-xl font-black uppercase text-slate-900">+86 123 4567 8900</p>
                </div>
              </div>
              <div className="flex items-center gap-6 group cursor-pointer">
                <div className="w-16 h-16 rounded-[24px] bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm group-hover:shadow-xl group-hover:rotate-6"><i className="far fa-envelope"></i></div>
                <div>
                  <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Sales Inquiries</h4>
                  <p className="text-xl font-black uppercase text-slate-900">sales@highfasteners.com</p>
                </div>
              </div>
              <div className="flex items-center gap-6 group cursor-pointer">
                <div className="w-16 h-16 rounded-[24px] bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm group-hover:shadow-xl group-hover:rotate-6"><i className="fas fa-map-marker-alt"></i></div>
                <div>
                  <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Factory Address</h4>
                  <p className="text-xl font-black uppercase text-slate-900 leading-tight">Yongnian Dist, Handan, Hebei, CN</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-12 md:p-16 rounded-[64px] border border-slate-100 shadow-2xl relative group">
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full translate-x-12 -translate-y-12 blur-[100px] group-hover:scale-110 transition-transform duration-1000"></div>
             <form className="space-y-6 relative z-10">
                <h3 className="text-[10px] font-black uppercase text-blue-600 tracking-[0.4em] mb-10">Direct Message</h3>
                <input 
                  type="text" 
                  placeholder="YOUR FULL NAME" 
                  className="w-full bg-slate-50 border-none rounded-[20px] px-8 py-5 font-black uppercase text-xs tracking-widest focus:ring-4 ring-blue-500/10 shadow-inner"
                />
                <input 
                  type="email" 
                  placeholder="BUSINESS EMAIL ADDRESS" 
                  className="w-full bg-slate-50 border-none rounded-[20px] px-8 py-5 font-black uppercase text-xs tracking-widest focus:ring-4 ring-blue-500/10 shadow-inner"
                />
                <textarea 
                  rows={5} 
                  placeholder="SPECIFIC REQUIREMENTS..." 
                  className="w-full bg-slate-50 border-none rounded-[32px] px-8 py-8 font-black uppercase text-xs tracking-widest focus:ring-4 ring-blue-500/10 shadow-inner"
                ></textarea>
                <button className="w-full bg-slate-900 text-white py-6 rounded-[32px] font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-blue-600 hover:shadow-blue-500/30 transition-all active:scale-95">TRANSMIT TO FACTORY</button>
             </form>
          </div>
        </div>
      </main>
    </Layout>
  );
}
