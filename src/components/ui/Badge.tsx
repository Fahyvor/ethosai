import React from 'react';

interface BadgeProps {
  level?: 'unacceptable' | 'high' | 'limited' | 'minimal' | string;
  className?: string;
  children?: React.ReactNode;
}

export const RiskBadge: React.FC<BadgeProps> = ({ level, className = '', children }) => {
  const normalized = (level || '').toLowerCase();

  let styles = 'bg-[#181c24] text-slate-300 border-[#2a3140]';
  let prefix = 'RISK';
  let label = children || level || 'Unknown';

  if (normalized === 'unacceptable') {
    styles = 'bg-rose-950/40 text-rose-300 border-rose-800/60 shadow-[0_0_12px_rgba(244,63,94,0.12)]';
    prefix = 'ART.5 PROHIBITED';
    label = children || 'Unacceptable';
  } else if (normalized === 'high') {
    styles = 'bg-amber-950/40 text-amber-300 border-amber-800/60 shadow-[0_0_12px_rgba(245,158,11,0.12)]';
    prefix = 'ANNEX III';
    label = children || 'High Risk';
  } else if (normalized === 'limited') {
    styles = 'bg-sky-950/40 text-sky-300 border-sky-800/60';
    prefix = 'ART.50';
    label = children || 'Limited Risk';
  } else if (normalized === 'minimal') {
    styles = 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60';
    prefix = 'VOLUNTARY';
    label = children || 'Minimal Risk';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono tracking-tight uppercase border rounded-[4px] select-none ${styles} ${className}`}
    >
      <span className="opacity-60 text-[10px] font-semibold">{prefix} //</span>
      <span className="font-semibold tracking-normal">{label}</span>
    </span>
  );
};

export const StatusBadge: React.FC<{ status: string; className?: string }> = ({ status, className = '' }) => {
  const norm = status.toLowerCase();
  let styles = 'bg-[#161a22] text-slate-400 border-[#262c3a]';
  let display = norm.replace('_', ' ');

  if (norm === 'approved' || norm === 'completed' || norm === 'assessed') {
    styles = 'bg-emerald-950/30 text-emerald-300 border-emerald-800/50';
    display = norm === 'assessed' ? 'Assessed // Complete' : display;
  } else if (norm === 'under_assessment' || norm === 'in_progress') {
    styles = 'bg-blue-950/30 text-blue-300 border-blue-800/50';
    display = 'Active Audit';
  } else if (norm === 'registered' || norm === 'draft') {
    styles = 'bg-[#141820] text-slate-400 border-slate-800';
    display = 'Registered // Pending';
  } else if (norm === 'rejected') {
    styles = 'bg-rose-950/40 text-rose-300 border-rose-800/60';
    display = 'Non-Conforming';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider border rounded-[4px] ${styles} ${className}`}
    >
      <span className="w-1 h-1 rounded-full bg-current opacity-70" />
      <span>{display}</span>
    </span>
  );
};
