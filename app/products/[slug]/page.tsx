// app/products/[slug]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useProducts, Product } from '../../context/ProductContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import InquiryForm from '../../components/InquiryForm';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { products, settings } = useProducts();
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImg, setActiveImg] = useState<string>('');
  const [activeTab, setActiveTab] = useState('technical');
  
  useEffect(() => {
    const p = products.find(item => item.seoSlug === slug || item.id.toString() === slug);
    if (p) {
      setProduct(p);
      setActiveImg(p.img);
    }
  }, [slug, products]);

  if (!product) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;

  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": [product.img, ...(product.gallery || [])],
    "description": product.seoDescription || product.description,
    "sku": product.spec,
    "brand": { "@type": "Brand", "name": settings?.siteName || "High Fasteners" },
    "offers": {
      "@type": "Offer",
      "url": `https://highfasteners.com/products/${product.seoSlug || product.id}`,
      "priceCurrency": "USD",
      "price": product.price || "0.00",
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-blue-600 selection:text-white">
      <Navbar />
      
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-4 mb-12 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
            <Link href="/" className="hover:text-blue-600 transition">HOME</Link>
            <i className="fas fa-chevron-right text-[8px] opacity-30"></i>
            <Link href="/products" className="hover:text-blue-600 transition">PRODUCTS</Link>
            <i className="fas fa-chevron-right text-[8px] opacity-30"></i>
            <span className="text-slate-900">{product.cat}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 mb-20">
            {/* Left: Gallery System (Approx 40%) */}
            <div className="lg:col-span-5 space-y-6 animate-in slide-in-from-left-8 duration-700">
              <div className="relative aspect-square rounded-[48px] overflow-hidden bg-slate-50 border border-slate-100 group shadow-2xl shadow-slate-200/50">
                <Image 
                  src={activeImg || product.img} 
                  alt={product.alt || product.name} 
                  fill 
                  className="object-contain p-8 transition-all duration-1000 group-hover:scale-105"
                  priority
                />
                <div className="absolute top-8 right-8 bg-blue-600 text-white px-6 py-2 rounded-xl font-black uppercase text-[9px] tracking-widest z-10">
                  FACTORY DIRECT
                </div>
              </div>
              
              <div className="grid grid-cols-5 gap-3 px-1">
                <button 
                  onClick={() => setActiveImg(product.img)}
                  className={`relative aspect-square rounded-2xl overflow-hidden bg-slate-50 border-2 transition-all ${activeImg === product.img ? 'border-blue-600 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <Image src={product.img} alt="" fill className="object-contain p-1.5" />
                </button>
                {product.gallery?.map((g, i) => (
                  <button 
                    key={i}
                    onClick={() => setActiveImg(g)}
                    className={`relative aspect-square rounded-2xl overflow-hidden bg-slate-50 border-2 transition-all ${activeImg === g ? 'border-blue-600 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <Image src={g} alt="" fill className="object-contain p-1.5" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Essential Info (Approx 60%) */}
            <div className="lg:col-span-7 flex flex-col justify-center animate-in slide-in-from-right-8 duration-700">
              <div className="inline-flex items-center gap-3 bg-blue-50 text-blue-600 px-5 py-2 rounded-full font-black uppercase text-[9px] tracking-[0.2em] mb-6 w-fit shadow-sm shadow-blue-100">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> {product.cat}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-slate-900 leading-tight mb-4">
                {product.name}
              </h1>

              {product.summary && (
                <p className="text-xl text-slate-500 font-bold mb-8 leading-relaxed italic border-l-4 border-blue-600 pl-6">
                  {product.summary}
                </p>
              )}

              {/* Core SEO Keywords Display */}
              {product.keywords && product.keywords.length > 0 && (
                 <div className="flex flex-wrap gap-2 mb-8">
                    {product.keywords.map((kw, i) => (
                       <span key={i} className="bg-slate-100 text-slate-500 px-3 py-1 rounded-lg font-black uppercase text-[8px] tracking-[0.2em]">
                          #{kw}
                       </span>
                    ))}
                 </div>
              )}

              <div className="grid grid-cols-2 gap-8 mb-10 border-y border-slate-100 py-8">
                <div>
                  <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] mb-2">Global Standard</h4>
                  <p className="text-lg font-black uppercase text-slate-900">{product.spec}</p>
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] mb-2">Production Power</h4>
                  <p className="text-lg font-black uppercase text-slate-900">1M+ PCS / Month</p>
                </div>
              </div>

              {/* Description Section - Moved here per User Request */}
              <div className="mb-10 max-h-[400px] overflow-y-auto no-scrollbar pr-4 border-b border-slate-50 pb-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white text-[10px]"><i className="fas fa-file-alt"></i></div>
                  <h3 className="text-[10px] font-black uppercase text-slate-900 tracking-[0.3em]">Quick Specifications</h3>
                </div>
                <div 
                  className="prose prose-slate max-w-none backend-rich-text text-base leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <button 
                  onClick={() => {
                    const el = document.getElementById('inquiry-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex-1 bg-blue-600 text-white py-5 rounded-[24px] font-black uppercase tracking-[0.3em] text-[10px] shadow-xl shadow-blue-500/30 hover:bg-slate-900 transition-all flex items-center justify-center gap-4 group"
                >
                  <i className="fas fa-paper-plane text-[10px] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"></i>
                  GET INSTANT QUOTATION
                </button>
                <div className="flex items-center gap-4 py-4 px-6 bg-slate-50 rounded-[24px] border border-slate-100">
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-xl border-2 border-white bg-slate-200 overflow-hidden relative shadow-sm"><Image src={`https://images.unsplash.com/photo-${1500000000000+i}?auto=format&fit=crop&q=80&w=100`} alt="" fill className="object-cover" /></div>)}
                  </div>
                  <p className="text-[8px] font-black uppercase text-slate-400 tracking-[0.1em]">500+ Distributors</p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Content Tabs (Filtered) */}
          <div className="mb-32">
            <div className="flex flex-wrap gap-2 md:gap-4 mb-12 border-b border-slate-100 pb-8 overflow-x-auto no-scrollbar">
              {['technical', 'quality', 'logistics'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-10 py-4 rounded-[24px] font-black uppercase text-[10px] tracking-[0.4em] transition-all whitespace-nowrap ${activeTab === tab ? 'bg-slate-900 text-white shadow-2xl -translate-y-1' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-[400px]">
              {activeTab === 'technical' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                   {product.specs && product.specs.length > 0 ? (
                      product.specs.map((s, i) => (
                        <div key={i} className="p-8 border border-slate-100 rounded-[32px] hover:shadow-xl transition-all group">
                           <h4 className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-[0.3em] group-hover:text-blue-600 transition-colors">{s.key}</h4>
                           <p className="text-xl font-black uppercase text-slate-900">{s.value}</p>
                        </div>
                      ))
                   ) : (
                      ['Material Grade', 'Thread Precision', 'Surface Finish', 'Tensile Strength', 'Hardness', 'Tolerance'].map(t => (
                        <div key={t} className="p-8 border border-slate-100 rounded-[32px] hover:shadow-xl transition-all group">
                           <h4 className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-[0.3em] group-hover:text-blue-600 transition-colors">{t}</h4>
                           <p className="text-xl font-black uppercase text-slate-900">Industrial Standard</p>
                        </div>
                      ))
                   )}
                </div>
              )}
              {activeTab === 'quality' && (
                <div className="bg-slate-900 rounded-[64px] p-16 text-white relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-[120px]"></div>
                   <div className="relative z-10 max-w-3xl">
                      <h3 className="text-5xl font-black uppercase tracking-tighter mb-8 leading-none">Zero-Defect Commitment</h3>
                      <p className="text-slate-400 text-lg leading-loose font-medium mb-12">Our QA center is equipped with advanced testing machines including salt spray testers, tensile strength machines, and image measurement systems to ensure every batch meets your rigid requirements.</p>
                      <div className="grid grid-cols-2 gap-8">
                         <div className="flex items-center gap-6"><div className="w-16 h-16 rounded-[24px] bg-blue-600 flex items-center justify-center text-3xl"><i className="fas fa-shield-alt"></i></div> <span className="text-xs font-black uppercase tracking-widest">ISO 9001 Certified</span></div>
                         <div className="flex items-center gap-6"><div className="w-16 h-16 rounded-[24px] bg-blue-600 flex items-center justify-center text-3xl"><i className="fas fa-microscope"></i></div> <span className="text-xs font-black uppercase tracking-widest">Lab Testing Avail.</span></div>
                      </div>
                   </div>
                </div>
              )}
              {activeTab === 'logistics' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                   <div className="bg-slate-50 p-12 rounded-[56px] shadow-inner">
                      <h3 className="text-2xl font-black uppercase tracking-tighter mb-8">Global Shipping Support</h3>
                      <div className="space-y-6">
                         {['Sea Freight (FOB/CIF)', 'Air Express (Door-to-Door)', 'Rail Transport (Eurasia)', 'Customized Packaging'].map(l => (
                            <div key={l} className="flex items-center justify-between p-6 bg-white rounded-3xl shadow-sm border border-slate-100">
                               <span className="font-black uppercase text-[10px] tracking-widest text-slate-700">{l}</span>
                               <i className="fas fa-check-circle text-blue-600"></i>
                            </div>
                         ))}
                      </div>
                   </div>
                   <div className="flex flex-col justify-center">
                      <h4 className="text-[11px] font-black uppercase text-blue-600 tracking-[0.4em] mb-6">Standard Lead Time</h4>
                      <p className="text-6xl font-black uppercase tracking-tighter mb-8">15-30 DAYS</p>
                      <p className="text-slate-500 font-medium leading-loose text-lg">We maintain high stock levels for standard items to ensure 72-hour fast delivery for global partners.</p>
                   </div>
                </div>
              )}
            </div>
          </div>

          {/* Inquiry Section */}
          <section id="inquiry-section" className="bg-white border-[12px] border-slate-50 rounded-[80px] p-12 md:p-24 shadow-2xl animate-in fade-in duration-1000 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/5 rounded-full -translate-x-32 -translate-y-32 blur-[100px] group-hover:scale-110 transition-transform duration-1000"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 relative z-10">
              <div>
                <h2 className="text-6xl font-black uppercase tracking-tighter mb-8 leading-none">Request a<br /><span className="text-blue-600">Direct Quote</span></h2>
                <p className="text-slate-500 text-xl font-medium leading-relaxed mb-12">Connect with our factory experts now. We provide professional fastener solutions and competitive B2B pricing within 24 hours.</p>
                <div className="space-y-8">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-[28px] bg-slate-900 flex items-center justify-center text-white text-2xl shadow-xl shadow-slate-200"><i className="fab fa-whatsapp"></i></div>
                    <div>
                      <h5 className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Instant Response</h5>
                      <p className="text-lg font-black uppercase">{settings?.whatsapp || '+86 123 4567 8900'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-[28px] bg-blue-600 flex items-center justify-center text-white text-2xl shadow-xl shadow-blue-200"><i className="far fa-envelope"></i></div>
                    <div>
                      <h5 className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Sales Inquiries</h5>
                      <p className="text-lg font-black uppercase">{settings?.contactEmail || 'sales@highfasteners.com'}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-12 md:p-16 rounded-[64px] border border-slate-100 shadow-2xl relative group">
                <InquiryForm productType={`Inquiry for: ${product.name}`} />
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
