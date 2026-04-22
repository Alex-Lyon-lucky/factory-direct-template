// app/components/DynamicRenderer.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Block, Product, Category } from '../context/ProductContext';
import InquiryForm from './InquiryForm';
import ModuleTitle from './ModuleTitle';

interface DynamicRendererProps {
  blocks: Block[];
  products?: Product[];
  categories?: Category[];
}

export default function DynamicRenderer({ blocks, products = [], categories = [] }: DynamicRendererProps) {
  if (!blocks || !Array.isArray(blocks)) return null;

  return (
    <div className="flex flex-col">
      {blocks.map((block, idx) => {
        if (!block || !block.data) return null;
        
        const style = {
          backgroundColor: block.data.bgColor?.startsWith('#') ? block.data.bgColor : undefined,
          color: block.data.textColor?.startsWith('#') ? block.data.textColor : undefined
        };
        const className = !block.data.bgColor?.startsWith('#') ? block.data.bgColor : '';

        switch (block.type) {
          case 'Hero':
            return <HeroSection key={block.id || idx} data={block.data} />;
          case 'SplitAbout':
            return <SplitAboutSection key={block.id || idx} data={block.data} style={style} className={className} />;
          case 'Category':
            return <CategorySection key={block.id || idx} data={block.data} categories={categories} style={style} className={className} />;
          case 'FeaturedProduct':
            return <FeaturedProductSection key={block.id || idx} data={block.data} products={products} style={style} className={className} />;
          case 'NewArrivals':
            return <NewArrivalsSection key={block.id || idx} data={block.data} products={products} style={style} className={className} />;
          case 'Stats':
            return <StatsSection key={block.id || idx} data={block.data} style={style} className={className} />;
          case 'FAQ':
            return <FAQSection key={block.id || idx} data={block.data} style={style} className={className} />;
          case 'Inquiry':
            return <InquirySection key={block.id || idx} data={block.data} style={style} className={className} />;
          case 'Trust':
            return <TrustSection key={block.id || idx} data={block.data} style={style} className={className} />;
          case 'Process':
            return <ProcessSection key={block.id || idx} data={block.data} style={style} className={className} />;
          case 'FactoryShowcase':
            return <FactoryShowcaseSection key={block.id || idx} data={block.data} style={style} className={className} />;
          case 'RichText':
            return <RichTextSection key={block.id || idx} data={block.data} style={style} className={className} />;
          default:
            return null;
        }
      })}
    </div>
  );
}

// --- Block Sections ---

