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
  const res = await axios.get('https://datingwebbe-jnmo.onrender.com/api/AdminDash/daily');
  return res.data;
};

export const getWeeklyDashboardData = async (): Promise<DashboardData> => {
  const res = await axios.get('https://datingwebbe-jnmo.onrender.com/api/AdminDash/weekly');
  return res.data;
};

export const getMonthlyDashboardData = async (): Promise<DashboardData> => {
  const res = await axios.get('https://datingwebbe-jnmo.onrender.com/api/AdminDash/monthly');
  return res.data;
}; 