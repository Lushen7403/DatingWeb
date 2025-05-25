import axios from 'axios';

export interface RechargePackage {
  id: number;
  price: number;
  diamond: number;
}

export const getActiveRechargePackages = async (): Promise<RechargePackage[]> => {
  const res = await axios.get('http://localhost:5291/api/Diamond/GetAllActive');
  return res.data;
};

export const getDiamondBalance = async (accountId: number): Promise<number> => {
  const res = await axios.get(`http://localhost:5291/api/Diamond/balance/${accountId}`);
  return res.data;
};
