import { BrowserRouter, HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { KBarProvider } from 'kbar';
import { useEffect } from 'react';
import { CommandPalette } from './shared/components/ui/CommandPalette';
import { DashboardLayout } from './layouts/DashboardLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { GoalsPage } from './pages/GoalsPage';
import { ReportsPage } from './pages/ReportsPage';
import { BudgetsPage } from './pages/BudgetsPage';
import { SettingsPage } from './pages/SettingsPage';
import { ProtectedRoute } from './features/auth/components/ProtectedRoute';
import { keepAliveService } from './core/services/keepAliveService';

function App() {
  // 🔥 Iniciar keep-alive al montar la aplicación
  useEffect(() => {
    keepAliveService.start();
    
    return () => {
      keepAliveService.stop();
    };
  }, []);
  // Use HashRouter for Electron (file protocol) to avoid routing issues with file paths
  // Use BrowserRouter for Web (http/https) for cleaner URLs
  const Router = window.location.protocol === 'file:' ? HashRouter : BrowserRouter;

  return (
    <Router>
      <KBarProvider>
        <CommandPalette />
        <Routes>
        {/* Rutas Públicas de Autenticación */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Rutas Protegidas del Dashboard */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<HomePage />} />
            
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/goals" element={<GoalsPage />} />
            
            <Route path="/budgets" element={<BudgetsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        {/* Ruta catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </KBarProvider>
    </Router>
  );
}

export default App;
