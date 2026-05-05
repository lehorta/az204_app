import React from 'react';
import { AdminLayout } from '../../../components/AdminLayout';
import { Card } from '../../../components/Card';
import {
  Users,
  Clock,
  TrendingUp,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  LogIn,
} from 'lucide-react';
import { ReceptionistDashboardStats, Alert } from './types';

interface ReceptionistDashboardViewProps {
  stats: ReceptionistDashboardStats;
  isLoading: boolean;
}

const getAlertIcon = (type: Alert['type']) => {
  switch (type) {
    case 'warning':
      return AlertTriangle;
    case 'error':
      return AlertCircle;
    case 'info':
      return Info;
    case 'success':
      return CheckCircle;
    default:
      return Info;
  }
};

const getAlertColor = (type: Alert['type']) => {
  switch (type) {
    case 'warning':
      return 'bg-orange-500/10 border-orange-500/30 text-orange-400';
    case 'error':
      return 'bg-red-500/10 border-red-500/30 text-red-400';
    case 'info':
      return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
    case 'success':
      return 'bg-green-500/10 border-green-500/30 text-green-400';
    default:
      return 'bg-gray-500/10 border-gray-500/30 text-gray-400';
  }
};

const getMembershipColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-500/20 text-green-400 border border-green-500/30';
    case 'expiring':
      return 'bg-orange-500/20 text-orange-400 border border-orange-500/30';
    case 'expired':
      return 'bg-red-500/20 text-red-400 border border-red-500/30';
    default:
      return 'bg-gray-500/20 text-gray-400';
  }
};

export const ReceptionistDashboardView: React.FC<ReceptionistDashboardViewProps> = ({
  stats,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <AdminLayout userName="Recepção">
        <div className="text-center py-12">
          <p className="text-text-secondary">Carregando dashboard...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout userName="Recepção">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Dashboard Recepção</h1>
          <p className="text-text-secondary">Monitoramento de presença e avisos importantes</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Presentes Hoje */}
          <Card className="bg-background-secondary border-border-primary">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Users className="w-7 h-7 text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-text-secondary mb-1">Presentes Hoje</p>
                <p className="text-2xl font-bold text-text-primary">{stats.totalPresentToday}</p>
                <p className="text-xs text-text-muted mt-1">
                  Esperado: {stats.expectedToday}
                </p>
              </div>
            </div>
          </Card>

          {/* Taxa de Check-in */}
          <Card className="bg-background-secondary border-border-primary">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-green-500/20 flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-green-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-text-secondary mb-1">Taxa de Check-in</p>
                <p className="text-2xl font-bold text-text-primary">{stats.checkInRate}%</p>
                <div className="w-full bg-background-tertiary h-1 rounded-full mt-2">
                  <div
                    className="bg-green-500 h-1 rounded-full"
                    style={{ width: `${stats.checkInRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </Card>

          {/* Hora de Pico */}
          <Card className="bg-background-secondary border-border-primary">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Clock className="w-7 h-7 text-purple-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-text-secondary mb-1">Hora de Pico</p>
                <p className="text-2xl font-bold text-text-primary">
                  {String(stats.peakHour).padStart(2, '0')}:00
                </p>
                <p className="text-xs text-text-muted mt-1">
                  {stats.peakHourCount} alunos
                </p>
              </div>
            </div>
          </Card>

          {/* Avisos */}
          <Card className="bg-background-secondary border-border-primary">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-orange-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-text-secondary mb-1">Alertas Ativos</p>
                <p className="text-2xl font-bold text-text-primary">{stats.alerts.length}</p>
                <p className="text-xs text-text-muted mt-1">
                  Requer atenção
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gráfico de Presença por Hora */}
          <div className="lg:col-span-2">
            <Card className="bg-background-secondary border-border-primary">
              <h3 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-brand-primary" />
                Presença por Hora do Dia
              </h3>
              
              <div className="flex items-end gap-2 h-64">
                {stats.hourlyPresence.map((data) => (
                  <div
                    key={data.hour}
                    className="flex flex-col items-center flex-1 group"
                  >
                    <div className="w-full bg-background-tertiary rounded-t-lg overflow-hidden relative group-hover:bg-brand-primary/30 transition-colors duration-200">
                      <div
                        className="w-full bg-gradient-to-b from-brand-primary to-brand-primary/80 rounded-t-lg transition-all duration-300"
                        style={{ height: `${data.percentage}%` }}
                      >
                        <div className="text-xs font-bold text-white text-center py-1">
                          {data.count}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-text-muted mt-2">
                      {String(data.hour).padStart(2, '0')}h
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-background-tertiary rounded-lg">
                <p className="text-sm text-text-secondary">
                  <span className="font-semibold text-text-primary">
                    Pico de presença:
                  </span>{' '}
                  {String(stats.peakHour).padStart(2, '0')}:00 com{' '}
                  <span className="font-bold text-brand-primary">
                    {stats.peakHourCount} alunos
                  </span>
                </p>
              </div>
            </Card>
          </div>

          {/* Alertas e Avisos */}
          <Card className="bg-background-secondary border-border-primary">
            <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Avisos Importantes
            </h3>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {stats.alerts.map((alert) => {
                const IconComponent = getAlertIcon(alert.type);
                const colorClass = getAlertColor(alert.type);

                return (
                  <div
                    key={alert.id}
                    className={`p-3 border rounded-lg ${colorClass}`}
                  >
                    <div className="flex gap-2">
                      <IconComponent className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold mb-1">{alert.title}</p>
                        <p className="text-xs text-text-muted">{alert.message}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Log de Acessos Recentes */}
        <Card className="bg-background-secondary border-border-primary">
          <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
            <LogIn className="w-5 h-5 text-brand-primary" />
            Últimos Acessos
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-primary">
                  <th className="text-left py-3 px-4 font-semibold text-text-secondary">
                    Nome
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-text-secondary">
                    Horário
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-text-secondary">
                    Plano
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-text-secondary">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.recentAccessLog.map((access) => (
                  <tr
                    key={access.id}
                    className="border-b border-border-primary hover:bg-background-tertiary transition-colors"
                  >
                    <td className="py-3 px-4 text-text-primary">{access.studentName}</td>
                    <td className="py-3 px-4 text-text-secondary">{access.checkInTime}</td>
                    <td className="py-3 px-4 text-text-secondary">{access.membership}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getMembershipColor(
                          access.status
                        )}`}
                      >
                        {access.status === 'active'
                          ? 'Ativo'
                          : access.status === 'expiring'
                          ? 'Vencendo'
                          : 'Expirado'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};
