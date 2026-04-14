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
    headerHeight: 220,
    bgMode: "image",
    bgColor: "#0f172a"
  };

  const about = pages?.about ? { ...fallbackAbout, ...pages.about } : fallbackAbout;

  return (
    <Layout>
      <PageHeader data={about} />

      <main className="max-w-7xl mx-auto px-6 py-24 flex-1 w-full animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="order-2 lg:order-1 flex flex-col justify-center">
            <h3 className="text-xs font-black uppercase text-blue-600 tracking-[0.4em] mb-6">Our Industrial Story</h3>
            <h2 className="text-4xl md:text-5xl font-black uppercase text-slate-900 tracking-tighter mb-10 leading-none">Global standards. <br />Handan factory direct.</h2>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-500 text-lg leading-loose font-medium opacity-80 whitespace-pre-wrap">{about.content}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-8 mt-16 pt-12 border-t border-slate-100">
              <div>
                <h4 className="text-4xl font-black uppercase tracking-tighter text-slate-900 mb-2 leading-none">25+</h4>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Years Excellence</p>
              </div>
              <div>
                <h4 className="text-4xl font-black uppercase tracking-tighter text-slate-900 mb-2 leading-none">5000t</h4>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Annual Production</p>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 rounded-[64px] overflow-hidden shadow-2xl relative aspect-square rotate-2 hover:rotate-0 transition-all duration-1000 group">
            <Image 
              src={about.heroImg || "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800"} 
              alt="Factory" 
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-blue-600/10 mix-blend-overlay"></div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
