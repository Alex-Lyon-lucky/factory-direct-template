// app/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useProducts } from './context/ProductContext';
import Layout from './components/Layout';
import InquiryForm from './components/InquiryForm';

export default function Home() {
  const { pages, categories, products, settings, whatsappAccounts } = useProducts();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const fallbackHome = {
    heroTitle: "Custom Fasteners For Global Trade",
    heroSubtitle: "Hangfan specializes in high-precision fasteners and custom hardware. We bridge the gap between quality manufacturing and international standards.",
    advantages: ["8.8/10.9/12.9 GRADE SPECIALIST", "FULL SCALE OEM CAPABILITIES", "ISO 9001:2015 CERTIFIED"],
    heroImg: "https://images.unsplash.com/photo-1530124560677-bdaea024f061?auto=format&fit=crop&q=80&w=800",
    categoryTitle: "Featured Categories",
    categorySubtitle: "Engineered for Performance and Durability",
    categoryImages: {},
    featuredTitle: "High Precision Fasteners",
    featuredSubtitle: "Top-rated products from our manufacturing line",
    featuredCount: 6,
    videoTitle: "Advanced Manufacturing",
    videoUrl: "",
    videoText: "Our facility is equipped with the latest cold-heading and thread-rolling machinery. Every product undergoes rigorous quality checks to ensure compliance with international standards.",
    stats: [
      { label: 'Years Experience', value: '20+' },
      { label: 'Global Clients', value: '500+' },
      { label: 'Countries Served', value: '80+' },
      { label: 'Industry Awards', value: '50+' }
    ],
    trustTitle: "Certified Quality & Global Presence",
    trustItems: [],
    faq: []
  };

  const homeData = pages?.home ? { ...fallbackHome, ...pages.home } : fallbackHome;

  // Category Layout Logic
  const renderCategories = () => {
    const cats = categories.slice(0, 12); // Limit to 12
    const count = cats.length;

    if (count === 3) {
      return (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cats.slice(0, 2).map(cat => <CategoryCard key={cat.id} cat={cat} homeData={homeData} />)}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <CategoryCard cat={cats[2]} homeData={homeData} />
            <Link href="/products" className="group relative aspect-[16/7] md:aspect-auto rounded-[48px] bg-slate-900 flex flex-col items-center justify-center overflow-hidden transition-all hover:bg-blue-600">
               <div className="relative z-10 text-center">
                  <p className="text-white font-black text-2xl uppercase tracking-tighter mb-2">Explore More</p>
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-widest group-hover:text-white transition">View Full Catalog &rarr;</p>
               </div>
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-white/10 transition"></div>
            </Link>
          </div>
        </div>
      );
    }

    // Default Grid (Adapts based on count)
    const gridCols = count % 4 === 0 ? 'lg:grid-cols-4' : count % 3 === 0 ? 'lg:grid-cols-3' : 'lg:grid-cols-2';
    
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols} gap-8`}>
        {cats.map(cat => <CategoryCard key={cat.id} cat={cat} homeData={homeData} />)}
      </div>
    );
  };

  return (
    <Layout>
      {/* HERO SECTION */}
      <header className="relative bg-[#0a0f1d] py-20 lg:py-40 px-4 overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-[120px] animate-pulse"></div>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 items-center relative z-10">
          <div className="lg:col-span-7 text-center lg:text-left animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="inline-flex items-center gap-3 bg-blue-600/10 border border-blue-600/20 px-4 py-2 rounded-full mb-8">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span className="text-blue-400 font-black uppercase tracking-[0.3em] text-[10px]">Direct Factory Excellence</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-10 uppercase tracking-tighter leading-[0.95]">
              {homeData.heroTitle}
            </h1>
            
            <p className="text-slate-400 text-sm md:text-xl max-w-2xl mx-auto lg:mx-0 mb-12 leading-relaxed font-medium">
              {homeData.heroSubtitle}
            </p>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-6">
              <Link href="/products" className="group bg-blue-600 text-white font-black px-12 py-6 rounded-2xl hover:bg-white hover:text-blue-600 transition-all uppercase tracking-widest text-xs shadow-2xl flex items-center justify-center gap-3">
                Explore Products <i className="fas fa-arrow-right group-hover:translate-x-2 transition-transform"></i>
              </Link>
              <Link href="/contact" className="bg-white/5 border border-white/10 text-white font-black px-12 py-6 rounded-2xl hover:bg-white hover:text-slate-900 transition-all uppercase tracking-widest text-xs">
                Get Free Quote
              </Link>
            </div>
            
            <div className="mt-16 flex flex-wrap justify-center lg:justify-start gap-10">
               {homeData.advantages.map((adv, i) => (
                  <div key={i} className="flex items-center gap-3">
                     <div className="w-2 h-2 bg-blue-500 rounded-full"></div> 
                     <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{adv}</span>
                  </div>
               ))}
            </div>
          </div>

          {/* COMPRESSED HERO IMAGE */}
          <div className="lg:col-span-5 hidden lg:block relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[52px] opacity-20 blur shadow-2xl"></div>
            <Image
              src={homeData.heroImg || "https://images.unsplash.com/photo-1530124560677-bdaea024f061?auto=format&fit=crop&q=80&w=800"}
              alt="Premium Fasteners" width={800} height={800}
              className="relative rounded-[48px] shadow-2xl aspect-square object-cover border border-white/10"
              priority
            />
          </div>
        </div>
      </header>

      {/* CATEGORY SECTION (ADAPTIVE) */}
      <section className="max-w-7xl mx-auto px-4 py-32">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-20 gap-6">
          <div className="text-center md:text-left">
            <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Product Selection</span>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-slate-900 leading-none">{homeData.categoryTitle}</h2>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-4">{homeData.categorySubtitle}</p>
          </div>
        </div>
        {renderCategories()}
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="bg-slate-50 py-32 px-4">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
               <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Our Recommendations</span>
               <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-slate-900 leading-none">{homeData.featuredTitle}</h2>
               <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-4">{homeData.featuredSubtitle}</p>
            </div>
            <div className={`grid grid-cols-2 md:grid-cols-3 ${homeData.featuredCount === 4 ? 'lg:grid-cols-4' : homeData.featuredCount === 8 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6 md:gap-10`}>
               {products.slice(0, homeData.featuredCount).map(prod => (
                  <Link key={prod.id} href={`/products/${prod.seoSlug}`} className="bg-white p-6 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
                     <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-50 mb-6">
                        <Image src={prod.img} alt={prod.name} fill className="object-contain p-8 group-hover:scale-110 transition-transform duration-700" />
                     </div>
                     <h4 className="text-lg font-black uppercase text-slate-900 tracking-tight line-clamp-1">{prod.name}</h4>
                     <p className="text-blue-600 font-black uppercase text-[10px] tracking-widest mt-2">{prod.spec}</p>
                  </Link>
               ))}
            </div>
         </div>
      </section>

      {/* VIDEO & STATS SECTION */}
      <section className="py-32 px-4 relative overflow-hidden bg-[#0a0f1d]">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
            <div className="relative aspect-video rounded-[48px] overflow-hidden bg-slate-800 shadow-2xl">
               {homeData.videoUrl ? (
                  <iframe 
                    src={homeData.videoUrl.replace('watch?v=', 'embed/')} 
                    className="absolute inset-0 w-full h-full" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
               ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-white/10">
                     <i className="fas fa-play text-8xl"></i>
                  </div>
               )}
            </div>
            <div className="space-y-10">
               <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">{homeData.videoTitle}</h2>
               <p className="text-white/60 text-lg leading-relaxed font-medium">{homeData.videoText}</p>
               
               <div className="grid grid-cols-2 gap-8 pt-8">
                  {homeData.stats?.map((stat, i) => (
                     <div key={i}>
                        <p className="text-4xl md:text-5xl font-black text-blue-500 mb-2">{stat.value}</p>
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">{stat.label}</p>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* TRUST & EXHIBITION SECTION */}
      <section className="py-32 px-4 max-w-7xl mx-auto">
         <div className="text-center mb-20">
            <span className="text-blue-600 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Proven Capability</span>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-slate-900 leading-none">{homeData.trustTitle || 'Industrial Certifications'}</h2>
         </div>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {homeData.trustItems?.map((item, i) => (
               <div key={i} className="text-center group">
                  <div className="relative aspect-square rounded-[40px] bg-slate-50 border border-slate-100 overflow-hidden mb-6 group-hover:shadow-xl transition-all">
                     <Image src={item.img} alt={item.title} fill className="object-contain p-8 group-hover:scale-105 transition-transform" />
                  </div>
                  <h4 className="text-xs font-black uppercase text-slate-900 tracking-widest mb-2">{item.title}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{item.desc}</p>
               </div>
            ))}
         </div>
      </section>

      {/* FAQ SECTION */}
      <section className="bg-slate-50 py-32 px-4">
         <div className="max-w-4xl mx-auto">
            <div className="text-center mb-20">
               <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-900 leading-none">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-4">
               {homeData.faq?.map((faq, i) => (
                  <div key={i} className="bg-white rounded-[32px] overflow-hidden border border-slate-200">
                     <button 
                       onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                       className="w-full px-8 py-6 flex items-center justify-between text-left group"
                     >
                        <span className={`font-black uppercase text-xs tracking-widest transition-colors ${activeFaq === i ? 'text-blue-600' : 'text-slate-900'}`}>{faq.q}</span>
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${activeFaq === i ? 'bg-blue-600 text-white rotate-180' : 'bg-slate-100 text-slate-400'}`}>
                           <i className="fas fa-chevron-down text-[10px]"></i>
                        </div>
                     </button>
                     <div className={`px-8 overflow-hidden transition-all duration-500 ${activeFaq === i ? 'max-h-96 pb-8' : 'max-h-0'}`}>
                        <p className="text-sm font-medium text-slate-500 leading-relaxed border-t border-slate-50 pt-6">
                           {faq.a}
                        </p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* FOOTER INQUIRY & INFO */}
      <section className="py-32 px-4 max-w-7xl mx-auto">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            <div>
               <h2 className="text-4xl md:text-6xl font-black uppercase text-slate-900 tracking-tighter mb-10 leading-[0.9]">Partner with Us for <span className="text-blue-600">Reliable</span> Solutions</h2>
               <div className="space-y-10">
                  <ContactItem icon="fas fa-map-marker-alt" label="Factory Address" value={settings?.address || 'Handan, Hebei, China'} />
                  <ContactItem icon="fas fa-phone-alt" label="General Phone" value={settings?.contactPhone || '+86 123 4567 890'} />
                  <ContactItem icon="far fa-envelope" label="Sales Email" value={settings?.contactEmail || 'sales@highfasteners.com'} />
               </div>
               
               {/* WHATSAPP TEAM */}
               <div className="mt-16 pt-16 border-t border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-8">Our Sales Team (Online)</p>
                  <div className="flex flex-wrap gap-4">
                     {whatsappAccounts.filter(acc => acc.is_active).map(acc => (
                       <Link key={acc.id} href={`https://wa.me/${acc.phone.replace(/\D/g, '')}`} target="_blank" className="flex items-center gap-4 bg-emerald-50 px-6 py-4 rounded-2xl border border-emerald-100 group hover:bg-emerald-600 transition-all">
                          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white text-lg group-hover:bg-white group-hover:text-emerald-600 transition">
                             <i className="fab fa-whatsapp"></i>
                          </div>
                          <div>
                            <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest group-hover:text-white transition">Chat with</p>
                            <span className="font-black uppercase text-[10px] tracking-widest text-emerald-700 group-hover:text-white transition">{acc.label}</span>
                          </div>
                       </Link>
                     ))}
                     {whatsappAccounts.filter(acc => acc.is_active).length === 0 && settings?.whatsapp && (
                        <Link href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`} target="_blank" className="flex items-center gap-4 bg-emerald-50 px-6 py-4 rounded-2xl border border-emerald-100 group hover:bg-emerald-600 transition-all">
                           <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white text-lg group-hover:bg-white group-hover:text-emerald-600 transition">
                              <i className="fab fa-whatsapp"></i>
                           </div>
                           <span className="font-black uppercase text-[10px] tracking-widest text-emerald-700 group-hover:text-white transition">Chat on WhatsApp</span>
                        </Link>
                     )}
                  </div>
               </div>
            </div>
            
            <div className="bg-white p-10 md:p-16 rounded-[64px] border border-slate-100 shadow-2xl relative">
               <div className="mb-10">
                  <h3 className="text-2xl font-black uppercase text-slate-900 tracking-tighter">Instant Inquiry</h3>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">Professional response within 12h</p>
               </div>
               <InquiryForm />
            </div>
         </div>
      </section>
    </Layout>
  );
}

function ContactItem({ icon, label, value }: { icon: string, label: string, value: string }) {
   return (
      <div className="flex gap-6 items-start">
         <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 shrink-0">
            <i className={`${icon} text-lg`}></i>
         </div>
         <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <p className="text-lg font-black text-slate-900 uppercase tracking-tight">{value}</p>
         </div>
      </div>
   );
}

function CategoryCard({ cat, homeData }: { cat: any, homeData: any }) {
   return (
      <Link href={`/products?cat=${cat.value}`} className="group relative aspect-[4/5] md:aspect-[16/10] lg:aspect-[4/5] rounded-[48px] overflow-hidden shadow-lg cursor-pointer block border border-slate-100 hover:shadow-2xl transition-all duration-500">
         <Image 
            src={homeData.categoryImages?.[cat.value] || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=600"} 
            alt={cat.name} fill className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
         />
         <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1d] via-[#0a0f1d]/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
         <div className="absolute bottom-10 left-10 right-10 transform group-hover:-translate-y-2 transition-transform duration-500">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none mb-2">{cat.name}</h3>
            <p className="text-blue-400 text-[9px] font-black uppercase tracking-[0.2em]">View Products &rarr;</p>
         </div>
      </Link>
   );
}
