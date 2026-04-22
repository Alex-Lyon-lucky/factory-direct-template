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
  if (!blocks || blocks.length === 0) return null;

  return (
    <>
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'Hero':
            return <HeroSection key={block.id} data={block.data} />;
          case 'SplitAbout':
            return <SplitAboutSection key={block.id} data={block.data} />;
          case 'Category':
            return <CategorySection key={block.id} data={block.data} categories={categories} />;
          case 'FeaturedProduct':
            return <FeaturedProductSection key={block.id} data={block.data} products={products} />;
          case 'Stats':
            return <StatsSection key={block.id} data={block.data} />;
          case 'FAQ':
            return <FAQSection key={block.id} data={block.data} />;
          case 'Inquiry':
            return <InquirySection key={block.id} />;
          case 'Trust':
            return <TrustSection key={block.id} data={block.data} />;
          case 'Process':
            return <ProcessSection key={block.id} data={block.data} />;
          case 'FactoryShowcase':
            return <FactoryShowcaseSection key={block.id} data={block.data} />;
          case 'RichText':
            return <RichTextSection key={block.id} data={block.data} />;
          default:
            return <div key={block.id} className="p-10 text-center text-slate-300">Unknown block type: {block.type}</div>;
        }
      })}
    </>
  );
}

// Sub-components for each block type

function HeroSection({ data }: { data: any }) {
  return (
    <section className="relative h-[80vh] min-h-[700px] flex items-center justify-center overflow-hidden">
      {data.img && (
        <Image src={data.img} alt={data.title} fill className="object-cover" priority />
      )}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-8 animate-in fade-in slide-in-from-bottom-12 duration-1000">
          {data.title}
        </h1>
        <p className="text-lg md:text-xl text-white/80 font-medium mb-12 max-w-3xl mx-auto leading-relaxed">
          {data.subtitle}
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          {(data.advantages || []).map((adv: string, i: number) => (
            adv && (
              <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
                <i className="fas fa-check text-blue-400 text-xs"></i>
                <span className="text-white text-[11px] font-black uppercase tracking-widest">{adv}</span>
              </div>
            )
          ))}
        </div>
      </div>
    </section>
  );
}

