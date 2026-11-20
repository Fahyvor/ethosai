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

  const filtered = resources.filter((r: RegulatoryResource) => {
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
      {/* Header */}
      <div className="pb-4 border-b border-[#1c222e]">
        <div className="text-[10px] font-mono tracking-widest text-blue-400 uppercase mb-1">
          CORPUS // STATUTORY CODICES & MANDATORY BENCHMARKS
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          AI Ethics & Regulatory Knowledge Base
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Statutory provisions, legal benchmarks, and compliance guidance for AI systems under EU and Nigerian law.
        </p>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex bg-[#0b0e14] p-1 rounded-[4px] border border-[#1d2433] self-start font-mono">
          <button
            onClick={() => setTab('all')}
            className={`px-3 py-1.5 rounded-[3px] text-xs transition-all ${
              tab === 'all'
                ? 'bg-[#181f2c] text-white font-semibold border border-blue-500/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Codices
          </button>
          <button
            onClick={() => setTab('eu_ai_act')}
            className={`px-3 py-1.5 rounded-[3px] text-xs transition-all ${
              tab === 'eu_ai_act'
                ? 'bg-[#181f2c] text-white font-semibold border border-blue-500/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            EU AI Act (2024/1689)
          </button>
          <button
            onClick={() => setTab('ndpa_2023')}
            className={`px-3 py-1.5 rounded-[3px] text-xs transition-all ${
              tab === 'ndpa_2023'
                ? 'bg-[#181f2c] text-white font-semibold border border-blue-500/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            NDPA 2023 (Nigeria)
          </button>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search article, keyword, statute topic..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            className="w-full bg-[#0d1016] border border-[#1f2635] rounded-[4px] pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono transition-colors"
          />
        </div>
      </div>

      {/* Resources Cards */}
      {loading ? (
        <div className="py-16 text-center text-xs font-mono text-slate-500">
          [QUERYING STATUTORY CORPUS...]
        </div>
      ) : filtered.length === 0 ? (
        <Card className="py-12 text-center text-slate-500 font-mono text-xs">
          <BookOpen className="w-8 h-8 mx-auto text-slate-700 mb-2" />
          <p>NO STATUTORY PROVISIONS MATCH FILTER QUERY.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((r: RegulatoryResource) => {
            const isEu = r.category === 'eu_ai_act';
            return (
              <Card
                key={r.id}
                tag={isEu ? 'EU-AIA' : 'NDPA-2023'}
                className="flex flex-col justify-between hover:border-[#2b3548] transition-colors"
              >
                <div className="space-y-3 font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-blue-400 bg-blue-950/40 px-2 py-0.5 rounded-[3px] border border-blue-800/40">
                      {r.article}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500">
                      {isEu ? 'Regulation 2024/1689' : 'Act No. 44 (2023)'}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white tracking-tight">{r.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">{r.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#181d28] bg-[#090b0e] p-3 rounded-[3px] border border-[#171c26] font-mono">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block mb-1">
                    Conformity Audit Obligation:
                  </span>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{r.relevance}</p>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
