// app/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useProducts } from './context/ProductContext';
import Layout from './components/Layout';

export default function Home() {
  const { pages } = useProducts();

  const fallbackHome = {
    heroTitle: "Custom Fasteners For Global Trade",
    heroSubtitle: "Hangfan specializes in high-precision fasteners and custom hardware. We bridge the gap between quality manufacturing and international standards.",
    advantages: ["8.8/10.9/12.9 GRADE SPECIALIST", "FULL SCALE OEM CAPABILITIES", "ISO 9001:2015 CERTIFIED"],
    heroImg: "https://images.unsplash.com/photo-1530124560677-bdaea024f061?auto=format&fit=crop&q=80&w=800"
  };

  const hero = pages?.home ? { ...fallbackHome, ...pages.home } : fallbackHome;

  return (
    <Layout>
      <header className="relative bg-slate-900 py-20 lg:py-40 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10 animate-in fade-in duration-1000">
          <div className="text-center lg:text-left">
            <span className="text-blue-400 font-bold uppercase tracking-[0.3em] text-xs mb-6 block">Direct Factory Excellence</span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-8 uppercase tracking-tighter leading-[1.1]">
              {hero.heroTitle.split(' ').map((word, i) => 
                word.toLowerCase() === 'fasteners' ? <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">{word} </span> : word + ' '
              )}
            </h1>
            <p className="text-slate-400 text-sm md:text-lg max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed font-medium">
              {hero.heroSubtitle}
            </p>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <Link href="/products" className="bg-blue-600 text-white font-black px-10 py-5 rounded-2xl hover:bg-white hover:text-blue-600 transition-all uppercase tracking-widest text-xs shadow-xl shadow-blue-500/20">Explorer Store</Link>
              <Link href="/contact" className="bg-white/5 border border-white/10 text-white font-black px-10 py-5 rounded-2xl hover:bg-white hover:text-slate-900 transition-all uppercase tracking-widest text-xs">Upload Drawing</Link>
            </div>
            
            <div className="mt-12 flex flex-wrap justify-center lg:justify-start gap-6 opacity-40">
               {hero.advantages.map((adv, i) => (
                  <div key={i} className="flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-widest">
                     <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> {adv}
                  </div>
               ))}
            </div>
          </div>

          <div className="hidden lg:block relative">
            <div className="absolute inset-0 bg-blue-600 blur-[120px] opacity-20 animate-pulse"></div>
            <Image
              src={hero.heroImg || "https://images.unsplash.com/photo-1530124560677-bdaea024f061?auto=format&fit=crop&q=80&w=800"}
              alt="Fasteners" width={800} height={600}
              className="rounded-[48px] shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700 aspect-video object-cover"
              priority
            />
          </div>
        </div>
      </header>

      {/* FEATURED CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 py-24 flex-1 w-full">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900">Featured Categories</h2>
            <div className="w-12 h-1 bg-blue-600 mt-2"></div>
          </div>
          <Link href="/products" className="text-xs font-black uppercase text-blue-600 hover:underline">View All &rarr;</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          <CategoryCard title="Washers" subtitle="DIN 125 / DIN 127" img="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=600" />
          <CategoryCard title="Bolts & Nuts" subtitle="Grade 8.8 / 10.9 / 12.9" img="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600" />
          <CategoryCard title="Custom OEM" subtitle="By Drawing & Samples" img="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=600" />
        </div>
      </section>

    </Layout>
  );
}

function CategoryCard({ title, subtitle, img }: { title: string, subtitle: string, img: string }) {
  return (
    <Link href="/products" className="group relative aspect-[4/5] rounded-[40px] overflow-hidden shadow-lg cursor-pointer block">
      <Image src={img} alt={title} fill className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
      <div className="absolute bottom-8 left-8 right-8">
        <h3 className="text-2xl font-black text-white uppercase">{title}</h3>
        <p className="text-blue-400 text-xs font-bold mt-2 uppercase tracking-widest">{subtitle}</p>
      </div>
    </Link>
  );
}
