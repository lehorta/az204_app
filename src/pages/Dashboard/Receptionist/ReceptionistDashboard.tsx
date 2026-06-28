import React from 'react';
import { ReceptionistDashboardView } from './ReceptionistDashboardView';
import { useReceptionistDashboard } from './useReceptionistDashboard';

export const ReceptionistDashboard: React.FC = () => {
  const { stats, isLoading } = useReceptionistDashboard();

  return (
    <ReceptionistDashboardView
      stats={stats}
      isLoading={isLoading}
    />
  );
};
