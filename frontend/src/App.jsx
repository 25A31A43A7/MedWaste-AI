import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import WasteManagementPage from './pages/WasteManagementPage';
import AIClassificationPage from './pages/AIClassificationPage';
import CollectionRequestsPage from './pages/CollectionRequestsPage';
import MobileUnitsPage from './pages/MobileUnitsPage';
import WasteTrackingPage from './pages/WasteTrackingPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ReportsPage from './pages/ReportsPage';
import AlertsPage from './pages/AlertsPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('medwaste_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('medwaste_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('medwaste_user');
  };

  return (
   <Routes>
        {/* Unauthenticated route */}
        <Route 
          path="/login" 
          element={!user ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/dashboard" replace />} 
        />

        {/* Authenticated Protected Routes */}
        <Route 
          element={user ? <Layout user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />}
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/waste" element={<WasteManagementPage />} />
          <Route path="/classification" element={<AIClassificationPage />} />
          <Route path="/collections" element={<CollectionRequestsPage />} />
          <Route path="/units" element={<MobileUnitsPage />} />
          <Route path="/tracking" element={<WasteTrackingPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback route */}
        <Route 
          path="*" 
          element={<Navigate to={user ? "/dashboard" : "/login"} replace />} 
        />
        </Routes>
  );
}
