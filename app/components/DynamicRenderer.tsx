// app/components/DynamicRenderer.tsx
'use client';

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
        
        // Common Styles from data
        const sectionStyle = {
          backgroundColor: block.data.bgColor?.startsWith('#') ? block.data.bgColor : undefined,
          color: block.data.textColor?.startsWith('#') ? block.data.textColor : undefined
        };
        const sectionClass = !block.data.bgColor?.startsWith('#') ? block.data.bgColor : '';

        switch (block.type) {
          case 'Hero':
            return <HeroSection key={block.id || idx} data={block.data} />;
          case 'SplitAbout':
            return <SplitAboutSection key={block.id || idx} data={block.data} style={sectionStyle} className={sectionClass} />;
          case 'Category':
            return <CategorySection key={block.id || idx} data={block.data} categories={categories} style={sectionStyle} className={sectionClass} />;
          case 'FeaturedProduct':
            return <FeaturedProductSection key={block.id || idx} data={block.data} products={products} style={sectionStyle} className={sectionClass} />;
          case 'NewArrivals':
            return <NewArrivalsSection key={block.id || idx} data={block.data} products={products} style={sectionStyle} className={sectionClass} />;
          case 'Stats':
            return <StatsSection key={block.id || idx} data={block.data} style={sectionStyle} className={sectionClass} />;
          case 'FAQ':
            return <FAQSection key={block.id || idx} data={block.data} style={sectionStyle} className={sectionClass} />;
          case 'Inquiry':
            return <InquirySection key={block.id || idx} data={block.data} style={sectionStyle} className={sectionClass} />;
          case 'Trust':
            return <TrustSection key={block.id || idx} data={block.data} style={sectionStyle} className={sectionClass} />;
          case 'Process':
            return <ProcessSection key={block.id || idx} data={block.data} style={sectionStyle} className={sectionClass} />;
          case 'FactoryShowcase':
            return <FactoryShowcaseSection key={block.id || idx} data={block.data} style={sectionStyle} className={sectionClass} />;
          case 'RichText':
            return <RichTextSection key={block.id || idx} data={block.data} style={sectionStyle} className={sectionClass} />;
          default:
            return null;
        }
      })}
    </div>
  );
}

// --- Block Sections ---

