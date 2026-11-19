import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { Dashboard } from './pages/dashboard/Dashboard';
import { AISystems } from './pages/aiSystems/AISystems';
import { RegisterAISystem } from './pages/aiSystems/RegisterAISystem';
import { Assessments } from './pages/assessments/Assessments';
import { NewAssessment } from './pages/assessments/NewAssessment';
import { AssessmentDetail } from './pages/assessments/AssessmentDetail';
import { Reports } from './pages/reports/Reports';
import { Resources } from './pages/resources/Resources';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes inside Layout */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/ai-systems"
            element={
              <ProtectedRoute>
                <Layout>
                  <AISystems />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/ai-systems/new"
            element={
              <ProtectedRoute>
                <Layout>
                  <RegisterAISystem />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/assessments"
            element={
              <ProtectedRoute>
                <Layout>
                  <Assessments />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/assessments/new"
            element={
              <ProtectedRoute>
                <Layout>
                  <NewAssessment />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/assessments/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <AssessmentDetail />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Layout>
                  <Reports />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/resources"
            element={
              <ProtectedRoute>
                <Layout>
                  <Resources />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Root Fallback */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
