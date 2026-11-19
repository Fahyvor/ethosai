import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  BarChart3,
  Cpu,
  FileCheck,
  FileText,
  BookOpen,
  Plus,
  Scale,
} from '../ui/Icons';

export const Sidebar: React.FC = () => {
  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { to: '/ai-systems', label: 'AI Systems', icon: Cpu },
    { to: '/assessments', label: 'Assessments', icon: FileCheck },
    { to: '/assessments/new', label: 'New Assessment', icon: Plus, highlight: true },
    { to: '/reports', label: 'Reports & Exports', icon: FileText },
    { to: '/resources', label: 'Regulatory Docs', icon: BookOpen },
  ];

  return (
    <aside className="w-64 bg-slate-950/80 border-r border-slate-800 flex flex-col justify-between shrink-0 h-[calc(100vh-4rem)] sticky top-16">
      <div className="p-4 space-y-1">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-3 py-2">
          Assessment & Governance
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : item.highlight
                    ? 'text-slate-200 hover:bg-slate-800/80 hover:text-white'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Regulatory Framework Tracker Footer */}
      <div className="p-4 m-3 rounded-xl bg-slate-900/90 border border-slate-800/80">
        <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-300">
          <Scale className="w-4 h-4 text-emerald-400" />
          <span>Active Standards</span>
        </div>
        <div className="space-y-1.5 text-[11px] text-slate-400">
          <div className="flex justify-between items-center">
            <span>EU AI Act (2024)</span>
            <span className="text-emerald-400 font-mono">v1.0</span>
          </div>
          <div className="flex justify-between items-center">
            <span>NDPA 2023</span>
            <span className="text-emerald-400 font-mono">Sec. 24/30</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
