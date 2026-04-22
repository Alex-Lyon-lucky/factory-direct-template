// app/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useProducts } from './context/ProductContext';
import Layout from './components/Layout';
import InquiryForm from './components/InquiryForm';
import ModuleTitle from './components/ModuleTitle';

export default function Home() {
  const { pages, categories, products, settings, whatsappAccounts } = useProducts();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const fallbackHome = {
    heroTitle: "Custom Fasteners For Global Trade",
    heroSubtitle: "Hangfan specializes in high-precision fasteners and custom hardware. We bridge the gap between quality manufacturing and international standards.",
    advantages: ["8.8/10.9/12.9 GRADE SPECIALIST", "FULL SCALE OEM CAPABILITIES", "ISO 9001:2015 CERTIFIED"],
    heroImg: "https://images.unsplash.com/photo-1530124560677-bdaea024f061?auto=format&fit=crop&q=80&w=800",
    aboutTag: 'ABOUT HANGFAN',
    aboutTitle: 'Experienced & Quality More Than 20 Years',
    aboutDesc: 'Handan Hangfan Metal Products Co., Ltd. is a comprehensive enterprise integrating scientific research, production and trade. We specialize in high-end fasteners, including various high-strength bolts, nuts, and non-standard custom parts, serving global infrastructure and machinery industries with 20+ years of industrial expertise.',
    aboutStats: [
      { icon: 'fas fa-industry', value: '20+', label: 'Years Experience' },
      { icon: 'fas fa-users', value: '500+', label: 'Global Clients' },
      { icon: 'fas fa-globe', value: '80+', label: 'Countries Served' },
      { icon: 'fas fa-award', value: '50+', label: 'Industry Awards' }
    ],
    aboutBtn1Label: 'Learn More About Us',
    aboutBtn1Link: '/about',
    aboutBtn2Label: 'Request a Quote',
    aboutBtn2Link: '/contact',
    aboutVideoCover: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
    trustItems: [],
    faq: []
  };

  const homeData = pages?.home ? { ...fallbackHome, ...pages.home } : fallbackHome;

  const renderCategories = () => {
    const cats = categories.slice(0, 12); 
    const count = cats.length;

    if (count === 5) {
      return (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cats.slice(0, 3).map(cat => <CategoryCard key={cat.id} cat={cat} homeData={homeData} />)}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cats.slice(3, 5).map(cat => <CategoryCard key={cat.id} cat={cat} homeData={homeData} />)}
            <Link href="/products" className="group relative aspect-square rounded-[48px] bg-slate-900 flex flex-col items-center justify-center overflow-hidden transition-all hover:bg-blue-600">
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

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {cats.map(cat => <CategoryCard key={cat.id} cat={cat} homeData={homeData} />)}
      </div>
    );
  };

  return (
    <Layout>
      {/* HERO SECTION */}
      <section className="relative w-full bg-[#0a0f1d] overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 py-10 lg:py-16 flex flex-col lg:flex-row items-center gap-10 lg:gap-20 min-h-[500px] lg:min-h-[700px] relative z-10">
          <div className="flex-1 text-center lg:text-left animate-in fade-in slide-in-from-left-8 duration-1000">
             <div className="inline-block bg-blue-600/10 border border-blue-500/20 px-4 py-2 rounded-full mb-6">
                <span className="text-blue-500 font-black text-[10px] uppercase tracking-[0.3em]">Factory Direct Excellence</span>
             </div>
             <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter mb-6 leading-[0.85]">
               {homeData.heroTitle}
             </h1>
             <p className="text-white/40 text-sm md:text-base font-medium max-w-xl mb-10 leading-relaxed">
               {homeData.heroSubtitle}
             </p>
             <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
               <Link href="/products" className="w-full sm:w-auto bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95">
                 View Collections
               </Link>
               <Link href="/contact" className="w-full sm:w-auto bg-white/5 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest border border-white/10 hover:bg-white/10 transition-all">
                 Contact Sales
               </Link>
             </div>
             <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-4 pt-10 border-t border-white/5">
                {homeData.advantages.map((adv, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span className="text-white font-black text-[9px] uppercase tracking-widest opacity-60">{adv}</span>
                  </div>
                ))}
             </div>
          </div>

          <div className="flex-1 w-full relative animate-in fade-in zoom-in duration-1000">
            <div className="relative aspect-square max-w-[550px] mx-auto rounded-[100px] overflow-hidden shadow-2xl border border-white/10 rotate-3 hover:rotate-0 transition-transform duration-700 group">
              <Image 
                src={homeData.heroImg} 
                alt="Fastener Manufacturing" 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent"></div>
            </div>
          </div>
        </div>
        
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] -mr-96 -mt-96 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] -ml-72 -mb-72 animate-pulse"></div>
      </section>

      {/* NEW ABOUT US SPLIT-SCREEN SECTION (Replaces old stats/video) */}
      <section className="bg-white py-24 md:py-40">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col lg:flex-row items-center gap-16 lg:gap-32">
           {/* Left Column: Video Cover */}
           <div className="flex-1 w-full relative group">
              <div className="absolute -inset-4 bg-blue-600/5 rounded-[80px] blur-3xl group-hover:bg-blue-600/10 transition duration-700"></div>
              <div className="relative aspect-square lg:aspect-[4/5] rounded-[64px] overflow-hidden shadow-2xl bg-slate-900 border border-slate-100">
                 {homeData.aboutVideoUrl ? (
                   <video src={homeData.aboutVideoUrl} poster={homeData.aboutVideoCover} autoPlay muted loop playsInline className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition duration-700" />
                 ) : (
                   <Image src={homeData.aboutVideoCover || fallbackHome.aboutVideoCover} alt="Factory" fill className="object-cover opacity-80 group-hover:opacity-100 transition duration-700" />
                 )}
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-2xl shadow-blue-600/20 scale-90 group-hover:scale-100 transition duration-500">
                       <i className="fas fa-play ml-1 text-2xl"></i>
                    </div>
                 </div>
              </div>
           </div>

           {/* Right Column: Content Area */}
           <div className="flex-1 text-left">
              <div className="inline-block bg-blue-50 px-4 py-2 rounded-xl mb-6 border border-blue-100">
                 <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.3em]">{homeData.aboutTag}</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter mb-8 leading-[0.9]">
                 {homeData.aboutTitle}
              </h2>
              <p className="text-slate-500 text-sm md:text-base font-medium leading-loose mb-12 opacity-80">
                 {homeData.aboutDesc}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-8 mb-16">
                 {homeData.aboutStats?.map((stat, i) => (
                    <div key={i} className="space-y-3">
                       <i className={`${stat.icon} text-blue-600 text-lg`}></i>
                       <div>
                          <h4 className="text-3xl font-black text-slate-900 leading-none mb-1">{stat.value}</h4>
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{stat.label}</p>
                       </div>
                    </div>
                 ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                 <Link href={homeData.aboutBtn1Link || '/about'} className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-slate-900 transition-all text-center">
                    {homeData.aboutBtn1Label}
                 </Link>
                 <Link href={homeData.aboutBtn2Link || '/contact'} className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-blue-600 transition-all text-center flex items-center justify-center gap-3">
                    <i className="fas fa-comments"></i> {homeData.aboutBtn2Label}
                 </Link>
              </div>
           </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="bg-slate-50 py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6">
          <ModuleTitle 
            title={homeData.categoryTitle}
            subtitle={homeData.categorySubtitle}
            titleColor={homeData.categoryTitleColor}
            subtitleColor={homeData.categorySubtitleColor}
            align={homeData.categoryAlign}
          />
          {renderCategories()}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="bg-white py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6">
          <ModuleTitle 
            title={homeData.featuredTitle}
            subtitle={homeData.featuredSubtitle}
            titleColor={homeData.featuredTitleColor}
            subtitleColor={homeData.featuredSubtitleColor}
            align={homeData.featuredAlign}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.slice(0, homeData.featuredCount || 6).map((product) => (
              <Link key={product.id} href={`/products/${product.seoSlug || product.id}`} className="group bg-slate-50 p-8 rounded-[48px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500">
                 <div className="relative aspect-square rounded-[36px] overflow-hidden mb-8 bg-white p-6 group-hover:p-4 transition-all duration-700">
                    <Image 
                      src={product.img} 
                      alt={product.alt || product.name} 
                      fill 
                      className="object-contain group-hover:scale-110 transition-transform duration-700"
                    />
                 </div>
                 <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-none group-hover:text-blue-600 transition">{product.name}</h3>
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition">
                       <i className="fas fa-arrow-right text-[10px]"></i>
                    </div>
                 </div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{product.cat}</p>
              </Link>
            ))}
          </div>
          <div className="mt-20 text-center">
             <Link href="/products" className="inline-flex items-center gap-4 bg-slate-900 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-blue-600 transition-all active:scale-95">
                Explore All Products <i className="fas fa-long-arrow-alt-right"></i>
             </Link>
          </div>
        </div>
      </section>

      {/* TRUST & FAQ SECTION */}
      <section className="bg-slate-50 py-24 md:py-40">
        <div className="max-w-[1400px] mx-auto px-6">
          <ModuleTitle 
            title={homeData.trustTitle}
            subtitle={homeData.trustSubtitle}
            titleColor={homeData.trustTitleColor}
            subtitleColor={homeData.trustSubtitleColor}
            align={homeData.trustAlign}
          />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-32">
             {homeData.trustItems?.map((item, i) => (
                <div key={i} className="group flex flex-col items-center animate-in fade-in duration-1000">
                   <div className="relative aspect-square w-full bg-white rounded-[40px] shadow-sm flex items-center justify-center p-8 mb-6 group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-500 border border-slate-100">
                      <Image src={item.img} alt={item.title} fill className="object-contain p-8 opacity-40 group-hover:opacity-100 transition grayscale group-hover:grayscale-0" />
                   </div>
                   <p className="text-[10px] font-black uppercase text-slate-400 text-center tracking-widest">{item.title}</p>
                </div>
             ))}
          </div>

          <div className="max-w-4xl mx-auto">
             <ModuleTitle 
               title={homeData.faqTitle}
               subtitle={homeData.faqSubtitle}
               titleColor={homeData.faqTitleColor}
               subtitleColor={homeData.faqSubtitleColor}
               align={homeData.faqAlign}
               className="mb-12"
             />
             <div className="space-y-4">
                {homeData.faq?.map((item, i) => (
                   <div key={i} className={`group bg-white rounded-[32px] overflow-hidden border border-slate-100 transition-all duration-500 ${activeFaq === i ? 'shadow-2xl' : 'hover:bg-slate-50'}`}>
                      <button 
                        onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                        className="w-full px-10 py-8 flex justify-between items-center text-left"
                      >
                         <span className="text-sm md:text-base font-black text-slate-900 uppercase tracking-tight">{item.q}</span>
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${activeFaq === i ? 'bg-slate-900 text-white rotate-180' : 'bg-slate-50 text-slate-400'}`}>
                            <i className="fas fa-chevron-down text-[10px]"></i>
                         </div>
                      </button>
                      <div className={`transition-all duration-500 ease-in-out ${activeFaq === i ? 'max-h-[500px] opacity-100 border-t border-slate-50' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                         <div className="px-10 py-8">
                            <p className="text-slate-500 text-sm leading-loose font-medium opacity-80">{item.a}</p>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* CONTACT & INQUIRY SECTION */}
      <section className="bg-white py-24 md:py-40">
          <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
             <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
                <h3 className="text-xs font-black uppercase text-blue-600 tracking-[0.4em] mb-6">Global Fastener Supply</h3>
                <h2 className="text-5xl md:text-7xl font-black uppercase text-slate-900 tracking-tighter mb-10 leading-[0.9]">Ready to build <br />your project?</h2>
                <p className="text-slate-400 text-lg font-medium max-w-lg mb-12 opacity-80 leading-relaxed">
                   Connect with our technical sales team for custom quotes and international logistics support.
                </p>
                
                <div className="space-y-12">
                   <ContactItem icon="fas fa-envelope" label="General Inquiry" value={settings?.contactEmail || "sales@hangfan.com"} />
                   <ContactItem icon="fas fa-phone-alt" label="Direct Hotline" value={settings?.contactPhone || "+86 123 4567 890"} />
                   
                   <div className="pt-10 border-t border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Our Sales Team</p>
                      <div className="flex flex-wrap gap-4">
                        {whatsappAccounts.filter(acc => acc.is_active).map((acc, i) => (
                           <Link 
                             key={i} 
                             href={`https://wa.me/${acc.phone.replace(/\D/g, '')}`} 
                             target="_blank"
                             className="flex items-center gap-4 bg-emerald-50 px-6 py-4 rounded-2xl border border-emerald-100 group hover:bg-emerald-600 transition-all"
                           >
                              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white text-lg group-hover:bg-white group-hover:text-emerald-600 transition">
                                 <i className="fab fa-whatsapp"></i>
                              </div>
                              <div className="text-left">
                                <p className="text-[8px] font-black uppercase text-emerald-500 group-hover:text-white transition">Chat with</p>
                                <p className="font-black uppercase text-[10px] tracking-widest text-emerald-700 group-hover:text-white transition">{acc.label}</p>
                              </div>
                           </Link>
                        ))}
                     </div>
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
      <Link href={`/products?cat=${cat.value}`} className="group relative aspect-square rounded-[48px] overflow-hidden shadow-lg cursor-pointer block border border-slate-100 hover:shadow-2xl transition-all duration-500">
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
