// app/products/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import { useProducts } from '../context/ProductContext';

export default function ProductsPage() {
  const { categories, products, pages } = useProducts();

  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredProducts, setFilteredProducts] = useState(products);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCat, searchTerm]);

  useEffect(() => {
    let result = products;
    if (selectedCat !== 'All') {
      result = result.filter(p => p.cat === selectedCat);
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.spec.toLowerCase().includes(term) ||
        (p.description && p.description.toLowerCase().includes(term)) ||
        (p.keywords && p.keywords.some(k => k.toLowerCase().includes(term)))
      );
    }
    setFilteredProducts(result);
  }, [selectedCat, searchTerm, products]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentItems = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const headerData = pages?.products || {
    title: "Industrial Product Center",
    subtitle: "Global Standards, Direct From Handan Factory Floor.",
    headerHeight: 200,
    bgMode: "color",
    bgColor: "#0f172a"
  };

  return (
    <Layout>
      <PageHeader data={headerData} />

      <main className="max-w-7xl mx-auto px-6 py-12 flex-1 w-full min-h-screen">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar - Category Filter */}
          <aside className="lg:w-72 space-y-8">
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm sticky top-28 overflow-hidden group">
              {/* Decorative light effect */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-full translate-x-12 -translate-y-12 transition-transform duration-1000 group-hover:scale-150"></div>
              
              <div className="relative group mb-8">
                 <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 text-xs group-focus-within:text-blue-500 transition-colors"></i>
                 <input 
                  type="text" 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="SEARCH..." 
                  className="w-full bg-slate-50/80 border-none text-slate-900 rounded-[18px] pl-12 pr-4 py-3.5 font-bold text-[10px] focus:bg-white focus:ring-4 ring-blue-500/10 transition-all tracking-widest uppercase"
                 />
              </div>

              <h3 className="font-bold text-sm mb-6 uppercase tracking-widest border-b border-slate-50 pb-4 relative z-10 text-slate-900">
                CATEGORIES
              </h3>
              
              <div className="flex flex-col gap-1.5 relative z-10">
                <button
                  onClick={() => setSelectedCat('All')}
                  className={`w-full text-left px-6 py-3.5 rounded-[18px] font-bold uppercase text-[10px] tracking-[0.2em] transition-all ${
                    selectedCat === 'All' 
                      ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 translate-x-1' 
                      : 'hover:bg-slate-50 text-slate-400 hover:text-slate-900'
                  }`}
                >
                  All Hardware
                </button>

                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCat(cat.value)}
                    className={`w-full text-left px-6 py-3.5 rounded-[18px] font-bold uppercase text-[10px] tracking-[0.2em] transition-all ${
                      selectedCat === cat.value 
                        ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 translate-x-1' 
                        : 'hover:bg-slate-50 text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 animate-in slide-in-from-bottom-8 duration-1000">
              {currentItems.length > 0 ? (
                currentItems.map((product) => (
                  <Link 
                    key={product.id} 
                    href={`/products/${product.id}`}
                    className="bg-white rounded-[40px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col group cursor-pointer relative"
                  >
                    {/* Square Image container - reduced padding for better fit */}
                    <div className="aspect-square relative overflow-hidden bg-slate-50/30 p-8 shadow-inner group-hover:bg-white transition-colors duration-500">
                      <Image 
                        src={product.img} 
                        alt={product.name} 
                        fill 
                        className="object-contain p-6 group-hover:scale-110 transition-transform duration-1000" 
                      />
                      
                      {/* Industrial Tag Overlay */}
                      <div className="absolute top-6 left-6 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-[7px] font-bold uppercase tracking-widest shadow-xl">FACTORY DIRECT</span>
                      </div>
                    </div>

                    {/* Content Section - Compact and Clean */}
                    <div className="p-8 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-2.5">
                          <div className="w-4 h-[2px] bg-blue-600"></div>
                          <p className="text-blue-600 text-[9px] font-bold uppercase tracking-[0.3em]">{product.cat}</p>
                      </div>
                      
                      <h4 className="text-base font-bold uppercase tracking-tight text-slate-900 mb-2 leading-tight group-hover:text-blue-600 transition duration-300">
                        {product.name}
                      </h4>
                      
                      <p className="text-slate-400 text-[10px] line-clamp-2 font-medium uppercase tracking-wider opacity-60 leading-relaxed mb-6">
                        {product.spec} | HIGH-PERFORMANCE FASTENER
                      </p>

                      <div className="mt-auto pt-5 flex justify-between items-center border-t border-slate-50">
                        <div className="flex flex-col">
                           <span className="text-[7px] font-bold text-slate-300 uppercase tracking-widest mb-0.5">Specifications</span>
                           <span className="text-[10px] font-bold text-slate-900 uppercase tracking-tighter">{product.spec}</span>
                        </div>
                        <div className="w-10 h-10 bg-slate-50 text-slate-300 rounded-[14px] flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all duration-300 shadow-sm group-hover:scale-110">
                          <i className="fas fa-arrow-right text-[10px]"></i>
                        </div>
                      </div>
                    </div>
                    
                    {/* Bottom Border Accent */}
                    <div className="absolute bottom-0 left-0 h-1 w-0 bg-blue-600 transition-all duration-700 group-hover:w-full"></div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full py-32 text-center bg-slate-50 rounded-[64px] border-2 border-dashed border-slate-200 text-slate-300 font-bold uppercase tracking-widest animate-pulse">
                   <i className="fas fa-search text-5xl mb-6 opacity-20 block"></i>
                   No hardware matches your search
                </div>
              )}
            </div>

            {/* Pagination Controls - Refined */}
            {totalPages > 1 && (
               <div className="mt-16 flex justify-center items-center gap-3">
                  {[...Array(totalPages)].map((_, i) => (
                    <button 
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-11 h-11 rounded-xl font-bold text-xs transition-all ${
                        currentPage === i + 1 
                          ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 -translate-y-1' 
                          : 'bg-white border border-slate-100 text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
               </div>
            )}
          </div>
        </div>
      </main>
    </Layout>
  );
}
