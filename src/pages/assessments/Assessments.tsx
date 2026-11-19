import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sleek-toast';
import api from '../../lib/api';
import { Assessment } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { RiskBadge, StatusBadge } from '../../components/ui/Badge';
import { FileCheck, Plus, Search, Eye } from '../../components/ui/Icons';

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">AI Risk Assessments</h1>
          <p className="text-sm text-slate-400 mt-1">
            Audits conducted against EU AI Act standards, bias thresholds, and NDPA 2023 requirements
          </p>
        </div>
        <Link to="/assessments/new">
          <Button variant="primary" className="gap-2">
            <Plus className="w-4 h-4" />
            Conduct New Assessment
          </Button>
        </Link>
      </div>

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Search assessment by system name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 capitalize"
          >
            <option value="all">All Risk Levels</option>
            <option value="unacceptable">Unacceptable Risk</option>
            <option value="high">High Risk</option>
            <option value="limited">Limited Risk</option>
            <option value="minimal">Minimal Risk</option>
          </select>
        </div>
      </Card>

      {loading ? (
        <div className="py-16 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading assessments repository...
        </div>
      ) : filtered.length === 0 ? (
        <Card className="py-16 text-center text-slate-500 space-y-4">
          <FileCheck className="w-12 h-12 mx-auto text-slate-700" />
          <div>
            <h3 className="text-base font-semibold text-slate-300">No Assessments Found</h3>
            <p className="text-xs text-slate-400 mt-1">
              Start evaluating your AI systems against governance, bias, and privacy obligations.
            </p>
          </div>
          <Link to="/assessments/new">
            <Button variant="primary" size="sm">Start Assessment</Button>
          </Link>
        </Card>
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/60 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-6 font-semibold">AI System</th>
                  <th className="py-3.5 px-4 font-semibold">Risk Classification</th>
                  <th className="py-3.5 px-4 font-semibold">Risk Score</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold">Date Completed</th>
                  <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((a) => {
                  const sys = typeof a.aiSystemId === 'object' ? a.aiSystemId : null;
                  return (
                    <tr key={a._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-semibold text-white">{sys?.name || 'AI System'}</div>
                        <div className="text-xs text-slate-400 capitalize">{sys?.domain || 'General'}</div>
                      </td>
                      <td className="py-4 px-4">
                        <RiskBadge level={a.riskLevel} />
                      </td>
                      <td className="py-4 px-4 font-mono font-bold">
                        <span className={a.overallRiskScore >= 60 ? 'text-amber-400' : 'text-emerald-400'}>
                          {a.overallRiskScore} / 100
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <StatusBadge status={a.status} />
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-400">
                        {new Date(a.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link to={`/assessments/${a._id}`}>
                          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                            <Eye className="w-3.5 h-3.5" />
                            View Audit
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
