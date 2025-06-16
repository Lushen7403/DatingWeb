import axios from 'axios';

const API_URL = 'https://datingwebbe-jnmo.onrender.com/api';

export interface Voucher {
  id: number;
  code: string;
  discountPercent: number;
}

export const getActiveVouchers = async (): Promise<Voucher[]> => {
  const response = await axios.get(`${API_URL}/Voucher/voucher`);
  return response.data;
}; 