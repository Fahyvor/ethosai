import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sleek-toast';
import api from '../../lib/api';
import { AISystem } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { RiskBadge } from '../../components/ui/Badge';
import {
  Scale,
  Eye,
  Shield,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from '../../components/ui/Icons';

export const NewAssessment: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedSystemId = searchParams.get('systemId') || '';

  const [step, setStep] = useState(1);
  const [systems, setSystems] = useState<AISystem[]>([]);
  const [loadingSystems, setLoadingSystems] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [aiSystemId, setAiSystemId] = useState(preselectedSystemId);
  const [assessmentContext, setAssessmentContext] = useState('pre_deployment');

  // Step 2: Bias Evaluation
  const [biasScore, setBiasScore] = useState(75);
  const [fairnessMetricsUsed, setFairnessMetricsUsed] = useState(true);
  const [proxyDiscriminationRisk, setProxyDiscriminationRisk] = useState(false);
  const [affectedGroups, setAffectedGroups] = useState<string[]>(['Gender', 'Age']);
  const [biasMitigationMeasures, setBiasMitigationMeasures] = useState('');

  // Step 3: Privacy & Data Protection (NDPA 2023)
  const [privacyScore, setPrivacyScore] = useState(80);
  const [dataMinimization, setDataMinimization] = useState(true);
  const [consentMechanism, setConsentMechanism] = useState('explicit_consent');
  const [crossBorderTransfer, setCrossBorderTransfer] = useState(false);
  const [dpiaConducted, setDpiaConducted] = useState(true);

  // Step 4: Transparency & Human Oversight (EU AI Act)
  const [transparencyScore, setTransparencyScore] = useState(70);
  const [humanOversightScore, setHumanOversightScore] = useState(85);
  const [dataQualityScore, setDataQualityScore] = useState(80);
  const [rightToExplanation, setRightToExplanation] = useState(true);
  const [humanOverrideEnabled, setHumanOverrideEnabled] = useState(true);

  useEffect(() => {
    const fetchSystems = async () => {
      try {
        setLoadingSystems(true);
        const res = await api.get('/ai-systems');
        setSystems(res.data);
        if (!aiSystemId && res.data.length > 0) {
          setAiSystemId(res.data[0]._id);
        }
      } catch {
        toast.error('Failed to load registered AI systems');
      } finally {
        setLoadingSystems(false);
      }
    };
    fetchSystems();
  }, []);

  const selectedSystem = systems.find((s) => s._id === aiSystemId);

  // Quick estimation of risk
  const approxRiskScore = Math.round(
    (100 - transparencyScore) * 0.2 +
    (100 - biasScore) * 0.25 +
    (100 - privacyScore) * 0.2 +
    (100 - humanOversightScore) * 0.2 +
    (100 - dataQualityScore) * 0.15
  );

  const getEstimatedLevel = (score: number) => {
    if (score >= 90) return 'unacceptable';
    if (score >= 60) return 'high';
    if (score >= 30) return 'limited';
    return 'minimal';
  };

  const handleGroupToggle = (group: string) => {
    setAffectedGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    );
  };

  const handleSubmit = async () => {
    if (!aiSystemId) {
      toast.error('Please select an AI system to evaluate');
      setStep(1);
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        aiSystemId,
        transparencyScore,
        biasScore,
        privacyScore,
        humanOversightScore,
        dataQualityScore,
        assessmentData: {
          assessmentContext,
          fairnessMetricsUsed,
          proxyDiscriminationRisk,
          affectedGroups,
          biasMitigationMeasures,
          dataMinimization,
          consentMechanism,
          crossBorderTransfer,
          dpiaConducted,
          rightToExplanation,
          humanOverrideEnabled,
        },
      };

      const res = await api.post('/assessments', payload);
      toast.success('Risk assessment completed and classified!');
      navigate(`/assessments/${res.data._id}`);
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Failed to submit assessment';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const stepsList = [
    { num: 1, label: 'Scope & Target' },
    { num: 2, label: 'Bias & Fairness' },
    { num: 3, label: 'NDPA 2023 Privacy' },
    { num: 4, label: 'Transparency & Oversight' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            AI Governance & Ethics Assessment
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Standardized evaluation framework under EU AI Act & Nigeria Data Protection Act 2023
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
          <span className="text-xs text-slate-400">Live Risk Index:</span>
          <span className="font-mono text-sm font-bold text-emerald-400">{approxRiskScore}/100</span>
          <RiskBadge level={getEstimatedLevel(approxRiskScore)} />
        </div>
      </div>

      {/* Step Progress Indicators */}
      <div className="grid grid-cols-4 gap-2">
        {stepsList.map((s) => (
          <button
            key={s.num}
            onClick={() => setStep(s.num)}
            className={`p-3 rounded-lg border text-left transition-all ${
              step === s.num
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                : step > s.num
                ? 'bg-slate-900/80 border-slate-800 text-slate-200'
                : 'bg-slate-950 border-slate-900 text-slate-600'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step === s.num ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
              }`}>
                {s.num}
              </span>
              <span className="text-xs font-semibold truncate">{s.label}</span>
            </div>
          </button>
        ))}
      </div>

      <Card>
        {/* STEP 1: SCOPE */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white">Step 1: Select AI System & Audit Scope</h2>
              <p className="text-xs text-slate-400">Specify the model to be audited and the operational stage</p>
            </div>

            {loadingSystems ? (
              <div className="py-8 text-center text-slate-400 text-sm">Loading systems...</div>
            ) : systems.length === 0 ? (
              <div className="py-8 text-center space-y-3">
                <p className="text-sm text-slate-400">No registered AI systems found. Register one first.</p>
                <Button variant="primary" onClick={() => navigate('/ai-systems/new')}>
                  Register System
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Select AI System *
                  </label>
                  <select
                    value={aiSystemId}
                    onChange={(e) => setAiSystemId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 capitalize"
                  >
                    {systems.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name} ({s.domain} • {s.isAutonomous ? 'Autonomous' : 'Assisted'})
                      </option>
                    ))}
                  </select>
                </div>

                {selectedSystem && (
                  <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs space-y-2">
                    <div className="font-semibold text-white">{selectedSystem.name}</div>
                    <div className="text-slate-400">{selectedSystem.description}</div>
                    <div className="flex gap-4 pt-1 text-slate-300">
                      <span><strong>Domain:</strong> {selectedSystem.domain}</span>
                      <span><strong>Oversight:</strong> {selectedSystem.humanOversightLevel}</span>
                      <span><strong>Autonomy:</strong> {selectedSystem.isAutonomous ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Audit Phase / Context
                  </label>
                  <select
                    value={assessmentContext}
                    onChange={(e) => setAssessmentContext(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="pre_deployment">Pre-Deployment Conformity Assessment (EU AI Act Art. 43)</option>
                    <option value="post_market">Post-Market Monitoring & Continuous Audit (Art. 72)</option>
                    <option value="substantial_modification">Substantial Modification Re-Assessment</option>
                    <option value="annual_compliance">Annual Fundamental Rights Review</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: BIAS & FAIRNESS */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Scale className="w-5 h-5 text-emerald-400" />
                Step 2: Bias & Discrimination Evaluation
              </h2>
              <p className="text-xs text-slate-400">EU AI Act Art. 10 & NDPA s.24 Non-Discrimination Protections</p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Training Data Diversity & Representation Score
                </label>
                <span className="font-mono text-sm font-bold text-emerald-400">{biasScore} / 100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={biasScore}
                onChange={(e) => setBiasScore(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <span className="text-[11px] text-slate-500">
                100 = Comprehensive representation of all protected demographic groups; 0 = Severe skew/unbalanced.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={fairnessMetricsUsed}
                  onChange={(e) => setFairnessMetricsUsed(e.target.checked)}
                  className="w-4 h-4 text-emerald-500 rounded bg-slate-900 border-slate-700"
                />
                <span className="text-xs text-slate-300">
                  Statistical fairness metrics verified (Demographic Parity, Equalized Odds)
                </span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={proxyDiscriminationRisk}
                  onChange={(e) => setProxyDiscriminationRisk(e.target.checked)}
                  className="w-4 h-4 text-emerald-500 rounded bg-slate-900 border-slate-700"
                />
                <span className="text-xs text-slate-300">
                  Risk of proxy discrimination identified (e.g. location/telemetry proxying protected status)
                </span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Protected Groups Evaluated for Differential Impact
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {['Gender', 'Age', 'Race & Ethnicity', 'Disability Status', 'Religion & Belief', 'Socio-economic Status'].map((group) => (
                  <label
                    key={group}
                    className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer ${
                      affectedGroups.includes(group)
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={affectedGroups.includes(group)}
                      onChange={() => handleGroupToggle(group)}
                      className="w-3.5 h-3.5 text-emerald-500 rounded bg-slate-900 border-slate-700"
                    />
                    <span>{group}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Bias Mitigation & Countermeasures Applied
              </label>
              <input
                type="text"
                placeholder="e.g. Adversarial debiasing, re-weighting sampling, threshold adjustment"
                value={biasMitigationMeasures}
                onChange={(e) => setBiasMitigationMeasures(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        )}

        {/* STEP 3: PRIVACY & NDPA 2023 */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                Step 3: Privacy & Data Protection (NDPA 2023 / GDPR)
              </h2>
              <p className="text-xs text-slate-400">Nigeria Data Protection Act 2023 Part III & Section 30 DPIA</p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Data Protection & Privacy Compliance Index
                </label>
                <span className="font-mono text-sm font-bold text-emerald-400">{privacyScore} / 100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={privacyScore}
                onChange={(e) => setPrivacyScore(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Lawful Basis for Processing (NDPA Part III)
                </label>
                <select
                  value={consentMechanism}
                  onChange={(e) => setConsentMechanism(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="explicit_consent">Explicit & Informed Consent (s.26)</option>
                  <option value="contractual_necessity">Contractual Necessity</option>
                  <option value="vital_interests">Vital / Public Interests</option>
                  <option value="legitimate_interest">Legitimate Commercial Interest</option>
                </select>
              </div>

              <div className="space-y-2 pt-2">
                <label className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dataMinimization}
                    onChange={(e) => setDataMinimization(e.target.checked)}
                    className="w-4 h-4 text-emerald-500 rounded bg-slate-900 border-slate-700"
                  />
                  <span className="text-xs text-slate-300">
                    Data Minimization Verified (NDPA s.24)
                  </span>
                </label>

                <label className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dpiaConducted}
                    onChange={(e) => setDpiaConducted(e.target.checked)}
                    className="w-4 h-4 text-emerald-500 rounded bg-slate-900 border-slate-700"
                  />
                  <span className="text-xs text-slate-300">
                    Formal DPIA Completed (NDPA s.30)
                  </span>
                </label>
              </div>
            </div>

            <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={crossBorderTransfer}
                onChange={(e) => setCrossBorderTransfer(e.target.checked)}
                className="w-4 h-4 text-emerald-500 rounded bg-slate-900 border-slate-700"
              />
              <span className="text-xs text-slate-300">
                Data transferred outside Nigeria or EU (Subject to NDPA Section 40 adequacy safeguards)
              </span>
            </label>
          </div>
        )}

        {/* STEP 4: TRANSPARENCY & OVERSIGHT */}
        {step === 4 && (
          <div className="space-y-5">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-emerald-400" />
                Step 4: Transparency & Human Oversight (EU AI Act Art. 13 & 14)
              </h2>
              <p className="text-xs text-slate-400">Explainability mechanisms, right to explanation & kill-switch controls</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Transparency Score (Art. 13)
                  </label>
                  <span className="font-mono text-sm font-bold text-emerald-400">{transparencyScore} / 100</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={transparencyScore}
                  onChange={(e) => setTransparencyScore(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Human Oversight Score (Art. 14)
                  </label>
                  <span className="font-mono text-sm font-bold text-emerald-400">{humanOversightScore} / 100</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={humanOversightScore}
                  onChange={(e) => setHumanOversightScore(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Data Governance & Quality Score (Art. 10)
                </label>
                <span className="font-mono text-sm font-bold text-emerald-400">{dataQualityScore} / 100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={dataQualityScore}
                onChange={(e) => setDataQualityScore(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rightToExplanation}
                  onChange={(e) => setRightToExplanation(e.target.checked)}
                  className="w-4 h-4 text-emerald-500 rounded bg-slate-900 border-slate-700"
                />
                <span className="text-xs text-slate-300">
                  Users guaranteed clear, plain-language explanations of decisions (Art. 86)
                </span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={humanOverrideEnabled}
                  onChange={(e) => setHumanOverrideEnabled(e.target.checked)}
                  className="w-4 h-4 text-emerald-500 rounded bg-slate-900 border-slate-700"
                />
                <span className="text-xs text-slate-300">
                  Human supervisor has override authority & stop-button mechanism (Art. 14(4))
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="pt-6 border-t border-slate-800 flex justify-between items-center mt-6">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setStep(step - 1)}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>
          ) : <div />}

          {step < 4 ? (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => setStep(step + 1)}
              className="gap-2"
            >
              Next Step
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="md"
              loading={submitting}
              onClick={handleSubmit}
              className="gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Compute & Finalize Risk Assessment
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
