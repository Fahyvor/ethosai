import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sleek-toast';
import api from '../../lib/api';
import { Assessment } from '../../types';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { RiskBadge } from '../../components/ui/Badge';
import {
  Cpu,
  Scale,
  Plus,
  ArrowRight,
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
        toast.error('Failed to load compliance metrics');
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
  const avgScore = stats?.avgRiskScore ?? 0;

  return (
    <div className="space-y-6">
      {/* Cockpit Executive Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#1c222e]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-widest text-blue-400 uppercase bg-blue-950/40 px-2 py-0.5 border border-blue-800/50 rounded-[3px]">
              AUDIT TERMINAL // LIVE REGISTER
            </span>
            <span className="text-xs text-slate-500 font-mono">SYS-ID: ETHOS-EU-NG</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            AI Governance & Statutory Compliance Cockpit
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Conformity management system under EU AI Act (Regulation 2024/1689) and Nigeria Data Protection Act (NDPA 2023).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to="/ai-systems">
            <Button variant="outline" size="sm" className="gap-1.5 font-mono">
              <Cpu className="w-3.5 h-3.5 text-slate-400" />
              <span>Systems Registry</span>
            </Button>
          </Link>
          <Link to="/assessments/new">
            <Button variant="primary" size="sm" className="gap-1.5 font-mono">
              <Plus className="w-3.5 h-3.5" />
              <span>Execute Audit</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Architectural Ledger Strip (High Density Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-[#0e1117] border border-[#1d2331] rounded-[5px] p-4 relative overflow-hidden">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1">
            01 // INVENTORY ASSETS
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-white tracking-tight">
              {stats?.totalSystems ?? 0}
            </span>
            <span className="text-xs text-slate-400">Deployed Models</span>
          </div>
          <div className="mt-3 pt-2 border-t border-[#181d27] flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>AUDIT COVERAGE:</span>
            <span className="text-blue-400">
              {stats?.totalSystems ? Math.round(((stats.totalAssessments || 0) / stats.totalSystems) * 100) : 0}%
            </span>
          </div>
        </div>

        <div className="bg-[#0e1117] border border-[#1d2331] rounded-[5px] p-4 relative overflow-hidden">
          <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400/80 mb-1">
            02 // ANNEX III HIGH-RISK
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-amber-400 tracking-tight">
              {highAndUnacceptable}
            </span>
            <span className="text-xs text-slate-400">Strict Conformity</span>
          </div>
          <div className="mt-3 pt-2 border-t border-[#181d27] flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>EU ART. 6 THRESHOLD:</span>
            <span className="text-amber-400 font-bold">{highAndUnacceptable > 0 ? 'ALERT' : 'NOMINAL'}</span>
          </div>
        </div>

        <div className="bg-[#0e1117] border border-[#1d2331] rounded-[5px] p-4 relative overflow-hidden">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1">
            03 // VERIFIED AUDITS
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-white tracking-tight">
              {stats?.completedAssessments ?? 0}
            </span>
            <span className="text-xs text-slate-400">Certified Ledgers</span>
          </div>
          <div className="mt-3 pt-2 border-t border-[#181d27] flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>AUDITOR SIGN-OFF:</span>
            <span className="text-emerald-400">ACTIVE</span>
          </div>
        </div>

        <div className="bg-[#0e1117] border border-[#1d2331] rounded-[5px] p-4 relative overflow-hidden">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-1">
            04 // COMPOSITE RISK INDEX
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold tracking-tight text-white">
              {avgScore}
            </span>
            <span className="text-xs font-mono text-slate-500">/ 100</span>
          </div>
          <div className="mt-3 pt-2 border-t border-[#181d27] flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>MEAN CLASSIFICATION:</span>
            <span className={avgScore >= 60 ? 'text-amber-400' : 'text-emerald-400'}>
              {avgScore >= 60 ? 'HIGH RISK' : avgScore >= 30 ? 'LIMITED' : 'MINIMAL'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Audit Ledger (Left) + Statutory Distribution (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Statutory Audit Registry */}
        <div className="lg:col-span-2 space-y-4">
          <Card tag="RECORD: AUDIT-LOG">
            <CardHeader
              title="Recent Statutory Audit Determinations"
              subtitle="Formal risk assessments executed against Annex III high-risk employment, health, biometric, and finance criteria."
              action={
                <Link to="/assessments" className="text-xs font-mono text-blue-400 hover:text-blue-300 flex items-center gap-1">
                  <span>Full Ledger</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              }
            />

            {loading ? (
              <div className="py-12 text-center text-xs font-mono text-slate-500">
                [RETRIEVING AUDIT VERIFICATIONS...]
              </div>
            ) : recentAssessments.length === 0 ? (
              <div className="py-12 text-center text-slate-500 font-mono text-xs">
                NO AUDIT RECORDS LOGGED IN CURRENT SESSION.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="text-slate-400 border-b border-[#1c222e] text-[10px] tracking-wider uppercase">
                      <th className="pb-2.5 font-medium">System Nomenclature</th>
                      <th className="pb-2.5 font-medium">Domain</th>
                      <th className="pb-2.5 font-medium">Score</th>
                      <th className="pb-2.5 font-medium">Statutory Tier</th>
                      <th className="pb-2.5 font-medium text-right">Inspect</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#151922]">
                    {recentAssessments.map((a) => (
                      <tr key={a._id} className="hover:bg-[#12161f] transition-colors group">
                        <td className="py-3 pr-3">
                          <div className="font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">
                            {a.aiSystemId?.name || 'Unnamed Model'}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            ID: {a._id.substring(0, 8)}... // {new Date(a.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <span className="text-[10px] uppercase px-1.5 py-0.5 bg-[#141822] border border-[#222938] rounded text-slate-300">
                            {a.aiSystemId?.domain || 'General'}
                          </span>
                        </td>
                        <td className="py-3 px-2 font-bold text-slate-200">
                          {a.overallRiskScore}
                          <span className="text-[10px] text-slate-400 font-normal">/100</span>
                        </td>
                        <td className="py-3 px-2">
                          <RiskBadge level={a.riskLevel} />
                        </td>
                        <td className="py-3 pl-2 text-right">
                          <Link
                            to={`/assessments/${a._id}`}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-[#151922] hover:bg-blue-600 hover:text-white text-slate-300 border border-[#273042] rounded-[3px] text-[10px] font-semibold transition-all"
                          >
                            <span>Certificate</span>
                            <ArrowRight className="w-2.5 h-2.5" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        {/* Right 1 Col: Statutory Tiers Breakdown & Framework Matrix */}
        <div className="space-y-4">
          <Card tag="STATUTE: BREAKDOWN">
            <CardHeader
              title="EU AI Act Risk Matrix"
              subtitle="Statutory distribution across the four tiers of Regulation 2024/1689."
            />

            <div className="space-y-3 font-mono text-xs">
              {/* Unacceptable */}
              <div className="p-3 bg-[#130f14] border border-rose-950/60 rounded-[4px]">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] font-bold text-rose-400 uppercase">Article 5 // Prohibited</span>
                  <span className="text-sm font-bold text-rose-300">{getRiskCount('unacceptable')}</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">
                  Exploitative manipulation, social scoring, untargeted facial scraping.
                </p>
              </div>

              {/* High Risk */}
              <div className="p-3 bg-[#14120e] border border-amber-950/60 rounded-[4px]">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] font-bold text-amber-400 uppercase">Article 6 // High Risk (Annex III)</span>
                  <span className="text-sm font-bold text-amber-300">{getRiskCount('high')}</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">
                  Critical infrastructure, biometric triage, employment screening, credit scoring.
                </p>
              </div>

              {/* Limited */}
              <div className="p-3 bg-[#0d141c] border border-sky-950/60 rounded-[4px]">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] font-bold text-sky-400 uppercase">Article 50 // Limited Risk</span>
                  <span className="text-sm font-bold text-sky-300">{getRiskCount('limited')}</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">
                  Chatbots, synthetic media generators, emotion recognition systems.
                </p>
              </div>

              {/* Minimal */}
              <div className="p-3 bg-[#0c1410] border border-emerald-950/60 rounded-[4px]">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase">Voluntary // Minimal Risk</span>
                  <span className="text-sm font-bold text-emerald-300">{getRiskCount('minimal')}</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">
                  AI spam filters, video games, inventory routing.
                </p>
              </div>
            </div>

            {/* NDPA Cross-Check Section */}
            <div className="mt-4 pt-3 border-t border-[#1a202c]">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-300 font-bold uppercase mb-1.5">
                <Scale className="w-3.5 h-3.5 text-blue-400" />
                <span>NDPA 2023 Cross-Border Audit Checklist</span>
              </div>
              <ul className="text-[11px] space-y-1 text-slate-400 font-mono">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Part III: Lawful Processing Base Documented
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Sec. 24: Data Subject Recourse Protocol
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Sec. 30: DPIA Register Enforced for High Risk
                </li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
