// app/components/PageHeader.tsx
'use client';

import Image from 'next/image';

interface PageHeaderProps {
  data: {
    title?: string;
    heroTitle?: string;
    subtitle?: string;
    heroImg?: string;
    headerHeight?: number;
    bgMode?: string; // 宽泛类型，解决部署时的严格匹配问题
    bgColor?: string;
  };
}

export default function PageHeader({ data }: PageHeaderProps) {
  const height = data.headerHeight || 200;
  const isImageMode = data.bgMode === 'image';
  const title = data.title || data.heroTitle || 'Page Title';
  const subtitle = data.subtitle || '';

  return (
    <header 
      className="relative flex items-center justify-center overflow-hidden transition-all duration-700 pt-20"
      style={{ 
        height: `${height}px`,
        backgroundColor: data.bgColor || '#0f172a'
      }}
    >
      {isImageMode && data.heroImg && (
        <>
          <Image 
            src={data.heroImg} 
            alt={title} 
            fill 
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"></div>
        </>
      )}
      
      {/* Decorative accents */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full translate-x-32 -translate-y-32 blur-[80px]"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/5 rounded-full -translate-x-32 translate-y-32 blur-[80px]"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter leading-none mb-3">
          {title}
        </h2>
        {subtitle && (
          <p className="text-blue-400 font-bold uppercase tracking-[0.4em] text-[8px] md:text-[10px] opacity-80 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
}
