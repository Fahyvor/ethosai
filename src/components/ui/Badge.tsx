import React from 'react';

interface BadgeProps {
  level?: 'unacceptable' | 'high' | 'limited' | 'minimal' | string;
  className?: string;
  children?: React.ReactNode;
}

export const RiskBadge: React.FC<BadgeProps> = ({ level, className = '', children }) => {
  const normalized = (level || '').toLowerCase();
  
  let styles = 'bg-slate-800 text-slate-300 border-slate-700';
  let label = children || level || 'Unknown';

  if (normalized === 'unacceptable') {
    styles = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    label = children || 'Unacceptable Risk';
  } else if (normalized === 'high') {
    styles = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    label = children || 'High Risk';
  } else if (normalized === 'limited') {
    styles = 'bg-sky-500/10 text-sky-400 border-sky-500/30';
    label = children || 'Limited Risk';
  } else if (normalized === 'minimal') {
    styles = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    label = children || 'Minimal Risk';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {label}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: string; className?: string }> = ({ status, className = '' }) => {
  const norm = status.toLowerCase();
  let styles = 'bg-slate-800 text-slate-300 border-slate-700';
  
  if (norm === 'approved' || norm === 'completed') {
    styles = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  } else if (norm === 'under_assessment' || norm === 'in_progress') {
    styles = 'bg-sky-500/10 text-sky-400 border-sky-500/30';
  } else if (norm === 'registered' || norm === 'draft') {
    styles = 'bg-slate-700/30 text-slate-400 border-slate-700';
  } else if (norm === 'rejected') {
    styles = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border capitalize ${styles} ${className}`}>
      {norm.replace('_', ' ')}
    </span>
  );
};
