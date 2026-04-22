// app/components/ModuleTitle.tsx
'use client';

interface ModuleTitleProps {
  title?: string;
  subtitle?: string;
  titleColor?: string;
  subtitleColor?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export default function ModuleTitle({ 
  title, 
  subtitle, 
  titleColor, 
  subtitleColor, 
  align = 'center',
  className = ''
}: ModuleTitleProps) {
  if (!title && !subtitle) return null;

  const alignClass = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end'
  }[align];

  const marginClass = {
    left: 'mr-auto ml-0',
    center: 'mx-auto',
    right: 'ml-auto mr-0'
  }[align];

  // Helper to handle both Tailwind classes and HEX colors
  const getStyle = (val?: string) => {
    if (!val) return {};
    if (val.startsWith('#')) return { color: val };
    return {};
  };

  const getClass = (val?: string, defaultClass: string = '') => {
    if (!val || val.startsWith('#')) return defaultClass;
    return val;
  };

  return (
    <div className={`flex flex-col mb-16 md:mb-20 ${alignClass} ${className}`}>
      {title && (
        <h2 
          className={`text-4xl md:text-5xl lg:text-7xl font-black uppercase tracking-tighter mb-6 leading-[0.9] ${getClass(titleColor, 'text-slate-900')}`}
          style={getStyle(titleColor)}
        >
          {title}
        </h2>
      )}
      <div className={`w-24 h-2 bg-blue-600 mb-8 shadow-sm ${marginClass}`}></div>
      {subtitle && (
        <p 
          className={`text-[10px] md:text-xs font-black uppercase tracking-[0.4em] max-w-2xl leading-relaxed ${getClass(subtitleColor, 'text-slate-400')}`}
          style={getStyle(subtitleColor)}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
