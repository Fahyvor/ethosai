import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sleek-toast';
import api from '../../lib/api';
import { Assessment } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { RiskBadge, StatusBadge } from '../../components/ui/Badge';
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
        toast.error('Failed to load assessment report');
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
      toast.info('Generating official governance audit PDF...');
      const res = await api.post('/reports/generate', { assessmentId: assessment._id });
      toast.success('PDF report ready! Downloading...');

      // Open download link
      const downloadRes = await api.get(`/reports/${res.data.report._id}/pdf`, {
        responseType: 'blob',
      });
      const blob = new Blob([downloadRes.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ethosai-audit-${assessment._id}.pdf`);
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
      <div className="py-20 text-center text-slate-400">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading governance assessment details...
      </div>
    );
  }

  if (!assessment) {
    return (
      <Card className="py-16 text-center text-slate-400">
        <p>Assessment record not found.</p>
        <Link to="/assessments" className="mt-4 inline-block">
          <Button variant="outline" size="sm">Back to Assessments</Button>
        </Link>
      </Card>
    );
  }

  const sys = typeof assessment.aiSystemId === 'object' ? assessment.aiSystemId : null;
  const assessor = typeof assessment.assessorId === 'object' ? assessment.assessorId : null;

  const categories = [
    { label: 'Transparency & Explainability', score: assessment.transparencyScore, icon: Eye, ref: 'EU AI Act Art. 13' },
    { label: 'Bias & Non-Discrimination', score: assessment.biasScore, icon: Scale, ref: 'Art. 10 & NDPA s.24' },
    { label: 'Privacy & Data Protection', score: assessment.privacyScore, icon: Shield, ref: 'NDPA 2023 Part III' },
    { label: 'Human Oversight Capability', score: assessment.humanOversightScore, icon: CheckCircle2, ref: 'EU AI Act Art. 14' },
    { label: 'Data Quality & Provenance', score: assessment.dataQualityScore, icon: FileText, ref: 'EU AI Act Art. 10' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/assessments')}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {sys?.name || 'AI System Assessment'}
              </h1>
              <RiskBadge level={assessment.riskLevel} />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Evaluated on {new Date(assessment.createdAt).toLocaleDateString()} by {assessor?.name || 'Compliance Officer'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            loading={generatingPdf}
            onClick={handleExportPDF}
            className="gap-2 text-sm"
          >
            <Download className="w-4 h-4" />
            Export Official PDF Report
          </Button>
        </div>
      </div>

      {/* Primary Risk Classification Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Gauge Card */}
        <Card className="flex flex-col items-center justify-center p-6 text-center">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
            Overall Governance Risk Score
          </h3>
          <RiskGauge
            score={assessment.overallRiskScore}
            riskLevel={assessment.riskLevel}
            size={200}
          />
          <div className="mt-4 text-xs text-slate-400 max-w-xs leading-relaxed">
            Calculated under EU AI Act composite risk classification algorithms and fundamental rights weights.
          </div>
        </Card>

        {/* System Profile Card */}
        <Card className="lg:col-span-2 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-semibold text-white">System Profile & Scope</h3>
            <p className="text-xs text-slate-400">Target deployment metrics and regulatory environment</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
              <span className="text-slate-400 block mb-1">Sector Domain:</span>
              <span className="font-semibold text-white capitalize">{sys?.domain || 'General'}</span>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
              <span className="text-slate-400 block mb-1">Human Oversight:</span>
              <span className="font-semibold text-white capitalize">{sys?.humanOversightLevel || 'Moderate'}</span>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
              <span className="text-slate-400 block mb-1">Operational Mode:</span>
              <span className="font-semibold text-white">{sys?.isAutonomous ? 'Fully Autonomous' : 'Assisted Decision'}</span>
            </div>
          </div>

          {sys?.description && (
            <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-slate-800/50">
              <strong className="text-slate-200">Description:</strong> {sys.description}
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-1">
            <span className="text-xs text-slate-400 self-center mr-1">Statutory Citations:</span>
            {assessment.regulatoryReferences.map((ref, idx) => (
              <span key={idx} className="text-[11px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded border border-slate-700">
                {ref}
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* Component Scores */}
      <Card>
        <h3 className="text-base font-semibold text-white mb-4">Five Pillar Compliance Scores</h3>
        <div className="space-y-4">
          {categories.map((c) => {
            const Icon = c.icon;
            const isGood = c.score >= 70;
            const isMedium = c.score >= 40 && c.score < 70;
            return (
              <div key={c.label} className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-semibold text-white">{c.label}</span>
                    <span className="text-[11px] text-slate-500 font-mono">({c.ref})</span>
                  </div>
                  <span className={`font-mono text-sm font-bold ${
                    isGood ? 'text-emerald-400' : isMedium ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {c.score} / 100
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
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

      {/* Key Findings */}
      {assessment.findings && assessment.findings.length > 0 && (
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-semibold text-white">Audit Findings & Observations</h3>
          </div>
          <div className="space-y-2.5">
            {assessment.findings.map((f, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs">
                <span className="text-amber-400 font-bold shrink-0 mt-0.5">•</span>
                <span className="text-slate-300 leading-relaxed">{f}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Recommendations & Mitigation Measures */}
      {assessment.recommendations && assessment.recommendations.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-base font-semibold text-white">Recommendations & Action Plan</h3>
              <p className="text-xs text-slate-400">Mandated mitigation measures to bring system into compliance</p>
            </div>
          </div>
          <div className="space-y-4">
            {assessment.recommendations.map((rec, i) => {
              const isCrit = rec.priority === 'critical';
              const isHigh = rec.priority === 'high';
              return (
                <div
                  key={i}
                  className={`p-4 rounded-xl border space-y-2 ${
                    isCrit
                      ? 'bg-rose-500/5 border-rose-500/30'
                      : isHigh
                      ? 'bg-amber-500/5 border-amber-500/30'
                      : 'bg-slate-950/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{rec.category}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                      isCrit
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : isHigh
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}>
                      {rec.priority} Priority
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{rec.description}</p>
                  {rec.regulatoryReference && (
                    <div className="text-[11px] text-sky-400 flex items-center gap-1 font-mono">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{rec.regulatoryReference}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                    <strong className="text-slate-200">Mitigation: </strong>{rec.mitigationMeasure}
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
