// app/admin/products/edit/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useProducts } from '../../../../context/ProductContext';
import ProductForm from '../../ProductForm';

export default function EditProductPage() {
  const params = useParams();
  const id = parseInt(params.id as string);
  const { products } = useProducts();
  const product = products.find(p => p.id === id);

  if (!product && products.length > 0) return <div className="p-20 text-center font-black uppercase italic text-slate-300">产品未找到</div>;
  if (products.length === 0) return <div className="p-20 text-center font-black uppercase italic text-slate-300">正在加载产品数据...</div>;

  return <ProductForm initialData={product} />;
}
