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

  // Composite estimation
  const approxRiskScore = Math.round(
    (100 - transparencyScore) * 0.2 +
    (100 - biasScore) * 0.25 +
    (100 - privacyScore) * 0.2 +
    (100 - humanOversightScore) * 0.2 +
    (100 - dataQualityScore) * 0.15
  );

  const getEstimatedLevel = (score: number) => {
    if (score >= 85) return 'unacceptable';
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
      toast.error('Please select an AI model from registry');
      setStep(1);
      return;
    }

    try {
      setSubmitting(true);
      toast.info('Computing multi-dimensional risk matrix...');
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
      toast.success('Statutory Audit Determination certified!');
      navigate(`/assessments/${res.data._id}`);
    } catch (err: any) {
      toast.error('Failed to submit assessment');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const stepsList = [
    { num: 1, label: 'PHASE 01: SYSTEM SCOPE' },
    { num: 2, label: 'PHASE 02: BIAS EVALUATION' },
    { num: 3, label: 'PHASE 03: NDPA PRIVACY' },
    { num: 4, label: 'PHASE 04: EU OVERSIGHT' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1c222e]">
        <div>
          <div className="text-[10px] font-mono tracking-widest text-blue-400 uppercase mb-0.5">
            PROCEDURE // CONFORMITY AUDIT WIZARD
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Initiate Statutory Compliance Audit
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Standardized evaluation protocol under EU AI Act Regulation 2024/1689 & NDPA 2023
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#0d1016] border border-[#1f2635] px-3 py-1.5 rounded-[4px] font-mono text-xs">
          <span className="text-slate-500 uppercase text-[10px]">LIVE ESTIMATED CRI:</span>
          <span className="font-bold text-white">{approxRiskScore}/100</span>
          <RiskBadge level={getEstimatedLevel(approxRiskScore)} />
        </div>
      </div>

      {/* Phase Trackers */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 select-none">
        {stepsList.map((s) => (
          <button
            key={s.num}
            type="button"
            onClick={() => setStep(s.num)}
            className={`p-2.5 rounded-[4px] border text-left font-mono text-xs transition-all ${
              step === s.num
                ? 'bg-[#141822] border-blue-500/70 text-white shadow-sm'
                : step > s.num
                ? 'bg-[#0e1117] border-[#222a3a] text-slate-300'
                : 'bg-[#090b0e] border-[#181d28] text-slate-600'
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`w-4 h-4 rounded-[2px] flex items-center justify-center text-[10px] font-bold ${
                  step === s.num ? 'bg-blue-600 text-white' : 'bg-[#181d28] text-slate-400'
                }`}
              >
                {s.num}
              </span>
              <span className="text-[11px] truncate tracking-tight">{s.label}</span>
            </div>
          </button>
        ))}
      </div>

      <Card tag={`PHASE: 0${step}`}>
        {/* STEP 1: SCOPE */}
        {step === 1 && (
          <div className="space-y-5 font-mono text-xs">
            <div className="border-b border-[#1c222e] pb-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Phase 1: Select AI Model & Operational Audit Scope
              </h2>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Specify the deployed automated decision system and conformity assessment context.
              </p>
            </div>

            {loadingSystems ? (
              <div className="py-8 text-center text-slate-500">[FETCHING ASSET REGISTER...]</div>
            ) : systems.length === 0 ? (
              <div className="py-8 text-center space-y-3">
                <p className="text-slate-400">No registered AI systems found in inventory.</p>
                <Button variant="primary" size="sm" onClick={() => navigate('/ai-systems/new')}>
                  Register Model First
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block uppercase text-slate-400 mb-1 text-[11px]">
                    Registered AI System *
                  </label>
                  <select
                    value={aiSystemId}
                    onChange={(e) => setAiSystemId(e.target.value)}
                    className="w-full bg-[#080a0e] border border-[#212735] rounded-[4px] px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 uppercase"
                  >
                    {systems.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name} // DOMAIN: {s.domain.toUpperCase()} // [{s.isAutonomous ? 'AUTONOMOUS' : 'ASSISTED'}]
                      </option>
                    ))}
                  </select>
                </div>

                {selectedSystem && (
                  <div className="p-3.5 bg-[#090b0f] rounded-[3px] border border-[#1c222e] space-y-1.5 text-[11px]">
                    <div className="font-bold text-white tracking-tight">{selectedSystem.name}</div>
                    <div className="text-slate-400">{selectedSystem.description}</div>
                    <div className="flex gap-4 pt-1 text-slate-400 border-t border-[#181d27] mt-2">
                      <span>DOMAIN: <strong className="text-slate-200 capitalize">{selectedSystem.domain}</strong></span>
                      <span>OVERSIGHT: <strong className="text-slate-200 capitalize">{selectedSystem.humanOversightLevel}</strong></span>
                      <span>AUTONOMY: <strong className="text-slate-200">{selectedSystem.isAutonomous ? 'Yes' : 'No'}</strong></span>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block uppercase text-slate-400 mb-1 text-[11px]">
                    Statutory Assessment Phase
                  </label>
                  <select
                    value={assessmentContext}
                    onChange={(e) => setAssessmentContext(e.target.value)}
                    className="w-full bg-[#080a0e] border border-[#212735] rounded-[4px] px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="pre_deployment">Pre-Deployment Conformity Assessment (EU AI Act Art. 43)</option>
                    <option value="post_market">Post-Market Monitoring & Continuous Audit (Art. 72)</option>
                    <option value="substantial_modification">Substantial Modification Re-Assessment (Art. 43(4))</option>
                    <option value="annual_compliance">Annual Fundamental Rights Impact Assessment (NDPA s.30)</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: BIAS & FAIRNESS */}
        {step === 2 && (
          <div className="space-y-5 font-mono text-xs">
            <div className="border-b border-[#1c222e] pb-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Scale className="w-4 h-4 text-blue-400" />
                <span>Phase 2: Algorithmic Fairness & Demographic Parity</span>
              </h2>
              <p className="text-slate-400 text-[11px] mt-0.5">
                EU AI Act Article 10(2)(f) & NDPA Section 24 non-discrimination safeguards.
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="uppercase text-slate-400 text-[11px]">
                  Training Corpus Diversity & Benchmark Representation Score
                </label>
                <span className="font-bold text-blue-400">{biasScore} / 100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={biasScore}
                onChange={(e) => setBiasScore(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 pt-1">
                <span>0.00 (Severe Demographic Skew)</span>
                <span>100.00 (Balanced Multi-Cohort Benchmarks)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-start gap-2.5 p-3 rounded-[3px] bg-[#090b0e] border border-[#1d2331] cursor-pointer">
                <input
                  type="checkbox"
                  checked={fairnessMetricsUsed}
                  onChange={(e) => setFairnessMetricsUsed(e.target.checked)}
                  className="mt-0.5 w-3.5 h-3.5 rounded bg-[#10131a] border-[#293245] text-blue-600"
                />
                <span className="text-slate-300 leading-tight">
                  Statistical parity & equalized odds audits verified across cohorts
                </span>
              </label>

              <label className="flex items-start gap-2.5 p-3 rounded-[3px] bg-[#090b0e] border border-[#1d2331] cursor-pointer">
                <input
                  type="checkbox"
                  checked={proxyDiscriminationRisk}
                  onChange={(e) => setProxyDiscriminationRisk(e.target.checked)}
                  className="mt-0.5 w-3.5 h-3.5 rounded bg-[#10131a] border-[#293245] text-blue-600"
                />
                <span className="text-slate-300 leading-tight">
                  Proxy discrimination risk detected (e.g. zip code/device telemetry acting as proxy)
                </span>
              </label>
            </div>

            <div>
              <label className="block uppercase text-slate-400 mb-2 text-[11px]">
                Protected Groups Tested Against Adverse Impact
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {['Gender', 'Age', 'Race & Ethnicity', 'Disability Status', 'Religion & Belief', 'Socio-economic Status'].map((group) => (
                  <label
                    key={group}
                    className={`flex items-center gap-2 p-2 rounded-[3px] border text-[11px] cursor-pointer ${
                      affectedGroups.includes(group)
                        ? 'bg-blue-950/30 border-blue-800/60 text-blue-300 font-semibold'
                        : 'bg-[#090b0e] border-[#1d2331] text-slate-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={affectedGroups.includes(group)}
                      onChange={() => handleGroupToggle(group)}
                      className="w-3 h-3 text-blue-600 rounded"
                    />
                    <span>{group}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block uppercase text-slate-400 mb-1 text-[11px]">
                Active Debiasing & Algorithmic Countermeasures Applied
              </label>
              <input
                type="text"
                placeholder="e.g. Counterfactual data augmentation, adversarial re-weighting, disparate impact ratio > 0.8"
                value={biasMitigationMeasures}
                onChange={(e) => setBiasMitigationMeasures(e.target.value)}
                className="w-full bg-[#080a0e] border border-[#212735] rounded-[4px] px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {/* STEP 3: PRIVACY & NDPA 2023 */}
        {step === 3 && (
          <div className="space-y-5 font-mono text-xs">
            <div className="border-b border-[#1c222e] pb-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <span>Phase 3: Data Protection & Fundamental Rights (NDPA 2023)</span>
              </h2>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Nigeria Data Protection Act 2023 Part III lawful bases and Section 30 mandatory DPIA.
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="uppercase text-slate-400 text-[11px]">
                  Data Minimization & Subject Privacy Index
                </label>
                <span className="font-bold text-blue-400">{privacyScore} / 100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={privacyScore}
                onChange={(e) => setPrivacyScore(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block uppercase text-slate-400 mb-1 text-[11px]">
                  Lawful Processing Basis (NDPA Part III)
                </label>
                <select
                  value={consentMechanism}
                  onChange={(e) => setConsentMechanism(e.target.value)}
                  className="w-full bg-[#080a0e] border border-[#212735] rounded-[4px] px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 uppercase"
                >
                  <option value="explicit_consent">Explicit & Informed Consent (s.26)</option>
                  <option value="contractual_necessity">Contractual Necessity</option>
                  <option value="vital_interests">Vital / Public Interests</option>
                  <option value="legitimate_interest">Legitimate Commercial Interest</option>
                </select>
              </div>

              <div className="space-y-2 pt-1">
                <label className="flex items-center gap-2.5 p-2 rounded-[3px] bg-[#090b0e] border border-[#1d2331] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dataMinimization}
                    onChange={(e) => setDataMinimization(e.target.checked)}
                    className="w-3.5 h-3.5 text-blue-600 rounded bg-[#10131a] border-[#293245]"
                  />
                  <span className="text-slate-300">Data Minimization Verified (s.24)</span>
                </label>

                <label className="flex items-center gap-2.5 p-2 rounded-[3px] bg-[#090b0e] border border-[#1d2331] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dpiaConducted}
                    onChange={(e) => setDpiaConducted(e.target.checked)}
                    className="w-3.5 h-3.5 text-blue-600 rounded bg-[#10131a] border-[#293245]"
                  />
                  <span className="text-slate-300">Mandatory DPIA Completed (s.30)</span>
                </label>
              </div>
            </div>

            <label className="flex items-start gap-2.5 p-3 rounded-[3px] bg-[#090b0e] border border-[#1d2331] cursor-pointer">
              <input
                type="checkbox"
                checked={crossBorderTransfer}
                onChange={(e) => setCrossBorderTransfer(e.target.checked)}
                className="mt-0.5 w-3.5 h-3.5 text-blue-600 rounded bg-[#10131a] border-[#293245]"
              />
              <span className="text-slate-300 leading-tight">
                Data transferred outside Nigeria or European Economic Area (Subject to NDPA Section 40 adequacy safeguards)
              </span>
            </label>
          </div>
        )}

        {/* STEP 4: TRANSPARENCY & OVERSIGHT */}
        {step === 4 && (
          <div className="space-y-5 font-mono text-xs">
            <div className="border-b border-[#1c222e] pb-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-400" />
                <span>Phase 4: Transparency & Human Oversight (EU AI Act Art. 13 & 14)</span>
              </h2>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Inspect technical documentation, explainability interfaces, and emergency override capabilities.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="uppercase text-slate-400 text-[11px]">
                    Transparency Rating (Art. 13)
                  </label>
                  <span className="font-bold text-blue-400">{transparencyScore} / 100</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={transparencyScore}
                  onChange={(e) => setTransparencyScore(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="uppercase text-slate-400 text-[11px]">
                    Human Oversight Score (Art. 14)
                  </label>
                  <span className="font-bold text-blue-400">{humanOversightScore} / 100</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={humanOversightScore}
                  onChange={(e) => setHumanOversightScore(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="uppercase text-slate-400 text-[11px]">
                  Data Quality & Governance Level (Art. 10)
                </label>
                <span className="font-bold text-blue-400">{dataQualityScore} / 100</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={dataQualityScore}
                onChange={(e) => setDataQualityScore(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-start gap-2.5 p-3 rounded-[3px] bg-[#090b0e] border border-[#1d2331] cursor-pointer">
                <input
                  type="checkbox"
                  checked={rightToExplanation}
                  onChange={(e) => setRightToExplanation(e.target.checked)}
                  className="mt-0.5 w-3.5 h-3.5 text-blue-600 rounded bg-[#10131a] border-[#293245]"
                />
                <span className="text-slate-300 leading-tight">
                  Affected individuals guaranteed plain-language explanations of decisions (Art. 86)
                </span>
              </label>

              <label className="flex items-start gap-2.5 p-3 rounded-[3px] bg-[#090b0e] border border-[#1d2331] cursor-pointer">
                <input
                  type="checkbox"
                  checked={humanOverrideEnabled}
                  onChange={(e) => setHumanOverrideEnabled(e.target.checked)}
                  className="mt-0.5 w-3.5 h-3.5 text-blue-600 rounded bg-[#10131a] border-[#293245]"
                />
                <span className="text-slate-300 leading-tight">
                  Assigned supervisor has instantaneous override & stop-button authority (Art. 14(4))
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="pt-5 border-t border-[#1c222e] flex justify-between items-center mt-6">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setStep(step - 1)}
              className="gap-2 font-mono"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous Phase</span>
            </Button>
          ) : <div />}

          {step < 4 ? (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => setStep(step + 1)}
              className="gap-2 font-mono"
            >
              <span>Next Phase</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="md"
              loading={submitting}
              onClick={handleSubmit}
              className="gap-2 font-mono"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Certify Audit Determination</span>
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
