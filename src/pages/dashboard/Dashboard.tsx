import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sleek-toast';
import api from '../../lib/api';
import { Assessment } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { RiskBadge } from '../../components/ui/Badge';
import {
  ShieldAlert,
  Cpu,
  FileCheck,
  Scale,
  Plus,
  ArrowRight,
  BookOpen,
} from '../../components/ui/Icons';

interface DashboardStats {
  totalSystems: number;
  totalAssessments: number;
  completedAssessments: number;
  avgRiskScore: number;
  riskDistribution: Array<{ _id: string; count: number }>;
}

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentAssessments, setRecentAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, assessRes] = await Promise.all([
          api.get('/assessments/stats'),
          api.get('/assessments'),
        ]);
        setStats(statsRes.data);
        setRecentAssessments(assessRes.data.slice(0, 5));
      } catch (err: any) {
        console.error('Dashboard load error:', err);
        toast.error('Failed to load dashboard metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getRiskCount = (level: string) => {
    return stats?.riskDistribution?.find((r) => r._id === level)?.count || 0;
  };

  const highAndUnacceptable = getRiskCount('high') + getRiskCount('unacceptable');

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            AI Governance & Ethics Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time compliance monitoring under the EU AI Act (2024) and Nigeria Data Protection Act (NDPA 2023)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/ai-systems">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Cpu className="w-4 h-4" />
              Manage Systems
            </Button>
          </Link>
          <Link to="/assessments/new">
            <Button variant="primary" size="sm" className="gap-1.5">
              <Plus className="w-4 h-4" />
              Run Assessment
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center shrink-0">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{stats?.totalSystems ?? 0}</div>
            <div className="text-xs text-slate-400 font-medium">Registered AI Systems</div>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{stats?.totalAssessments ?? 0}</div>
            <div className="text-xs text-slate-400 font-medium">Assessments Conducted</div>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{highAndUnacceptable}</div>
            <div className="text-xs text-slate-400 font-medium">High / Prohibited Risks</div>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center shrink-0">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{stats?.avgRiskScore ?? 0}<span className="text-xs text-slate-400 font-normal"> / 100</span></div>
            <div className="text-xs text-slate-400 font-medium">Avg Risk Index</div>
          </div>
        </Card>
      </div>

      {/* Framework Summary Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-semibold text-white">Risk Classification Breakdown</h3>
              <p className="text-xs text-slate-400">EU AI Act Tier Distribution</p>
            </div>
            <span className="text-xs text-slate-500">Based on active assessments</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            <div className="p-3.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
              <span className="text-xs font-semibold text-emerald-400 block">Minimal Risk</span>
              <span className="text-2xl font-extrabold text-white mt-1 block">{getRiskCount('minimal')}</span>
              <span className="text-[11px] text-slate-400">Permitted / No Barrier</span>
            </div>

            <div className="p-3.5 rounded-lg bg-sky-500/5 border border-sky-500/20">
              <span className="text-xs font-semibold text-sky-400 block">Limited Risk</span>
              <span className="text-2xl font-extrabold text-white mt-1 block">{getRiskCount('limited')}</span>
              <span className="text-[11px] text-slate-400">Transparency Obligation</span>
            </div>

            <div className="p-3.5 rounded-lg bg-amber-500/5 border border-amber-500/20">
              <span className="text-xs font-semibold text-amber-400 block">High Risk</span>
              <span className="text-2xl font-extrabold text-white mt-1 block">{getRiskCount('high')}</span>
              <span className="text-[11px] text-slate-400">Conformity Assessment</span>
            </div>

            <div className="p-3.5 rounded-lg bg-rose-500/5 border border-rose-500/20">
              <span className="text-xs font-semibold text-rose-400 block">Unacceptable</span>
              <span className="text-2xl font-extrabold text-white mt-1 block">{getRiskCount('unacceptable')}</span>
              <span className="text-[11px] text-slate-400">Prohibited (Art. 5)</span>
            </div>
          </div>
        </Card>

        {/* Regulatory Spotlight */}
        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 mb-2">
              <BookOpen className="w-5 h-5" />
              <h3 className="font-semibold text-white text-base">Regulatory Frameworks</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              ETHOSAI continuously cross-references your assessment results against Articles 5, 6, 9, 10, 13, 14 of the EU AI Act and Sections 24, 30 of NDPA 2023.
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800">
            <Link to="/resources">
              <Button variant="outline" size="sm" className="w-full gap-2 text-xs">
                Explore Legal References
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Recent Assessments Table */}
      <Card>
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div>
            <h3 className="text-base font-semibold text-white">Recent AI Assessments</h3>
            <p className="text-xs text-slate-400">Latest governance reviews and risk scores</p>
          </div>
          <Link to="/assessments">
            <Button variant="ghost" size="sm" className="text-xs gap-1">
              View All
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="py-8 text-center text-slate-400 text-sm">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Loading assessments...
          </div>
        ) : recentAssessments.length === 0 ? (
          <div className="py-12 text-center text-slate-500 space-y-3">
            <FileCheck className="w-10 h-10 mx-auto text-slate-600" />
            <p className="text-sm">No assessments recorded yet.</p>
            <Link to="/assessments/new">
              <Button size="sm" variant="primary">Start Your First Assessment</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="pb-3 font-semibold">AI System</th>
                  <th className="pb-3 font-semibold">Domain</th>
                  <th className="pb-3 font-semibold">Risk Classification</th>
                  <th className="pb-3 font-semibold">Risk Score</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentAssessments.map((a) => {
                  const sys = typeof a.aiSystemId === 'object' ? a.aiSystemId : null;
                  return (
                    <tr key={a._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 font-medium text-white">
                        {sys?.name || 'AI System'}
                      </td>
                      <td className="py-3.5 text-xs text-slate-400 capitalize">
                        {sys?.domain || 'General'}
                      </td>
                      <td className="py-3.5">
                        <RiskBadge level={a.riskLevel} />
                      </td>
                      <td className="py-3.5 font-mono text-sm font-semibold">
                        <span className={a.overallRiskScore >= 60 ? 'text-amber-400' : 'text-emerald-400'}>
                          {a.overallRiskScore} / 100
                        </span>
                      </td>
                      <td className="py-3.5 text-xs text-slate-400">
                        {new Date(a.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 text-right">
                        <Link to={`/assessments/${a._id}`}>
                          <Button variant="outline" size="sm" className="text-xs">
                            View Report
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
