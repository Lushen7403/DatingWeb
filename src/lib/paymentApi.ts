import axios from 'axios';

const API_URL = 'https://datingwebbe-jnmo.onrender.com/api';

export interface CreatePaymentRequest {
  accountId: number;
  packageId: number;
  voucherId?: number;
  amountBefore: number;
  discountAmount: number;
}

export const createPaymentUrl = async (data: CreatePaymentRequest) => {
  const response = await axios.post(`${API_URL}/Payment/create-url`, data);
  return response.data;
};

export const checkPaymentStatus = async (paymentId: number) => {
  const response = await axios.get(`${API_URL}/Payment/return?vnp_TxnRef=${paymentId}`);
  return response.data;
}; 