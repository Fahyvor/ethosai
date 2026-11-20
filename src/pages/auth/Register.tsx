import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sleek-toast';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowRight, ShieldAlert } from '../../components/ui/Icons';
import { Button } from '../../components/ui/Button';

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('assessor');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      await register({ name, email, password, role, organization });
      toast.success('Assessor profile registered successfully. Welcome to ETHOSAI.');
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      const msg = err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Registration failed.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090c] flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-blue-600/30">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-[4px] bg-[#12161f] border border-[#273245] flex items-center justify-center mb-3">
            <span className="font-mono text-base font-bold text-blue-400">Ξ</span>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-white font-mono">
              ETHOS<span className="text-blue-500">.AI</span>
            </h1>
            <span className="text-[10px] font-mono tracking-wider uppercase bg-[#141822] text-slate-400 px-1.5 py-0.5 border border-[#232a39] rounded-[3px]">
              REGISTRATION // PROTOCOL
            </span>
          </div>
          <p className="mt-1.5 text-xs text-slate-400 font-mono">
            Register Accredited AI Assessor & Governance Credentials
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-[#0e1117] border border-[#1e2533] rounded-[6px] p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
          <div className="mb-5 pb-3 border-b border-[#1a202c] flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-400 font-mono leading-relaxed">
              Create accredited compliance officer, statutory auditor, or deployer credentials under EU AI Act & NDPA 2023.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                Full Name & Title *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Eleanor Vance, Lead Auditor"
                className="w-full bg-[#080a0e] border border-[#222a3a] rounded-[4px] px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                Official Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="auditor@governance-institute.org"
                className="w-full bg-[#080a0e] border border-[#222a3a] rounded-[4px] px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                Organization / Institution
              </label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="Regulatory Compliance Advisory LLC"
                className="w-full bg-[#080a0e] border border-[#222a3a] rounded-[4px] px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                Conformity Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-[#080a0e] border border-[#222a3a] rounded-[4px] px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono transition-colors"
              >
                <option value="assessor">Assessor (Statutory Risk Evaluator)</option>
                <option value="auditor">Auditor (Independent Verification)</option>
                <option value="developer">Developer / Provider (System Deployer)</option>
                <option value="regulator">Regulator / Inspector (Government Agency)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                Master Secret *
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#080a0e] border border-[#222a3a] rounded-[4px] px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono transition-colors"
              />
            </div>

            <Button type="submit" loading={loading} className="w-full gap-2 mt-2" size="md">
              <span>Issue Assessor Credentials</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </form>

          <div className="mt-5 pt-4 border-t border-[#1a202c] text-center text-xs text-slate-500">
            Already accredited?{' '}
            <Link to="/login" className="font-semibold text-blue-400 hover:text-blue-300">
              Session Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
