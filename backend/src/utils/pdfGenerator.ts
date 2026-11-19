import PDFDocument from 'pdfkit';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface PDFReportData {
  reportTitle: string;
  systemName: string;
  systemDomain: string;
  assessmentDate: string;
  assessorName: string;
  riskLevel: string;
  overallRiskScore: number;
  transparencyScore: number;
  biasScore: number;
  privacyScore: number;
  humanOversightScore: number;
  dataQualityScore: number;
  findings: string[];
  recommendations: Array<{
    category: string;
    priority: string;
    description: string;
    regulatoryReference?: string;
    mitigationMeasure: string;
  }>;
  regulatoryReferences: string[];
  euAiActCategory: string;
}

const COLORS = {
  primary: '#0f172a',
  accent: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  text: '#1e293b',
  muted: '#64748b',
  border: '#e2e8f0',
};

function getRiskColor(level: string): string {
  switch (level) {
    case 'unacceptable': return COLORS.danger;
    case 'high': return '#f97316';
    case 'limited': return COLORS.warning;
    case 'minimal': return COLORS.accent;
    default: return COLORS.muted;
  }
}

export async function generatePDFReport(data: PDFReportData, outputDir: string): Promise<string> {
  const reportsDir = path.resolve(outputDir);
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const filename = `ethosai-report-${Date.now()}.pdf`;
  const outputPath = path.join(reportsDir, filename);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    // Header
    doc.rect(0, 0, doc.page.width, 100).fill(COLORS.primary);
    doc.fillColor('white').fontSize(24).font('Helvetica-Bold').text('ETHOSAI', 50, 30);
    doc.fontSize(11).font('Helvetica').text('AI Governance & Ethics Assessment Platform', 50, 60);
    doc.fillColor(COLORS.accent).fontSize(10).text('Assessment Report', 50, 78);

    doc.moveDown(4);

    // Report Title
    doc.fillColor(COLORS.text).fontSize(18).font('Helvetica-Bold').text(data.reportTitle, { align: 'center' });
    doc.moveDown(0.5);
    doc.fillColor(COLORS.muted).fontSize(10).font('Helvetica').text(`Generated: ${data.assessmentDate}`, { align: 'center' });
    doc.moveDown(2);

    // System Info box
    doc.rect(50, doc.y, doc.page.width - 100, 80).strokeColor(COLORS.border).stroke();
    const infoY = doc.y + 10;
    doc.fillColor(COLORS.text).fontSize(10).font('Helvetica-Bold').text('AI SYSTEM INFORMATION', 60, infoY);
    doc.font('Helvetica').text(`System Name: ${data.systemName}`, 60, infoY + 18);
    doc.text(`Domain: ${data.systemDomain}`, 60, infoY + 32);
    doc.text(`Assessor: ${data.assessorName}`, 60, infoY + 46);
    doc.moveDown(5.5);

    // Risk Level Banner
    const riskColor = getRiskColor(data.riskLevel);
    doc.rect(50, doc.y, doc.page.width - 100, 50).fill(riskColor);
    const bannerY = doc.y - 40;
    doc.fillColor('white').fontSize(16).font('Helvetica-Bold').text(
      `Overall Risk Level: ${data.riskLevel.toUpperCase()} (Score: ${data.overallRiskScore}/100)`,
      60, bannerY + 15
    );
    doc.moveDown(2);

    // EU AI Act Category
    doc.fillColor(COLORS.text).fontSize(10).font('Helvetica-Bold').text('EU AI Act Classification:');
    doc.font('Helvetica').fillColor(COLORS.info).text(data.euAiActCategory);
    doc.moveDown(1.5);

    // Score breakdown
    doc.fillColor(COLORS.text).fontSize(13).font('Helvetica-Bold').text('Assessment Scores');
    doc.moveDown(0.5);
    const scores = [
      { label: 'Transparency & Explainability', score: data.transparencyScore },
      { label: 'Bias & Non-Discrimination', score: data.biasScore },
      { label: 'Privacy & Data Protection', score: data.privacyScore },
      { label: 'Human Oversight', score: data.humanOversightScore },
      { label: 'Data Quality & Governance', score: data.dataQualityScore },
    ];
    scores.forEach(({ label, score }) => {
      doc.fillColor(COLORS.text).fontSize(10).font('Helvetica').text(`${label}: `);
      const color = score >= 70 ? COLORS.accent : score >= 40 ? COLORS.warning : COLORS.danger;
      doc.fillColor(color).font('Helvetica-Bold').text(`${score}/100`, { continued: false });
      doc.moveDown(0.3);
    });
    doc.moveDown(1);

    // Findings
    if (data.findings.length > 0) {
      doc.fillColor(COLORS.text).fontSize(13).font('Helvetica-Bold').text('Key Findings');
      doc.moveDown(0.5);
      data.findings.forEach((finding, i) => {
        doc.fillColor(COLORS.text).fontSize(10).font('Helvetica').text(`${i + 1}. ${finding}`);
        doc.moveDown(0.4);
      });
      doc.moveDown(1);
    }

    // Recommendations
    if (data.recommendations.length > 0) {
      doc.addPage();
      doc.fillColor(COLORS.text).fontSize(13).font('Helvetica-Bold').text('Recommendations & Mitigation Measures');
      doc.moveDown(0.5);
      data.recommendations.forEach((rec, i) => {
        const priorityColor = rec.priority === 'critical' ? COLORS.danger :
          rec.priority === 'high' ? '#f97316' : COLORS.warning;
        doc.fillColor(COLORS.text).fontSize(11).font('Helvetica-Bold').text(`${i + 1}. ${rec.category}`);
        doc.fillColor(priorityColor).fontSize(9).font('Helvetica').text(`Priority: ${rec.priority.toUpperCase()}`);
        doc.fillColor(COLORS.text).fontSize(10).text(rec.description);
        if (rec.regulatoryReference) {
          doc.fillColor(COLORS.info).fontSize(9).text(`Reference: ${rec.regulatoryReference}`);
        }
        doc.fillColor(COLORS.muted).fontSize(10).text(`Mitigation: ${rec.mitigationMeasure}`);
        doc.moveDown(0.8);
      });
    }

    // Regulatory References
    if (data.regulatoryReferences.length > 0) {
      doc.moveDown(1);
      doc.fillColor(COLORS.text).fontSize(12).font('Helvetica-Bold').text('Regulatory References');
      doc.moveDown(0.5);
      data.regulatoryReferences.forEach(ref => {
        doc.fillColor(COLORS.muted).fontSize(10).font('Helvetica').text(`• ${ref}`);
      });
    }

    // Footer
    const range = doc.bufferedPageRange();
    for (let i = 0; i < range.count; i++) {
      doc.switchToPage(range.start + i);
      doc.rect(0, doc.page.height - 40, doc.page.width, 40).fill(COLORS.primary);
      doc.fillColor('white').fontSize(8).font('Helvetica')
        .text(`ETHOSAI • AI Governance Assessment Platform • Confidential • Page ${i + 1} of ${range.count}`,
          50, doc.page.height - 25, { align: 'center' });
    }

    doc.end();
    stream.on('finish', () => resolve(outputPath));
    stream.on('error', reject);
  });
}
