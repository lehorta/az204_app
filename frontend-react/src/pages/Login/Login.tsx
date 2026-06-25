import { FormEvent, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, LogOut, KeyRound, Mail, AlertCircle } from 'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Emoji } from '../../components/Emoji';
import { useAuth } from '../../contexts/AuthContext';
import { getErrorMessages } from '../../services/apiError';

// Hook
const useLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string[]>([]);
  const navigate = useNavigate();
  const { login, isLoading, isAuthenticated } = useAuth();

  // Se já está autenticado, redireciona para dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError([]);

    try {
      await login({ email, password });
      navigate('/admin/dashboard');
    } catch (err) {
      setError(getErrorMessages(err, 'Erro ao realizar login'));
    }
  };

  const handleForgotPassword = () => {
    alert('Funcionalidade "Recuperar Senha" será implementada em breve!');
  };

  const handleExit = () => {
    if (confirm('Deseja realmente sair da aplicação?')) {
      try {
        // Tentar fechar via WebView2 interop
        if ((window as any).chrome?.webview) {
          (window as any).chrome.webview.postMessage(JSON.stringify({ action: 'exit' }));
          return;
        }
      } catch (error) {
        console.error('Erro ao fechar via WebView2:', error);
      }
      
      // Fallback para fechar janela do navegador
      window.close();
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isLoading,
    handleLogin,
    handleForgotPassword,
    handleExit,
  };
};

// Components
const LoginHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-primary/20 rounded-full mb-4 border border-brand-primary/30">
        <Lock className="w-8 h-8 text-brand-primary" />
      </div>
      <h1 className="text-3xl font-bold text-text-primary">Burpee</h1>
      <p className="text-text-secondary mt-2">Sistema de Academias</p>
    </div>
  );
};

interface LoginFormProps {
  email: string;  
  password: string;
  isLoading: boolean;
  error: string[];
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  onForgotPassword: () => void;
  onExit: () => void;
}

const LoginForm = ({
  email,
  password,
  isLoading,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onForgotPassword,
  onExit,
}: LoginFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error.length > 0 && (
        <div className="flex items-start gap-3 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <ul className="list-disc list-inside space-y-1">
            {error.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">
          E-mail
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="seu@email.com"
            className="w-full pl-11 pr-4 py-3 bg-background-tertiary border border-border-primary rounded-lg text-text-primary placeholder-text-disabled focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">
          Senha
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          placeholder="Digite sua senha"
          className="w-full px-4 py-3 bg-background-tertiary border border-border-primary rounded-lg text-text-primary placeholder-text-disabled focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition"
          required
          disabled={isLoading}
        />
      </div>

      <p className="text-xs text-text-muted">
        <Emoji symbol="bulb" label="dica" /> Credenciais de teste: <code className="bg-background-tertiary px-1 py-0.5 rounded border border-border-primary">admin@sisburpee.com</code> / <code className="bg-background-tertiary px-1 py-0.5 rounded border border-border-primary">admin</code>
      </p>

      <Button type="submit" className="w-full" isLoading={isLoading} disabled={isLoading}>
        Entrar no Sistema
      </Button>

      <div className="space-y-3">
        <button
          type="button"
          onClick={onForgotPassword}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 text-sm text-text-secondary hover:text-brand-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <KeyRound className="w-4 h-4" />
          Recuperar Senha
        </button>

        <button
          type="button"
          onClick={onExit}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 text-sm text-text-muted hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </form>
  );
};

const LoginFooter = () => {
  return (
    <div className="mt-6 pt-6 border-t border-border-primary">
      <div className="flex items-center justify-between text-xs text-text-muted">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          Sistema Online
        </span>
        <span>v1.0.0</span>
      </div>
    </div>
  );
};

// Main Component
export const Login = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isLoading,
    handleLogin,
    handleForgotPassword,
    handleExit,
  } = useLogin();

  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center p-4">
      <Card className="w-full max-w-md animate-in bg-background-secondary border-border-primary">
        <LoginHeader />
        
        <LoginForm
          email={email}
          password={password}
          isLoading={isLoading}
          error={error}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onSubmit={handleLogin}
          onForgotPassword={handleForgotPassword}
          onExit={handleExit}
        />
        
        <LoginFooter />
      </Card>
    </div>
  );
};
