import axios from 'axios';

// Interface phản ánh đúng dữ liệu backend trả về
export interface NotificationApiResponse {
  notificationId: number;
  userId: number;
  notificationTypeId: number;
  content: string;
  isRead: boolean;
  createdAt: string;
  referenceId?: number;
}

export const getNotificationsByAccountId = async (accountId: number): Promise<NotificationApiResponse[]> => {
  const res = await axios.get(`http://localhost:5291/api/Notification/GetByAccountId/${accountId}`);
  return res.data;
};

export const markAllAsRead = async (accountId: number): Promise<void> => {
  await axios.post(`http://localhost:5291/api/Notification/MarkAllAsRead/${accountId}`);
};

export const getUnreadNotificationCount = async (accountId: number): Promise<number> => {
  const res = await axios.get(`http://localhost:5291/api/Notification/UnreadCount/${accountId}`);
  return res.data;
};
