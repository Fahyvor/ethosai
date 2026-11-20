import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, Plus } from '../ui/Icons';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-14 bg-[#0a0c10] border-b border-[#1c222e] px-5 flex items-center justify-between select-none">
      {/* Brand Identity */}
      <div className="flex items-center gap-6">
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="w-7 h-7 bg-[#151922] border border-[#2d3648] group-hover:border-blue-500 rounded-[4px] flex items-center justify-center transition-colors">
            <span className="font-mono font-bold text-xs text-blue-400">Ξ</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-bold tracking-tight text-white text-base">ETHOS<span className="text-blue-500 font-mono font-normal">.AI</span></span>
            <span className="text-[10px] font-mono tracking-widest uppercase text-slate-500 hidden sm:inline">
              // GOV-REGISTER
            </span>
          </div>
        </Link>

        {/* Live System Operational Posture */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 bg-[#10141b] border border-[#1e2533] rounded-[4px] text-[10px] font-mono text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>STATUTORY AUDIT ENGINE: ONLINE (EU-AIA-2024 / NDPA-2023)</span>
        </div>
      </div>

      {/* Actions & Assessor Credential */}
      <div className="flex items-center gap-4">
        <Link to="/assessments/new">
          <Button size="sm" variant="primary" className="gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            <span>Initiate Assessment</span>
          </Button>
        </Link>

        {user && (
          <div className="flex items-center gap-3 pl-3 border-l border-[#1d2330]">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-semibold text-slate-200 tracking-tight">{user.name}</div>
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                {user.role} // {user.organization || 'Independent Inspector'}
              </div>
            </div>

            <div className="w-7 h-7 rounded-[4px] bg-[#141822] border border-[#2b3447] flex items-center justify-center font-mono font-bold text-blue-400 text-xs">
              {user.name.charAt(0).toUpperCase()}
            </div>

            <button
              onClick={logout}
              title="Terminate Session"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-[#161a22] border border-transparent hover:border-[#2d3546] rounded-[4px] transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
