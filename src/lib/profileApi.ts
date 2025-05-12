import axios from "axios";

const API_URL_LOCAL = "http://localhost:5291/api/Profile";

// Kiểm tra profile tồn tại
export const checkProfile = async (accountId: number): Promise<boolean> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const response = await axios.get(`${API_URL_LOCAL}/GetProfile/${accountId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data !== null;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return false;
    }
    throw error;
  }
};

// Tạo profile mới
export const createProfile = async (formData: FormData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const response = await axios.post(`${API_URL_LOCAL}/CreateProfile`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

// Cập nhật profile
export const updateProfile = async (accountId: number, formData: FormData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const response = await axios.put(`${API_URL_LOCAL}/UpdateProfile/${accountId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    });

    // Đợi response thực sự từ server
    if (response.status === 200) {
      return response;
    } else {
      throw new Error('Cập nhật hồ sơ không thành công');
    }
  } catch (error: any) {
    throw error;
  }
};

// Lấy thông tin profile
export const getProfile = async (accountId: number) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const response = await axios.get(`${API_URL_LOCAL}/GetProfile/${accountId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export interface Profile {
  id: number;
  accountId: number;
  fullName: string;
  birthday: string;
  genderId: number;
  description: string;
  avatar: string;
  publicId: string;
  createdAt: string;
  updatedAt: string;
  account: any;
  gender: any;
  profileImages: any[];
}

export async function getProfilesToMatch(accountId: number): Promise<Profile[]> {
  try {
    const response = await fetch(`${API_URL_LOCAL}/GetProfilesToMatch/${accountId}`);
    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }
      throw new Error('Failed to fetch profiles');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching profiles:', error);
    throw error;
  }
} 