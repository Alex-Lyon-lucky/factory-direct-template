// app/components/Footer.tsx
'use client';

import Link from 'next/link';
import { useProducts } from '../context/ProductContext';

export default function Footer() {
  const { settings } = useProducts();

  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-8 px-4 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 sm:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">HF</div>
            <span className="text-2xl font-black tracking-tighter uppercase text-slate-900">{settings?.siteName || 'High Fasteners'}</span>
          </div>
          <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-sm">
            {settings?.siteDescription || 'A leader in fastener manufacturing for over 20 years, serving the global markets with precision-engineered products.'}
          </p>
        </div>

        <div>
          <h4 className="font-black uppercase text-xs tracking-[0.2em] text-slate-400 mb-6">Quick Links</h4>
          <ul className="space-y-3 font-bold text-sm text-slate-600">
            <li><Link href="/products" className="hover:text-blue-600 transition">All Products</Link></li>
            <li><Link href="/news" className="hover:text-blue-600 transition">Company News</Link></li>
            <li><Link href="/about" className="hover:text-blue-600 transition">Factory Tour</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-black uppercase text-xs tracking-[0.2em] text-slate-400 mb-6">Contact Us</h4>
          <ul className="space-y-3 font-bold text-sm text-slate-600">
            <li className="flex items-center gap-3">
              <i className="fab fa-whatsapp text-blue-600 text-lg w-5"></i> {settings?.whatsapp || '+86 123 4567 8900'}
            </li>
            <li className="flex items-center gap-3">
              <i className="far fa-envelope text-blue-600 w-5"></i> {settings?.contactEmail || 'sales@highfasteners.com'}
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-100 pt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          &copy; 2026 {settings?.siteName || 'Hangfan Fasteners'}. Made for Excellence.
        </p>
      </div>
    </footer>
  );
}
