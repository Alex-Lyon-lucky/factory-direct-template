// app/components/PageHeader.tsx
'use client';

import Image from 'next/image';
import { PageHeaderConfig } from '../context/ProductContext';

interface PageHeaderProps {
  config?: PageHeaderConfig;
  defaultTitle: string;
}

export default function PageHeader({ config, defaultTitle }: PageHeaderProps) {
  const heightClasses = {
    compact: 'h-[30vh] min-h-[300px]',
    standard: 'h-[50vh] min-h-[450px]',
    hero: 'h-[80vh] min-h-[650px]'
  };

  const alignClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end'
  };

  const currentHeight = config?.height || 'standard';
  const textAlign = config?.align || 'center';

  return (
    <div className={`relative w-full overflow-hidden flex flex-col justify-center px-6 lg:px-24 ${heightClasses[currentHeight as keyof typeof heightClasses]} ${config?.bgColor || 'bg-[#0a0f1d]'} ${config?.textColor || 'text-white'}`}>
      
      {/* Background Image */}
      {config?.bgImg && (
        <>
          <Image 
            src={config.bgImg} 
            alt={config.title || defaultTitle} 
            fill 
            className="object-cover"
            priority
          />
          {/* Overlay to ensure text readability */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        </>
      )}

      {/* Content */}
      <div className={`relative z-10 w-full max-w-[1400px] mx-auto flex flex-col ${alignClasses[textAlign as keyof typeof alignClasses]}`}>
        <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] drop-shadow-2xl">
            {config?.title || defaultTitle}
          </h1>
          {config?.subtitle && (
            <p className="text-sm md:text-lg lg:text-xl font-medium opacity-80 leading-relaxed tracking-wide max-w-2xl">
              {config.subtitle}
            </p>
          )}
          
          {/* Decorative bar */}
          <div className={`h-2 w-24 bg-blue-600 rounded-full mt-8 ${textAlign === 'center' ? 'mx-auto' : textAlign === 'right' ? 'ml-auto' : ''}`} />
        </div>
      </div>

      {/* Bottom Gradients */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
    </div>
  );
}
