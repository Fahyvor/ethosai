import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sleek-toast';
import api from '../../lib/api';
import { AISystem } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { RiskBadge, StatusBadge } from '../../components/ui/Badge';
import { Cpu, Plus, Search, FileCheck } from '../../components/ui/Icons';

export const AISystems: React.FC = () => {
  const [systems, setSystems] = useState<AISystem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState('all');

  const fetchSystems = async () => {
    try {
      setLoading(true);
      const res = await api.get('/ai-systems');
      setSystems(res.data);
    } catch {
      toast.error('Failed to load registered AI systems');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystems();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from governance inventory?`)) return;
    try {
      await api.delete(`/ai-systems/${id}`);
      toast.success(`Removed ${name} from registry`);
      setSystems((prev) => prev.filter((s) => s._id !== id));
    } catch {
      toast.error('Failed to delete AI system');
    }
  };

  const filtered = systems.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.purpose.toLowerCase().includes(search.toLowerCase());
    const matchesDomain = domainFilter === 'all' || s.domain === domainFilter;
    return matchesSearch && matchesDomain;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">AI Systems Inventory</h1>
          <p className="text-sm text-slate-400 mt-1">
            Registry of all enterprise, commercial and public-sector AI models under governance
          </p>
        </div>
        <Link to="/ai-systems/new">
          <Button variant="primary" className="gap-2">
            <Plus className="w-4 h-4" />
            Register New AI System
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Search by system name, domain or purpose..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <select
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 capitalize"
          >
            <option value="all">All Domains</option>
            <option value="healthcare">Healthcare</option>
            <option value="finance">Finance / Credit</option>
            <option value="hr">HR & Recruitment</option>
            <option value="education">Education</option>
            <option value="public_services">Public Services</option>
            <option value="law_enforcement">Law Enforcement</option>
            <option value="other">Other</option>
          </select>
        </div>
      </Card>

      {/* Systems Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading AI Systems Registry...
        </div>
      ) : filtered.length === 0 ? (
        <Card className="py-16 text-center text-slate-500 space-y-4">
          <Cpu className="w-12 h-12 mx-auto text-slate-700" />
          <div>
            <h3 className="text-base font-semibold text-slate-300">No AI Systems Registered</h3>
            <p className="text-xs text-slate-400 mt-1">
              Add your first AI system to start compliance and fundamental rights assessments.
            </p>
          </div>
          <Link to="/ai-systems/new">
            <Button variant="primary" size="sm">Register System</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((sys) => (
            <Card key={sys._id} className="flex flex-col justify-between hover:border-slate-700 transition-colors">
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <RiskBadge level={sys.riskCategory} />
                </div>

                <h3 className="text-base font-bold text-white mb-1">{sys.name}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium text-emerald-400 capitalize bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/20">
                    {sys.domain.replace('_', ' ')}
                  </span>
                  <StatusBadge status={sys.status} />
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                  {sys.description}
                </p>

                <div className="space-y-1.5 text-[11px] text-slate-400 bg-slate-950/60 p-3 rounded-lg border border-slate-800/60 mb-4">
                  <div className="flex justify-between">
                    <span>Autonomy:</span>
                    <span className="text-slate-200 font-medium">{sys.isAutonomous ? 'Fully Autonomous' : 'Assisted'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Human Oversight:</span>
                    <span className="text-slate-200 font-medium capitalize">{sys.humanOversightLevel}</span>
                  </div>
                  {sys.vendor && (
                    <div className="flex justify-between">
                      <span>Vendor/Dev:</span>
                      <span className="text-slate-200 font-medium">{sys.vendor}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <Link to={`/assessments/new?systemId=${sys._id}`} className="flex-1">
                  <Button variant="primary" size="sm" className="w-full text-xs gap-1.5">
                    <FileCheck className="w-3.5 h-3.5" />
                    Assess Risk
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(sys._id, sys.name)}
                  className="text-xs text-slate-500 hover:text-rose-400"
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
