import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import DashboardLayout from './components/layout/DashboardLayout';

// Route Guards
import ProtectedRoute from './components/common/ProtectedRoute';
import PublicOnlyRoute from './components/common/PublicOnlyRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import StudyPlanPage from './pages/StudyPlanPage';
import ComingSoonPage from './pages/ComingSoonPage';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
        <Routes>
          {/* Public Landing & Marketing */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
          </Route>

          {/* Authentication Pages (Restricted to unauthenticated visitors) */}
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicOnlyRoute>
                <RegisterPage />
              </PublicOnlyRoute>
            }
          />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Protected Routes: Require Authentication */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/study-plan" element={<StudyPlanPage />} />
            <Route path="/dsa" element={<ComingSoonPage />} />
            <Route path="/dsa-practice" element={<Navigate to="/dsa" replace />} />
            <Route path="/sql" element={<ComingSoonPage />} />
            <Route path="/sql-practice" element={<Navigate to="/sql" replace />} />
            <Route path="/mock-interviews" element={<ComingSoonPage />} />
            <Route path="/progress" element={<ComingSoonPage />} />
            <Route path="/settings" element={<ComingSoonPage />} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </ThemeProvider>
  );
}
