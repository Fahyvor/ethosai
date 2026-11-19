import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import prisma from '../lib/prisma.js';
import { verifyToken, AuthRequest } from '../middleware/auth.js';

const router = Router();
router.use(verifyToken);

// Safe ID extractor for Express 5 typing
const getParamId = (idParam: string | string[] | undefined): string => {
  if (Array.isArray(idParam)) return idParam[0] || '';
  return idParam || '';
};

// Format AISystem for compatibility with frontend expectations
const formatAISystem = (sys: any) => {
  let dataTypes: string[] = [];
  try {
    dataTypes = typeof sys.dataTypesUsed === 'string' ? JSON.parse(sys.dataTypesUsed) : sys.dataTypesUsed;
  } catch {
    dataTypes = [];
  }

  return {
    ...sys,
    _id: sys.id,
    dataTypesUsed: Array.isArray(dataTypes) ? dataTypes : [],
    registeredBy: sys.registeredBy
      ? {
          id: sys.registeredBy.id,
          _id: sys.registeredBy.id,
          name: sys.registeredBy.name,
          email: sys.registeredBy.email,
        }
      : undefined,
  };
};

// GET /api/ai-systems - List all systems registered by user
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const systems = await prisma.aISystem.findMany({
      where: { registeredById: req.user!.userId },
      include: {
        registeredBy: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(systems.map(formatAISystem));
  } catch (err: any) {
    console.error('Failed to fetch AI systems:', err);
    res.status(500).json({ error: 'Failed to fetch AI systems' });
  }
});

// POST /api/ai-systems - Register a new AI system
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('System name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('purpose').notEmpty().withMessage('Intended purpose is required'),
    body('domain')
      .isIn(['healthcare', 'finance', 'hr', 'education', 'public_services', 'law_enforcement', 'other'])
      .withMessage('Valid domain is required'),
    body('deploymentContext').notEmpty().withMessage('Deployment context is required'),
  ],
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    try {
      const {
        name,
        description,
        purpose,
        domain,
        deploymentContext,
        dataTypesUsed,
        isAutonomous,
        humanOversightLevel,
        trainingDataDescription,
        vendor,
      } = req.body;

      const dataTypesString = Array.isArray(dataTypesUsed)
        ? JSON.stringify(dataTypesUsed)
        : typeof dataTypesUsed === 'string'
        ? dataTypesUsed
        : '[]';

      const system = await prisma.aISystem.create({
        data: {
          name: name.trim(),
          description: description.trim(),
          purpose: purpose.trim(),
          domain,
          deploymentContext: deploymentContext.trim(),
          dataTypesUsed: dataTypesString,
          isAutonomous: Boolean(isAutonomous),
          humanOversightLevel: humanOversightLevel || 'moderate',
          trainingDataDescription: trainingDataDescription?.trim() || null,
          vendor: vendor?.trim() || null,
          registeredById: req.user!.userId,
          status: 'registered',
        },
        include: {
          registeredBy: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      res.status(201).json(formatAISystem(system));
    } catch (err: any) {
      console.error('Failed to register AI system:', err);
      res.status(500).json({ error: 'Failed to register AI system' });
    }
  }
);

// GET /api/ai-systems/:id - Fetch single system
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = getParamId(req.params.id);
    const system = await prisma.aISystem.findUnique({
      where: { id },
      include: {
        registeredBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!system) {
      res.status(404).json({ error: 'AI system not found' });
      return;
    }

    res.json(formatAISystem(system));
  } catch (err: any) {
    console.error('Failed to fetch AI system:', err);
    res.status(500).json({ error: 'Failed to fetch AI system' });
  }
});

// PUT /api/ai-systems/:id - Update system
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = getParamId(req.params.id);
    const existing = await prisma.aISystem.findUnique({
      where: { id },
    });

    if (!existing) {
      res.status(404).json({ error: 'AI system not found' });
      return;
    }

    const updateData: any = {};
    const allowed = [
      'name',
      'description',
      'purpose',
      'domain',
      'deploymentContext',
      'isAutonomous',
      'humanOversightLevel',
      'trainingDataDescription',
      'vendor',
      'riskCategory',
      'status',
    ];

    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        updateData[key] = req.body[key];
      }
    }

    if (req.body.dataTypesUsed !== undefined) {
      updateData.dataTypesUsed = Array.isArray(req.body.dataTypesUsed)
        ? JSON.stringify(req.body.dataTypesUsed)
        : String(req.body.dataTypesUsed);
    }

    const system = await prisma.aISystem.update({
      where: { id },
      data: updateData,
      include: {
        registeredBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.json(formatAISystem(system));
  } catch (err: any) {
    console.error('Failed to update AI system:', err);
    res.status(500).json({ error: 'Failed to update' });
  }
});

// DELETE /api/ai-systems/:id - Delete system
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = getParamId(req.params.id);
    const existing = await prisma.aISystem.findUnique({
      where: { id },
    });

    if (!existing) {
      res.status(404).json({ error: 'AI system not found' });
      return;
    }

    await prisma.aISystem.delete({
      where: { id },
    });

    res.json({ message: 'AI system deleted' });
  } catch (err: any) {
    console.error('Failed to delete AI system:', err);
    res.status(500).json({ error: 'Failed to delete' });
  }
});

export default router;
