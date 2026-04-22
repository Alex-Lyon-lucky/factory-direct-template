// app/page.tsx
'use client';

import { useProducts } from './context/ProductContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DynamicRenderer from './components/DynamicRenderer';

export default function Home() {
  const { pages, products, categories } = useProducts();

  if (!pages) return <div className="min-h-screen bg-slate-900 flex items-center justify-center"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <main className="relative bg-white min-h-screen">
      <Navbar />
      
      {/* 首页全积木化渲染 */}
      <DynamicRenderer 
        blocks={pages.home || []} 
        products={products}
        categories={categories}
      />

      <Footer />
    </main>
  );
}
