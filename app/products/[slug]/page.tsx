// app/products/[slug]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useProducts, Product } from '../../context/ProductContext';
import { supabase } from '@/lib/supabase';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import InquiryForm from '../../components/InquiryForm';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { products } = useProducts();
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImg, setActiveImg] = useState<string>('');
  
  useEffect(() => {
    const p = products.find(item => item.seoSlug === slug || item.id.toString() === slug);
    if (p) {
      setProduct(p);
      setActiveImg(p.img);
    }
  }, [slug, products]);

  // WhatsApp 自动分流跳转逻辑
  const handleWhatsAppClick = async () => {
    try {
      const { data: accounts, error } = await supabase
        .from('whatsapp_accounts')
        .select('phone')
        .eq('is_active', true);

      if (error || !accounts || accounts.length === 0) {
        alert("Customer service is currently busy. Please fill out the inquiry form below.");
        return;
      }

      // 随机分配
      const randomIndex = Math.floor(Math.random() * accounts.length);
      const selectedPhone = accounts[randomIndex].phone;

      const message = encodeURIComponent(`Hi, I'm checking this product: ${product?.name}. Please send me the catalog and price. ${window.location.origin}/products/${product?.seoSlug}`);
      window.open(`https://wa.me/${selectedPhone}?text=${message}`, '_blank');
    } catch (err) {
      console.error("WhatsApp Link Error:", err);
    }
  };

  if (!product) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          {/* 面包屑 */}
          <nav className="flex items-center gap-4 mb-10 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
            <Link href="/" className="hover:text-blue-600 transition">HOME</Link>
            <i className="fas fa-chevron-right text-[8px] opacity-30"></i>
            <Link href="/products" className="hover:text-blue-600 transition">PRODUCTS</Link>
            <i className="fas fa-chevron-right text-[8px] opacity-30"></i>
            <span className="text-slate-900">{product.cat}</span>
          </nav>

          {/* 第一部分：核心展示区 (40/60 比例) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 mb-24">
            
            {/* 左侧：精美大图 (40%) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="relative aspect-square rounded-[56px] overflow-hidden bg-slate-50 border border-slate-100 shadow-2xl shadow-slate-200/50 group">
                <Image 
                  src={activeImg || product.img} 
                  alt={product.name} 
                  fill 
                  className="object-contain p-12 transition-transform duration-1000 group-hover:scale-105"
                  priority
                />
              </div>
              <div className="flex gap-4 px-2 overflow-x-auto no-scrollbar">
                {[product.img, ...(product.gallery || [])].map((img, i) => img && (
                  <button 
                    key={i}
                    onClick={() => setActiveImg(img)}
                    className={`w-20 h-20 flex-shrink-0 relative rounded-[24px] overflow-hidden border-2 transition-all ${activeImg === img ? 'border-blue-600 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <Image src={img} alt="" fill className="object-cover p-2" />
                  </button>
                ))}
              </div>
            </div>

            {/* 右侧：核心信息区 (60%) */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full font-black text-[9px] tracking-widest mb-8 w-fit shadow-sm">
                CERTIFIED INDUSTRIAL FASTENERS
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-none mb-10 text-slate-900">
                {product.name}
              </h1>

              {/* 你要求的白色圆角三栏卡片样式 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/20 group hover:-translate-y-1 transition-all">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 group-hover:text-blue-600 transition-colors">Product Name</p>
                   <p className="text-xs font-black text-slate-900 uppercase">
                     {product.name.split('|')[0].trim()}
                   </p>
                </div>
                <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/20 group hover:-translate-y-1 transition-all">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 group-hover:text-blue-600 transition-colors">Application</p>
                   <p className="text-xs font-black text-slate-900 uppercase truncate">
                     Industrial, Machinery
                   </p>
                </div>
                <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/20 group hover:-translate-y-1 transition-all">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 group-hover:text-blue-600 transition-colors">Finish</p>
                   <p className="text-xs font-black text-slate-900 uppercase">
                     {product.specs?.find(s => s.key.toLowerCase().includes('finish'))?.value || 'Polished'}
                   </p>
                </div>
              </div>

              {/* 特色短描述 */}
              {product.summary && (
                <div className="mb-12 border-l-8 border-blue-600 pl-8">
                  <p className="text-2xl text-slate-500 font-bold italic leading-relaxed">
                    "{product.summary}"
                  </p>
                </div>
              )}

              {/* 核心操作按钮：并排分布 */}
              <div className="flex flex-col sm:flex-row gap-5">
                <button 
                  onClick={() => document.getElementById('inquiry-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex-1 bg-blue-600 text-white py-7 rounded-[32px] font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl shadow-blue-500/30 hover:bg-slate-900 transition-all flex items-center justify-center gap-4 group"
                >
                  <i className="fas fa-paper-plane group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"></i>
                  GET INSTANT QUOTE
                </button>
                <button 
                  onClick={handleWhatsAppClick}
                  className="flex-1 bg-[#25D366] text-white py-7 rounded-[32px] font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl shadow-green-500/30 hover:bg-slate-900 transition-all flex items-center justify-center gap-4 group"
                >
                  <i className="fab fa-whatsapp text-xl group-hover:scale-125 transition-transform"></i>
                  WHATSAPP SALES
                </button>
              </div>
            </div>
          </div>

          {/* 第二部分：详细展示区 (全宽，位于下方) */}
          <div className="border-t-2 border-slate-50 pt-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
              
              {/* 左侧：长篇大论详情 (8列) */}
              <div className="lg:col-span-8">
                <div className="flex items-center gap-6 mb-16">
                   <div className="w-12 h-12 rounded-[20px] bg-slate-900 flex items-center justify-center text-white text-lg"><i className="fas fa-file-alt"></i></div>
                   <h2 className="text-3xl font-black uppercase tracking-tighter">Product Deep Dive</h2>
                </div>
                <article className="prose prose-slate max-w-none backend-rich-text prose-img:rounded-[48px] prose-headings:font-black prose-headings:uppercase prose-p:text-slate-500 prose-p:leading-loose">
                  <div dangerouslySetInnerHTML={{ __html: product.description }} />
                </article>
              </div>

              {/* 右侧：技术参数表 (4列) - 吸顶 */}
              <div className="lg:col-span-4">
                <div className="sticky top-32 space-y-8">
                  <div className="bg-slate-50 p-12 rounded-[64px] border border-slate-100 shadow-inner">
                    <h3 className="text-[10px] font-black uppercase text-blue-600 tracking-[0.4em] mb-10 flex items-center gap-3">
                       <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span> Technical Details
                    </h3>
                    <div className="space-y-6">
                      {product.specs?.map((s, i) => (
                        <div key={i} className="flex justify-between items-center border-b border-slate-200/50 pb-5">
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{s.key}</span>
                          <span className="text-xs font-black text-slate-900 uppercase">{s.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 信任背书卡片 */}
                  <div className="bg-slate-900 p-10 rounded-[56px] text-white relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full translate-x-10 -translate-y-10 blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
                     <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 text-blue-400">Quality Verified</h4>
                     <p className="text-sm font-bold leading-relaxed mb-8 opacity-70">"Every piece of fastener undergoes rigid inspection to meet global ISO/DIN standards."</p>
                     <div className="flex items-center gap-4">
                        <div className="flex -space-x-3">
                           {[1,2,3].map(i => <div key={i} className="w-10 h-10 rounded-xl border-4 border-slate-900 bg-slate-800 overflow-hidden relative"><Image src={`https://images.unsplash.com/photo-${1500000000000+i}?auto=format&fit=crop&q=80&w=100`} alt="" fill /></div>)}
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-40">10k+ Global Clients</span>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 底部的询盘表单 */}
          <section id="inquiry-section" className="mt-40">
             <div className="bg-blue-600 rounded-[100px] p-12 md:p-24 text-white relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-slate-900/10 rounded-full -translate-x-1/2 translate-y-1/2 blur-[120px]"></div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 relative z-10">
                   <div>
                      <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-10">Let's Build<br /><span className="text-slate-900">Better.</span></h2>
                      <p className="text-blue-100 text-xl font-medium leading-relaxed mb-16 max-w-md">Ready to scale your supply chain? Our expert team is standing by to provide a tailored quotation for your project.</p>
                      <div className="grid grid-cols-2 gap-10">
                        <div>
                           <div className="text-4xl font-black mb-2">24H</div>
                           <div className="text-[9px] font-black uppercase tracking-[0.3em] opacity-60">Rapid Response</div>
                        </div>
                        <div>
                           <div className="text-4xl font-black mb-2">FREE</div>
                           <div className="text-[9px] font-black uppercase tracking-[0.3em] opacity-60">Tech Support</div>
                        </div>
                      </div>
                   </div>
                   <div className="bg-white p-12 md:p-16 rounded-[72px] shadow-2xl text-slate-900">
                      <InquiryForm productType={`Inquiry for: ${product.name}`} />
                   </div>
                </div>
             </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
