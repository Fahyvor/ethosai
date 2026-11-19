# ETHOSAI — AI Governance & Ethics Assessment Platform

ETHOSAI is a full-stack AI governance, risk assessment, and regulatory compliance platform aligned with the **EU AI Act** and Nigeria's **Data Protection Act (NDPA 2023)**.

---

## Portfolio & Demo Highlights

This project is tailored for instant portfolio evaluation with **zero setup hurdles**:

- **Database ORM**: Powered by **Prisma ORM** with SQLite (`DATABASE_URL="file:./dev.db"`) for zero-configuration, plug-and-play local execution (no Docker or external database service required). Can effortlessly be pointed to PostgreSQL for production.
- **Auto-Seeding**: On first startup, the database is automatically seeded with demo assessor credentials, baseline AI systems, assessments, and governance reports.
- **Demo JWT Authentication**:
  - **Quick Demo Account**:
    - **Email**: `assessor@ethosai.gov`
    - **Password**: `governance123`
    - **Role**: `assessor`
  - **Demo JWT Route**: [`http://localhost:3000/api/auth/demo-token`](http://localhost:3000/api/auth/demo-token) returns a pre-signed demo JWT token and ready-to-use curl authorization header.
  - **1-Click Demo Login API**: `POST /api/auth/demo-login` or `POST /api/auth/demo` immediately logs in with the demo account.

---

## Architecture

Built using the **nub-stack Dual-Mode** fullstack pattern:

- **In Development**:
  - Frontend dev server runs on `http://localhost:5173` (React 19, Vite HMR, Tailwind CSS v4).
  - Backend server runs on `http://localhost:3000` (Node.js, Express, Prisma ORM, JWT).
  - Frontend proxies all `/api/*` requests directly to the backend.
- **In Production**:
  - Running `npm run build` compiles both the frontend and backend.
  - Running `npm run start` launches the unified Express server serving static assets and API routes.

---

## Environment Configuration

In `backend/.env` (or copy from `backend/.env.example`):

```env
PORT=3000
NODE_ENV=development

# Database ORM (Prisma)
# Default: Zero-configuration SQLite for instant local portfolio demo running
DATABASE_URL="file:./dev.db"

# Optional: PostgreSQL (if deploying or using external DB)
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ethosai?schema=public"

# Demo JWT Secret for Portfolio Presentation
JWT_SECRET="ethosai-demo-jwt-secret-portfolio-key-2025"
```

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Generate Prisma Client & Database (if needed)
```bash
cd backend
npm run prisma:generate
npm run prisma:push
npm run seed
cd ..
```
*(Note: Starting the server also automatically creates and seeds the demo database if empty).*

### 3. Run Development Server
```bash
npm run dev:full
```
Runs both the frontend dev server (`http://localhost:5173`) and backend API (`http://localhost:3000`) concurrently.

### 4. Production Build & Start
```bash
npm run build
npm run start
```
