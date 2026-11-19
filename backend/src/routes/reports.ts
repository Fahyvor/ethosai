import { Router, Response } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import prisma from '../lib/prisma.js';
import { verifyToken, AuthRequest } from '../middleware/auth.js';
import { generatePDFReport } from '../utils/pdfGenerator.js';

const router = Router();
router.use(verifyToken);

const reportsDir = path.resolve(process.cwd(), 'generated_reports');

const getParamId = (idParam: string | string[] | undefined): string => {
  if (Array.isArray(idParam)) return idParam[0] || '';
  return idParam || '';
};

const safeJsonParse = <T>(value: any, fallback: T): T => {
  if (value === null || value === undefined) return fallback;
  if (typeof value !== 'string') return value as T;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

const formatReport = (report: any) => {
  return {
    ...report,
    id: report.id,
    _id: report.id,
    assessmentId: report.assessment
      ? {
          ...report.assessment,
          id: report.assessment.id,
          _id: report.assessment.id,
        }
      : report.assessmentId,
  };
};

// GET /api/reports - List user's reports
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const reports = await prisma.report.findMany({
      where: { generatedById: req.user!.userId },
      include: {
        assessment: {
          include: {
            aiSystem: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(reports.map(formatReport));
  } catch (err) {
    console.error('Failed to retrieve reports:', err);
    res.status(500).json({ error: 'Failed to retrieve reports' });
  }
});

// POST /api/reports/generate - Generate report PDF
router.post('/generate', async (req: AuthRequest, res: Response) => {
  try {
    const { assessmentId } = req.body;
    if (!assessmentId) {
      res.status(400).json({ error: 'assessmentId is required' });
      return;
    }

    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        aiSystem: true,
        assessor: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!assessment) {
      res.status(404).json({ error: 'Assessment not found' });
      return;
    }

    const aiSys = assessment.aiSystem;
    const assessor = assessment.assessor;

    const reportTitle = `ETHOSAI Governance Report - ${aiSys?.name || 'AI System'}`;

    const findings = safeJsonParse<string[]>(assessment.findings, []);
    const recommendations = safeJsonParse<any[]>(assessment.recommendations, []);
    const regulatoryRefs = safeJsonParse<string[]>(assessment.regulatoryReferences, []);

    const pdfPath = await generatePDFReport(
      {
        reportTitle,
        systemName: aiSys?.name || 'Unknown System',
        systemDomain: aiSys?.domain || 'General',
        assessmentDate: new Date(assessment.createdAt).toLocaleDateString(),
        assessorName: assessor?.name || 'Certified Assessor',
        riskLevel: assessment.riskLevel,
        overallRiskScore: assessment.overallRiskScore,
        transparencyScore: assessment.transparencyScore,
        biasScore: assessment.biasScore,
        privacyScore: assessment.privacyScore,
        humanOversightScore: assessment.humanOversightScore,
        dataQualityScore: assessment.dataQualityScore,
        findings,
        recommendations,
        regulatoryReferences: regulatoryRefs,
        euAiActCategory:
          assessment.riskLevel === 'unacceptable'
            ? 'Article 5 - Prohibited AI Practices'
            : assessment.riskLevel === 'high'
            ? 'Article 6 & Annex III - High Risk AI System'
            : assessment.riskLevel === 'limited'
            ? 'Article 50 - Limited Risk (Transparency Requirements)'
            : 'Minimal Risk - Voluntary Code of Conduct',
      },
      reportsDir
    );

    const report = await prisma.report.create({
      data: {
        assessmentId: assessment.id,
        generatedById: req.user!.userId,
        title: reportTitle,
        pdfPath,
        status: 'ready',
      },
    });

    res.status(201).json({
      message: 'Report generated successfully',
      report: formatReport(report),
      downloadUrl: `/api/reports/${report.id}/pdf`,
    });
  } catch (err: any) {
    console.error('Report generation error:', err);
    res.status(500).json({ error: 'Failed to generate PDF report', details: err?.message });
  }
});

// GET /api/reports/:id/pdf - Download PDF
router.get('/:id/pdf', async (req: AuthRequest, res: Response) => {
  try {
    const id = getParamId(req.params.id);
    const report = await prisma.report.findUnique({
      where: { id },
    });

    if (!report || !report.pdfPath) {
      res.status(404).json({ error: 'Report PDF not found' });
      return;
    }

    if (!fs.existsSync(report.pdfPath)) {
      res.status(404).json({ error: 'Report file missing on server' });
      return;
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${path.basename(report.pdfPath)}"`);
    fs.createReadStream(report.pdfPath).pipe(res);
  } catch (err) {
    console.error('Failed to download report:', err);
    res.status(500).json({ error: 'Failed to download report' });
  }
});

export default router;
