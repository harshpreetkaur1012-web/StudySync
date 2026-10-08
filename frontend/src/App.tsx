import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth.js';
import { ToastProvider } from './components/Toast.js';
import { ProtectedRoute } from './components/ProtectedRoute.js';
import { DashboardLayout } from './layouts/DashboardLayout.js';

// Pages
import { LandingPage } from './pages/LandingPage.js';
import { LoginPage } from './pages/LoginPage.js';
import { RegisterPage } from './pages/RegisterPage.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { AssignmentsPage } from './pages/AssignmentsPage.js';
import { SubjectsPage } from './pages/SubjectsPage.js';
import { CalendarPage } from './pages/CalendarPage.js';
import { NotesPage } from './pages/NotesPage.js';
import { AnalyticsPage } from './pages/AnalyticsPage.js';
import { ProfilePage } from './pages/ProfilePage.js';
import { SettingsPage } from './pages/SettingsPage.js';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Workspace Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/assignments" element={<AssignmentsPage />} />
              <Route path="/subjects" element={<SubjectsPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/notes" element={<NotesPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
