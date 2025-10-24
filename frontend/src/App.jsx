import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import DripPage from './pages/Drip';
import ProfilePage from './pages/Profile';
import NotificationsPage from './pages/Notifications';
import { AuthProvider } from './context/AuthProvider';
import { supabase } from './supabase';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/drip" replace />} />
            <Route path="/drip" element={<DripPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="*" element={<div style={{padding:20}}>Page not found — check routing or auth provider.</div>} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;