import React from 'react';

interface RiskGaugeProps {
  score: number; // 0 to 100
  riskLevel: string;
  size?: number;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({ score, riskLevel, size = 180 }) => {
  const radius = (size - 24) / 2;
  const circumference = Math.PI * radius; // semi-circle
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let color = '#10b981'; // minimal
  if (score >= 90) color = '#f43f5e'; // unacceptable
  else if (score >= 60) color = '#f97316'; // high
  else if (score >= 30) color = '#38bdf8'; // limited

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size / 2 + 20 }}>
        <svg width={size} height={size / 2 + 20} className="overflow-visible">
          {/* Background Arc */}
          <path
            d={`M 12 ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 12} ${size / 2}`}
            fill="none"
            stroke="#1e293b"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Progress Arc */}
          <path
            d={`M 12 ${size / 2} A ${radius} ${radius} 0 0 1 ${size - 12} ${size / 2}`}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
          <span className="text-3xl font-extrabold text-slate-100">{score}</span>
          <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">Risk Score / 100</span>
        </div>
      </div>

      <div className="mt-2 text-center">
        <span
          className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border"
          style={{
            borderColor: `${color}40`,
            color: color,
            backgroundColor: `${color}15`,
          }}
        >
          {riskLevel} Risk
        </span>
      </div>
    </div>
  );
};
