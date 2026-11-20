import React from 'react';

interface RiskGaugeProps {
  score: number; // 0 to 100
  riskLevel: string;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ score, riskLevel }) => {
  const normalizedLevel = (riskLevel || '').toLowerCase();

  let accentColor = '#10b981';
  let statutoryTier = 'Voluntary / Article 69 Code of Conduct';

  if (score >= 85 || normalizedLevel === 'unacceptable') {
    accentColor = '#f43f5e';
    statutoryTier = 'Article 5 // Prohibited Practice Detected';
  } else if (score >= 60 || normalizedLevel === 'high') {
    accentColor = '#f59e0b';
    statutoryTier = 'Article 6 & Annex III // Mandatory Conformity Assessment';
  } else if (score >= 30 || normalizedLevel === 'limited') {
    accentColor = '#38bdf8';
    statutoryTier = 'Article 50 // Transparency & Marking Obligation';
  }

  // Calculate percentage within 0-100 clamp
  const clamped = Math.max(0, Math.min(100, Math.round(score)));

  return (
    <div className="w-full bg-[#0c0e13] border border-[#1d2330] rounded-[6px] p-5 shadow-inner">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#181d28]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-[2px]" style={{ backgroundColor: accentColor }} />
          <span className="text-[11px] font-mono tracking-wider uppercase text-slate-400">
            Composite Risk Index (CRI)
          </span>
        </div>
        <div className="font-mono text-xs text-slate-500">SCALE: 0.00 — 100.00</div>
      </div>

      {/* Main Metric Display */}
      <div className="flex items-baseline justify-between mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-mono font-bold tracking-tight text-white">{clamped}</span>
          <span className="text-xs font-mono text-slate-500">/ 100</span>
        </div>
        <div className="text-right">
          <span
            className="text-xs font-mono uppercase tracking-wider font-semibold px-2.5 py-1 border rounded-[3px]"
            style={{
              borderColor: `${accentColor}50`,
              color: accentColor,
              backgroundColor: `${accentColor}12`,
            }}
          >
            {riskLevel} Risk Tier
          </span>
        </div>
      </div>

      {/* Precision Segmented Bar */}
      <div className="space-y-1.5">
        <div className="relative h-3 w-full bg-[#131720] border border-[#222837] rounded-[3px] overflow-hidden p-0.5 flex gap-1">
          {/* Segment 1: Minimal [0-30] */}
          <div className="h-full flex-1 bg-[#10b981]/20 rounded-[2px] relative">
            {clamped <= 30 && (
              <div
                className="h-full bg-[#10b981] transition-all duration-500"
                style={{ width: `${(clamped / 30) * 100}%` }}
              />
            )}
            {clamped > 30 && <div className="h-full bg-[#10b981]/70" />}
          </div>

          {/* Segment 2: Limited [30-60] */}
          <div className="h-full flex-1 bg-[#38bdf8]/20 rounded-[2px] relative">
            {clamped > 30 && clamped <= 60 && (
              <div
                className="h-full bg-[#38bdf8] transition-all duration-500"
                style={{ width: `${((clamped - 30) / 30) * 100}%` }}
              />
            )}
            {clamped > 60 && <div className="h-full bg-[#38bdf8]/70" />}
          </div>

          {/* Segment 3: High [60-85] */}
          <div className="h-full flex-1 bg-[#f59e0b]/20 rounded-[2px] relative">
            {clamped > 60 && clamped <= 85 && (
              <div
                className="h-full bg-[#f59e0b] transition-all duration-500"
                style={{ width: `${((clamped - 60) / 25) * 100}%` }}
              />
            )}
            {clamped > 85 && <div className="h-full bg-[#f59e0b]/70" />}
          </div>

          {/* Segment 4: Unacceptable [85-100] */}
          <div className="h-full flex-1 bg-[#f43f5e]/20 rounded-[2px] relative">
            {clamped > 85 && (
              <div
                className="h-full bg-[#f43f5e] transition-all duration-500"
                style={{ width: `${((clamped - 85) / 15) * 100}%` }}
              />
            )}
          </div>
        </div>

        {/* Axis Ticks */}
        <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-0.5 px-0.5">
          <span>0 (Minimal)</span>
          <span>30 (Limited)</span>
          <span>60 (High Risk)</span>
          <span>85 (Prohibited)</span>
        </div>
      </div>

      {/* Statutory Citation Footer */}
      <div className="mt-3.5 pt-2.5 border-t border-[#171c26] flex items-center justify-between text-[11px]">
        <span className="text-slate-400 font-medium">Statutory Classification:</span>
        <span className="font-mono text-slate-300 text-[10px] tracking-tight">{statutoryTier}</span>
      </div>
    </div>
  );
};
