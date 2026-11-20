import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sleek-toast';
import api from '../../lib/api';
import { AISystem } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { RiskBadge } from '../../components/ui/Badge';
import { Plus, Search, FileCheck, Cpu, Trash2 } from '../../components/ui/Icons';

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
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.purpose.toLowerCase().includes(search.toLowerCase());
    const matchesDomain = domainFilter === 'all' || s.domain === domainFilter;
    return matchesSearch && matchesDomain;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1c222e]">
        <div>
          <div className="text-[10px] font-mono tracking-widest text-blue-400 uppercase mb-1">
            STATUTORY ASSET REGISTRY // ARTICLE 51
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            AI Systems Specification Register
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Inventory of high-impact automated decision models under European and Nigerian jurisdiction.
          </p>
        </div>
        <Link to="/ai-systems/new">
          <Button variant="primary" size="sm" className="gap-2 font-mono">
            <Plus className="w-3.5 h-3.5" />
            <span>Register New System</span>
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Filter by system name, purpose, keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0d1016] border border-[#1f2635] rounded-[4px] pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono transition-colors"
          />
        </div>

        <select
          value={domainFilter}
          onChange={(e) => setDomainFilter(e.target.value)}
          className="bg-[#0d1016] border border-[#1f2635] rounded-[4px] px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
        >
          <option value="all">ALL DOMAINS</option>
          <option value="healthcare">Healthcare // Diagnostics</option>
          <option value="finance">Finance // AML & Credit</option>
          <option value="hr">HR // Recruitment & Screening</option>
          <option value="education">Education // Evaluation</option>
          <option value="public_services">Public Services // Benefits</option>
          <option value="law_enforcement">Law Enforcement // Risk</option>
          <option value="other">General Domain</option>
        </select>
      </div>

      {/* Systems Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs font-mono text-slate-500">
          [QUERYING ASSET INVENTORY...]
        </div>
      ) : filtered.length === 0 ? (
        <Card className="py-16 text-center text-slate-500 space-y-4">
          <Cpu className="w-10 h-10 mx-auto text-slate-700" />
          <div className="font-mono text-xs">
            NO MATCHING AI SYSTEMS CATALOGUED IN REGISTRY.
          </div>
          <Link to="/ai-systems/new">
            <Button variant="primary" size="sm">
              Register First Model
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((sys) => (
            <Card
              key={sys._id}
              tag={sys.domain.toUpperCase()}
              className="flex flex-col justify-between hover:border-[#2f394d] transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="font-mono text-[10px] text-slate-500 tracking-wider uppercase">
                    SYS-REF: {sys._id.substring(0, 8)}
                  </span>
                  <RiskBadge level={sys.riskCategory} />
                </div>

                <h3 className="text-sm font-bold text-white mb-1.5 tracking-tight">{sys.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                  {sys.description}
                </p>

                {/* Technical Lineage Box */}
                <div className="space-y-1.5 text-[11px] font-mono bg-[#090b0f] p-3 rounded-[3px] border border-[#1a202c] mb-4">
                  <div className="flex justify-between text-slate-400">
                    <span>OVERSIGHT:</span>
                    <span className="text-slate-200 capitalize font-medium">{sys.humanOversightLevel}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>AUTONOMY:</span>
                    <span className="text-slate-200">{sys.isAutonomous ? 'Fully Autonomous' : 'Assisted'}</span>
                  </div>
                  {sys.vendor && (
                    <div className="flex justify-between text-slate-400">
                      <span>PROVIDER:</span>
                      <span className="text-slate-200 truncate max-w-[140px]">{sys.vendor}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-[#1a202c] flex items-center justify-between gap-2">
                <Link to={`/assessments/new?systemId=${sys._id}`} className="flex-1">
                  <Button variant="primary" size="sm" className="w-full text-xs gap-1.5 font-mono">
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>Audit Conformity</span>
                  </Button>
                </Link>
                <button
                  onClick={() => handleDelete(sys._id, sys.name)}
                  title="Remove from inventory"
                  className="p-1.5 text-slate-500 hover:text-rose-400 border border-transparent hover:border-rose-900/50 rounded-[4px] transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
