import { useState, useEffect } from 'react';
import { ReceptionistDashboardStats, HourlyPresence, Alert } from './types';

export const useReceptionistDashboard = () => {
  const [stats, setStats] = useState<ReceptionistDashboardStats>({
    totalPresentToday: 0,
    expectedToday: 0,
    checkInRate: 0,
    peakHour: 0,
    peakHourCount: 0,
    alerts: [],
    hourlyPresence: [],
    recentAccessLog: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        // Simular dados de presença por hora
        const hourlyData: HourlyPresence[] = Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          count: Math.floor(Math.random() * 45) + 5, // Entre 5 e 50 alunos
          percentage: 0,
        }));

        // Calcular percentuais
        const maxCount = Math.max(...hourlyData.map(h => h.count));
        hourlyData.forEach(h => {
          h.percentage = (h.count / maxCount) * 100;
        });

        // Encontrar hora de pico
        const peakEntry = hourlyData.reduce((prev, current) => 
          (prev.count > current.count) ? prev : current
        );

        // Dados de acessos recentes (mock)
        const recentAccessLog = [
          {
            id: '1',
            studentName: 'João Silva',
            checkInTime: '08:15',
            membership: 'Premium',
            status: 'active' as const,
          },
          {
            id: '2',
            studentName: 'Maria Santos',
            checkInTime: '08:22',
            membership: 'Mensal',
            status: 'active' as const,
          },
          {
            id: '3',
            studentName: 'Carlos Mendes',
            checkInTime: '08:45',
            membership: 'Anual',
            status: 'active' as const,
          },
          {
            id: '4',
            studentName: 'Ana Costa',
            checkInTime: '09:10',
            membership: 'Mensal',
            status: 'expiring' as const,
          },
          {
            id: '5',
            studentName: 'Pedro Oliveira',
            checkInTime: '09:30',
            membership: 'Trial',
            status: 'expired' as const,
          },
        ];

        // Alertas importantes
        const alerts: Alert[] = [
          {
            id: 'alert-1',
            type: 'warning',
            title: '8 membros com plano vencendo',
            message: 'Entrar em contato hoje para renovação',
            timestamp: new Date().toISOString(),
          },
          {
            id: 'alert-2',
            type: 'error',
            title: '3 membros com plano expirado',
            message: 'Necessário atualizar dados ou remover acesso',
            timestamp: new Date().toISOString(),
          },
          {
            id: 'alert-3',
            type: 'info',
            title: 'Limpeza de piscina agendada',
            message: 'Às 18:00 - Avisar alunos',
            timestamp: new Date().toISOString(),
          },
          {
            id: 'alert-4',
            type: 'warning',
            title: '2 equipamentos com manutenção necessária',
            message: 'Máquina leg press (#5) e esteira (#8)',
            timestamp: new Date().toISOString(),
          },
          {
            id: 'alert-5',
            type: 'info',
            title: 'Aula de yoga cancelada',
            message: 'Instrutor indisponível - Informar alunos',
            timestamp: new Date().toISOString(),
          },
        ];

        const totalPresent = recentAccessLog.length;
        const expected = Math.floor(Math.random() * 30) + 50; // Entre 50 e 80

        setStats({
          totalPresentToday: totalPresent,
          expectedToday: expected,
          checkInRate: Math.round((totalPresent / expected) * 100),
          peakHour: peakEntry.hour,
          peakHourCount: peakEntry.count,
          alerts,
          hourlyPresence: hourlyData,
          recentAccessLog,
        });
      } catch (error) {
        console.error('Erro ao carregar dashboard de recepcionista:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return { stats, isLoading };
};
