import React from 'react';
import { useView } from '../../contexts/ViewContext';
import { DashboardView } from './DashboardView';
import { useDashboard } from './useDashboard';
import { ReceptionistDashboard } from './Receptionist';

export const Dashboard: React.FC = () => {
  const { stats, isLoading } = useDashboard();
  const { currentView } = useView();

  // Renderiza dashboard específico baseado na visão
  if (currentView === 'Recepcionista') {
    return <ReceptionistDashboard />;
  }

  // Dashboard padrão para outras roles
  return (
    <DashboardView
      stats={stats}
      isLoading={isLoading}
    />
  );
};
