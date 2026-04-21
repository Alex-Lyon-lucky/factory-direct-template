// app/about/page.tsx
'use client';

import Image from 'next/image';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import { useProducts } from '../context/ProductContext';

export default function AboutPage() {
  const { pages } = useProducts();
  
  const fallbackAbout = {
    title: "A Legacy of Fastener Excellence",
    content: "Founded in 1998, High Fasteners has grown from a local workshop to a premier industrial fastener powerhouse. Our state-of-the-art facility in Handan produces over 5,000 tons of high-strength bolts and nuts annually for the global market.",
    heroImg: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800",
    serviceTitle: "Professional Service",
    serviceSubtitle: "Providing you with comprehensive and professional pre-sales and after-sales services",
    partners: []
  };

  const about = pages?.about ? { ...fallbackAbout, ...pages.about } : fallbackAbout;

  return (
    <Layout>
      <PageHeader data={{...about, headerHeight: 280}} />

      <main className="flex-1 w-full bg-white">
        {/* 1. 基础介绍模块 */}
        <section className="max-w-[1400px] mx-auto px-6 py-24">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
              <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
                 <h3 className="text-xs font-black uppercase text-blue-600 tracking-[0.4em] mb-6">Our Industrial Story</h3>
                 <h2 className="text-4xl md:text-6xl font-black uppercase text-slate-900 tracking-tighter mb-10 leading-[0.9]">Global standards. <br />Handan factory direct.</h2>
                 <div className="prose prose-slate max-w-none">
                    <p className="text-slate-500 text-lg leading-loose font-medium opacity-80 whitespace-pre-wrap">{about.content}</p>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-8 mt-16 pt-12 border-t border-slate-100">
                    <div>
                       <h4 className="text-5xl font-black uppercase tracking-tighter text-slate-900 mb-2 leading-none">25+</h4>
                       <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Years Excellence</p>
                    </div>
                    <div>
                       <h4 className="text-5xl font-black uppercase tracking-tighter text-slate-900 mb-2 leading-none">5000t</h4>
                       <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Annual Production</p>
                    </div>
                 </div>
              </div>

              <div className="relative aspect-square rounded-[80px] overflow-hidden shadow-2xl animate-in fade-in slide-in-from-right-8 duration-1000 group">
                 <Image 
                   src={about.heroImg || fallbackAbout.heroImg} 
                   alt="Factory" 
                   fill
                   className="object-cover group-hover:scale-105 transition-transform duration-1000"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent"></div>
              </div>
           </div>
        </section>

        {/* 2. 视频与专业服务模块 (左视频右文案) */}
        {(about.videoUrl || about.serviceTitle) && (
          <section className="bg-slate-900 py-32 overflow-hidden">
             <div className="max-w-[1400px] mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                   {/* 左侧视频 */}
                   <div className="relative aspect-video rounded-[48px] overflow-hidden bg-slate-800 shadow-2xl border border-white/5 group">
                      {about.videoUrl ? (
                         <video 
                           src={about.videoUrl} 
                           autoPlay 
                           muted 
                           loop 
                           playsInline 
                           className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition duration-700"
                         />
                      ) : (
                         <div className="absolute inset-0 flex items-center justify-center text-slate-700 uppercase font-black text-xs tracking-widest">Corporate Video Placeholder</div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                         <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-blue-600/50 scale-90 group-hover:scale-100 transition duration-500">
                            <i className="fas fa-play ml-1"></i>
                         </div>
                      </div>
                   </div>

                   {/* 右侧服务文案 */}
                   <div className="text-white">
                      <h3 className="text-xs font-black uppercase text-blue-500 tracking-[0.4em] mb-6">Unrivaled Expertise</h3>
                      <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8 leading-none">
                         {about.serviceTitle || "Professional Service"}
                      </h2>
                      <p className="text-slate-400 text-lg font-medium leading-relaxed mb-12 opacity-80">
                         {about.serviceSubtitle || "Providing you with comprehensive and professional pre-sales and after-sales services"}
                      </p>
                      
                      {about.serviceImg && (
                        <div className="relative aspect-[21/9] rounded-3xl overflow-hidden border border-white/10 group">
                           <Image src={about.serviceImg} alt="Service" fill className="object-cover group-hover:scale-110 transition duration-1000" />
                        </div>
                      )}
                   </div>
                </div>
             </div>
          </section>
        )}

        {/* 3. 战略合作伙伴 (Partners) */}
        {about.partners && about.partners.length > 0 && (
          <section className="py-32 bg-slate-50">
             <div className="max-w-[1400px] mx-auto px-6 text-center">
                <h3 className="text-xs font-black uppercase text-blue-600 tracking-[0.4em] mb-6">Strategic Alliances</h3>
                <h2 className="text-4xl md:text-5xl font-black uppercase text-slate-900 tracking-tighter mb-20">{about.partnersTitle || "Global Partnership Network"}</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12">
                   {about.partners.map((partner, i) => (
                      <div key={i} className="group text-center">
                         <div className="relative aspect-square w-full bg-white rounded-[40px] shadow-sm flex items-center justify-center p-8 mb-6 group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-500">
                            <Image src={partner.img} alt={partner.name} fill className="object-contain p-8 opacity-60 group-hover:opacity-100 transition grayscale group-hover:grayscale-0" />
                         </div>
                         {partner.name && (
                           <div className="space-y-1">
                              <h4 className="text-[10px] font-black uppercase text-slate-900 tracking-widest">{partner.name}</h4>
                              {partner.desc && <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{partner.desc}</p>}
                           </div>
                         )}
                      </div>
                   ))}
                </div>
             </div>
          </section>
        )}
      </main>
    </Layout>
  );
}
