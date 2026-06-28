import { Moon, Sun } from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { Card } from '../../components/Card';
import { useTheme } from '../../contexts/ThemeContext';

export const Settings = () => {
  const { theme, setTheme } = useTheme();

  return (
    <AdminLayout userName="Configurações">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Configurações</h1>
          <p className="text-text-secondary">Personalize as preferências do sistema</p>
        </div>

        {/* Tema Card */}
        <Card className="bg-background-secondary border-border-primary max-w-md">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-text-primary mb-1">Tema do Sistema</h2>
              <p className="text-sm text-text-secondary">Escolha entre tema claro ou escuro</p>
            </div>

            {/* Theme Options */}
            <div className="space-y-3">
              {/* Dark Theme Button */}
              <button
                onClick={() => setTheme('dark')}
                className={`w-full p-4 rounded-lg border-2 transition-all ${
                  theme === 'dark'
                    ? 'border-brand-primary bg-background-tertiary'
                    : 'border-border-primary hover:border-border-secondary'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-lg bg-gradient-to-b from-slate-800 to-slate-900 flex items-center justify-center border border-slate-700">
                    <Moon className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-semibold text-text-primary">Escuro</div>
                    <div className="text-xs text-text-secondary">Tema escuro padrão</div>
                  </div>
                  {theme === 'dark' && (
                    <div className="w-6 h-6 rounded-full bg-brand-primary flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                  )}
                </div>
              </button>

              {/* Light Theme Button */}
              <button
                onClick={() => setTheme('light')}
                className={`w-full p-4 rounded-lg border-2 transition-all ${
                  theme === 'light'
                    ? 'border-brand-primary bg-background-tertiary'
                    : 'border-border-primary hover:border-border-secondary'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-lg bg-gradient-to-b from-white to-gray-100 flex items-center justify-center border border-gray-300">
                    <Sun className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-semibold text-text-primary">Claro</div>
                    <div className="text-xs text-text-secondary">Tema claro moderno</div>
                  </div>
                  {theme === 'light' && (
                    <div className="w-6 h-6 rounded-full bg-brand-primary flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                  )}
                </div>
              </button>
            </div>

            {/* Info */}
            <div className="mt-4 p-3 rounded-lg bg-background-tertiary border border-border-primary">
              <p className="text-xs text-text-secondary">
                Sua preferencia de tema sera salva automaticamente e sera restaurada ao retornar.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};