function SplitAboutSection({ data }: { data: any }) {
  return (
    <section className="py-24 lg:py-40 bg-white">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          {/* Left: Media */}
          <div className="relative aspect-square lg:aspect-[4/5] rounded-[64px] overflow-hidden group">
            {data.videoCover && <Image src={data.videoCover} alt="" fill className="object-cover group-hover:scale-105 transition duration-1000" />}
            <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
              <button className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all">
                <i className="fas fa-play ml-1"></i>
              </button>
            </div>
          </div>
          {/* Right: Content */}
          <div className="space-y-12">
            <div className="space-y-6">
              <span className="text-blue-600 font-black tracking-[0.4em] uppercase text-xs">{data.tag}</span>
              <h2 className="text-5xl lg:text-7xl font-black text-slate-900 uppercase tracking-tighter leading-[0.95]">
                {data.title}
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed font-medium">
                {data.desc}
              </p>
            </div>
            {/* Mini Stats Grid */}
            <div className="grid grid-cols-2 gap-8">
              {(data.stats || []).map((stat: any, i: number) => (
                <div key={i} className="space-y-2">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-blue-600 text-xl">
                    <i className={stat.icon}></i>
                  </div>
                  <div className="text-3xl font-black text-slate-900 uppercase tracking-tighter">{stat.value}</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CategorySection({ data, categories }: { data: any, categories: Category[] }) {
  return (
    <section className="py-24 lg:py-40 bg-slate-50">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <ModuleTitle title={data.title} subtitle={data.subtitle} align={data.align} />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {categories.slice(0, 8).map((cat) => (
            <Link key={cat.id} href={`/products?cat=${cat.value}`} className="group relative aspect-square rounded-[40px] overflow-hidden bg-white shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-700">
              <div className="p-10 flex flex-col justify-between h-full relative z-10">
                <span className="text-slate-900 font-black uppercase text-lg leading-tight tracking-tighter">{cat.name}</span>
                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white group-hover:bg-blue-600 transition-colors">
                  <i className="fas fa-arrow-right -rotate-45 group-hover:rotate-0 transition-transform duration-500"></i>
                </div>
              </div>
              <div className="absolute right-[-10%] bottom-[-10%] w-2/3 h-2/3 opacity-10 group-hover:opacity-20 transition duration-700">
                <i className="fas fa-box-open text-8xl"></i>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedProductSection({ data, products }: { data: any, products: Product[] }) {
  const displayProducts = products.slice(0, data.count || 6);
  return (
    <section className="py-24 lg:py-40 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <ModuleTitle title={data.title} subtitle={data.subtitle} align={data.align} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mt-16">
          {displayProducts.map((p) => (
            <Link key={p.id} href={`/products/${p.seoSlug || p.id}`} className="group block">
              <div className="relative aspect-square rounded-[48px] overflow-hidden mb-6 bg-slate-100">
                <Image src={p.img} alt={p.name} fill className="object-cover group-hover:scale-110 transition duration-700" />
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter group-hover:text-blue-600 transition mb-2">{p.name}</h3>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{p.cat}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsSection({ data }: { data: any }) {
  return (
    <section className="py-24 lg:py-40 bg-slate-900 text-white overflow-hidden relative">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {(data.items || []).map((item: any, i: number) => (
            <div key={i} className="text-center space-y-4">
              <div className="text-5xl lg:text-7xl font-black uppercase tracking-tighter text-blue-500">{item.value}</div>
              <div className="text-xs font-black uppercase tracking-[0.3em] opacity-50">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection({ data }: { data: any }) {
  return (
    <section className="py-24 lg:py-40 bg-slate-50">
      <div className="max-w-[1000px] mx-auto px-6 lg:px-12">
        <ModuleTitle title={data.title} subtitle={data.subtitle} align="center" />
        <div className="mt-16 space-y-4">
          {(data.items || []).map((faq: any, i: number) => (
            <div key={i} className="bg-white rounded-[32px] overflow-hidden border border-slate-100">
              <details className="group">
                <summary className="flex justify-between items-center p-8 cursor-pointer list-none">
                  <span className="text-lg font-black text-slate-900 uppercase tracking-tighter">{faq.q}</span>
                  <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-open:bg-blue-600 group-open:text-white transition-all">
                    <i className="fas fa-plus group-open:rotate-45 transition-transform"></i>
                  </div>
                </summary>
                <div className="p-8 pt-0 text-slate-600 font-medium leading-relaxed">
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

function InquirySection() {
  return (
    <section id="inquiry" className="py-24 lg:py-40 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          <div className="space-y-12 lg:sticky lg:top-40">
            <span className="text-blue-600 font-black tracking-[0.4em] uppercase text-xs">Request A Quote</span>
            <h2 className="text-5xl lg:text-7xl font-black text-slate-900 uppercase tracking-tighter leading-[0.95]">
              Partner With Global Expertise.
            </h2>
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-slate-50 rounded-[28px] flex items-center justify-center text-blue-600 text-xl"><i className="fas fa-clock"></i></div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Response Time</p>
                   <p className="text-lg font-black text-slate-900 uppercase tracking-tighter">Within 12 Hours</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-slate-50 rounded-[28px] flex items-center justify-center text-blue-600 text-xl"><i className="fas fa-shield-alt"></i></div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Quality Assurance</p>
                   <p className="text-lg font-black text-slate-900 uppercase tracking-tighter">Global Standards Certified</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#f8fafc] p-12 lg:p-16 rounded-[64px] shadow-2xl shadow-slate-200">
             <InquiryForm />
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustSection({ data }: { data: any }) {
  return (
    <section className="py-24 lg:py-40 bg-white">
       <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <ModuleTitle title={data.title} subtitle={data.subtitle} align="center" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
             {(data.items || []).map((item: any, i: number) => (
               <div key={i} className="group flex flex-col items-center text-center space-y-6">
                  <div className="relative w-full aspect-square bg-slate-50 rounded-[48px] p-12 overflow-hidden border border-slate-100 group-hover:bg-blue-600 group-hover:-translate-y-4 transition-all duration-700">
                     <Image src={item.img} alt={item.title} fill className="object-contain p-12 group-hover:brightness-0 group-hover:invert transition duration-700" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 uppercase tracking-tighter group-hover:text-blue-600 transition">{item.title}</h4>
                    {item.desc && <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{item.desc}</p>}
                  </div>
               </div>
             ))}
          </div>
       </div>
    </section>
  );
}

function ProcessSection({ data }: { data: any }) {
  return (
    <section className="py-24 lg:py-40 bg-slate-50">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
        <ModuleTitle title="Our Working Process" subtitle="How we deliver excellence from start to finish" align="center" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mt-24 relative">
          <div className="hidden md:block absolute top-[60px] left-[10%] right-[10%] h-[2px] bg-slate-200 z-0" />
          {[
            { n: '01', t: 'Inquiry & Consultation', i: 'fas fa-comments' },
            { n: '02', t: 'Customized Solution', i: 'fas fa-drafting-compass' },
            { n: '03', t: 'Precision Production', i: 'fas fa-cogs' },
            { n: '04', t: 'Global Logistics', i: 'fas fa-ship' }
          ].map((s, i) => (
            <div key={i} className="relative z-10 space-y-6">
               <div className="w-[120px] h-[120px] bg-white rounded-full flex items-center justify-center mx-auto shadow-xl text-blue-600 text-3xl border-8 border-slate-50">
                 <i className={s.i}></i>
               </div>
               <div className="space-y-2">
                 <span className="text-[10px] font-black text-blue-600 tracking-widest uppercase">{s.n} Step</span>
                 <h4 className="font-black text-slate-900 uppercase tracking-tighter leading-tight">{s.t}</h4>
               </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FactoryShowcaseSection({ data }: { data: any }) {
  return (
    <section className="py-24 lg:py-40 bg-white overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-12 gap-6 h-[600px]">
          <div className="col-span-8 relative rounded-[64px] overflow-hidden group">
            <Image src={data.img1 || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2070'} alt="" fill className="object-cover group-hover:scale-105 transition duration-1000" />
          </div>
          <div className="col-span-4 grid grid-rows-2 gap-6">
             <div className="relative rounded-[48px] overflow-hidden group">
               <Image src={data.img2 || 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&q=80&w=1959'} alt="" fill className="object-cover group-hover:scale-105 transition duration-1000" />
             </div>
             <div className="relative rounded-[48px] overflow-hidden group">
               <Image src={data.img3 || 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=2070'} alt="" fill className="object-cover group-hover:scale-105 transition duration-1000" />
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RichTextSection({ data }: { data: any }) {
  return (
    <section className="py-24 lg:py-40 bg-white prose-custom">
      <div className="max-w-[1000px] mx-auto px-6 lg:px-12" dangerouslySetInnerHTML={{ __html: data.content }} />
    </section>
  );
}
