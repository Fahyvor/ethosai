import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma.js';
import { verifyToken, AuthRequest } from '../middleware/auth.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'ethosai-demo-jwt-secret-portfolio-key-2025';

// Helper to sign JWT token
const signToken = (payload: { userId: string; email: string; role: string }) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

// POST /api/auth/register
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['assessor', 'auditor', 'developer', 'regulator', 'admin']).withMessage('Invalid role'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    try {
      const { name, email, password, organization, role } = req.body;
      const normalizedEmail = email.toLowerCase().trim();

      const existing = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });

      if (existing) {
        res.status(409).json({ error: 'Email already registered' });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          name: name.trim(),
          email: normalizedEmail,
          password: hashedPassword,
          organization: organization?.trim() || null,
          role: role || 'assessor',
        },
      });

      const token = signToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      res.status(201).json({
        token,
        user: {
          id: user.id,
          _id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          organization: user.organization,
        },
      });
    } catch (err: any) {
      console.error('Registration error:', err);
      res.status(500).json({ error: 'Registration failed' });
    }
  }
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    try {
      const { email, password } = req.body;
      const normalizedEmail = email.toLowerCase().trim();

      const user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });

      if (!user) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const token = signToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      res.json({
        token,
        user: {
          id: user.id,
          _id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          organization: user.organization,
        },
      });
    } catch (err: any) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Login failed' });
    }
  }
);

// POST /api/auth/demo & POST /api/auth/demo-login
// Seamless 1-click authentication for reviewers and portfolio evaluators
const handleDemoLogin = async (_req: Request, res: Response) => {
  try {
    let demoUser = await prisma.user.findUnique({
      where: { email: 'assessor@ethosai.gov' },
    });

    if (!demoUser) {
      const hashedPassword = await bcrypt.hash('governance123', 10);
      demoUser = await prisma.user.create({
        data: {
          id: 'user-demo-assessor-001',
          name: 'Dr. Alex Vance',
          email: 'assessor@ethosai.gov',
          password: hashedPassword,
          organization: 'Ethical AI Oversight Institute',
          role: 'assessor',
        },
      });
    }

    const token = signToken({
      userId: demoUser.id,
      email: demoUser.email,
      role: demoUser.role,
    });

    res.json({
      message: 'Demo assessor authenticated successfully for portfolio review',
      token,
      user: {
        id: demoUser.id,
        _id: demoUser.id,
        name: demoUser.name,
        email: demoUser.email,
        role: demoUser.role,
        organization: demoUser.organization,
      },
    });
  } catch (err: any) {
    console.error('Demo auth error:', err);
    res.status(500).json({ error: 'Demo authentication failed' });
  }
};

router.post('/demo', handleDemoLogin);
router.post('/demo-login', handleDemoLogin);

// GET /api/auth/demo-token
// Convenience endpoint for portfolio testers to inspect or copy a pre-signed demo JWT token
router.get('/demo-token', async (_req: Request, res: Response) => {
  try {
    let demoUser = await prisma.user.findUnique({
      where: { email: 'assessor@ethosai.gov' },
    });

    if (!demoUser) {
      const hashedPassword = await bcrypt.hash('governance123', 10);
      demoUser = await prisma.user.create({
        data: {
          id: 'user-demo-assessor-001',
          name: 'Dr. Alex Vance',
          email: 'assessor@ethosai.gov',
          password: hashedPassword,
          organization: 'Ethical AI Oversight Institute',
          role: 'assessor',
        },
      });
    }

    const demoToken = signToken({
      userId: demoUser.id,
      email: demoUser.email,
      role: demoUser.role,
    });

    res.json({
      environment: 'portfolio-demo',
      jwtSecretConfigured: !!process.env.JWT_SECRET,
      credentials: {
        email: 'assessor@ethosai.gov',
        password: 'governance123',
        role: 'assessor',
      },
      demoToken,
      authHeader: `Bearer ${demoToken}`,
      instructions: 'Include header `Authorization: Bearer <demoToken>` to test protected endpoints in curl or Postman.',
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to generate demo token' });
  }
});

// GET /api/auth/me
router.get('/me', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        organization: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      ...user,
      _id: user.id,
    });
  } catch (err: any) {
    console.error('Error fetching current user:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export default router;
