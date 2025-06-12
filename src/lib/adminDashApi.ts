import axios from 'axios';

export interface DashboardData {
  totalUsers: number;
  totalPayments: number;
  chart: {
    labels: string[];
    newRegistrations: number[];
    matchedCounts: number[];
    revenues: number[];
  };
}

export const getDashboardData = async (): Promise<DashboardData> => {
  const res = await axios.get('http://localhost:5291/api/AdminDash/daily');
  return res.data;
};

export const getWeeklyDashboardData = async (): Promise<DashboardData> => {
  const res = await axios.get('http://localhost:5291/api/AdminDash/weekly');
  return res.data;
};

export const getMonthlyDashboardData = async (): Promise<DashboardData> => {
  const res = await axios.get('http://localhost:5291/api/AdminDash/monthly');
  return res.data;
}; 