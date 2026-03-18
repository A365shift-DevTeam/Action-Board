/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAppStore } from "./store/useAppStore";
import MainLayout from "./layouts/MainLayout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import InsightsPage from "./pages/InsightsPage";
import AskAIPage from "./pages/AskAIPage";
import ReportsPage from "./pages/ReportsPage";

export default function App() {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const theme = useAppStore((state) => state.theme);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route 
          path="/login" 
          element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />} 
        />

        {/* Protected Routes */}
        <Route 
          element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" replace />}
        >
          <Route path="/" element={<DashboardPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/ask-ai" element={<AskAIPage />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
