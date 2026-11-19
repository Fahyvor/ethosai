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
      toast.error('Please fill in all mandatory fields');
      return;
    }

    try {
      setLoading(true);
      await api.post('/ai-systems', form);
      toast.success(`"${form.name}" registered successfully!`);
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
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/ai-systems')}
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Register New AI System</h1>
          <p className="text-sm text-slate-400">
            Submit architecture and operational parameters for EU AI Act & NDPA classification
          </p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                AI System Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. MedVision Diagnostics Model"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Operating Domain *
              </label>
              <select
                value={form.domain}
                onChange={(e) => setForm({ ...form, domain: e.target.value })}
                className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 capitalize"
              >
                <option value="healthcare">Healthcare & Medicine (High-Risk)</option>
                <option value="finance">Finance, Banking & Credit Scoring</option>
                <option value="hr">HR, Recruitment & Worker Evaluation</option>
                <option value="education">Education & Vocational Assessment</option>
                <option value="public_services">Public Services & Social Security</option>
                <option value="law_enforcement">Law Enforcement & Justice</option>
                <option value="other">Other / Commercial AI</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              System Description & Architecture *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Provide a concise technical summary of the model (e.g. Vision Transformer fine-tuned on clinical X-ray datasets)"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Intended Purpose & Use-Case *
            </label>
            <textarea
              required
              rows={2}
              placeholder="What specific tasks, decisions, or recommendations does this AI system execute?"
              value={form.purpose}
              onChange={(e) => setForm({ ...form, purpose: e.target.value })}
              className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Deployment Context & Target Users *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Hospital Radiologists across Nigeria & West Africa"
              value={form.deploymentContext}
              onChange={(e) => setForm({ ...form, deploymentContext: e.target.value })}
              className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Autonomy & Human Oversight */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Level of Autonomy
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isAutonomous}
                  onChange={(e) => setForm({ ...form, isAutonomous: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded bg-slate-900 border-slate-700 focus:ring-emerald-500"
                />
                <span className="text-xs text-slate-300">
                  Operates fully autonomously without mandatory human pre-approval
                </span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Human Oversight Mechanism (EU AI Act Art. 14)
              </label>
              <select
                value={form.humanOversightLevel}
                onChange={(e) => setForm({ ...form, humanOversightLevel: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white capitalize focus:outline-none focus:border-emerald-500"
              >
                <option value="full">Full Human-in-the-Loop (Mandatory Review)</option>
                <option value="moderate">Moderate Oversight (Human-on-the-Loop)</option>
                <option value="minimal">Minimal Oversight (Post-decision Audits)</option>
                <option value="none">No Human Oversight</option>
              </select>
            </div>
          </div>

          {/* Data Types */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Categories of Data Processed (NDPA 2023 / GDPR)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {availableDataTypes.map((type) => (
                <label
                  key={type}
                  className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                    form.dataTypesUsed.includes(type)
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form.dataTypesUsed.includes(type)}
                    onChange={() => handleDataTypeToggle(type)}
                    className="w-3.5 h-3.5 text-emerald-500 rounded bg-slate-900 border-slate-700"
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Training Data Governance & Provenance
              </label>
              <input
                type="text"
                placeholder="e.g. Curated from NIH clinical repository with IRB clearance"
                value={form.trainingDataDescription}
                onChange={(e) => setForm({ ...form, trainingDataDescription: e.target.value })}
                className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Developer / Vendor Entity
              </label>
              <input
                type="text"
                placeholder="e.g. Internal Engineering Team or Third-party Provider"
                value={form.vendor}
                onChange={(e) => setForm({ ...form, vendor: e.target.value })}
                className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/ai-systems')}
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading} variant="primary">
              Register System in Inventory
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
