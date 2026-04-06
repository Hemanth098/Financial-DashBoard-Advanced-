import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import AuthPage from './pages/AuthPage';
import DashboardLayout from './pages/DashboardLayout';

function AppInner() {
  const { state } = useApp();
  if (!state.currentUser) return <AuthPage />;
  return <DashboardLayout />;
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
