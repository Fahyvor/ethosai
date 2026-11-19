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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Audit Reports & PDF Exports</h1>
          <p className="text-sm text-slate-400 mt-1">
            Certifications, executive summaries, and formal compliance declarations
          </p>
        </div>
        <Link to="/assessments">
          <Button variant="primary" className="gap-2">
            <Plus className="w-4 h-4" />
            Generate From Assessment
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading reports archive...
        </div>
      ) : reports.length === 0 ? (
        <Card className="py-16 text-center text-slate-500 space-y-4">
          <FileText className="w-12 h-12 mx-auto text-slate-700" />
          <div>
            <h3 className="text-base font-semibold text-slate-300">No Reports Generated Yet</h3>
            <p className="text-xs text-slate-400 mt-1">
              Complete an assessment and click "Export Official PDF" to generate formal audit records.
            </p>
          </div>
          <Link to="/assessments">
            <Button variant="primary" size="sm">Browse Assessments</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((r) => (
            <Card key={r._id} className="flex flex-col justify-between hover:border-slate-700 transition-colors">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Ready
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-1">{r.title}</h3>
                <p className="text-xs text-slate-400">
                  Created: {new Date(r.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800 mt-4 flex items-center justify-between gap-3">
                <span className="text-xs text-slate-500 font-mono">Format: PDF (A4)</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownload(r._id, r.title)}
                  className="gap-1.5 text-xs text-emerald-400 hover:text-emerald-300"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download PDF
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
