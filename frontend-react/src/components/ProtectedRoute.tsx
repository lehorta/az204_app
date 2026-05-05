import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: string[];
}

export const ProtectedRoute = ({ children, requiredRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();

  // Não autenticado - redireciona para login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Verifica perfis necessários
  if (requiredRoles && requiredRoles.length > 0) {
    const hasRequiredRole = user?.roles.some((role) => requiredRoles.includes(role));
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};
