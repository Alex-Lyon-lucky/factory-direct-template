// app/admin/layout.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useProducts } from '../context/ProductContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { inquiries } = useProducts();
  const [collapsed, setCollapsed] = useState(false);
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    if (pathname === '/admin/login') {
      setIsAuth(true);
      return;
    }

    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/check');
        if (res.ok) {
          setIsAuth(true);
        } else {
          setIsAuth(false);
          router.push('/admin/login');
        }
      } catch (err) {
        setIsAuth(false);
        router.push('/admin/login');
      }
    };

    checkAuth();
  }, [pathname, router]);

  const SidebarItem = ({ href, icon, label, badge }: { href: string, icon: string, label: string, badge?: number }) => {
    const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href));
    return (
      <Link 
        href={href} 
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all group ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-500 hover:bg-slate-50'}`}
      >
        <i className={`${icon} w-5 text-center ${isActive ? 'text-white' : 'group-hover:text-blue-600'}`}></i>
        {!collapsed && <span className="font-bold text-sm flex-1 text-left">{label}</span>}
        {!collapsed && badge !== undefined && badge > 0 && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{badge}</span>}
      </Link>
    );
  };

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (isAuth === null) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isAuth === false) {
    return null; // Redirecting...
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      {/* 侧边栏 */}
      <aside className={`bg-white border-r border-slate-200 transition-all duration-300 ${collapsed ? 'w-20' : 'w-72'} flex flex-col z-50 shadow-2xl shadow-slate-200/50 h-screen sticky top-0`}>
        <div className="h-20 border-b border-slate-50 flex items-center justify-between px-6">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex-shrink-0 flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <i className="fas fa-bolt text-lg"></i>
            </div>
            {!collapsed && <span className="font-black text-xl tracking-tighter uppercase truncate">航帆 <span className="text-blue-600">OS</span></span>}
          </div>
          <button onClick={() => setCollapsed(!collapsed)} className="text-slate-400 hover:text-blue-600 transition">
            <i className={`fas ${collapsed ? 'fa-indent' : 'fa-outdent'}`}></i>
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto no-scrollbar">
          <SidebarItem href="/admin" icon="fas fa-chart-pie" label="控制中心" />
          
          <div className="pt-4 pb-2 px-4">
            {!collapsed && <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">系统管理</p>}
          </div>
          <SidebarItem href="/admin/settings" icon="fas fa-cog" label="基础设置" />
          <SidebarItem href="/admin/pages" icon="fas fa-pager" label="页面管理" />
          <SidebarItem href="/admin/config" icon="fas fa-key" label="密钥管理" />
          <div className="pt-4 pb-2 px-4">
            {!collapsed && <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">内容运营</p>}
          </div>
          <SidebarItem href="/admin/news" icon="fas fa-newspaper" label="文章动态管理" />
          <Link href="/admin/news/add" className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-slate-500 hover:bg-slate-50`}>
             <i className="fas fa-pen-nib w-5 text-center"></i>
             {!collapsed && <span className="font-bold text-sm">发布新文章</span>}
          </Link>

          <div className="pt-4 pb-2 px-4">
            {!collapsed && <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">产品中心</p>}
          </div>
          <SidebarItem href="/admin/products" icon="fas fa-boxes-stacked" label="产品列表管理" />
          <Link href="/admin/products/add" className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-slate-500 hover:bg-slate-50`}>
             <i className="fas fa-plus-circle w-5 text-center"></i>
             {!collapsed && <span className="font-bold text-sm">录入新产品</span>}
          </Link>
          <SidebarItem href="/admin/categories" icon="fas fa-tags" label="分类体系管理" />

          <div className="pt-4 pb-2 px-4">
            {!collapsed && <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">客户与素材</p>}
          </div>
          <SidebarItem href="/admin/inquiry" icon="fas fa-envelope" label="客户询盘处理" badge={inquiries.length} />
          <SidebarItem href="/admin/material" icon="fas fa-images" label="素材库管理" />
        </nav>

        <div className="p-4 border-t border-slate-50">
           <Link href="/" className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-blue-600 transition">
             <i className="fas fa-home w-5 text-center"></i>
             {!collapsed && <span className="font-bold text-sm">回网站首页</span>}
           </Link>
        </div>
      </aside>

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <div className="h-8 w-1 bg-blue-600 rounded-full"></div>
            <h1 className="font-black text-2xl uppercase tracking-tight text-slate-800">
               航帆后台管理系统
            </h1>
          </div>
          
          <div className="flex items-center gap-6">
             <button 
                onClick={async () => {
                   await fetch('/api/auth/logout', { method: 'POST' });
                   router.push('/admin/login');
                   router.refresh();
                }}
                className="text-slate-400 hover:text-red-500 transition text-[10px] font-black uppercase tracking-widest"
             >
                LOGOUT
             </button>
             <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                <i className="fas fa-user-shield"></i>
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 no-scrollbar bg-[#f8fafc]">
          {children}
        </main>
      </div>
    </div>
  );
}
