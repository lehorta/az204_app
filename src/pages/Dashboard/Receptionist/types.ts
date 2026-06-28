export interface HourlyPresence {
  hour: number;
  count: number;
  percentage: number;
}

export interface Alert {
  id: string;
  type: 'warning' | 'info' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ReceptionistDashboardStats {
  totalPresentToday: number;
  expectedToday: number;
  checkInRate: number;
  peakHour: number;
  peakHourCount: number;
  alerts: Alert[];
  hourlyPresence: HourlyPresence[];
  recentAccessLog: {
    id: string;
    studentName: string;
    checkInTime: string;
    membership: string;
    status: 'active' | 'expiring' | 'expired';
  }[];
}
