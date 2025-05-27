// src/lib/accountApi.ts
import axios from "axios";

const API_URL = "http://localhost:5291/api/Account"; // Đổi lại nếu API chạy port khác

export const login = async (data: { userName: string; password: string }) => {
  try {
    const response = await axios.post(`${API_URL}/Login`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response;
  } catch (error: any) {
    throw error;
  }
};

export const register = (data: { userName: string; email: string; password: string }) =>
  axios.post(`${API_URL}/Register`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

export const changePassword = (data: { accountId: number; oldPassword: string; newPassword: string }) =>
  axios.post(`${API_URL}/ChangePassword`, data);

export const logout = (token: string) =>
  axios.post(`${API_URL}/Logout`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });