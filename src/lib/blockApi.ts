import axios from 'axios';

const BLOCK_API_URL = "https://datingwebbe-jnmo.onrender.com/api/Block";

export async function blockUser(accountId: number, blockedAccountId: number) {
  const res = await fetch(`${BLOCK_API_URL}/block?accountId=${accountId}&blockedAccountId=${blockedAccountId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  if (!res.ok) {
    throw new Error('Không thể chặn người dùng');
  }
  
  return await res.json();
}

export async function unblockUser(accountId: number, blockedAccountId: number) {
  const res = await fetch(`${BLOCK_API_URL}/unblock?accountId=${accountId}&blockedAccountId=${blockedAccountId}`, {
    method: 'DELETE'
  });
  
  if (!res.ok) {
    throw new Error('Không thể bỏ chặn người dùng');
  }
}

export async function getBlockedUsers(accountId: number) {
  const res = await fetch(`${BLOCK_API_URL}/list?accountId=${accountId}`);
  
  if (!res.ok) {
    throw new Error('Không thể lấy danh sách người dùng đã chặn');
  }
  
  return await res.json();
}

export const isBlocked = async (accountId: number, blockedAccountId: number) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found');

  const response = await axios.get(`${BLOCK_API_URL}/isBlock`, {
    params: {
      accountId,
      blockedAccountId
    },
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

export const isEitherBlocked = async (userId1: number, userId2: number) => {
  try {
    const blockedByUser1 = await isBlocked(userId1, userId2);
    const blockedByUser2 = await isBlocked(userId2, userId1);
    return blockedByUser1 || blockedByUser2;
  } catch (error) {
    console.error('Error checking block status:', error);
    return false;
  }
}; 