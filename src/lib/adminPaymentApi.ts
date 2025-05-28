import axios from 'axios';

const API_URL = 'http://localhost:5291/api';

export const getAllPayments = async (page = 1, pageSize = 10) => {
  const res = await axios.get(`${API_URL}/AdminPayment`, {
    params: { page, pageSize }
  });
  return res.data;
}; 