function HeroSection({ data }: { data: any }) {
  const getStyle = (val?: string) => (val?.startsWith('#') ? { color: val } : {});
  const getClass = (val?: string, def: string = '') => (!val || val.startsWith('#') ? def : val);

  return (
    <section className={`relative min-h-[70vh] flex items-center overflow-hidden ${getClass(data.bgColor, 'bg-[#0a0f1d]')}`} style={data.bgColor?.startsWith('#') ? {backgroundColor: data.bgColor} : {}}>
      <div className="max-w-[1600px] mx-auto px-6 lg:px-24 w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center relative z-10 py-16 lg:py-24">
        {/* Left Content */}
        <div className="space-y-8 animate-in fade-in slide-in-from-left-12 duration-1000">
          <div className="space-y-6">
            <span className="inline-block px-5 py-2 rounded-full border border-blue-600/30 text-blue-500 text-[10px] font-black uppercase tracking-[0.4em]">
              {data.tag || 'FACTORY DIRECT EXCELLENCE'}
            </span>
            <h1 
              className={`text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] ${getClass(data.titleColor, 'text-white')}`}
              style={getStyle(data.titleColor)}
            >
              {data.title}
            </h1>
            <p 
              className={`text-lg md:text-xl font-medium max-w-xl leading-relaxed opacity-70 ${getClass(data.subtitleColor, 'text-slate-300')}`}
              style={getStyle(data.subtitleColor)}
            >
              {data.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap gap-6 pt-4">
             <Link href="/products" className="bg-blue-600 text-white px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-blue-500/20">
                {data.btn1Label || 'VIEW COLLECTIONS'}
             </Link>
             <Link href="/inquiry" className="bg-white/5 backdrop-blur-md text-white border border-white/10 px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white hover:text-slate-900 transition-all">
                {data.btn2Label || 'CONTACT SALES'}
             </Link>
          </div>

          <div className="pt-12 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-6">
            {(data.advantages || []).slice(0, 4).map((adv: string, i: number) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.8)]"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{adv}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Media (Matching the Alibaba/B2B image layout) */}
        <div className="relative animate-in fade-in slide-in-from-right-12 duration-1000">
           <div className="relative aspect-square lg:aspect-[4/5] rounded-[100px] lg:rounded-[200px] overflow-hidden shadow-2xl border-8 border-white/5">
              {data.img ? (
                <Image src={data.img} alt="" fill className="object-cover" priority />
              ) : (
                <div className="absolute inset-0 bg-slate-800 flex items-center justify-center"><i className="fas fa-industry text-6xl text-slate-700"></i></div>
              )}
           </div>
           {/* Floating Badge */}
           <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-600 rounded-[64px] flex flex-col items-center justify-center text-white p-8 shadow-2xl rotate-12">
              <span className="text-4xl font-black mb-1">25+</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-center opacity-80">Years of Experience</span>
           </div>
        </div>
      </div>
    </section>
  );
}

function SplitAboutSection({ data, style, className }: { data: any, style: any, className: string }) {
  const [showVideo, setShowVideo] = useState(false);
  const getStyle = (val?: string) => (val?.startsWith('#') ? { color: val } : {});
  const getClass = (val?: string, def: string = '') => (!val || val.startsWith('#') ? def : val);

  return (
    <section className={`py-16 lg:py-28 ${className || 'bg-white'}`} style={style}>
      <div className="max-w-[1600px] mx-auto px-6 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="relative aspect-square lg:aspect-[4/5] rounded-[64px] overflow-hidden group bg-slate-100 shadow-2xl cursor-pointer" onClick={() => setShowVideo(true)}>
            {data.videoCover && <Image src={data.videoCover} alt="" fill className="object-cover group-hover:scale-105 transition duration-1000" />}
            <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
              <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all">
                <i className="fas fa-play ml-1"></i>
              </div>
            </div>
          </div>
          <div className="space-y-12">
            <div className="space-y-6">
              <span className="text-blue-600 font-black tracking-[0.4em] uppercase text-xs">{data.tag}</span>
              <h2 className={`text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.95] ${getClass(data.titleColor, 'text-slate-900')}`} style={getStyle(data.titleColor)}>
                {data.title}
              </h2>
              <p className={`text-lg leading-relaxed font-medium opacity-80 ${getClass(data.textColor, 'text-slate-600')}`} style={getStyle(data.textColor)}>
                {data.desc}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              {(data.stats || []).map((stat: any, i: number) => (
                <div key={i} className="space-y-2">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-blue-600 text-xl shadow-sm">
                    <i className={stat.icon || 'fas fa-bolt'}></i>
                  </div>
                  <div className={`text-3xl font-black uppercase tracking-tighter ${getClass(data.titleColor, 'text-slate-900')}`} style={getStyle(data.titleColor)}>{stat.value}</div>
                  <div className={`text-[10px] font-black uppercase tracking-widest opacity-50 ${getClass(data.textColor, 'text-slate-400')}`} style={getStyle(data.textColor)}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showVideo && data.videoUrl && (
        <div className="fixed inset-0 z-[1000] bg-black/95 flex items-center justify-center p-6 md:p-24" onClick={() => setShowVideo(false)}>
           <div className="w-full max-w-6xl aspect-video rounded-3xl overflow-hidden shadow-2xl relative" onClick={e => e.stopPropagation()}>
              <iframe src={data.videoUrl} className="w-full h-full border-none" allowFullScreen />
              <button className="absolute -top-12 right-0 text-white text-2xl" onClick={() => setShowVideo(false)}><i className="fas fa-times"></i></button>
           </div>
        </div>
      )}
    </section>
  );
}

function CategorySection({ data, categories, style, className }: { data: any, categories: Category[], style: any, className: string }) {
  const selectedValues = data.categories && data.categories.length > 0 ? data.categories : categories.slice(0, 5).map(c => c.value);
  const displayCats = selectedValues.map((v: string) => categories.find(c => c.value === v)).filter(Boolean);

  return (
    <section className={`py-16 lg:py-28 ${className || 'bg-slate-50'}`} style={style}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <ModuleTitle title={data.title} subtitle={data.subtitle} align={data.align} titleColor={data.titleColor} subtitleColor={data.subtitleColor} />
        <div className={`mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`}>
          {displayCats.map((cat: Category) => (
            <CategoryCard key={cat.id} cat={cat} img={data.images?.[cat.value]} />
          ))}
          <Link href="/products" className="group relative aspect-[4/3] rounded-[48px] overflow-hidden bg-slate-900 flex flex-col items-center justify-center text-center p-12 hover:scale-[1.02] transition-all shadow-2xl">
             <div className="relative z-10 space-y-6">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto text-white text-2xl group-hover:rotate-45 transition-transform duration-700">
                   <i className="fas fa-arrow-right"></i>
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">LEARN MORE</h3>
             </div>
             <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-600/40 via-transparent to-transparent"></div>
          </Link>
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ cat, img }: { cat: Category, img?: string }) {
  return (
    <Link href={`/products?cat=${cat.value}`} className="group relative aspect-[4/3] rounded-[48px] overflow-hidden bg-white shadow-sm hover:shadow-2xl transition-all duration-700 border border-slate-100">
      {img ? (
        <Image src={img} alt={cat.name} fill className="object-cover group-hover:scale-110 transition duration-1000" />
      ) : (
        <div className="absolute inset-0 bg-slate-100 flex items-center justify-center"><i className="fas fa-toolbox text-slate-200 text-6xl"></i></div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
      <div className="absolute bottom-10 left-10 right-10">
        <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-2">{cat.value}</p>
        <h4 className="text-2xl font-black text-white uppercase tracking-tighter leading-none group-hover:text-blue-400 transition">{cat.name}</h4>
      </div>
    </Link>
  );
}

function FeaturedProductSection({ data, products, style, className }: { data: any, products: Product[], style: any, className: string }) {
  const cols = data.cols || 3;
  let displayProducts = products;
  if (data.productIds && Array.isArray(data.productIds) && data.productIds.length > 0) {
    displayProducts = products.filter(p => data.productIds.includes(p.id.toString()) || data.productIds.includes(p.id));
  } else {
    displayProducts = products.slice(0, data.count || 6);
  }

  const gridColsClass = {
    2: 'md:grid-cols-2 lg:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-3 lg:grid-cols-4'
  }[cols as 2 | 3 | 4] || 'lg:grid-cols-3';

  return (
    <section className={`py-16 lg:py-28 ${className || 'bg-white'}`} style={style}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <ModuleTitle title={data.title} subtitle={data.subtitle} align={data.align} titleColor={data.titleColor} subtitleColor={data.subtitleColor} />
        <div className={`grid grid-cols-1 ${gridColsClass} gap-12 mt-16`}>
          {displayProducts.map((p) => (
            <ProductCard key={p.id} p={p} textColor={data.textColor} />
          ))}
        </div>
      </div>
    </section>
  );
}

function NewArrivalsSection({ data, products, style, className }: { data: any, products: Product[], style: any, className: string }) {
  const displayProducts = [...products].sort((a, b) => b.id - a.id).slice(0, data.count || 4);
  const getStyle = (val?: string) => (val?.startsWith('#') ? { color: val } : {});
  const getClass = (val?: string, def: string = '') => (!val || val.startsWith('#') ? def : val);

  return (
    <section className={`py-12 lg:py-24 overflow-hidden relative ${className || 'bg-transparent'}`} style={style}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        <ModuleTitle title={data.title || "New Arrivals"} subtitle={data.subtitle} align={data.align} titleColor={data.titleColor} subtitleColor={data.subtitleColor} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {displayProducts.map((p) => (
            <Link key={p.id} href={`/products/${p.seoSlug || p.id}`} className="group bg-white rounded-[48px] p-8 border border-slate-100 hover:shadow-2xl transition-all duration-700">
               <div className="relative aspect-square rounded-[32px] overflow-hidden mb-8 bg-slate-50">
                  <Image src={p.p_img || p.img} alt={p.name} fill className="object-contain p-6 group-hover:scale-110 transition duration-1000" />
                  <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest">NEW</div>
               </div>
               <h4 className={`text-lg font-black uppercase tracking-tighter group-hover:text-blue-500 transition ${getClass(data.textColor, 'text-slate-900')}`} style={getStyle(data.textColor)}>{p.name}</h4>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ p, textColor }: { p: Product, textColor?: string }) {
  const getStyle = (val?: string) => (val?.startsWith('#') ? { color: val } : {});
  const getClass = (val?: string, def: string = '') => (!val || val.startsWith('#') ? def : val);
  return (
    <Link href={`/products/${p.seoSlug || p.id}`} className="group block">
      <div className="relative aspect-square rounded-[48px] overflow-hidden mb-8 bg-slate-100 p-8 shadow-inner group-hover:bg-white transition-colors duration-700 border border-slate-100">
        <Image src={p.img} alt={p.name} fill className="object-contain p-10 group-hover:scale-110 transition duration-1000" />
      </div>
      <h3 className={`text-2xl font-black uppercase tracking-tighter group-hover:text-blue-600 transition mb-3 ${getClass(textColor, 'text-slate-900')}`} style={getStyle(textColor)}>{p.name}</h3>
      <div className="flex items-center gap-3">
        <div className="w-6 h-[2px] bg-blue-600" />
        <p className={`text-[10px] font-black uppercase tracking-widest ${getClass(textColor, 'text-slate-400')}`} style={getStyle(textColor)}>{p.cat}</p>
      </div>
    </Link>
  );
}

function StatsSection({ data, style, className }: { data: any, style: any, className: string }) {
  const getStyle = (val?: string) => (val?.startsWith('#') ? { color: val } : {});
  const getClass = (val?: string, def: string = '') => (!val || val.startsWith('#') ? def : val);
  return (
    <section className={`py-16 lg:py-28 relative overflow-hidden ${className || 'bg-slate-900 text-white'}`} style={style}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10 text-center">
        <ModuleTitle title={data.title} subtitle={data.subtitle} align={data.align} titleColor={data.titleColor} subtitleColor={data.subtitleColor} />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mt-20">
          {(data.items || []).map((item: any, i: number) => (
            <div key={i} className="text-center space-y-4 group">
              <div className={`text-5xl lg:text-[100px] font-black uppercase tracking-tighter leading-none group-hover:scale-110 transition duration-700 ${getClass(data.titleColor, 'text-blue-500')}`} style={getStyle(data.titleColor)}>{item.value}</div>
              <div className={`text-xs font-black uppercase tracking-[0.4em] opacity-40 ${getClass(data.textColor, 'text-white')}`} style={getStyle(data.textColor)}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection({ data, style, className }: { data: any, style: any, className: string }) {
  return (
    <section className={`py-16 lg:py-28 ${className || 'bg-slate-50'}`} style={style}>
      <div className="max-w-[1000px] mx-auto px-6 lg:px-12">
        <ModuleTitle title={data.title} subtitle={data.subtitle} align={data.align} titleColor={data.titleColor} subtitleColor={data.subtitleColor} />
        <div className="mt-16 space-y-6">
          {(data.items || []).map((faq: any, i: number) => (
            <div key={i} className="bg-white rounded-[40px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition duration-500">
              <details className="group">
                <summary className="flex justify-between items-center p-10 cursor-pointer list-none">
                  <span className={`text-xl font-black uppercase tracking-tighter ${data.textColor?.startsWith('#') ? '' : (data.textColor || 'text-slate-900')}`} style={data.textColor?.startsWith('#') ? {color: data.textColor} : {}}>{faq.q}</span>
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-open:bg-blue-600 group-open:text-white transition-all shadow-sm"><i className="fas fa-plus group-open:rotate-45 transition-transform"></i></div>
                </summary>
                <div className="p-10 pt-0 font-medium leading-relaxed opacity-80" style={data.textColor?.startsWith('#') ? {color: data.textColor} : {}}>{faq.a}</div>
              </details>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function InquirySection({ data, style, className }: { data: any, style: any, className: string }) {
  const getStyle = (val?: string) => (val?.startsWith('#') ? { color: val } : {});
  const getClass = (val?: string, def: string = '') => (!val || val.startsWith('#') ? def : val);
  return (
    <section id="inquiry" className={`py-16 lg:py-28 ${className || 'bg-white'}`} style={style}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          <div className="space-y-12 lg:sticky lg:top-40">
            <span className="text-blue-600 font-black tracking-[0.4em] uppercase text-xs">Request A Quote</span>
            <h2 className={`text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.95] ${getClass(data.titleColor, 'text-slate-900')}`} style={getStyle(data.titleColor)}>Partner With Global Expertise.</h2>
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-slate-50 rounded-[28px] flex items-center justify-center text-blue-600 text-xl shadow-sm"><i className="fas fa-clock"></i></div>
                <p className={`text-lg font-black uppercase tracking-tighter ${getClass(data.textColor, 'text-slate-900')}`} style={getStyle(data.textColor)}>Within 12 Hours</p>
              </div>
            </div>
          </div>
          <div className="bg-[#f8fafc] p-12 lg:p-16 rounded-[64px] shadow-2xl shadow-slate-100 border border-slate-50"><InquiryForm /></div>
        </div>
      </div>
    </section>
  );
}

function TrustSection({ data, style, className }: { data: any, style: any, className: string }) {
  return (
    <section className={`py-16 lg:py-28 ${className || 'bg-white'}`} style={style}>
       <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <ModuleTitle title={data.title} subtitle={data.subtitle} align={data.align} titleColor={data.titleColor} subtitleColor={data.subtitleColor} />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mt-20">
             {(data.items || []).map((item: any, i: number) => (
               <div key={i} className="group flex flex-col items-center text-center space-y-6">
                  <div className="relative w-full aspect-square bg-slate-50 rounded-[56px] p-12 overflow-hidden border border-slate-100 group-hover:bg-blue-600 group-hover:-translate-y-4 transition-all shadow-sm group-hover:shadow-2xl">
                     {item.img && <Image src={item.img} alt={item.title} fill className="object-contain p-12 group-hover:brightness-0 group-hover:invert transition duration-700" />}
                  </div>
                  <h4 className={`font-black uppercase tracking-tighter group-hover:text-blue-600 transition ${data.textColor?.startsWith('#') ? '' : (data.textColor || 'text-slate-900')}`} style={data.textColor?.startsWith('#') ? {color: data.textColor} : {}}>{item.title}</h4>
               </div>
             ))}
          </div>
       </div>
    </section>
  );
}

function ProcessSection({ data, style, className }: { data: any, style: any, className: string }) {
  const steps = data.steps && data.steps.length > 0 ? data.steps : [
    { title: 'Inquiry & Consultation', icon: 'fas fa-comments' },
    { title: 'Customized Solution', icon: 'fas fa-drafting-compass' },
    { title: 'Precision Production', icon: 'fas fa-cogs' },
    { title: 'Global Logistics', icon: 'fas fa-ship' }
  ];
  return (
    <section className={`py-16 lg:py-28 ${className || 'bg-slate-50'}`} style={style}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
        <ModuleTitle title={data.title} subtitle={data.subtitle} align={data.align} titleColor={data.titleColor} subtitleColor={data.subtitleColor} />
        <div className={`grid grid-cols-1 md:grid-cols-${Math.min(steps.length, 4)} gap-16 mt-20 relative`}>
          {steps.length > 1 && <div className="hidden md:block absolute top-[60px] left-[10%] right-[10%] h-[2px] bg-slate-200 z-0" />}
          {steps.map((s: any, i: number) => (
            <div key={i} className="relative z-10 space-y-8 group">
               <div className="w-[120px] h-[120px] bg-white rounded-full flex items-center justify-center mx-auto shadow-2xl text-blue-600 text-3xl border-[12px] border-slate-50 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-700">
                 {s.icon?.startsWith('http') ? <Image src={s.icon} alt="" width={40} height={40} className="object-contain" /> : <i className={s.icon || 'fas fa-cog'}></i>}
               </div>
               <h4 className="text-xl font-black uppercase tracking-tighter leading-tight" style={data.textColor?.startsWith('#') ? {color: data.textColor} : {}}>{s.title || s.t}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FactoryShowcaseSection({ data, style, className }: { data: any, style: any, className: string }) {
  return (
    <section className={`py-16 lg:py-28 overflow-hidden ${className || 'bg-white'}`} style={style}>
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <ModuleTitle title={data.title} subtitle={data.subtitle} align={data.align} titleColor={data.titleColor} subtitleColor={data.subtitleColor} />
        <div className="grid grid-cols-12 gap-8 h-[700px] mt-20">
          <div className="col-span-8 relative rounded-[64px] overflow-hidden group shadow-2xl border border-slate-100">
            {data.img1 && <Image src={data.img1} alt="" fill className="object-cover group-hover:scale-105 transition duration-1000" />}
          </div>
          <div className="col-span-4 grid grid-rows-2 gap-8">
             <div className="relative rounded-[48px] overflow-hidden group shadow-2xl border border-slate-100">{data.img2 && <Image src={data.img2} alt="" fill className="object-cover group-hover:scale-105 transition duration-1000" />}</div>
             <div className="relative rounded-[48px] overflow-hidden group shadow-2xl border border-slate-100">{data.img3 && <Image src={data.img3} alt="" fill className="object-cover group-hover:scale-105 transition duration-1000" />}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RichTextSection({ data, style, className }: { data: any, style: any, className: string }) {
  return (
    <section className={`py-16 lg:py-28 ${className || 'bg-white'}`} style={style}>
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 prose-xl prose-slate max-w-none" style={data.textColor?.startsWith('#') ? {color: data.textColor} : {}}>
         <div dangerouslySetInnerHTML={{ __html: data.content }} className="rich-text-container" />
      </div>
    </section>
  );
}
