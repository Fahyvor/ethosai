import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sleek-toast';
import api from '../../lib/api';
import { Assessment } from '../../types';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { RiskBadge } from '../../components/ui/Badge';
import { RiskGauge } from '../../components/ui/RiskGauge';
import {
  FileText,
  Download,
  ArrowLeft,
  AlertTriangle,
  Scale,
  Shield,
  Eye,
  CheckCircle2,
  BookOpen,
} from '../../components/ui/Icons';

export const AssessmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/assessments/${id}`);
        setAssessment(res.data);
      } catch {
        toast.error('Failed to load audit certificate');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAssessment();
  }, [id]);

  const handleExportPDF = async () => {
    if (!assessment) return;
    try {
      setGeneratingPdf(true);
      toast.info('Rendering statutory audit certificate PDF...');
      const res = await api.post('/reports/generate', { assessmentId: assessment._id });
      toast.success('Certificate compiled. Initiating download...');

      const downloadRes = await api.get(`/reports/${res.data.report._id}/pdf`, {
        responseType: 'blob',
      });
      const blob = new Blob([downloadRes.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ethosai-audit-${assessment._id.substring(0, 8)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      toast.error('Failed to generate PDF report');
      console.error(err);
    } finally {
      setGeneratingPdf(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xs font-mono text-slate-500">
        [VERIFYING AUDIT CERTIFICATE INTEGRITY...]
      </div>
    );
  }

  if (!assessment) {
    return (
      <Card className="py-16 text-center text-slate-400 font-mono text-xs">
        <p>AUDIT DOSSIER NOT FOUND IN COMPLIANCE LEDGER.</p>
        <Link to="/assessments" className="mt-4 inline-block">
          <Button variant="outline" size="sm">Back to Ledger</Button>
        </Link>
      </Card>
    );
  }

  const sys = typeof assessment.aiSystemId === 'object' ? assessment.aiSystemId : null;
  const assessor = typeof assessment.assessorId === 'object' ? assessment.assessorId : null;

  const categories = [
    { label: 'Transparency & Technical Explainability', score: assessment.transparencyScore, icon: Eye, ref: 'EU AI Act Art. 13' },
    { label: 'Algorithmic Fairness & Bias Mitigation', score: assessment.biasScore, icon: Scale, ref: 'EU Art. 10 & NDPA s.24' },
    { label: 'Data Protection & Privacy Rigor', score: assessment.privacyScore, icon: Shield, ref: 'NDPA 2023 Part III' },
    { label: 'Human Oversight & Override Safeguards', score: assessment.humanOversightScore, icon: CheckCircle2, ref: 'EU AI Act Art. 14' },
    { label: 'Training Corpus Governance & Data Lineage', score: assessment.dataQualityScore, icon: FileText, ref: 'EU AI Act Art. 10' },
  ];

  return (
    <div className="space-y-6">
      {/* Dossier Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1c222e]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/assessments')}
            className="p-1.5 text-slate-400 hover:text-white rounded-[4px] hover:bg-[#151922] border border-transparent hover:border-[#283244] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono tracking-widest text-blue-400 uppercase bg-blue-950/40 px-2 py-0.5 border border-blue-800/50 rounded-[3px]">
                CERTIFICATE ID: {assessment._id.substring(0, 12).toUpperCase()}
              </span>
              <RiskBadge level={assessment.riskLevel} />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              {sys?.name || 'Statutory AI System Assessment'}
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Verified by {assessor?.name || 'Accredited Assessor'} on {new Date(assessment.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            size="sm"
            loading={generatingPdf}
            onClick={handleExportPDF}
            className="gap-2 font-mono"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Generate Certified PDF Dossier</span>
          </Button>
        </div>
      </div>

      {/* Primary Classification Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Risk Instrument */}
        <div className="flex flex-col">
          <RiskGauge
            score={assessment.overallRiskScore}
            riskLevel={assessment.riskLevel}
          />
        </div>

        {/* System Profile & Scope */}
        <Card tag="LEGAL SPEC" className="lg:col-span-2 space-y-4">
          <CardHeader
            title="Operational Scope & Statutory Classification"
            subtitle="Deployment boundaries registered under EU AI Act Regulation 2024/1689 and Nigeria NDPA 2023."
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div className="bg-[#090b0e] p-3 rounded-[3px] border border-[#1d2331]">
              <span className="text-slate-500 text-[10px] uppercase block mb-1">Operating Domain:</span>
              <span className="font-semibold text-white capitalize">{sys?.domain || 'General'}</span>
            </div>
            <div className="bg-[#090b0e] p-3 rounded-[3px] border border-[#1d2331]">
              <span className="text-slate-500 text-[10px] uppercase block mb-1">Human Oversight:</span>
              <span className="font-semibold text-white capitalize">{sys?.humanOversightLevel || 'Moderate'}</span>
            </div>
            <div className="bg-[#090b0e] p-3 rounded-[3px] border border-[#1d2331]">
              <span className="text-slate-500 text-[10px] uppercase block mb-1">Autonomy Model:</span>
              <span className="font-semibold text-white">{sys?.isAutonomous ? 'Fully Autonomous' : 'Assisted'}</span>
            </div>
          </div>

          {sys?.description && (
            <div className="text-xs text-slate-300 font-mono bg-[#090b0e] p-3 rounded-[3px] border border-[#1d2331] leading-relaxed">
              <span className="text-slate-500 uppercase text-[10px] block mb-1">Architecture Summary:</span>
              {sys.description}
            </div>
          )}

          <div className="pt-2 border-t border-[#1a202c]">
            <span className="text-[10px] font-mono text-slate-400 block mb-2 uppercase tracking-wider">
              Statutory Benchmark Citations:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {assessment.regulatoryReferences.map((ref, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-mono bg-[#141822] text-slate-300 px-2 py-0.5 rounded-[3px] border border-[#273042]"
                >
                  {ref}
                </span>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Five Pillars of Conformity */}
      <Card tag="EVALUATION: 5-PILLARS">
        <CardHeader
          title="Statutory Core Conformity Breakdown"
          subtitle="Precision evaluation across the five mandatory criteria of EU AI Act Articles 9, 10, 13, 14 & NDPA Section 24."
        />

        <div className="space-y-3 font-mono text-xs">
          {categories.map((c) => {
            const Icon = c.icon;
            const isGood = c.score >= 70;
            const isMedium = c.score >= 40 && c.score < 70;
            return (
              <div key={c.label} className="p-3 rounded-[4px] bg-[#090b0e] border border-[#1d2331]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 text-blue-400" />
                    <span className="font-semibold text-white">{c.label}</span>
                    <span className="text-[10px] text-slate-500">[{c.ref}]</span>
                  </div>
                  <span
                    className={`font-bold ${
                      isGood ? 'text-emerald-400' : isMedium ? 'text-amber-400' : 'text-rose-400'
                    }`}
                  >
                    {c.score}.00 / 100
                  </span>
                </div>
                {/* Segmented bar */}
                <div className="w-full bg-[#131720] border border-[#202735] rounded-[2px] h-2 p-0.5 overflow-hidden">
                  <div
                    className={`h-full rounded-[1px] transition-all duration-500 ${
                      isGood ? 'bg-emerald-500' : isMedium ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${c.score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Findings */}
      {assessment.findings && assessment.findings.length > 0 && (
        <Card tag="AUDIT: OBSERVATIONS">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#1c222e]">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-white font-mono uppercase tracking-wide">
              Inspector Observations & Empirical Findings
            </h3>
          </div>
          <div className="space-y-2 font-mono text-xs">
            {assessment.findings.map((f, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 p-3 rounded-[3px] bg-[#090b0e] border border-[#1d2331] text-slate-300 leading-relaxed"
              >
                <span className="text-amber-400 font-bold">[{i + 1}]</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Recommendations & Mitigation Orders */}
      {assessment.recommendations && assessment.recommendations.length > 0 && (
        <Card tag="MANDATED ACTIONS">
          <CardHeader
            title="Mandatory Mitigation Directives"
            subtitle="Corrective measures required before commercial deployment certification."
          />
          <div className="space-y-3 font-mono text-xs">
            {assessment.recommendations.map((rec, i) => {
              const isCrit = rec.priority === 'critical';
              const isHigh = rec.priority === 'high';
              return (
                <div
                  key={i}
                  className={`p-3.5 rounded-[4px] border space-y-2 ${
                    isCrit
                      ? 'bg-rose-950/20 border-rose-800/50'
                      : isHigh
                      ? 'bg-amber-950/20 border-amber-800/50'
                      : 'bg-[#090b0e] border-[#1d2331]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white uppercase tracking-tight">{rec.category}</span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[3px] border ${
                        isCrit
                          ? 'bg-rose-950/40 text-rose-300 border-rose-800/60'
                          : isHigh
                          ? 'bg-amber-950/40 text-amber-300 border-amber-800/60'
                          : 'bg-[#141822] text-slate-300 border-[#262f3f]'
                      }`}
                    >
                      {rec.priority} Priority
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{rec.description}</p>
                  {rec.regulatoryReference && (
                    <div className="text-[10px] text-blue-400 flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      <span>{rec.regulatoryReference}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-[#181d27] text-slate-400">
                    <strong className="text-slate-200">MITIGATION DIRECTIVE: </strong>
                    {rec.mitigationMeasure}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
};
