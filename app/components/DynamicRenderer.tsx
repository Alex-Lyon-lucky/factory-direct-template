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
          case 'FeatureMedia':
            return <FeatureMediaSection key={block.id || idx} data={block.data} style={style} className={className} />;
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

function FeatureMediaSection({ data, style, className }: { data: any, style: any, className: string }) {
  return (
    <section className={`py-16 lg:py-28 ${className || 'bg-white'}`} style={style}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
         <ModuleTitle title={data.title} subtitle={data.subtitle} align={data.align} titleColor={data.titleColor} subtitleColor={data.subtitleColor} />
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mt-20">
            <div className="relative aspect-video rounded-[64px] overflow-hidden shadow-2xl border border-slate-100 group">
               {data.mediaType === 'video' ? (
                 <video src={data.mediaUrl} className="w-full h-full object-cover" autoPlay muted loop playsInline />
               ) : (
                 <Image src={data.mediaUrl || '/placeholder.jpg'} alt="" fill className="object-cover group-hover:scale-105 transition duration-1000" />
               )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {(data.features || []).map((f: any, i: number) => (
                  <div key={i} className="p-8 bg-slate-50 rounded-[40px] hover:bg-blue-600 hover:text-white group transition-all duration-500 shadow-sm hover:shadow-2xl">
                     <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-2xl text-blue-600 mb-6 group-hover:scale-110 transition shadow-sm">
                        {f.icon?.startsWith('http') ? <Image src={f.icon} alt="" width={32} height={32} /> : <i className={f.icon || 'fas fa-check'}></i>}
                     </div>
                     <h4 className="text-lg font-black uppercase tracking-tighter mb-2">{f.title}</h4>
                     <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest leading-loose">{f.desc}</p>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </section>
  );
}

function HeroSection({ data }: { data: any }) {
  const getStyle = (val?: string) => (val?.startsWith('#') ? { color: val } : {});
  const getClass = (val?: string, def: string = '') => (!val || val.startsWith('#') ? def : val);

  return (
    <section className={`relative min-h-[70vh] flex items-center overflow-hidden ${getClass(data.bgColor, 'bg-[#0a0f1d]')}`} style={data.bgColor?.startsWith('#') ? {backgroundColor: data.bgColor} : {}}>
      <div className="max-w-[1600px] mx-auto px-6 lg:px-24 w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center relative z-10 py-16 lg:py-24">
        <div className="space-y-10 lg:space-y-12 animate-in slide-in-from-left duration-1000">
          <div className="flex items-center gap-4">
             <span className="w-12 h-[2px] bg-blue-500"></span>
             <span className={`text-xs font-black uppercase tracking-[0.4em] ${getClass(data.subtitleColor, 'text-blue-500')}`} style={getStyle(data.subtitleColor)}>{data.tag || 'Global Fastener Leader'}</span>
          </div>
          <h1 className={`text-6xl lg:text-[110px] font-black uppercase tracking-tighter leading-[0.85] ${getClass(data.titleColor, 'text-white')}`} style={getStyle(data.titleColor)}>
            {data.title || 'Forging Excellence In Every Thread.'}
          </h1>
          <div className="grid grid-cols-2 gap-10 border-l-2 border-slate-800 pl-10">
             {(data.advantages || []).map((adv: string, i: number) => (
                <div key={i} className="flex items-center gap-4 group">
                   <div className="w-2 h-2 rounded-full bg-blue-500 group-hover:scale-150 transition duration-500"></div>
                   <span className={`text-[10px] font-black uppercase tracking-widest ${getClass(data.textColor, 'text-slate-400')}`} style={getStyle(data.textColor)}>{adv}</span>
                </div>
             ))}
          </div>
          <div className="flex flex-wrap gap-6 pt-6">
            <Link href="/products" className="bg-blue-600 text-white px-12 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-white hover:text-slate-900 transition-all duration-500 shadow-2xl shadow-blue-500/20">
              {data.btn1Label || 'Our Products'}
            </Link>
            <Link href="/inquiry" className="bg-transparent border-2 border-slate-700 text-white px-12 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-slate-700 transition-all duration-500">
              {data.btn2Label || 'Request Quote'}
            </Link>
          </div>
        </div>
        <div className="relative aspect-square lg:aspect-auto lg:h-[80vh] animate-in zoom-in duration-1000 delay-300">
           {data.img && <Image src={data.img} alt="" fill className="object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)]" priority />}
           <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1d] via-transparent to-transparent lg:hidden"></div>
        </div>
      </div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
    </section>
  );
}

function SplitAboutSection({ data, style, className }: { data: any, style: any, className: string }) {
  const getStyle = (val?: string) => (val?.startsWith('#') ? { color: val } : {});
  const getClass = (val?: string, def: string = '') => (!val || val.startsWith('#') ? def : val);

  return (
    <section className={`py-16 lg:py-28 overflow-hidden ${className || 'bg-white'}`} style={style}>
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
        <div className="relative aspect-video lg:aspect-square rounded-[64px] overflow-hidden shadow-2xl border border-slate-100 group">
          {data.videoUrl ? (
            <div className="w-full h-full bg-slate-900 relative">
               <video src={data.videoUrl} className="w-full h-full object-cover" autoPlay muted loop playsInline />
               <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition duration-700"></div>
            </div>
          ) : (
            <Image src={data.img || '/placeholder.jpg'} alt="" fill className="object-cover group-hover:scale-105 transition duration-1000" />
          )}
        </div>
        <div className="space-y-12">
          <div className="space-y-6">
            <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${getClass(data.subtitleColor, 'text-blue-600')}`} style={getStyle(data.subtitleColor)}>{data.tag || 'Established 1995'}</span>
            <h2 className={`text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.95] ${getClass(data.titleColor, 'text-slate-900')}`} style={getStyle(data.titleColor)}>
              {data.title || 'Uncompromising Engineering Precision.'}
            </h2>
            <p className={`text-lg font-medium leading-relaxed opacity-70 ${getClass(data.textColor, 'text-slate-600')}`} style={getStyle(data.textColor)}>
              {data.desc || 'We specialize in high-performance fastening solutions for global industrial applications, delivering millions of precision components every month with guaranteed material traceability.'}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-12 pt-8 border-t border-slate-100">
             {(data.stats || []).map((s: any, i: number) => (
               <div key={i} className="space-y-2">
                 <div className="text-4xl font-black text-slate-900 tracking-tighter">{s.value}</div>
                 <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{s.label}</div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CategorySection({ data, categories, style, className }: { data: any, categories: Category[], style: any, className: string }) {
  const selectedCats = categories.filter(c => data.categories?.includes(c.value));
  return (
    <section className={`py-16 lg:py-28 ${className || 'bg-slate-50'}`} style={style}>
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <ModuleTitle title={data.title} subtitle={data.subtitle} align={data.align} titleColor={data.titleColor} subtitleColor={data.subtitleColor} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
          {selectedCats.map((cat, i) => (
            <Link href={`/products?category=${cat.value}`} key={i} className="group relative h-[450px] rounded-[56px] overflow-hidden bg-white shadow-sm hover:shadow-2xl transition-all duration-700">
              <Image src={data.images?.[cat.value] || '/placeholder.jpg'} alt={cat.name} fill className="object-cover group-hover:scale-110 transition duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-60 group-hover:opacity-90 transition duration-700"></div>
              <div className="absolute bottom-10 left-10 right-10">
                 <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Collection {i + 1}</p>
                 <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedProductSection({ data, products, style, className }: { data: any, products: Product[], style: any, className: string }) {
  const selected = products.filter(p => data.productIds?.includes(p.id.toString()));
  const cols = data.cols || 3;
  
  return (
    <section className={`py-16 lg:py-28 ${className || 'bg-white'}`} style={style}>
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <ModuleTitle title={data.title} subtitle={data.subtitle} align={data.align} titleColor={data.titleColor} subtitleColor={data.subtitleColor} />
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${cols} gap-8 lg:gap-12 mt-20`}>
          {selected.map((p, i) => (
            <Link href={`/products/${p.seoSlug || p.id}`} key={i} className="group flex flex-col space-y-8">
              <div className="relative aspect-square rounded-[64px] bg-slate-50 overflow-hidden border border-slate-100 group-hover:shadow-2xl transition duration-700">
                <Image src={p.img} alt={p.name} fill className="object-contain p-12 group-hover:scale-110 transition duration-1000" />
              </div>
              <div className="px-4 text-center">
                 <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-tight group-hover:text-blue-600 transition">{p.name}</h3>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-3">Precision Series / {p.cat}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function NewArrivalsSection({ data, products, style, className }: { data: any, products: Product[], style: any, className: string }) {
  const selected = products.filter(p => data.productIds?.includes(p.id.toString()));
  const cols = data.cols || 3;

  return (
    <section className={`py-16 lg:py-28 ${className || 'bg-slate-900'}`} style={style}>
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <ModuleTitle title={data.title} subtitle={data.subtitle} align={data.align} titleColor={data.titleColor} subtitleColor={data.subtitleColor} />
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${cols} gap-8 lg:gap-12 mt-20`}>
          {selected.map((p, i) => (
            <Link href={`/products/${p.seoSlug || p.id}`} key={i} className="group relative h-[500px] rounded-[64px] overflow-hidden bg-white/5 hover:bg-white/10 transition-all duration-700 border border-white/5">
              <Image src={p.img} alt={p.name} fill className="object-contain p-20 group-hover:scale-105 transition duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-12 left-12 right-12">
                 <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none mb-3">{p.name}</h3>
                 <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">New Release</span>
                    <i className="fas fa-arrow-right text-white opacity-0 group-hover:opacity-100 group-hover:translate-x-4 transition-all duration-500"></i>
                 </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsSection({ data, style, className }: { data: any, style: any, className: string }) {
  const getStyle = (val?: string) => (val?.startsWith('#') ? { color: val } : {});
  const getClass = (val?: string, def: string = '') => (!val || val.startsWith('#') ? def : val);

  return (
    <section className={`py-16 lg:py-28 overflow-hidden relative ${className || 'bg-blue-600'}`} style={style}>
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 relative z-10">
        <ModuleTitle title={data.title} subtitle={data.subtitle} align={data.align} titleColor={data.titleColor} subtitleColor={data.subtitleColor} />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24 mt-20">
          {(data.items || []).map((item: any, i: number) => (
            <div key={i} className="text-center space-y-4 group">
              <div className={`text-5xl lg:text-[100px] font-black uppercase tracking-tighter leading-none group-hover:scale-110 transition duration-700 ${getClass(data.titleColor, 'text-white')}`} style={getStyle(data.titleColor)}>{item.value}</div>
              <div className={`text-xs font-black uppercase tracking-[0.4em] opacity-40 ${getClass(data.textColor, 'text-white')}`} style={getStyle(data.textColor)}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
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
  return (
    <section id="inquiry" className={`py-16 lg:py-28 ${className || 'bg-white'}`} style={style}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <ModuleTitle title={data.title || 'READY TO START YOUR PROJECT?'} subtitle={data.subtitle || 'Connect with our engineering team for specialized fastener solutions, material certifications, and custom OEM manufacturing requirements.'} align="left" titleColor={data.titleColor} subtitleColor={data.subtitleColor} />
            <div className="grid grid-cols-2 gap-8">
               <div className="space-y-2">
                  <div className="text-3xl font-black text-blue-600">100%</div>
                  <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Quality Guaranteed</div>
               </div>
               <div className="space-y-2">
                  <div className="text-3xl font-black text-blue-600">24H</div>
                  <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Response Time</div>
               </div>
            </div>
          </div>
          <div className="bg-white p-12 lg:p-16 rounded-[64px] shadow-2xl shadow-slate-200 border border-slate-50 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
             <InquiryForm />
          </div>
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
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mt-20">
             {(data.items || []).map((item: any, i: number) => (
                <div key={i} className="group flex flex-col items-center text-center space-y-6">
                   <div className="relative w-full aspect-square bg-slate-50 rounded-[56px] p-8 overflow-hidden border border-slate-100 group-hover:bg-blue-600 group-hover:-translate-y-4 transition-all shadow-sm group-hover:shadow-2xl">
                      {item.img && <Image src={item.img} alt={item.title} fill className="object-contain p-8 group-hover:brightness-0 group-hover:invert transition duration-700" />}
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

  const rows = [];
  for (let i = 0; i < steps.length; i += 4) {
    rows.push(steps.slice(i, i + 4));
  }

  return (
    <section className={`py-16 lg:py-28 ${className || 'bg-slate-50'}`} style={style}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
        <ModuleTitle title={data.title} subtitle={data.subtitle} align={data.align} titleColor={data.titleColor} subtitleColor={data.subtitleColor} />
        
        <div className="mt-20 flex flex-col gap-24 relative">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className={`relative flex flex-col md:flex-row items-center justify-between gap-12 md:gap-0 ${rowIndex % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
              {row.map((s: any, i: number) => {
                const globalIndex = rowIndex * 4 + i;
                const isLastInRow = i === row.length - 1;
                const isFirstInRow = i === 0;
                const isEvenRow = rowIndex % 2 === 1;

                return (
                  <div key={globalIndex} className="relative flex-1 w-full max-w-[280px] group">
                    {/* Horizontal Line */}
                    {!isLastInRow && (
                      <div className={`hidden md:block absolute top-[60px] w-full h-[2px] bg-slate-200 z-0 ${isEvenRow ? 'right-1/2' : 'left-1/2'}`} />
                    )}

                    {/* Vertical Line for Row Transition */}
                    {isLastInRow && rowIndex < rows.length - 1 && (
                      <div className="hidden md:block absolute top-[60px] right-1/2 md:right-[60px] w-[2px] h-[120px] bg-slate-200 z-0" />
                    )}

                    <div className="relative z-10 space-y-6">
                       <div className="w-[120px] h-[120px] bg-white rounded-full flex items-center justify-center mx-auto shadow-2xl text-blue-600 text-3xl border-[12px] border-slate-50 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-700 relative">
                          <span className="absolute -top-2 -left-2 w-8 h-8 bg-slate-900 text-white text-[10px] font-black rounded-full flex items-center justify-center border-4 border-white">
                            {globalIndex + 1}
                          </span>
                          {s.icon?.startsWith('http') ? <Image src={s.icon} alt="" width={40} height={40} className="object-contain" /> : <i className={s.icon || 'fas fa-cog'}></i>}
                       </div>
                       <div className="px-4">
                          <h4 className="text-lg font-black uppercase tracking-tighter leading-tight mb-2" style={data.textColor?.startsWith('#') ? {color: data.textColor} : {}}>{s.title}</h4>
                          {s.desc && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.desc}</p>}
                       </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FactoryShowcaseSection({ data, style, className }: { data: any, style: any, className: string }) {
  const imgs = Array.isArray(data.images) ? data.images : [data.img1, data.img2, data.img3].filter(Boolean);
  
  return (
    <section className={`py-16 lg:py-28 overflow-hidden ${className || 'bg-white'}`} style={style}>
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <ModuleTitle title={data.title} subtitle={data.subtitle} align={data.align} titleColor={data.titleColor} subtitleColor={data.subtitleColor} />
        <div className="grid grid-cols-12 gap-8 h-[700px] mt-20">
          <div className="col-span-8 relative rounded-[64px] overflow-hidden group shadow-2xl border border-slate-100">
            {imgs[0] && <Image src={imgs[0]} alt="" fill className="object-cover group-hover:scale-105 transition duration-1000" />}
          </div>
          <div className="col-span-4 grid grid-rows-2 gap-8">
             <div className="relative rounded-[48px] overflow-hidden group shadow-2xl border border-slate-100">{imgs[1] && <Image src={imgs[1]} alt="" fill className="object-cover group-hover:scale-105 transition duration-1000" />}</div>
             <div className="relative rounded-[48px] overflow-hidden group shadow-2xl border border-slate-100">{imgs[2] && <Image src={imgs[2]} alt="" fill className="object-cover group-hover:scale-105 transition duration-1000" />}</div>
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
