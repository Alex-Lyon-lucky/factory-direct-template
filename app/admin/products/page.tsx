// app/admin/products/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useProducts } from '../../context/ProductContext';

export default function ProductListPage() {
  const { products, deleteProduct } = useProducts();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
         <div>
            <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900">产品列表管理</h2>
            <p className="text-slate-400 text-sm font-bold mt-1">管理您在线展示的所有紧固件产品。</p>
         </div>
         <Link href="/admin/products/add" className="bg-blue-600 text-white px-8 py-4 rounded-[20px] font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition">
           + 录入新产品
         </Link>
      </div>
      
      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">产品详情</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">所属分类</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">规格参数</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">操作管理</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {products.map(prod => (
              <tr key={prod.id} className="hover:bg-slate-50/50 transition group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 relative rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 group-hover:scale-110 transition duration-500 shadow-sm">
                      <Image src={prod.img} alt="" fill className="object-cover" />
                    </div>
                    <div>
                       <div className="font-black text-slate-900 uppercase leading-none mb-1">{prod.name}</div>
                       <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {prod.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest">{prod.cat}</span>
                </td>
                <td className="px-8 py-6 text-sm text-slate-500 font-bold">{prod.spec}</td>
                <td className="px-8 py-6 text-right">
                  <Link href={`/admin/products/edit/${prod.id}`} className="inline-flex w-10 h-10 rounded-xl bg-slate-50 text-slate-400 items-center justify-center hover:bg-blue-600 hover:text-white mr-2 transition"><i className="fas fa-edit"></i></Link>
                  <button onClick={() => { if(confirm('确定删除该产品？')) deleteProduct(prod.id); }} className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-500 hover:text-white transition"><i className="fas fa-trash"></i></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
           <div className="py-32 text-center text-slate-300 font-black uppercase tracking-widest">暂无产品数据</div>
        )}
      </div>
    </div>
  );
}
