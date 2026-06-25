import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ViewProvider } from './contexts/ViewContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Users } from './pages/Users';
import { Students } from './pages/Students';
import { Funcionarios } from './pages/Funcionarios';
import { Dashboard } from './pages/Dashboard';
import { Settings } from './pages/Settings';
import { Filiais } from './pages/Filiais';
import { useAuth } from './contexts/AuthContext';
import { AberturaCaixa } from './pages/caixa/AberturaCaixa';
import { CaixaOperacao } from './pages/caixa/CaixaOperacao';
import { FechamentoCaixa } from './pages/caixa/FechamentoCaixa';
import { HistoricoSessoes } from './pages/caixa/HistoricoSessoes';
import { AuditoriaSangrias } from './pages/caixa/AuditoriaSangrias';
import { ResumoDia } from './pages/caixa/ResumoDia';

function AppContent() {
  const { user } = useAuth();
  
  return (
    <ViewProvider actualRole={user?.roles?.[0] as any}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/usuarios"
            element={
              <ProtectedRoute requiredRoles={['Admin']}>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/alunos"
            element={
              <ProtectedRoute>
                <Students />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/funcionarios"
            element={
              <ProtectedRoute>
                <Funcionarios />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/filiais"
            element={
              <ProtectedRoute>
                <Filiais />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/configuracoes"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Caixa Routes */}
          <Route
            path="/caixa/abertura"
            element={
              <ProtectedRoute>
                <AberturaCaixa />
              </ProtectedRoute>
            }
          />
          <Route
            path="/caixa/operacao/:sessaoId"
            element={
              <ProtectedRoute>
                <CaixaOperacao />
              </ProtectedRoute>
            }
          />
          <Route
            path="/caixa/fechamento/:sessaoId"
            element={
              <ProtectedRoute>
                <FechamentoCaixa />
              </ProtectedRoute>
            }
          />
          <Route
            path="/caixa/historico"
            element={
              <ProtectedRoute>
                <HistoricoSessoes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/caixa/auditoria"
            element={
              <ProtectedRoute>
                <AuditoriaSangrias />
              </ProtectedRoute>
            }
          />
          <Route
            path="/caixa/resumo"
            element={
              <ProtectedRoute>
                <ResumoDia />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ViewProvider>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
