// app/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useProducts } from './context/ProductContext';
import Layout from './components/Layout';

export default function Home() {
  const { pages, categories } = useProducts();

  const fallbackHome = {
    heroTitle: "Custom Fasteners For Global Trade",
    heroSubtitle: "Hangfan specializes in high-precision fasteners and custom hardware. We bridge the gap between quality manufacturing and international standards.",
    advantages: ["8.8/10.9/12.9 GRADE SPECIALIST", "FULL SCALE OEM CAPABILITIES", "ISO 9001:2015 CERTIFIED"],
    heroImg: "https://images.unsplash.com/photo-1530124560677-bdaea024f061?auto=format&fit=crop&q=80&w=800"
  };

  const hero = pages?.home ? { ...fallbackHome, ...pages.home } : fallbackHome;

  return (
    <Layout>
      {/* HERO SECTION - REFINED */}
      <header className="relative bg-[#0a0f1d] py-24 lg:py-48 px-4 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/5 rounded-full -translate-x-1/2 translate-y-1/2 blur-[100px]"></div>
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 items-center relative z-10">
          <div className="lg:col-span-7 text-center lg:text-left animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="inline-flex items-center gap-3 bg-blue-600/10 border border-blue-600/20 px-4 py-2 rounded-full mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-blue-400 font-black uppercase tracking-[0.3em] text-[10px]">Direct Factory Excellence</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-10 uppercase tracking-tighter leading-[0.95]">
              {hero.heroTitle.split(' ').map((word, i) => 
                word.toLowerCase() === 'fasteners' || word.toLowerCase() === 'performance' ? 
                <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-200 to-indigo-300">{word} </span> : 
                <span key={i}>{word} </span>
              )}
            </h1>
            
            <p className="text-slate-400 text-sm md:text-xl max-w-2xl mx-auto lg:mx-0 mb-12 leading-relaxed font-medium">
              {hero.heroSubtitle}
            </p>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-6">
              <Link href="/products" className="group relative bg-blue-600 text-white font-black px-12 py-6 rounded-2xl hover:bg-white hover:text-blue-600 transition-all duration-500 uppercase tracking-widest text-xs shadow-2xl shadow-blue-500/20 flex items-center justify-center gap-3">
                <span>Explore Products</span>
                <i className="fas fa-arrow-right group-hover:translate-x-2 transition-transform"></i>
              </Link>
              <Link href="/contact" className="bg-white/5 border border-white/10 text-white font-black px-12 py-6 rounded-2xl hover:bg-white hover:text-slate-900 transition-all duration-500 uppercase tracking-widest text-xs backdrop-blur-sm">
                Get Free Quote
              </Link>
            </div>
            
            <div className="mt-16 flex flex-wrap justify-center lg:justify-start gap-10">
               {hero.advantages.map((adv, i) => (
                  <div key={i} className="flex items-center gap-3">
                     <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div> 
                     <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{adv}</span>
                  </div>
               ))}
            </div>
          </div>

          <div className="lg:col-span-5 hidden lg:block relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-600 blur-[80px] opacity-20 group-hover:opacity-30 transition-opacity duration-1000"></div>
            <div className="relative transform hover:scale-[1.02] transition-transform duration-700">
               <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[52px] opacity-20 blur shadow-2xl"></div>
               <Image
                 src={hero.heroImg || "https://images.unsplash.com/photo-1530124560677-bdaea024f061?auto=format&fit=crop&q=80&w=800"}
                 alt="Premium Fasteners" width={800} height={1000}
                 className="relative rounded-[48px] shadow-2xl aspect-[4/5] object-cover border border-white/10"
                 priority
               />
               
               {/* Floating Stats Card */}
               <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-[32px] shadow-2xl border border-slate-100 animate-bounce-slow">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-xl">
                        <i className="fas fa-check-double"></i>
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quality Rate</p>
                        <p className="text-2xl font-black text-slate-900 leading-none">99.9%</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </header>

      {/* STATS STRIP */}
      <section className="bg-slate-50 border-y border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatBox number="5000+" label="Stock Products" />
          <StatBox number="2000+" label="Global Clients" />
          <StatBox number="25+" label="Years Experience" />
          <StatBox number="ISO" label="Certified Quality" />
        </div>
      </section>

      {/* FEATURED CATEGORIES - GRID REFINED */}
      <section className="max-w-7xl mx-auto px-4 py-32 flex-1 w-full">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-20 gap-6">
          <div className="text-center md:text-left">
            <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Product Selection</span>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-slate-900 leading-none">Featured Categories</h2>
          </div>
          <Link href="/products" className="group bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 transition-all flex items-center gap-3">
             <span>Browse All</span>
             <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.slice(0, 3).map((cat, idx) => (
            <CategoryCard 
               key={cat.id} 
               title={cat.name} 
               subtitle={`Industrial Grade ${idx % 2 === 0 ? 'Fasteners' : 'Components'}`} 
               img={idx === 0 ? "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=600" : idx === 1 ? "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600" : "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=600"} 
               href={`/products?cat=${cat.value}`}
            />
          ))}
          {categories.length === 0 && (
            <>
               <CategoryCard title="Washers" subtitle="DIN 125 / DIN 127" img="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=600" />
               <CategoryCard title="Bolts & Nuts" subtitle="Grade 8.8 / 10.9 / 12.9" img="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600" />
               <CategoryCard title="Custom OEM" subtitle="By Drawing & Samples" img="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=600" />
            </>
          )}
        </div>
      </section>

      {/* TRUSTED CAPABILITY SECTION */}
      <section className="bg-[#0f172a] py-32 px-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
           <div className="order-2 lg:order-1 relative">
              <div className="grid grid-cols-2 gap-6 translate-y-12">
                 <div className="bg-white/5 border border-white/10 p-10 rounded-[48px] backdrop-blur-xl group hover:bg-blue-600 transition-all duration-500">
                    <i className="fas fa-microscope text-4xl text-blue-500 mb-6 group-hover:text-white transition"></i>
                    <h4 className="text-xl font-black text-white uppercase mb-4">Material Labs</h4>
                    <p className="text-white/40 text-sm group-hover:text-white/80">In-house quality testing for tensile strength and hardness.</p>
                 </div>
                 <div className="bg-white/5 border border-white/10 p-10 rounded-[48px] backdrop-blur-xl group hover:bg-indigo-600 transition-all duration-500">
                    <i className="fas fa-cogs text-4xl text-indigo-400 mb-6 group-hover:text-white transition"></i>
                    <h4 className="text-xl font-black text-white uppercase mb-4">Cold Heading</h4>
                    <p className="text-white/40 text-sm group-hover:text-white/80">High-speed production with micron-level precision.</p>
                 </div>
                 <div className="col-span-2 bg-gradient-to-r from-blue-600 to-indigo-600 p-12 rounded-[56px] shadow-2xl">
                    <div className="flex items-center gap-8">
                       <div className="flex -space-x-4">
                          {[1,2,3,4].map(i => (
                            <div key={i} className="w-16 h-16 rounded-full border-4 border-[#0f172a] bg-slate-200 overflow-hidden relative">
                               <Image src={`https://i.pravatar.cc/150?u=${i}`} alt="Engineer" fill />
                            </div>
                          ))}
                       </div>
                       <div>
                          <p className="text-white font-black text-2xl uppercase tracking-tighter">Talk to Engineers</p>
                          <p className="text-white/70 text-xs font-bold uppercase tracking-widest mt-1">Free Technical Consulting</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
           
           <div className="order-1 lg:order-2 space-y-10">
              <span className="text-blue-500 font-black uppercase tracking-[0.4em] text-[10px]">Industrial Infrastructure</span>
              <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">Built For The Toughest <span className="text-blue-500">Environments</span></h2>
              <p className="text-white/60 text-lg leading-relaxed font-medium">Our products are engineered to withstand extreme stress, corrosion, and high-temperature conditions. From bridge construction to aerospace assembly, we provide the backbone of modern engineering.</p>
              
              <ul className="space-y-6">
                 <li className="flex items-center gap-4 text-white font-black uppercase tracking-widest text-xs">
                    <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-600/40 flex items-center justify-center text-blue-400">
                       <i className="fas fa-check"></i>
                    </div>
                    Certified to DIN / ISO / ANSI Standards
                 </li>
                 <li className="flex items-center gap-4 text-white font-black uppercase tracking-widest text-xs">
                    <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-600/40 flex items-center justify-center text-blue-400">
                       <i className="fas fa-check"></i>
                    </div>
                    Custom Surface Treatments (Hot Dip Galv, Dacromet)
                 </li>
                 <li className="flex items-center gap-4 text-white font-black uppercase tracking-widest text-xs">
                    <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-600/40 flex items-center justify-center text-blue-400">
                       <i className="fas fa-check"></i>
                    </div>
                    Full Traceability with Material Certificates
                 </li>
              </ul>
              
              <Link href="/about" className="inline-block border-b-2 border-blue-600 text-white font-black uppercase tracking-widest text-xs pb-2 hover:text-blue-400 transition-colors">Our Factory Process &rarr;</Link>
           </div>
        </div>
      </section>

    </Layout>
  );
}

function StatBox({ number, label }: { number: string, label: string }) {
  return (
    <div className="text-center group">
      <h3 className="text-3xl md:text-5xl font-black text-slate-900 mb-2 tracking-tighter group-hover:text-blue-600 transition-colors">{number}</h3>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{label}</p>
    </div>
  );
}

function CategoryCard({ title, subtitle, img, href = "/products" }: { title: string, subtitle: string, img: string, href?: string }) {
  return (
    <Link href={href} className="group relative aspect-[4/5] rounded-[48px] overflow-hidden shadow-xl cursor-pointer block border border-slate-100 hover:shadow-2xl transition-all duration-500">
      <Image src={img} alt={title} fill className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1d] via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
      <div className="absolute bottom-10 left-10 right-10 transform group-hover:-translate-y-2 transition-transform duration-500">
        <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none mb-3">{title}</h3>
        <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">{subtitle}</p>
        <div className="w-0 group-hover:w-12 h-1 bg-blue-600 mt-4 transition-all duration-500"></div>
      </div>
    </Link>
  );
}
