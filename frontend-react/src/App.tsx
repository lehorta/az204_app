import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ViewProvider } from './contexts/ViewContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Users } from './pages/Users';
import { Students } from './pages/Students';
import { Dashboard } from './pages/Dashboard';
import { Settings } from './pages/Settings';
import { useAuth } from './contexts/AuthContext';

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
            path="/admin/configuracoes"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ViewProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
