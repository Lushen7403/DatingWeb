import axios from 'axios';
const API_URL = 'http://localhost:5291/api/AdminDash';

export const getDashboardData = async () => {
  const res = await axios.get(API_URL);
  return res.data;
}; 