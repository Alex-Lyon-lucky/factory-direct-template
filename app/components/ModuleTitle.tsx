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
  titleColor = 'text-slate-900', 
  subtitleColor = 'text-slate-400', 
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

  return (
    <div className={`flex flex-col mb-16 md:mb-20 ${alignClass} ${className}`}>
      {title && (
        <h2 className={`text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6 leading-[0.9] ${titleColor}`}>
          {title}
        </h2>
      )}
      {subtitle && (
        <div className={`w-20 h-1.5 bg-blue-600 mb-6 ${marginClass}`}></div>
      )}
      {subtitle && (
        <p className={`text-[10px] md:text-xs font-black uppercase tracking-[0.4em] max-w-2xl ${subtitleColor}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
