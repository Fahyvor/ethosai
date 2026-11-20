import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sleek-toast';
import api from '../../lib/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ArrowLeft } from '../../components/ui/Icons';

export const RegisterAISystem: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    description: '',
    purpose: '',
    domain: 'healthcare',
    deploymentContext: '',
    isAutonomous: false,
    humanOversightLevel: 'moderate',
    trainingDataDescription: '',
    vendor: '',
    dataTypesUsed: [] as string[],
  });

  const availableDataTypes = [
    'Biometric & Facial Identification Data',
    'Personal Identifiable Information (PII)',
    'Financial & Credit Records',
    'Health & Medical Records',
    'User Behavior & Telemetry Logs',
    'Publicly Available Web Scrapes',
    'Special Category / Sensitive Data',
  ];

  const handleDataTypeToggle = (type: string) => {
    setForm((prev) => ({
      ...prev,
      dataTypesUsed: prev.dataTypesUsed.includes(type)
        ? prev.dataTypesUsed.filter((t) => t !== type)
        : [...prev.dataTypesUsed, type],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.purpose || !form.deploymentContext) {
      toast.error('Please fill in all mandatory specification fields');
      return;
    }

    try {
      setLoading(true);
      await api.post('/ai-systems', form);
      toast.success(`"${form.name}" catalogued in governance register`);
      navigate('/ai-systems');
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Failed to register AI system';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-[#1c222e]">
        <button
          onClick={() => navigate('/ai-systems')}
          className="p-1.5 text-slate-400 hover:text-white rounded-[4px] hover:bg-[#151922] border border-transparent hover:border-[#283244] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <div className="text-[10px] font-mono tracking-widest text-blue-400 uppercase mb-0.5">
            NEW SPECIFICATION // FORM 10-AIA
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Register AI System Specification
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Architecture and operational disclosure for statutory EU AI Act & NDPA screening
          </p>
        </div>
      </div>

      <Card tag="SPEC: INPUT-FORM">
        <form onSubmit={handleSubmit} className="space-y-5 text-xs font-mono">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                System Nomenclature *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. ClinicalPulse Diagnostic Vision Model"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-[#080a0e] border border-[#212735] rounded-[4px] px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                Operating Domain *
              </label>
              <select
                value={form.domain}
                onChange={(e) => setForm({ ...form, domain: e.target.value })}
                className="w-full bg-[#080a0e] border border-[#212735] rounded-[4px] px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 uppercase"
              >
                <option value="healthcare">Healthcare & Diagnostic Triage (High Risk)</option>
                <option value="finance">Finance, Banking & Credit Evaluation</option>
                <option value="hr">HR, Recruitment & Worker Screening</option>
                <option value="education">Education & Vocational Scoring</option>
                <option value="public_services">Public Services & Social Benefits</option>
                <option value="law_enforcement">Law Enforcement & Predictive Risk</option>
                <option value="other">General Commercial System</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
              Technical Description & Model Architecture *
            </label>
            <textarea
              required
              rows={3}
              placeholder="e.g. Multi-layer Transformer architecture trained on 120,000 anonymized hospital CT scans with multi-head attention."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-[#080a0e] border border-[#212735] rounded-[4px] px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
              Intended Purpose & Automated Decision Scope *
            </label>
            <textarea
              required
              rows={2}
              placeholder="What exact decisions, outputs, or workflow rankings does this model generate?"
              value={form.purpose}
              onChange={(e) => setForm({ ...form, purpose: e.target.value })}
              className="w-full bg-[#080a0e] border border-[#212735] rounded-[4px] px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
              Deployment Context & Geographic Jurisdiction *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Deployed across clinical hospital networks in Europe and Nigeria"
              value={form.deploymentContext}
              onChange={(e) => setForm({ ...form, deploymentContext: e.target.value })}
              className="w-full bg-[#080a0e] border border-[#212735] rounded-[4px] px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Autonomy & Oversight Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-[4px] bg-[#090b0f] border border-[#1b212d]">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-slate-300 mb-2">
                Operational Autonomy Level
              </label>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isAutonomous}
                  onChange={(e) => setForm({ ...form, isAutonomous: e.target.checked })}
                  className="mt-0.5 w-3.5 h-3.5 rounded bg-[#10131a] border-[#293245] text-blue-600"
                />
                <span className="text-[11px] text-slate-400 leading-tight">
                  Operates autonomously without mandatory human pre-authorization per decision
                </span>
              </label>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-slate-300 mb-2">
                Human Oversight Mechanism (EU AI Act Art. 14)
              </label>
              <select
                value={form.humanOversightLevel}
                onChange={(e) => setForm({ ...form, humanOversightLevel: e.target.value })}
                className="w-full bg-[#080a0e] border border-[#212735] rounded-[4px] px-3 py-1.5 text-xs text-white uppercase focus:outline-none focus:border-blue-500"
              >
                <option value="full">Full Human-in-the-Loop (Mandatory Sign-off)</option>
                <option value="moderate">Moderate Oversight (Human-on-the-Loop)</option>
                <option value="minimal">Minimal Oversight (Post-action Audit)</option>
                <option value="none">Zero Oversight (Unattended Pipeline)</option>
              </select>
            </div>
          </div>

          {/* Categories of Data Processed */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-2">
              Categories of Data Ingested (NDPA 2023 Part III / GDPR)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {availableDataTypes.map((type) => (
                <label
                  key={type}
                  className={`flex items-center gap-2 p-2 rounded-[3px] border text-[11px] cursor-pointer transition-colors ${
                    form.dataTypesUsed.includes(type)
                      ? 'bg-blue-950/30 border-blue-800/60 text-blue-300 font-semibold'
                      : 'bg-[#090b0f] border-[#1b212d] text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form.dataTypesUsed.includes(type)}
                    onChange={() => handleDataTypeToggle(type)}
                    className="w-3 h-3 text-blue-600 rounded bg-[#10131a] border-[#293245]"
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                Training Corpus Lineage
              </label>
              <input
                type="text"
                placeholder="e.g. Curated clinical imaging register with ethical committee clearance"
                value={form.trainingDataDescription}
                onChange={(e) => setForm({ ...form, trainingDataDescription: e.target.value })}
                className="w-full bg-[#080a0e] border border-[#212735] rounded-[4px] px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                Developing Provider / Legal Entity
              </label>
              <input
                type="text"
                placeholder="e.g. BioVision Tech Ltd. / Internal Data Unit"
                value={form.vendor}
                onChange={(e) => setForm({ ...form, vendor: e.target.value })}
                className="w-full bg-[#080a0e] border border-[#212735] rounded-[4px] px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#1c222e] flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => navigate('/ai-systems')}
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading} variant="primary" size="sm">
              Commit System to Inventory
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
