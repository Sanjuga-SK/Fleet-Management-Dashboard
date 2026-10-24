import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { AppLayout } from '@/layout/AppLayout';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { FleetMapPage } from '@/pages/FleetMapPage';
import { VehiclesPage } from '@/pages/VehiclesPage';
import { TripsPage } from '@/pages/TripsPage';
import { AlertsPage } from '@/pages/AlertsPage';
import { Radio } from 'lucide-react';

// Route guard requiring authenticated user (Supabase or explicit Demo session)
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas-bg flex flex-col items-center justify-center text-content-dominant">
        <div className="w-14 h-14 rounded-2xl bg-primary-subtle border border-primary/20 flex items-center justify-center text-primary mb-4 shadow-sm">
          <Radio className="w-7 h-7 animate-pulse" />
        </div>
        <div className="text-xs font-bold tracking-widest uppercase text-content-muted">
          Verifying Telematics Session...
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Route wrapper for Login: redirects to /dashboard if session already active
const PublicLoginRoute: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // Prevents flash before session check completes
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <LoginPage />;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* Public Authentication Route */}
          <Route path="/login" element={<PublicLoginRoute />} />

          {/* Protected Application Layout */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            {/* Redirect root / to /dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/map" element={<FleetMapPage />} />
            <Route path="/vehicles" element={<VehiclesPage />} />
            <Route path="/trips" element={<TripsPage />} />
            <Route path="/alerts" element={<AlertsPage />} />

            {/* Catch-all redirect to /dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
