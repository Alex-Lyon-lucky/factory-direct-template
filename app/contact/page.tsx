// app/contact/page.tsx
'use client';

import { useState } from 'react';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import { useProducts } from '../context/ProductContext';
import InquiryForm from '../components/InquiryForm';
import Image from 'next/image';

export default function ContactPage() {
  const { pages } = useProducts();

  const fallbackContact = {
    title: "Start Your Industrial Partnership Today",
    description: "Our dedicated engineering team is ready to discuss your specific requirements. We provide rapid prototyping and high-volume manufacturing solutions.",
    headerHeight: 250,
    bgMode: "color",
    bgColor: "#0a0f1d"
  };

  const headerData = pages?.contact ? { ...fallbackContact, ...pages.contact } : fallbackContact;

  return (
    <Layout>
      <PageHeader data={headerData} />

      <main className="max-w-7xl mx-auto px-6 py-24 flex-1 w-full animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-start">
          <div className="flex flex-col">
            <div className="inline-flex items-center gap-3 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full mb-8 w-fit">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-[10px]">Global Distribution Hub</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black uppercase text-slate-900 tracking-tighter mb-10 leading-[0.9]">Connect with our <span className="text-blue-600">Factory</span> Experts</h2>
            <p className="text-slate-500 text-lg leading-loose font-medium mb-16 opacity-80">We maintain the highest standards of hardware production. Our engineering support team is available for technical consultations regarding special materials, surface treatments, and custom specifications.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
               <ContactInfoCard 
                  icon="fas fa-phone-alt" 
                  label="General Inquiries" 
                  value="+86 123 4567 8900" 
                  color="blue"
               />
               <ContactInfoCard 
                  icon="far fa-envelope" 
                  label="Sales & RFQ" 
                  value="sales@highfasteners.com" 
                  color="indigo"
               />
               <ContactInfoCard 
                  icon="fab fa-whatsapp" 
                  label="Instant Support" 
                  value="WhatsApp Online" 
                  color="emerald"
               />
               <ContactInfoCard 
                  icon="fas fa-map-marker-alt" 
                  label="Factory Location" 
                  value="Handan, Hebei, CN" 
                  color="orange"
               />
            </div>

            {/* FACTORY BADGE */}
            <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-200 flex items-center gap-6">
               <div className="w-20 h-20 relative rounded-2xl overflow-hidden shrink-0">
                  <Image src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=200" alt="Factory" fill className="object-cover" />
               </div>
               <div>
                  <p className="text-slate-900 font-black uppercase text-sm">Industrial Zone North</p>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Yongnian Dist, Handan, Hebei Province, China</p>
               </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 rounded-[72px] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            <div className="bg-white p-10 md:p-16 rounded-[64px] border border-slate-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] relative z-10">
                <div className="mb-12">
                   <h3 className="text-2xl font-black uppercase text-slate-900 tracking-tighter">Submit Your Specification</h3>
                   <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Expect a response within 24 business hours</p>
                </div>
                <InquiryForm />
            </div>
          </div>
        </div>
      </main>

      {/* GLOBAL OPERATIONS MAP PLACEHOLDER */}
      <section className="bg-slate-900 py-32 px-4 overflow-hidden relative">
         <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/world-map.png')] bg-center bg-no-repeat bg-contain"></div>
         <div className="max-w-7xl mx-auto relative z-10 text-center">
            <span className="text-blue-500 font-black uppercase tracking-[0.4em] text-[10px] mb-6 block">Supply Chain Efficiency</span>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-16">Global Delivery <span className="text-blue-500">Network</span></h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="bg-white/5 backdrop-blur-md p-10 rounded-[48px] border border-white/10 group hover:bg-blue-600/20 transition-all">
                  <h4 className="text-white font-black text-xl uppercase mb-4">Fast Shipping</h4>
                  <p className="text-white/40 text-sm group-hover:text-white/70">Strategic proximity to Qingdao and Tianjin ports for rapid sea freight.</p>
               </div>
               <div className="bg-white/5 backdrop-blur-md p-10 rounded-[48px] border border-white/10 group hover:bg-blue-600/20 transition-all">
                  <h4 className="text-white font-black text-xl uppercase mb-4">Custom Packing</h4>
                  <p className="text-white/40 text-sm group-hover:text-white/70">Industrial-grade export packaging optimized for long-distance transit.</p>
               </div>
               <div className="bg-white/5 backdrop-blur-md p-10 rounded-[48px] border border-white/10 group hover:bg-blue-600/20 transition-all">
                  <h4 className="text-white font-black text-xl uppercase mb-4">Global Compliance</h4>
                  <p className="text-white/40 text-sm group-hover:text-white/70">Handling all customs documentation and international standards (ROHS, REACH).</p>
               </div>
            </div>
         </div>
      </section>
    </Layout>
  );
}

function ContactInfoCard({ icon, label, value, color }: { icon: string, label: string, value: string, color: string }) {
   const colors: any = {
      blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600',
      indigo: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600',
      emerald: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600',
      orange: 'bg-orange-50 text-orange-600 group-hover:bg-orange-600'
   };

   return (
      <div className="group cursor-pointer">
         <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm group-hover:text-white group-hover:shadow-xl group-hover:-translate-y-1 mb-6 ${colors[color]}`}>
            <i className={`${icon} text-lg`}></i>
         </div>
         <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 ml-1">{label}</h4>
         <p className="text-lg font-black uppercase text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">{value}</p>
      </div>
   );
}
