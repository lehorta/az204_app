import React from 'react';
import { AdminLayout } from '../../components/AdminLayout';
import { Card } from '../../components/Card';
import { Emoji } from '../../components/Emoji';
import { 
  Users, 
  UserCheck, 
  TrendingUp, 
  DollarSign, 
  UserPlus, 
  Clock,
  Activity,
  Calendar
} from 'lucide-react';

interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  todayAccess: number;
  monthlyRevenue: number;
  newMembersMonth: number;
  expiringPlans: number;
}

interface DashboardViewProps {
  stats: DashboardStats;
  isLoading: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  isLoading,
}) => {
  const statsCards = [
    {
      title: 'Total de Alunos',
      value: stats.totalMembers,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/20',
    },
    {
      title: 'Alunos Ativos',
      value: stats.activeMembers,
      icon: UserCheck,
      color: 'text-green-500',
      bgColor: 'bg-green-500/20',
    },
    {
      title: 'Acessos Hoje',
      value: stats.todayAccess,
      icon: Activity,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/20',
    },
    {
      title: 'Receita Mensal',
      value: `R$ ${stats.monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/20',
    },
    {
      title: 'Novos Alunos (Mês)',
      value: stats.newMembersMonth,
      icon: UserPlus,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/20',
    },
    {
      title: 'Planos Vencendo',
      value: stats.expiringPlans,
      icon: Clock,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/20',
    },
  ];

  return (
    <AdminLayout userName="Admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Dashboard</h1>
          <p className="text-text-secondary">Visão geral do sistema</p>
        </div>

        {/* Stats Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-text-secondary">Carregando dados...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {statsCards.map((stat, index) => (
              <Card key={index} className="bg-background-secondary border-border-primary">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`w-7 h-7 ${stat.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-text-secondary mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-background-secondary border-border-primary">
            <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-primary" />
              Atividades Recentes
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-background-tertiary rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-sm text-text-secondary flex-1">João Silva fez check-in</p>
                <span className="text-xs text-text-muted">Há 5 min</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-background-tertiary rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-sm text-text-secondary flex-1">Novo aluno cadastrado</p>
                <span className="text-xs text-text-muted">Há 15 min</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-background-tertiary rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <p className="text-sm text-text-secondary flex-1">Pagamento recebido</p>
                <span className="text-xs text-text-muted">Há 32 min</span>
              </div>
            </div>
          </Card>

          <Card className="bg-background-secondary border-border-primary">
            <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-primary" />
              Avisos Importantes
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                <p className="text-sm font-semibold text-orange-400 mb-1">12 planos vencendo</p>
                <p className="text-xs text-text-muted">Entrar em contato com os alunos</p>
              </div>
              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-sm font-semibold text-blue-400 mb-1">Manutenção agendada</p>
                <p className="text-xs text-text-muted">Equipamentos - Amanhã às 14h</p>
              </div>
              <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="text-sm font-semibold text-green-400 mb-1">Meta mensal atingida</p>
                <p className="text-xs text-text-muted">23 novos alunos este mês <Emoji symbol="party" label="festa" /></p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};
