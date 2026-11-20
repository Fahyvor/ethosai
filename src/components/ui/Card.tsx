import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  tag?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', tag }) => {
  return (
    <div
      className={`relative bg-[#101319] border border-[#1f2533] rounded-[6px] p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.5)] transition-all ${className}`}
    >
      {tag && (
        <div className="absolute top-0 right-4 -translate-y-1/2 px-2 py-0.5 bg-[#090b0e] border border-[#2b3345] text-[10px] font-mono tracking-widest text-slate-400 uppercase rounded-[3px]">
          {tag}
        </div>
      )}
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  badge?: React.ReactNode;
}> = ({ title, subtitle, action, badge }) => (
  <div className="flex items-start justify-between pb-4 mb-4 border-b border-[#1c2230]">
    <div>
      <div className="flex items-center gap-2.5">
        <h3 className="text-base font-semibold text-white tracking-tight">{title}</h3>
        {badge}
      </div>
      {subtitle && <p className="text-xs text-slate-400 mt-1 font-normal leading-relaxed">{subtitle}</p>}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);
