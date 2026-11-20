import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sleek-toast';
import api from '../../lib/api';
import { ReportItem } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { FileText, Download, Plus } from '../../components/ui/Icons';

export const Reports: React.FC = () => {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await api.get('/reports');
      setReports(res.data);
    } catch {
      toast.error('Failed to load reports archive');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDownload = async (reportId: string, title: string) => {
    try {
      toast.info('Downloading PDF document...');
      const res = await api.get(`/reports/${reportId}/pdf`, {
        responseType: 'blob',
      });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${title.replace(/\s+/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Download complete');
    } catch {
      toast.error('Failed to download report PDF');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1c222e]">
        <div>
          <div className="text-[10px] font-mono tracking-widest text-blue-400 uppercase mb-1">
            ARCHIVE // ARTICLE 11 TECHNICAL DOCUMENTATION
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Governance Certificates & Audit Dossiers
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Formal EU AI Act technical conformity files, DPIA registers, and regulatory submissions.
          </p>
        </div>
        <Link to="/assessments">
          <Button variant="primary" size="sm" className="gap-2 font-mono">
            <Plus className="w-3.5 h-3.5" />
            <span>Generate From Audit</span>
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs font-mono text-slate-500">
          [QUERYING CERTIFICATE ARCHIVES...]
        </div>
      ) : reports.length === 0 ? (
        <Card className="py-16 text-center text-slate-500 space-y-4 font-mono text-xs">
          <FileText className="w-10 h-10 mx-auto text-slate-700" />
          <div>NO COMPILED PDF DOSSIERS IN ARCHIVE.</div>
          <Link to="/assessments">
            <Button variant="primary" size="sm">
              Inspect Completed Audits
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((r) => (
            <Card
              key={r._id}
              tag="CERTIFIED PDF"
              className="flex flex-col justify-between hover:border-[#2b3548] transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                    REF: {r._id.substring(0, 10).toUpperCase()}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-[3px] bg-emerald-950/40 text-emerald-300 border border-emerald-800/50">
                    VERIFIED // READY
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mb-1.5 tracking-tight">{r.title}</h3>
                <p className="text-[11px] font-mono text-slate-400">
                  COMPILED ON: {new Date(r.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="pt-3.5 border-t border-[#181d28] flex items-center justify-between gap-3 mt-4">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleDownload(r._id, r.title)}
                  className="gap-1.5 text-xs font-mono"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Signed PDF</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
