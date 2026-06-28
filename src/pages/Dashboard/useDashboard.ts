import { useState, useEffect } from 'react';

interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  todayAccess: number;
  monthlyRevenue: number;
  newMembersMonth: number;
  expiringPlans: number;
}

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    activeMembers: 0,
    todayAccess: 0,
    monthlyRevenue: 0,
    newMembersMonth: 0,
    expiringPlans: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simula carregamento de dados
    setTimeout(() => {
      setStats({
        totalMembers: 342,
        activeMembers: 298,
        todayAccess: 47,
        monthlyRevenue: 54380.00,
        newMembersMonth: 23,
        expiringPlans: 12,
      });
      setIsLoading(false);
    }, 800);
  }, []);

  return {
    stats,
    isLoading,
  };
};
