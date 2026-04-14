// app/inquiry/page.tsx
'use client';

import { useState } from 'react';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import { useProducts } from '../context/ProductContext';
import InquiryForm from '../components/InquiryForm';

export default function InquiryPage() {
  const { settings, pages } = useProducts();

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
                <InquiryForm />
            </div>
         </div>
      </section>
    </Layout>
  );
}
