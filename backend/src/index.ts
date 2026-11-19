import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

import prisma from './lib/prisma.js';
import { seedDatabase } from './lib/seed.js';

import authRoutes from './routes/auth.js';
import aiSystemsRoutes from './routes/aiSystems.js';
import assessmentsRoutes from './routes/assessments.js';
import reportsRoutes from './routes/reports.js';
import resourcesRoutes from './routes/resources.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT || 3000);
const isProd = process.env.NODE_ENV === 'production';
const publicPath = path.resolve(process.cwd(), 'public');

// Initialize and Seed Database for Seamless Portfolio Review
let isDatabaseReady = false;
async function initDatabase() {
  try {
    await prisma.$connect();
    isDatabaseReady = true;
    console.log('[ETHOSAI] Prisma ORM connected successfully');

    // Auto-seed demo portfolio assessor and baseline AI governance data
    await seedDatabase();
  } catch (err: any) {
    console.error('[ETHOSAI] Database initialization warning:', err.message);
  }
}

initDatabase();

// Middlewares
app.use(cors());
app.use(express.json());

console.log(`[ETHOSAI] Starting server on port ${PORT} (${isProd ? 'production' : 'development'})`);

// API Health Check & Portfolio Demo Info
app.get('/api/health', async (_req, res) => {
  res.json({
    status: 'online',
    platform: 'ETHOSAI - AI Governance & Ethics Assessment Platform',
    server: 'Node.js + Express (nub-stack)',
    database: isDatabaseReady ? 'connected (Prisma ORM)' : 'initializing',
    databaseUrl: process.env.DATABASE_URL ? 'configured' : 'default (file:./dev.db)',
    portfolioDemo: {
      demoAccount: 'assessor@ethosai.gov',
      demoPassword: 'governance123',
      demoLoginRoute: '/api/auth/demo-login',
      demoTokenRoute: '/api/auth/demo-token',
    },
    timestamp: new Date().toISOString(),
  });
});

// Mount Feature API Routes
app.use('/api/auth', authRoutes);
app.use('/api/ai-systems', aiSystemsRoutes);
app.use('/api/assessments', assessmentsRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/resources', resourcesRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Production Static Serving
if (isProd) {
  if (fs.existsSync(publicPath)) {
    app.use(express.static(publicPath));

    app.get('*', (req, res) => {
      if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'API route not found' });
      }
      res.sendFile(path.join(publicPath, 'index.html'));
    });
  } else {
    console.warn(`[ETHOSAI] Public directory not found at ${publicPath}. Run 'npm run build' first.`);
  }
}

app.listen(PORT, () => {
  console.log(`[ETHOSAI] Server running at http://localhost:${PORT}`);
  console.log(`[ETHOSAI] Demo credentials: assessor@ethosai.gov / governance123`);
  console.log(`[ETHOSAI] Demo JWT token route: http://localhost:${PORT}/api/auth/demo-token`);
  if (isProd) {
    console.log(`[ETHOSAI] Serving static frontend from: ${publicPath}`);
  }
});
