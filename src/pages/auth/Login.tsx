import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sleek-toast';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowRight, ShieldAlert } from '../../components/ui/Icons';
import { Button } from '../../components/ui/Button';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      toast.success('Assessor clearance confirmed. Welcome back.');
      navigate(from, { replace: true });
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Authentication rejected. Verify statutory assessor credentials.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    setEmail('assessor@ethosai.gov');
    setPassword('governance123');
    toast.info('Accredited Assessor credentials loaded');
  };

  return (
    <div className="min-h-screen bg-[#07090c] flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-blue-600/30">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Terminal Header */}
        <div className="flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-[4px] bg-[#12161f] border border-[#273245] flex items-center justify-center mb-3">
            <span className="font-mono text-base font-bold text-blue-400">Ξ</span>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-white font-mono">
              ETHOS<span className="text-blue-500">.AI</span>
            </h1>
            <span className="text-[10px] font-mono tracking-wider uppercase bg-[#141822] text-slate-400 px-1.5 py-0.5 border border-[#232a39] rounded-[3px]">
              REGISTRY // V1.0
            </span>
          </div>
          <p className="mt-1.5 text-xs text-slate-400 font-mono">
            Autonomous Statutory Governance & Risk Conformity System
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-[#0e1117] border border-[#1e2533] rounded-[6px] p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
          {/* Statutory Authority Notice */}
          <div className="mb-5 pb-3 border-b border-[#1a202c] flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-400 font-mono leading-relaxed">
              Authorized access restricted to accredited AI safety auditors, compliance officers, and independent governance assessors.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                Assessor Identity (Email)
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="assessor@ethosai.gov"
                className="w-full bg-[#080a0e] border border-[#222a3a] rounded-[4px] px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  Authentication Secret
                </label>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#080a0e] border border-[#222a3a] rounded-[4px] px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono transition-colors"
              />
            </div>

            <Button type="submit" loading={loading} className="w-full gap-2 mt-2" size="md">
              <span>Authenticate Session</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </form>

          {/* Portfolio Demo Instant Evaluator Block */}
          <div className="mt-6 pt-5 border-t border-[#1a202c]">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest text-center mb-3">
              // PORTFOLIO DEMO CREDENTIAL //
            </div>

            <div className="p-3 bg-[#080a0e] border border-[#1e2536] rounded-[4px] mb-3">
              <div className="flex justify-between items-center text-[11px] font-mono">
                <span className="text-slate-400">Assessor:</span>
                <span className="text-blue-400 font-semibold">Dr. Alex Vance</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mt-1">
                <span>Account:</span>
                <span>assessor@ethosai.gov</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mt-0.5">
                <span>Clearance:</span>
                <span className="text-emerald-400">Accredited Assessor L3</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDemoFill}
              className="w-full text-xs font-mono"
            >
              Fill Demo Assessor Credentials
            </Button>
          </div>

          <div className="mt-5 text-center text-xs text-slate-500">
            Need an authorized assessor profile?{' '}
            <Link to="/register" className="font-semibold text-blue-400 hover:text-blue-300">
              Register Credentials
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
