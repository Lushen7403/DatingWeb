export interface Notification {
  notificationId: number;
  userId: number;
  notificationTypeId: number;
  content: string;
  isRead: boolean;
  createdAt: string;
  referenceId?: number;
}
