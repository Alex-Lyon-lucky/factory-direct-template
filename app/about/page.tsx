// app/about/page.tsx
'use client';

import { useProducts } from '../context/ProductContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageHeader from '../components/PageHeader';
import DynamicRenderer from '../components/DynamicRenderer';

export default function About() {
  const { pages, products, categories } = useProducts();

  if (!pages || !pages.about) return <div className="min-h-screen bg-slate-900 flex items-center justify-center"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <main className="relative bg-white min-h-screen">
      <Navbar />
      
      {/* Dynamic Header */}
      <PageHeader 
        config={pages.about.header} 
        defaultTitle="About Our Factory" 
      />

      {/* Dynamic Blocks for About Page */}
      <DynamicRenderer 
        blocks={pages.about.blocks || []} 
        products={products}
        categories={categories}
      />

      <Footer />
    </main>
  );
}
