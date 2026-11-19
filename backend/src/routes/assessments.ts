import { Router, Response } from 'express';
import prisma from '../lib/prisma.js';
import { verifyToken, AuthRequest } from '../middleware/auth.js';
import { computeRiskScore, generateRecommendations, generateFindings } from '../utils/riskScoring.js';

const router = Router();
router.use(verifyToken);

// Safe ID extractor for Express 5 typing
const getParamId = (idParam: string | string[] | undefined): string => {
  if (Array.isArray(idParam)) return idParam[0] || '';
  return idParam || '';
};

// Safe JSON parser helper
const safeJsonParse = <T>(value: any, fallback: T): T => {
  if (value === null || value === undefined) return fallback;
  if (typeof value !== 'string') return value as T;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

// Format assessment document for frontend backwards compatibility
const formatAssessment = (item: any) => {
  const aiSys = item.aiSystem
    ? {
        ...item.aiSystem,
        id: item.aiSystem.id,
        _id: item.aiSystem.id,
      }
    : item.aiSystemId;

  const assessor = item.assessor
    ? {
        ...item.assessor,
        id: item.assessor.id,
        _id: item.assessor.id,
      }
    : item.assessorId;

  return {
    ...item,
    id: item.id,
    _id: item.id,
    aiSystemId: aiSys,
    assessorId: assessor,
    findings: safeJsonParse<string[]>(item.findings, []),
    recommendations: safeJsonParse<any[]>(item.recommendations, []),
    regulatoryReferences: safeJsonParse<string[]>(item.regulatoryReferences, []),
    assessmentData: safeJsonParse<Record<string, unknown>>(item.assessmentData, {}),
  };
};

// GET /api/assessments/stats
router.get('/stats', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const [total, completed, systems, riskGroup, avgScore] = await Promise.all([
      prisma.assessment.count({ where: { assessorId: userId } }),
      prisma.assessment.count({ where: { assessorId: userId, status: 'completed' } }),
      prisma.aISystem.count({ where: { registeredById: userId } }),
      prisma.assessment.groupBy({
        by: ['riskLevel'],
        where: { assessorId: userId },
        _count: { riskLevel: true },
      }),
      prisma.assessment.aggregate({
        where: { assessorId: userId },
        _avg: { overallRiskScore: true },
      }),
    ]);

    const riskDist = riskGroup.map((g) => ({
      _id: g.riskLevel,
      count: g._count.riskLevel,
    }));

    res.json({
      totalSystems: systems,
      totalAssessments: total,
      completedAssessments: completed,
      avgRiskScore: Math.round(avgScore._avg.overallRiskScore || 0),
      riskDistribution: riskDist,
    });
  } catch (err) {
    console.error('Failed to fetch stats:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// GET /api/assessments
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const assessments = await prisma.assessment.findMany({
      where: { assessorId: req.user!.userId },
      include: {
        aiSystem: {
          select: { id: true, name: true, domain: true, status: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(assessments.map(formatAssessment));
  } catch (err) {
    console.error('Failed to fetch assessments:', err);
    res.status(500).json({ error: 'Failed to fetch assessments' });
  }
});

// POST /api/assessments
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const {
      aiSystemId,
      transparencyScore,
      biasScore,
      privacyScore,
      humanOversightScore,
      dataQualityScore,
      assessmentData,
    } = req.body;

    const aiSystem = await prisma.aISystem.findUnique({
      where: { id: aiSystemId },
    });

    const riskResult = computeRiskScore({
      transparencyScore: Number(transparencyScore),
      biasScore: Number(biasScore),
      privacyScore: Number(privacyScore),
      humanOversightScore: Number(humanOversightScore),
      dataQualityScore: Number(dataQualityScore),
      domain: aiSystem?.domain,
      isAutonomous: aiSystem?.isAutonomous,
      humanOversightLevel: aiSystem?.humanOversightLevel,
    });

    const recommendations = generateRecommendations(riskResult, assessmentData || {});
    const findings = generateFindings(riskResult);

    const regulatoryRefs: string[] = [];
    if (riskResult.riskLevel === 'unacceptable' || riskResult.riskLevel === 'high') {
      regulatoryRefs.push('EU AI Act Art. 5 — Prohibited AI Practices');
      regulatoryRefs.push('EU AI Act Art. 6 — Classification of High-Risk AI Systems');
      regulatoryRefs.push('EU AI Act Art. 9 — Risk Management System');
      regulatoryRefs.push('EU AI Act Art. 10 — Data and Data Governance');
      regulatoryRefs.push('EU AI Act Art. 13 — Transparency');
      regulatoryRefs.push('EU AI Act Art. 14 — Human Oversight');
    }
    if (riskResult.privacyScore < 70) {
      regulatoryRefs.push('NDPA 2023 Part III — Lawful Basis for Processing');
      regulatoryRefs.push('NDPA 2023 s.24 — Data Subject Rights');
      regulatoryRefs.push('NDPA 2023 s.30 — Data Protection Impact Assessment');
    }

    const assessment = await prisma.assessment.create({
      data: {
        aiSystemId,
        assessorId: req.user!.userId,
        status: 'completed',
        transparencyScore: riskResult.transparencyScore,
        biasScore: riskResult.biasScore,
        privacyScore: riskResult.privacyScore,
        humanOversightScore: riskResult.humanOversightScore,
        dataQualityScore: riskResult.dataQualityScore,
        overallRiskScore: riskResult.overallScore,
        riskLevel: riskResult.riskLevel,
        findings: JSON.stringify(findings),
        recommendations: JSON.stringify(recommendations),
        regulatoryReferences: JSON.stringify(regulatoryRefs),
        assessmentData: JSON.stringify(assessmentData || {}),
      },
      include: {
        aiSystem: true,
      },
    });

    if (aiSystem) {
      await prisma.aISystem.update({
        where: { id: aiSystemId },
        data: {
          riskCategory: riskResult.riskLevel,
          status: 'assessed',
        },
      });
    }

    res.status(201).json({
      ...formatAssessment(assessment),
      euAiActCategory: riskResult.euAiActCategory,
    });
  } catch (err) {
    console.error('Failed to create assessment:', err);
    res.status(500).json({ error: 'Failed to create assessment' });
  }
});

// GET /api/assessments/:id
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = getParamId(req.params.id);
    const assessment = await prisma.assessment.findUnique({
      where: { id },
      include: {
        aiSystem: {
          select: {
            id: true,
            name: true,
            domain: true,
            deploymentContext: true,
            isAutonomous: true,
            humanOversightLevel: true,
          },
        },
        assessor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!assessment) {
      res.status(404).json({ error: 'Assessment not found' });
      return;
    }

    res.json(formatAssessment(assessment));
  } catch (err) {
    console.error('Failed to fetch assessment:', err);
    res.status(500).json({ error: 'Failed to fetch assessment' });
  }
});

export default router;
