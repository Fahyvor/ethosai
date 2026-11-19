import React, { useEffect, useState } from 'react';
import { toast } from 'sleek-toast';
import api from '../../lib/api';
import { RegulatoryResource } from '../../types';
import { Card } from '../../components/ui/Card';
import { BookOpen, Search } from '../../components/ui/Icons';

export const Resources: React.FC = () => {
  const [resources, setResources] = useState<RegulatoryResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'all' | 'eu_ai_act' | 'ndpa_2023'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const res = await api.get('/resources');
        setResources(res.data);
      } catch {
        toast.error('Failed to load regulatory resources');
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const filtered = resources.filter((r) => {
    const matchesTab = tab === 'all' || r.category === tab;
    const matchesSearch =
      r.article.toLowerCase().includes(search.toLowerCase()) ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.relevance.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          AI Ethics & Regulatory Knowledge Base
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Statutory provisions, legal benchmarks, and compliance guidance for AI systems
        </p>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 self-start">
          <button
            onClick={() => setTab('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              tab === 'all'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Standards
          </button>
          <button
            onClick={() => setTab('eu_ai_act')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              tab === 'eu_ai_act'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            EU AI Act (2024)
          </button>
          <button
            onClick={() => setTab('ndpa_2023')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              tab === 'ndpa_2023'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            NDPA 2023
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search article, keyword, topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Resources Cards */}
      {loading ? (
        <div className="py-16 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading statutory guidelines...
        </div>
      ) : filtered.length === 0 ? (
        <Card className="py-12 text-center text-slate-500">
          <BookOpen className="w-10 h-10 mx-auto text-slate-700 mb-2" />
          <p className="text-sm">No regulatory articles match your search filter.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((r) => {
            const isEu = r.category === 'eu_ai_act';
            return (
              <Card key={r.id} className="flex flex-col justify-between hover:border-slate-700 transition-colors">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {r.article}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      {isEu ? 'EU AI Act (2024)' : 'NDPA 2023'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">{r.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{r.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 bg-slate-950/60 p-3 rounded-lg border border-slate-800/40">
                  <span className="text-[11px] font-semibold text-emerald-400 block mb-1">
                    AI Assessment Relevance:
                  </span>
                  <p className="text-xs text-slate-400 leading-relaxed">{r.relevance}</p>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