function HeroSection({ data }: { data: any }) {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {data.img && (
        <Image src={data.img} alt={data.title || ''} fill className="object-cover" priority />
      )}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
      
      {/* Decorative Lines */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[1px] h-full bg-white/30" />
        <div className="absolute top-0 left-2/4 w-[1px] h-full bg-white/30" />
        <div className="absolute top-0 left-3/4 w-[1px] h-full bg-white/30" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto py-32">
        <div className="space-y-10">
          <div className="space-y-6">
            <h1 
              className="text-5xl md:text-8xl lg:text-[120px] font-black uppercase tracking-tighter leading-[0.85] animate-in fade-in slide-in-from-bottom-12 duration-1000 drop-shadow-2xl"
              style={{ color: data.titleColor }}
            >
              {data.title}
            </h1>
            <p 
              className="text-lg md:text-2xl font-medium max-w-3xl mx-auto leading-relaxed opacity-90"
              style={{ color: data.subtitleColor || 'white' }}
            >
              {data.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-6">
            {(data.advantages || []).map((adv: string, i: number) => (
              adv && (
                <div key={i} className="flex items-center gap-3 bg-white/10 backdrop-blur-xl px-8 py-4 rounded-2xl border border-white/20 shadow-2xl">
                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-[8px] text-white">
                    <i className="fas fa-check"></i>
                  </div>
                  <span className="text-white text-[11px] font-black uppercase tracking-widest">{adv}</span>
                </div>
              )
            ))}
          </div>

          <div className="pt-12 flex flex-wrap justify-center gap-6">
             <Link href="/products" className="bg-blue-600 text-white px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-blue-500/20">
                Explore Catalog
             </Link>
             <Link href="/inquiry" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white hover:text-slate-900 transition-all">
                Request Quote
             </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function SplitAboutSection({ data, style, className }: { data: any, style: any, className: string }) {
  return (
    <section className={`py-24 lg:py-40 ${className || 'bg-white'}`} style={style}>
      <div className="max-w-[1600px] mx-auto px-6 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="relative aspect-square lg:aspect-[4/5] rounded-[64px] overflow-hidden group bg-slate-100 shadow-2xl">
            {data.videoCover && <Image src={data.videoCover} alt="" fill className="object-cover group-hover:scale-105 transition duration-1000" />}
            <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
              <button className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all">
                <i className="fas fa-play ml-1"></i>
              </button>
            </div>
          </div>
          <div className="space-y-12">
            <div className="space-y-6">
              <span className="text-blue-600 font-black tracking-[0.4em] uppercase text-xs">{data.tag}</span>
              <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.95]" style={{ color: data.titleColor }}>
                {data.title}
              </h2>
              <p className="text-lg leading-relaxed font-medium opacity-80" style={{ color: data.textColor }}>
                {data.desc}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              {(data.stats || []).map((stat: any, i: number) => (
                <div key={i} className="space-y-2">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-blue-600 text-xl shadow-sm">
                    <i className={stat.icon || 'fas fa-bolt'}></i>
                  </div>
                  <div className="text-3xl font-black uppercase tracking-tighter" style={{ color: data.titleColor }}>{stat.value}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-50" style={{ color: data.textColor }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CategorySection({ data, categories, style, className }: { data: any, categories: Category[], style: any, className: string }) {
  // Dynamic Grid: User chooses category order
  const selectedCatValues = data.categories || categories.slice(0, 6).map(c => c.value);
  const displayCats = selectedCatValues.map((val: string) => categories.find(c => c.value === val)).filter(Boolean);

  return (
    <section className={`py-24 lg:py-40 ${className || 'bg-slate-50'}`} style={style}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <ModuleTitle title={data.title} subtitle={data.subtitle} align={data.align || 'center'} titleColor={data.titleColor} subtitleColor={data.subtitleColor} />
        
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayCats.map((cat: Category) => (
            <CategoryCard key={cat.id} cat={cat} img={data.images?.[cat.value]} textColor={data.textColor} />
          ))}
          
          {/* Always show Learn More Card at the end */}
          <Link href="/products" className="group relative aspect-[4/3] rounded-[48px] overflow-hidden bg-slate-900 flex flex-col items-center justify-center text-center p-12 hover:scale-[1.02] transition-all duration-700 shadow-2xl">
             <div className="relative z-10 space-y-6">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto text-white text-2xl group-hover:rotate-45 transition-transform duration-700">
                   <i className="fas fa-arrow-right"></i>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tighter">LEARN MORE</h3>
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Explore Full Range</p>
                </div>
             </div>
             <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-600/40 via-transparent to-transparent"></div>
             </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ cat, img, textColor }: { cat: Category, img?: string, textColor?: string }) {
  return (
    <Link href={`/products?cat=${cat.value}`} className="group relative aspect-[4/3] rounded-[48px] overflow-hidden bg-white shadow-sm hover:shadow-2xl transition-all duration-700 border border-slate-100">
      {img ? (
        <Image src={img} alt={cat.name} fill className="object-cover group-hover:scale-110 transition duration-1000" />
      ) : (
        <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
           <i className="fas fa-toolbox text-slate-200 text-6xl"></i>
        </div>
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
  let displayProducts = products;
  if (data.productIds && Array.isArray(data.productIds) && data.productIds.length > 0) {
    displayProducts = products.filter(p => data.productIds.includes(p.id.toString()) || data.productIds.includes(p.id));
  } else {
    displayProducts = products.slice(0, data.count || 6);
  }

  return (
    <section className={`py-24 lg:py-40 ${className || 'bg-white'}`} style={style}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <ModuleTitle title={data.title} subtitle={data.subtitle} align={data.align || 'center'} titleColor={data.titleColor} subtitleColor={data.subtitleColor} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mt-16">
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
  
  return (
    <section className={`py-24 lg:py-40 overflow-hidden relative ${className || 'bg-slate-900 text-white'}`} style={style}>
      <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/5 -skew-x-12 translate-x-1/4" />
      
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-end gap-12 mb-20">
          <div className="space-y-6">
             <span className="text-blue-500 font-black tracking-[0.4em] uppercase text-xs">Innovation & Quality</span>
             <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.95]" style={{ color: data.titleColor }}>New <span className="text-blue-500">Arrivals</span></h2>
          </div>
          <Link href="/products" className="px-10 py-4 bg-blue-600 text-white font-black uppercase text-[10px] tracking-widest rounded-full hover:scale-105 transition-all shadow-xl shadow-blue-500/20">
            View All Series
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayProducts.map((p) => (
            <Link key={p.id} href={`/products/${p.seoSlug || p.id}`} className="group bg-white/5 backdrop-blur-md rounded-[48px] p-10 border border-white/10 hover:bg-white/10 transition-all duration-700 shadow-xl">
               <div className="relative aspect-square rounded-[32px] overflow-hidden mb-8 bg-white/5">
                  <Image src={p.p_img || p.img} alt={p.name} fill className="object-contain p-6 group-hover:scale-110 transition duration-1000" />
                  <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg">NEW</div>
               </div>
               <div className="space-y-3">
                  <h4 className="text-xl font-black uppercase tracking-tighter group-hover:text-blue-500 transition" style={{ color: data.textColor || 'white' }}>{p.name}</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40" style={{ color: data.textColor || 'white' }}>{p.cat}</p>
               </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ p, textColor }: { p: Product, textColor?: string }) {
  return (
    <Link href={`/products/${p.seoSlug || p.id}`} className="group block">
      <div className="relative aspect-square rounded-[48px] overflow-hidden mb-8 bg-slate-100 p-8 shadow-inner group-hover:bg-white transition-colors duration-700 border border-slate-100">
        <Image src={p.img} alt={p.name} fill className="object-contain p-10 group-hover:scale-110 transition duration-1000" />
      </div>
      <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter group-hover:text-blue-600 transition mb-3" style={{ color: textColor }}>{p.name}</h3>
      <div className="flex items-center gap-3">
        <div className="w-6 h-[2px] bg-blue-600" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest" style={{ color: textColor }}>{p.cat}</p>
      </div>
    </Link>
  );
}

function StatsSection({ data, style, className }: { data: any, style: any, className: string }) {
  return (
    <section className={`py-24 lg:py-40 relative overflow-hidden ${className || 'bg-slate-900 text-white'}`} style={style}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {(data.items || []).map((item: any, i: number) => (
            <div key={i} className="text-center space-y-4 group">
              <div className="text-5xl lg:text-[100px] font-black uppercase tracking-tighter text-blue-500 leading-none group-hover:scale-110 transition duration-700 drop-shadow-2xl" style={{ color: data.titleColor }}>{item.value}</div>
              <div className="text-xs font-black uppercase tracking-[0.4em] opacity-40" style={{ color: data.textColor }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection({ data, style, className }: { data: any, style: any, className: string }) {
  return (
    <section className={`py-24 lg:py-40 ${className || 'bg-slate-50'}`} style={style}>
      <div className="max-w-[1000px] mx-auto px-6 lg:px-12">
        <ModuleTitle title={data.title} subtitle={data.subtitle} align="center" titleColor={data.titleColor} subtitleColor={data.subtitleColor} />
        <div className="mt-16 space-y-6">
          {(data.items || []).map((faq: any, i: number) => (
            <div key={i} className="bg-white rounded-[40px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-shadow duration-500">
              <details className="group">
                <summary className="flex justify-between items-center p-10 cursor-pointer list-none">
                  <span className="text-xl font-black text-slate-900 uppercase tracking-tighter" style={{ color: data.textColor }}>{faq.q}</span>
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-open:bg-blue-600 group-open:text-white transition-all shadow-sm">
                    <i className="fas fa-plus group-open:rotate-45 transition-transform"></i>
                  </div>
                </summary>
                <div className="p-10 pt-0 text-slate-600 font-medium leading-relaxed" style={{ color: data.textColor }}>
                  {faq.a}
                </div>
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
    <section id="inquiry" className={`py-24 lg:py-40 ${className || 'bg-white'}`} style={style}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          <div className="space-y-12 lg:sticky lg:top-40">
            <span className="text-blue-600 font-black tracking-[0.4em] uppercase text-xs">Request A Quote</span>
            <h2 className="text-5xl lg:text-7xl font-black text-slate-900 uppercase tracking-tighter leading-[0.95]" style={{ color: data.titleColor }}>
              Partner With Global Expertise.
            </h2>
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-slate-50 rounded-[28px] flex items-center justify-center text-blue-600 text-xl shadow-sm"><i className="fas fa-clock"></i></div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Response Time</p>
                   <p className="text-lg font-black text-slate-900 uppercase tracking-tighter" style={{ color: data.textColor }}>Within 12 Hours</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-slate-50 rounded-[28px] flex items-center justify-center text-blue-600 text-xl shadow-sm"><i className="fas fa-shield-alt"></i></div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Quality Assurance</p>
                   <p className="text-lg font-black text-slate-900 uppercase tracking-tighter" style={{ color: data.textColor }}>Global Standards Certified</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#f8fafc] p-12 lg:p-16 rounded-[64px] shadow-2xl shadow-slate-100 border border-slate-50">
             <InquiryForm />
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustSection({ data, style, className }: { data: any, style: any, className: string }) {
  return (
    <section className={`py-24 lg:py-40 ${className || 'bg-white'}`} style={style}>
       <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <ModuleTitle title={data.title} subtitle={data.subtitle} align="center" titleColor={data.titleColor} subtitleColor={data.subtitleColor} />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mt-20">
             {(data.items || []).map((item: any, i: number) => (
               <div key={i} className="group flex flex-col items-center text-center space-y-6">
                  <div className="relative w-full aspect-square bg-slate-50 rounded-[56px] p-12 overflow-hidden border border-slate-100 group-hover:bg-blue-600 group-hover:-translate-y-4 transition-all duration-700 shadow-sm group-hover:shadow-2xl">
                     {item.img && <Image src={item.img} alt={item.title} fill className="object-contain p-12 group-hover:brightness-0 group-hover:invert transition duration-700" />}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 uppercase tracking-tighter group-hover:text-blue-600 transition" style={{ color: data.textColor }}>{item.title}</h4>
                    {item.desc && <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 opacity-60" style={{ color: data.textColor }}>{item.desc}</p>}
                  </div>
               </div>
             ))}
          </div>
       </div>
    </section>
  );
}

function ProcessSection({ data, style, className }: { data: any, style: any, className: string }) {
  return (
    <section className={`py-24 lg:py-40 ${className || 'bg-slate-50'}`} style={style}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
        <ModuleTitle title={data.title || "Our Working Process"} subtitle={data.subtitle || "How we deliver excellence"} align="center" titleColor={data.titleColor} subtitleColor={data.subtitleColor} />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mt-32 relative">
          <div className="hidden md:block absolute top-[60px] left-[10%] right-[10%] h-[2px] bg-slate-200 z-0" />
          {[
            { n: '01', t: 'Inquiry & Consultation', i: 'fas fa-comments' },
            { n: '02', t: 'Customized Solution', i: 'fas fa-drafting-compass' },
            { n: '03', t: 'Precision Production', i: 'fas fa-cogs' },
            { n: '04', t: 'Global Logistics', i: 'fas fa-ship' }
          ].map((s, i) => (
            <div key={i} className="relative z-10 space-y-8 group">
               <div className="w-[120px] h-[120px] bg-white rounded-full flex items-center justify-center mx-auto shadow-2xl text-blue-600 text-3xl border-[12px] border-slate-50 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-700">
                 <i className={s.i}></i>
               </div>
               <div className="space-y-3">
                 <span className="text-[10px] font-black text-blue-600 tracking-[0.4em] uppercase">{s.n} Step</span>
                 <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-tight" style={{ color: data.textColor }}>{s.t}</h4>
               </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FactoryShowcaseSection({ data, style, className }: { data: any, style: any, className: string }) {
  return (
    <section className={`py-24 lg:py-40 overflow-hidden ${className || 'bg-white'}`} style={style}>
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <ModuleTitle title={data.title} subtitle={data.subtitle} align="center" titleColor={data.titleColor} subtitleColor={data.subtitleColor} />
        <div className="grid grid-cols-12 gap-8 h-[700px] mt-20">
          <div className="col-span-8 relative rounded-[64px] overflow-hidden group shadow-2xl border border-slate-100">
            {data.img1 && <Image src={data.img1} alt="" fill className="object-cover group-hover:scale-105 transition duration-1000" />}
          </div>
          <div className="col-span-4 grid grid-rows-2 gap-8">
             <div className="relative rounded-[48px] overflow-hidden group shadow-2xl border border-slate-100">
               {data.img2 && <Image src={data.img2} alt="" fill className="object-cover group-hover:scale-105 transition duration-1000" />}
             </div>
             <div className="relative rounded-[48px] overflow-hidden group shadow-2xl border border-slate-100">
               {data.img3 && <Image src={data.img3} alt="" fill className="object-cover group-hover:scale-105 transition duration-1000" />}
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RichTextSection({ data, style, className }: { data: any, style: any, className: string }) {
  return (
    <section className={`py-24 lg:py-40 ${className || 'bg-white'}`} style={style}>
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 prose-xl prose-slate max-w-none" style={{ color: data.textColor }}>
         <div dangerouslySetInnerHTML={{ __html: data.content }} className="rich-text-container" />
      </div>
    </section>
  );
}
