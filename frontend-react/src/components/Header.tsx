import { Bell, User, LogOut, Building2, ChevronDown, Eye, RotateCcw, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAcademies } from '../hooks/useAcademies';
import { useView } from '../contexts/ViewContext';
import { useState } from 'react';

interface HeaderProps {
  userName?: string;
}

// Mapear roles para labels amigáveis
const roleLabels: Record<string, string> = {
  'Administrador': 'Administrador',
  'Gerente': 'Gerente',
  'Financeiro': 'Financeiro',
  'Recepcionista': 'Recepção',
  'Professor': 'Professor',
};

export const Header = ({ userName = 'Admin' }: HeaderProps) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { academies, isLoading, error, selectedAcademy, setSelectedAcademy } = useAcademies();
  const { currentView, setCurrentView, availableViews, resetToActualRole } = useView();
  const [isAcademyOpen, setIsAcademyOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Verifica se o usuário é admin antes de exibir a combobox
  const isAdmin = user?.roles?.includes('Administrador');
  const isViewDifferent = currentView !== user?.roles?.[0];

  const handleLogout = () => {
    if (confirm('Deseja realmente sair?')) {
      logout();
      navigate('/');
    }
  };

  const handleSelectAcademy = (academy: typeof academies[0]) => {
    setSelectedAcademy(academy);
    setIsAcademyOpen(false);
  };

  const handleSelectView = (role: typeof currentView) => {
    setCurrentView(role);
    setIsUserMenuOpen(false);
  };

  return (
    <header className="h-16 bg-background-secondary border-b border-border-primary flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        {/* Academia Selector - Apenas para Admins */}
        {isAdmin && (
          <div className="relative">
            <button
              onClick={() => setIsAcademyOpen(!isAcademyOpen)}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-background-tertiary border border-border-primary rounded-lg hover:border-brand-primary hover:bg-background-tertiary/80 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Building2 className="w-4 h-4 text-text-secondary" />
              <span className="text-sm text-text-primary font-medium max-w-xs truncate">
                {isLoading ? 'Carregando...' : selectedAcademy?.academyName || 'Selecionar academia'}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-text-secondary transition-transform ${
                  isAcademyOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isAcademyOpen && academies.length > 0 && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-background-secondary border border-border-primary rounded-lg shadow-lg z-50">
                <div className="p-2">
                  {academies.map((academy) => (
                    <button
                      key={academy.academyId}
                      onClick={() => handleSelectAcademy(academy)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                        selectedAcademy?.academyId === academy.academyId
                          ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary/30'
                          : 'text-text-primary hover:bg-background-tertiary'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-medium">{academy.academyName}</p>
                          {academy.email && (
                            <p className="text-xs text-text-secondary">{academy.email}</p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Fechar dropdown ao clicar fora */}
            {isAcademyOpen && (
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsAcademyOpen(false)}
              ></div>
            )}
          </div>
        )}
        
        {/* View Switcher - Apenas para Admins */}
        {isAdmin && (
          <div className="relative">
            <button
              onClick={() => setIsViewOpen(!isViewOpen)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition ${
                isViewDifferent
                  ? 'bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/20'
                  : 'bg-background-tertiary border-border-primary text-text-secondary hover:border-brand-primary hover:bg-background-tertiary/80'
              }`}
              title={isViewDifferent ? `Visão como: ${roleLabels[currentView]}` : 'Alternar visão do usuário'}
            >
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">{roleLabels[currentView]}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${isViewOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* View Dropdown */}
            {isViewOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-background-secondary border border-border-primary rounded-lg shadow-lg z-50">
                <div className="p-2">
                  {availableViews.map((role) => (
                    <button
                      key={role}
                      onClick={() => handleSelectView(role)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-2 ${
                        currentView === role
                          ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary/30'
                          : 'text-text-primary hover:bg-background-tertiary'
                      }`}
                    >
                      <Eye className="w-4 h-4" />
                      <span className="font-medium">{roleLabels[role]}</span>
                    </button>
                  ))}
                  
                  {isViewDifferent && (
                    <>
                      <div className="my-2 border-t border-border-primary"></div>
                      <button
                        onClick={() => {
                          resetToActualRole();
                          setIsViewOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-2 text-text-secondary hover:bg-background-tertiary"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span className="font-medium text-sm">Restaurar visão real</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Fechar dropdown ao clicar fora */}
            {isViewOpen && (
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsViewOpen(false)}
              ></div>
            )}
          </div>
        )}
        
        {error && (
          <span className="text-xs text-red-400">{error}</span>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Notificações */}
        <button className="relative p-2 text-text-secondary hover:text-text-primary transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Menu Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-background-tertiary transition-colors"
          >
            <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm text-text-secondary font-medium">{userName}</span>
              {isViewDifferent && (
                <span className="text-xs text-orange-400">Ver como: {roleLabels[currentView]}</span>
              )}
            </div>
            <ChevronDown
              className={`w-4 h-4 text-text-secondary transition-transform ${
                isUserMenuOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* User Menu Dropdown Content */}
          {isUserMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-background-secondary border border-border-primary rounded-lg shadow-lg z-50">
              <div className="p-2">
                {/* Header com informações do usuário */}
                <div className="px-4 py-3 border-b border-border-primary mb-2">
                  <p className="text-sm font-semibold text-text-primary">{userName}</p>
                  <p className="text-xs text-text-secondary mt-1">{user?.email}</p>
                </div>

                {/* Opções de Perfil/Visão */}
                {/* Sempre mostrar opção de mudar perfil para testes/desenvolvimento */}
                <>
                  <p className="text-xs font-semibold text-text-muted px-4 py-2 uppercase">
                    Mudar Perfil
                  </p>
                  <div className="space-y-1 mb-3">
                    {availableViews.map((role) => (
                      <button
                        key={role}
                        onClick={() => handleSelectView(role)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                          currentView === role
                            ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary/30'
                            : 'text-text-primary hover:bg-background-tertiary'
                        }`}
                      >
                        <Eye className="w-4 h-4 flex-shrink-0" />
                        <span className="font-medium text-sm">{roleLabels[role]}</span>
                        {currentView === role && (
                          <span className="ml-auto text-xs font-semibold">✓</span>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Separador */}
                  <div className="my-2 border-t border-border-primary"></div>

                  {/* Restaurar Visão Real */}
                  {isViewDifferent && (
                    <>
                      <button
                        onClick={() => {
                          resetToActualRole();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 text-text-secondary hover:bg-background-tertiary text-sm mb-2"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Restaurar visão real</span>
                      </button>
                      <div className="my-2 border-t border-border-primary"></div>
                    </>
                  )}
                </>
                
                {/* Settings */}
                <button className="w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 text-text-secondary hover:bg-background-tertiary text-sm mb-1">
                  <Settings className="w-4 h-4" />
                  <span>Configurações</span>
                </button>

                {/* Logout */}
                <div className="border-t border-border-primary pt-2 mt-2">
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 text-red-400 hover:bg-red-500/10"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="font-medium text-sm">Sair</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Fechar dropdown ao clicar fora */}
          {isUserMenuOpen && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsUserMenuOpen(false)}
            ></div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
