// app/admin/page.tsx
'use client';

import { useProducts } from '../context/ProductContext';
import Link from 'next/link';
import AnalyticsDashboard from './dashboard/AnalyticsDashboard';

export default function AdminDashboard() {
  const { products, news, inquiries, categories } = useProducts();

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20 px-4">
      <AnalyticsDashboard />
    </div>
  );
}
