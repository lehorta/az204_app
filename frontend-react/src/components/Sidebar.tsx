import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Dumbbell, 
  Activity, 
  DollarSign, 
  UserCog,
  Settings,
  LogOut
} from 'lucide-react';
import { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface MenuItem {
  id: string;
  label: string;
  icon: ReactNode;
  path: string;
}

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/admin/dashboard' },
    { id: 'alunos', label: 'Alunos', icon: <Users className="w-5 h-5" />, path: '/admin/alunos' },
    { id: 'treinos', label: 'Treinos', icon: <Dumbbell className="w-5 h-5" />, path: '/admin/treinos' },
    { id: 'atividades', label: 'Atividades', icon: <Activity className="w-5 h-5" />, path: '/admin/atividades' },
    { id: 'financeiro', label: 'Financeiro', icon: <DollarSign className="w-5 h-5" />, path: '/admin/financeiro' },
    { id: 'usuarios', label: 'Usuários', icon: <UserCog className="w-5 h-5" />, path: '/admin/usuarios' },
    { id: 'configuracoes', label: 'Configurações', icon: <Settings className="w-5 h-5" />, path: '/admin/configuracoes' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    if (confirm('Deseja realmente sair?')) {
      logout();
      navigate('/');
    }
  };

  return (
    <aside className="w-52 bg-background-sidebar border-r border-border-primary flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border-primary">
        <h1 className="text-xl font-bold text-text-primary">Academia System</h1>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-lg
              transition-all duration-200 text-left
              ${isActive(item.path)
                ? 'bg-brand-primary text-white shadow-dark-md'
                : 'text-text-secondary hover:bg-background-tertiary hover:text-text-primary'
              }
            `}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-border-primary space-y-3">
        {user && (
          <div className="px-4 py-2 rounded-lg bg-background-tertiary">
            <p className="text-xs text-text-secondary">Conectado como</p>
            <p className="text-sm font-medium text-text-primary truncate">{user.nome}</p>
            <p className="text-xs text-text-muted truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors text-left font-medium"
        >
          <LogOut className="w-5 h-5" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};
