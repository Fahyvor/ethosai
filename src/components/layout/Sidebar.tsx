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
    { to: '/dashboard', label: 'Overview & Posture', code: '01', icon: BarChart3 },
    { to: '/ai-systems', label: 'AI Systems Inventory', code: '02', icon: Cpu },
    { to: '/assessments', label: 'Conformity Audits', code: '03', icon: FileCheck },
    { to: '/assessments/new', label: 'New Audit Procedure', code: '04', icon: Plus, highlight: true },
    { to: '/reports', label: 'Ledgers & Certificates', code: '05', icon: FileText },
    { to: '/resources', label: 'Regulatory Lexicon', code: '06', icon: BookOpen },
  ];

  return (
    <aside className="w-60 bg-[#0a0c10] border-r border-[#1c222e] flex flex-col justify-between shrink-0 h-[calc(100vh-3.5rem)] sticky top-14 select-none">
      <div className="py-4 space-y-1">
        <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 px-4 pb-2">
          MODULES // REGISTRY
        </div>

        <nav className="space-y-0.5 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-[4px] text-xs transition-all ${
                    isActive
                      ? 'bg-[#141822] text-white font-semibold border-l-2 border-blue-500 shadow-sm'
                      : item.highlight
                      ? 'text-slate-300 hover:bg-[#12161f] hover:text-white'
                      : 'text-slate-400 hover:bg-[#12161f] hover:text-slate-200'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-3.5 h-3.5 shrink-0 opacity-80" />
                  <span>{item.label}</span>
                </div>
                <span className="font-mono text-[10px] text-slate-500 tracking-tighter">[{item.code}]</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Statutory Framework Tracker Footer */}
      <div className="p-3 m-3 rounded-[4px] bg-[#0e1117] border border-[#1b212c]">
        <div className="flex items-center gap-2 mb-2 text-[10px] font-mono uppercase tracking-wider text-slate-300">
          <Scale className="w-3.5 h-3.5 text-blue-400" />
          <span>Statutory Frameworks</span>
        </div>
        <div className="space-y-1.5 text-[11px] text-slate-400">
          <div className="flex justify-between items-center py-0.5 border-b border-[#181d27]">
            <span className="text-[11px]">EU AI Act</span>
            <span className="text-emerald-400 font-mono text-[10px]">REG 2024/1689</span>
          </div>
          <div className="flex justify-between items-center py-0.5">
            <span className="text-[11px]">NDPA (Nigeria)</span>
            <span className="text-blue-400 font-mono text-[10px]">ACT NO. 44 (2023)</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
