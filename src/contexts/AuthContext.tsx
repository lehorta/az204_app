import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, LoginPayload, User, AuthState } from '../services/auth';

interface AuthContextType {
  authState: AuthState;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>(() => authService.getAuthState());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sincroniza estado ao montar o componente
  useEffect(() => {
    const state = authService.getAuthState();
    setAuthState(state);
  }, []);

  const login = async (credentials: LoginPayload) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await authService.login(credentials);
      const newState = authService.getAuthState();
      setAuthState(newState);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao realizar login';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setAuthState({
      token: null,
      refreshToken: null,
      user: null,
      expiresAt: null,
    });
    setError(null);
  };

  const value: AuthContextType = {
    authState,
    user: authState.user,
    isAuthenticated: !!authState.token && !!authState.user,
    isLoading,
    error,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};
