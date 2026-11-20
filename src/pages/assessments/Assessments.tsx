import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sleek-toast';
import api from '../../lib/api';
import { Assessment } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { RiskBadge, StatusBadge } from '../../components/ui/Badge';
import { Plus, Search, Eye } from '../../components/ui/Icons';

export const Assessments: React.FC = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/assessments');
      setAssessments(res.data);
    } catch {
      toast.error('Failed to load risk assessments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  const filtered = assessments.filter((a) => {
    const sys = typeof a.aiSystemId === 'object' ? a.aiSystemId : null;
    const nameMatch = sys?.name?.toLowerCase().includes(search.toLowerCase()) || false;
    const riskMatch = riskFilter === 'all' || a.riskLevel === riskFilter;
    return (search === '' || nameMatch) && riskMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1c222e]">
        <div>
          <div className="text-[10px] font-mono tracking-widest text-blue-400 uppercase mb-1">
            CONFORMITY REPOSITORY // ARTICLE 9 RISK SYSTEM
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Statutory AI Risk Audits Ledger
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Certified evaluations conducted under EU AI Act thresholds and NDPA Section 30 DPIA criteria.
          </p>
        </div>
        <Link to="/assessments/new">
          <Button variant="primary" size="sm" className="gap-2 font-mono">
            <Plus className="w-3.5 h-3.5" />
            <span>Initiate New Audit</span>
          </Button>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search audit by model name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0d1016] border border-[#1f2635] rounded-[4px] pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono transition-colors"
          />
        </div>

        <select
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
          className="bg-[#0d1016] border border-[#1f2635] rounded-[4px] px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono uppercase"
        >
          <option value="all">ALL RISK CLASSIFICATIONS</option>
          <option value="unacceptable">Prohibited // Art. 5</option>
          <option value="high">High Risk // Annex III</option>
          <option value="limited">Limited Risk // Art. 50</option>
          <option value="minimal">Minimal Risk // Voluntary</option>
        </select>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs font-mono text-slate-500">
          [QUERYING AUDIT REPOSITORY...]
        </div>
      ) : filtered.length === 0 ? (
        <Card className="py-16 text-center text-slate-500 space-y-4 font-mono text-xs">
          <div>NO CONFORMITY AUDIT RECORDS FOUND.</div>
          <Link to="/assessments/new">
            <Button variant="primary" size="sm">
              Execute Initial Audit
            </Button>
          </Link>
        </Card>
      ) : (
        <Card tag="AUDIT-LEDGER" className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#090b0e] text-[10px] uppercase tracking-wider text-slate-400 border-b border-[#1c222e]">
                <tr>
                  <th className="py-3 px-5 font-medium">Model Nomenclature</th>
                  <th className="py-3 px-4 font-medium">Conformity Tier</th>
                  <th className="py-3 px-4 font-medium">CRI Score</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium">Timestamp</th>
                  <th className="py-3 px-5 font-medium text-right">Audit Dossier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#151922]">
                {filtered.map((a) => {
                  const sys = typeof a.aiSystemId === 'object' ? a.aiSystemId : null;
                  return (
                    <tr key={a._id} className="hover:bg-[#12161f] transition-colors group">
                      <td className="py-3.5 px-5">
                        <div className="font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">
                          {sys?.name || 'Unnamed Model'}
                        </div>
                        <div className="text-[10px] text-slate-400 uppercase">
                          {sys?.domain || 'General'} // ID: {a._id.substring(0, 8)}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <RiskBadge level={a.riskLevel} />
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-200">
                        {a.overallRiskScore}
                        <span className="text-[10px] text-slate-400 font-normal">/100</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={a.status} />
                      </td>
                      <td className="py-3.5 px-4 text-[11px] text-slate-400">
                        {new Date(a.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <Link to={`/assessments/${a._id}`}>
                          <Button variant="outline" size="sm" className="gap-1.5 text-[11px]">
                            <Eye className="w-3 h-3 text-slate-400" />
                            <span>Inspect Dossier</span>
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};
