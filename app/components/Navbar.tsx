// app/components/Navbar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useProducts } from '../context/ProductContext';

export default function Navbar() {
  const { categories, settings } = useProducts();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => setIsDrawerOpen(open);

  return (
    <>
      <nav className="sticky top-0 z-[1000] h-20 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg font-bold text-xl">HF</div>
            <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{settings?.siteName || 'High Fasteners'}</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 font-bold text-sm uppercase tracking-widest">
            <Link href="/" className="text-blue-600 hover:text-blue-600 transition">Home</Link>
            
            <div className="relative group h-20 flex items-center">
              <Link href="/products" className="text-slate-600 group-hover:text-blue-600 flex items-center gap-1 transition">
                Products <i className="fas fa-chevron-down text-[10px] mt-0.5"></i>
              </Link>
              <div className="dropdown-content absolute top-20 left-0 w-64 bg-white shadow-2xl rounded-2xl border border-slate-100 p-4 hidden group-hover:block">
                <div className="flex flex-col gap-1">
                  {categories.map((cat) => (
                    <Link 
                      key={cat.id}
                      href={`/products?cat=${cat.value}`} 
                      className="px-4 py-3 hover:bg-slate-50 rounded-xl transition text-slate-600 hover:text-blue-600 flex items-center justify-between"
                    >
                      <span>{cat.name}</span> <i className="fas fa-arrow-right text-[10px] opacity-20"></i>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link href="/news" className="text-slate-600 hover:text-blue-600 transition">News</Link>
            <Link href="/about" className="text-slate-600 hover:text-blue-600 transition">About Us</Link>
            <Link href="/inquiry" className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-slate-900 transition shadow-lg">Inquiry Now</Link>
          </div>

          <button onClick={() => toggleDrawer(true)} className="md:hidden p-2 text-slate-900">
            <i className="fas fa-bars-staggered text-xl"></i>
          </button>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      <div onClick={() => toggleDrawer(false)} className={`fixed inset-0 bg-slate-900/60 z-[1000] transition-opacity ${isDrawerOpen ? 'block' : 'hidden'}`}></div>
      <aside className={`fixed top-0 right-0 w-72 h-full bg-white z-[1001] shadow-2xl flex flex-col transition-transform duration-400 ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 flex justify-between items-center border-b border-slate-100">
          <span className="font-black uppercase text-blue-600 tracking-widest text-lg">Menu</span>
          <button onClick={() => toggleDrawer(false)} className="text-slate-400 text-3xl hover:text-red-500 transition">&times;</button>
        </div>
        <div className="flex flex-col p-6 gap-6 font-bold uppercase text-sm tracking-widest text-slate-600">
          <Link href="/" className="text-blue-600 flex items-center gap-4">
            <i className="fas fa-home w-5 text-center text-blue-400"></i> Home
          </Link>
          <Link href="/products" className="hover:text-blue-600 flex items-center gap-4">
            <i className="fas fa-box w-5 text-center text-slate-400"></i> Products
          </Link>
          <Link href="/news" className="hover:text-blue-600 flex items-center gap-4">
            <i className="fas fa-newspaper w-5 text-center text-slate-400"></i> News
          </Link>
          <Link href="/about" className="hover:text-blue-600 flex items-center gap-4">
            <i className="fas fa-info-circle w-5 text-center text-slate-400"></i> About Us
          </Link>
          <div className="border-t border-slate-100 pt-6 mt-2">
            <Link href="/inquiry" className="block w-full bg-blue-600 text-white py-4 rounded-2xl text-center shadow-lg hover:bg-slate-900 transition">
              <i className="fas fa-paper-plane mr-2"></i> Inquiry Now
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
