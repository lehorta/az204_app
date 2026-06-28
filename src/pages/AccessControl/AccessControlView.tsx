import React from 'react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { AccessResponse } from '../../types';
import { UserCheck, CheckCircle, XCircle, Wifi, LogOut } from 'lucide-react';

interface AccessControlViewProps {
  credential: string;
  isLoading: boolean;
  result: AccessResponse | null;
  isOnline: boolean;
  onCredentialChange: (value: string) => void;
  onValidate: (e: React.FormEvent) => void;
  onLogout: () => void;
}

export const AccessControlView: React.FC<AccessControlViewProps> = ({
  credential,
  isLoading,
  result,
  isOnline,
  onCredentialChange,
  onValidate,
  onLogout,
}) => {
  return (
    <div className="min-h-screen bg-background-primary">
      {/* Header */}
      <header className="bg-background-secondary shadow-dark-md border-b border-border-primary">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-primary rounded-lg flex items-center justify-center shadow-dark-md">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-text-primary">SisBurpee</h1>
              <p className="text-xs text-text-secondary">Controle de Acesso</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Wifi className={`w-5 h-5 ${isOnline ? 'text-green-500' : 'text-red-500'}`} />
              <span className="text-sm text-text-secondary">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            <Button variant="secondary" size="sm" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2 inline" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <Card className="animate-in bg-background-secondary border-border-primary">
          <h2 className="text-2xl font-bold text-text-primary mb-6">
            Valida��o de Acesso
          </h2>

          <form onSubmit={onValidate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Credencial (RFID, CPF ou Matr�cula)
              </label>
              <input
                type="text"
                value={credential}
                onChange={(e) => onCredentialChange(e.target.value)}
                placeholder="Digite ou aproxime o cart�o"
                className="w-full px-4 py-4 text-lg bg-background-tertiary border-2 border-border-primary text-text-primary placeholder-text-disabled rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition"
                disabled={isLoading}
                autoFocus
                required
              />
              <p className="text-sm text-text-muted mt-2">
                ?? Teste com: <code className="bg-background-tertiary border border-border-primary px-2 py-1 rounded">123456</code> ou <code className="bg-background-tertiary border border-border-primary px-2 py-1 rounded">admin</code>
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              isLoading={isLoading}
            >
              Validar Acesso
            </Button>
          </form>

          {/* Result */}
          {result && (
            <div className={`mt-8 p-6 rounded-lg animate-in ${
              result.allowAccess 
                ? 'bg-green-500/10 border-2 border-green-500/30' 
                : 'bg-red-500/10 border-2 border-red-500/30'
            }`}>
              <div className="flex items-start gap-4">
                {result.allowAccess ? (
                  <CheckCircle className="w-12 h-12 text-green-500 flex-shrink-0" />
                ) : (
                  <XCircle className="w-12 h-12 text-red-500 flex-shrink-0" />
                )}

                <div className="flex-1">
                  {result.allowAccess && result.photo && (
                    <img 
                      src={result.photo} 
                      alt={result.memberName || ''} 
                      className="w-20 h-20 rounded-full mb-4 border-4 border-border-primary shadow-dark-lg"
                    />
                  )}

                  <h3 className={`text-2xl font-bold mb-2 ${
                    result.allowAccess ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {result.allowAccess ? '? Acesso Liberado!' : '? Acesso Negado'}
                  </h3>

                  {result.memberName && (
                    <p className="text-lg font-semibold text-text-primary mb-1">
                      {result.memberName}
                    </p>
                  )}

                  {result.memberId && (
                    <p className="text-sm text-text-secondary mb-2">
                      Matr�cula: {result.memberId}
                    </p>
                  )}

                  {result.plan && (
                    <p className="text-sm text-text-secondary mb-2">
                      Plano: {result.plan}
                    </p>
                  )}

                  <p className={`text-base mt-3 ${
                    result.allowAccess ? 'text-green-300' : 'text-red-300'
                  }`}>
                    {result.message}
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="bg-background-secondary border-border-primary">
            <div className="text-center">
              <p className="text-sm text-text-secondary mb-1">Acessos Hoje</p>
              <p className="text-3xl font-bold text-brand-primary">47</p>
            </div>
          </Card>
          <Card className="bg-background-secondary border-border-primary">
            <div className="text-center">
              <p className="text-sm text-text-secondary mb-1">Dispositivos</p>
              <p className="text-3xl font-bold text-green-500">3/3</p>
            </div>
          </Card>
          <Card className="bg-background-secondary border-border-primary">
            <div className="text-center">
              <p className="text-sm text-text-secondary mb-1">Status</p>
              <p className="text-3xl font-bold text-green-500">?? OK</p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};
