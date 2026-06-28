import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck,
  Building2,
  Dumbbell, 
  Activity, 
  DollarSign, 
  UserCog,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Unlock,
  Lock,
  ClipboardList,
  BarChart2
} from 'lucide-react';
import { ReactNode, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface MenuItem {
  id: string;
  label: string;
  icon: ReactNode;
  path: string;
  comingSoon?: boolean;
}

interface MenuGroup {
  id: string;
  label: string;
  icon: ReactNode;
  items: MenuItem[];
}

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ financeiro: true });

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, path: '/admin/dashboard' },
    { id: 'alunos', label: 'Alunos', icon: <Users className="w-5 h-5" />, path: '/admin/alunos' },
    { id: 'funcionarios', label: 'Funcionários', icon: <UserCheck className="w-5 h-5" />, path: '/admin/funcionarios' },
    { id: 'filiais', label: 'Filiais', icon: <Building2 className="w-5 h-5" />, path: '/admin/filiais' },
    { id: 'treinos', label: 'Treinos', icon: <Dumbbell className="w-5 h-5" />, path: '/admin/treinos', comingSoon: true },
    { id: 'atividades', label: 'Atividades', icon: <Activity className="w-5 h-5" />, path: '/admin/atividades', comingSoon: true },
    { id: 'usuarios', label: 'Usuários', icon: <UserCog className="w-5 h-5" />, path: '/admin/usuarios' },
    { id: 'configuracoes', label: 'Configurações', icon: <Settings className="w-5 h-5" />, path: '/admin/configuracoes' },
  ];

  const menuGroups: MenuGroup[] = [
    {
      id: 'financeiro',
      label: 'Financeiro',
      icon: <DollarSign className="w-5 h-5" />,
      items: [
        { id: 'caixa-abertura', label: 'Abertura de Caixa', icon: <Unlock className="w-4 h-4" />, path: '/caixa/abertura' },
        { id: 'caixa-operacao', label: 'Operacional', icon: <BarChart2 className="w-4 h-4" />, path: '/caixa/operacao' },
        { id: 'caixa-historico', label: 'Histórico', icon: <ClipboardList className="w-4 h-4" />, path: '/caixa/historico' },
        { id: 'caixa-auditoria', label: 'Auditoria Sangrias', icon: <Lock className="w-4 h-4" />, path: '/caixa/auditoria' },
      ],
    },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);
  const isGroupActive = (group: MenuGroup) => group.items.some(i => isActive(i.path));

  const toggleGroup = (id: string) =>
    setOpenGroups(prev => ({ ...prev, [id]: !prev[id] }));

  const handleLogout = () => {
    if (confirm('Deseja realmente sair?')) {
      logout();
      navigate('/');
    }
  };

  return (
    <aside className="w-56 bg-background-sidebar border-r border-border-primary flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border-primary">
        <h1 className="text-xl font-bold text-text-primary">Academia System</h1>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => !item.comingSoon && navigate(item.path)}
            disabled={item.comingSoon}
            title={item.comingSoon ? 'Em breve' : undefined}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-lg
              transition-all duration-200 text-left
              ${item.comingSoon
                ? 'text-text-disabled cursor-not-allowed opacity-50'
                : isActive(item.path)
                  ? 'bg-brand-primary text-white shadow-dark-md'
                  : 'text-text-secondary hover:bg-background-tertiary hover:text-text-primary'
              }
            `}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
            {item.comingSoon && (
              <span className="ml-auto text-[10px] text-text-disabled border border-text-disabled/30 rounded px-1">em breve</span>
            )}
          </button>
        ))}

        {/* Grupos com sub-menu */}
        {menuGroups.map((group) => (
          <div key={group.id}>
            <button
              onClick={() => toggleGroup(group.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg
                transition-all duration-200 text-left
                ${ isGroupActive(group)
                  ? 'bg-brand-primary/20 text-brand-primary'
                  : 'text-text-secondary hover:bg-background-tertiary hover:text-text-primary'
                }
              `}
            >
              {group.icon}
              <span className="font-medium flex-1">{group.label}</span>
              {openGroups[group.id]
                ? <ChevronDown className="w-4 h-4" />
                : <ChevronRight className="w-4 h-4" />}
            </button>

            {openGroups[group.id] && (
              <div className="ml-4 mt-1 space-y-1 border-l-2 border-border-primary pl-3">
                {group.items.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => navigate(sub.path)}
                    className={`
                      w-full flex items-center gap-2 px-3 py-2 rounded-lg
                      transition-all duration-200 text-left text-sm
                      ${isActive(sub.path)
                        ? 'bg-brand-primary text-white'
                        : 'text-text-secondary hover:bg-background-tertiary hover:text-text-primary'
                      }
                    `}
                  >
                    {sub.icon}
                    <span>{sub.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
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
