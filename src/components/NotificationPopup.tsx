import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Bell, MessageCircle, Heart, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { notificationService } from '@/lib/notificationService';
import { getNotificationsByAccountId, markAllAsRead } from '@/lib/notificationApi';
import { Notification } from '@/types/Notification';

function mapNotificationType(typeId: number): 'system' | 'message' | 'match' | 'swipe' {
  switch (typeId) {
    case 1: return 'message';
    case 2: return 'system';
    case 3: return 'match';
    case 4: return 'swipe';
    default: return 'system';
  }
}

interface NotificationPopupProps {
  onClose?: () => void;
  setUnreadCount?: (count: number) => void;
}

const NotificationPopup = ({ onClose, setUnreadCount }: NotificationPopupProps) => {
  const [notifications, setNotifications] = useState<Record<string, Notification[]>>({
    system: [],
    message: [],
    match: [],
    swipe: []
  });
  const [activeTab, setActiveTab] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const accountId = Number(localStorage.getItem('accountId'));
        const apiNotifs = await getNotificationsByAccountId(accountId);

        const grouped: Record<string, Notification[]> = {
          system: [],
          message: [],
          match: [],
          swipe: []
        };

        apiNotifs.forEach(n => {
          const type = mapNotificationType(n.notificationTypeId);
          grouped[type].push(n);
        });

        setNotifications(grouped);
      } catch (e) {
        // Xử lý lỗi nếu cần
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Realtime: nhận notification mới
  useEffect(() => {
    const unsubscribeNotification = notificationService.onNotification((notification: Notification) => {
      const type = mapNotificationType(notification.notificationTypeId);
      setNotifications(prev => ({
        ...prev,
        [type]: [notification, ...prev[type]]
      }));
    });

    // Mark as read realtime
    const unsubscribeMarkedAsRead = notificationService.onMarkedAsRead((notificationId: number) => {
      setNotifications(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
          updated[key] = updated[key].map(n =>
            n.notificationId === notificationId ? { ...n, isRead: true } : n
          );
        });
        return updated;
      });
    });

    return () => {
      unsubscribeNotification();
      unsubscribeMarkedAsRead();
    };
  }, []);

  // Sau khi load notifications hoặc khi state notifications thay đổi:
  useEffect(() => {
    if (setUnreadCount) {
      const totalUnread = [
        ...notifications.system,
        ...notifications.message,
        ...notifications.match,
        ...notifications.swipe
      ].filter(n => !n.isRead).length;
      setUnreadCount(totalUnread);
    }
  }, [notifications, setUnreadCount]);

  const getTypeLabel = (type: string): string => {
    switch (type) {
      case 'system': return 'Hệ thống';
      case 'message': return 'Tin nhắn';
      case 'match': return 'Lượt thích';
      case 'swipe': return 'Thích';
      case 'all': return 'Tất cả';
      default: return type;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'system': return <Bell className="h-4 w-4" />;
      case 'message': return <MessageCircle className="h-4 w-4" />;
      case 'match': return <Heart className="h-4 w-4" />;
      case 'swipe': return <Check className="h-4 w-4" />;
      default: return null;
    }
  };

  const getAllNotifications = (): Notification[] => {
    return [
      ...notifications.system,
      ...notifications.message,
      ...notifications.match,
      ...notifications.swipe
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const handleReadNotification = async (notification: Notification) => {
    try {
      await notificationService.markAsRead(notification.notificationId);
      // Điều hướng theo loại thông báo
      const type = mapNotificationType(notification.notificationTypeId);
      if (type === 'swipe' && notification.referenceId) {
        navigate(`/view-profile/${notification.referenceId}`);
      } else if ((type === 'match' || type === 'message') && notification.referenceId) {
        navigate(`/messages/${notification.referenceId}`);
      }
      if (onClose) onClose();
    } catch (error) {
      // Xử lý lỗi nếu cần
    }
  };

  const getUnreadCount = (type: string): number => {
    if (type === 'all') {
      return getAllNotifications().filter(n => !n.isRead).length;
    }
    return notifications[type]?.filter(n => !n.isRead).length || 0;
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleMarkAllAsRead = async () => {
    try {
      const accountId = Number(localStorage.getItem('accountId'));
      await markAllAsRead(accountId);
      // Cập nhật local state
      setNotifications(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
          updated[key] = updated[key].map(n => ({ ...n, isRead: true }));
        });
        return updated;
      });
      if (setUnreadCount) setUnreadCount(0);
    } catch (e) {
      // Xử lý lỗi nếu cần
    }
  };

  const renderNotifications = () => {
    const notifs = activeTab === 'all' ? getAllNotifications() : notifications[activeTab] || [];
    if (!notifs.length) return <p className="text-center p-4 text-muted-foreground">Không có thông báo</p>;
    return notifs.map(notification => (
      <div
        key={notification.notificationId}
        className={`p-3 border-b hover:bg-muted/50 cursor-pointer flex items-start ${!notification.isRead ? 'bg-muted/30' : ''}`}
        onClick={() => handleReadNotification(notification)}
      >
        <div className="mr-3 flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            {getTypeIcon(mapNotificationType(notification.notificationTypeId))}
          </div>
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h4 className="font-medium text-sm">{getTypeLabel(mapNotificationType(notification.notificationTypeId))}</h4>
            {!notification.isRead && (
              <Badge variant="secondary" className="ml-2 bg-primary text-white text-xs px-1.5 py-0.5">Mới</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{notification.content}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {format(new Date(notification.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
          </p>
        </div>
      </div>
    ));
  };

  const totalUnread = getUnreadCount('all');

  return (
    <div>
      <Tabs defaultValue="all" onValueChange={handleTabChange}>
        <div className="flex justify-between items-center p-3 border-b">
          <h3 className="font-semibold">Thông báo</h3>
          {totalUnread > 0 && (
            <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
              Đánh dấu đã đọc tất cả
            </Button>
          )}
        </div>
        <TabsList className="grid grid-cols-5 p-1">
          <TabsTrigger value="all" className="relative">
            Tất cả
            {getUnreadCount('all') > 0 && (
              <Badge variant="secondary" className="absolute -top-1 -right-1 bg-primary text-white text-xs px-1.5 py-0.5 rounded-full">
                {getUnreadCount('all')}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="system" className="relative">
            <Bell className="h-4 w-4 mr-1" />
            {getUnreadCount('system') > 0 && (
              <Badge variant="secondary" className="absolute -top-1 -right-1 bg-primary text-white text-xs px-1.5 py-0.5 rounded-full">
                {getUnreadCount('system')}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="message" className="relative">
            <MessageCircle className="h-4 w-4 mr-1" />
            {getUnreadCount('message') > 0 && (
              <Badge variant="secondary" className="absolute -top-1 -right-1 bg-primary text-white text-xs px-1.5 py-0.5 rounded-full">
                {getUnreadCount('message')}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="match" className="relative">
            <Heart className="h-4 w-4 mr-1" />
            {getUnreadCount('match') > 0 && (
              <Badge variant="secondary" className="absolute -top-1 -right-1 bg-primary text-white text-xs px-1.5 py-0.5 rounded-full">
                {getUnreadCount('match')}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="swipe" className="relative">
            <Check className="h-4 w-4 mr-1" />
            {getUnreadCount('swipe') > 0 && (
              <Badge variant="secondary" className="absolute -top-1 -right-1 bg-primary text-white text-xs px-1.5 py-0.5 rounded-full">
                {getUnreadCount('swipe')}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        <div className="mt-1 max-h-80 overflow-y-auto">
          {loading ? <div className="p-4 text-center text-muted-foreground">Đang tải...</div> : renderNotifications()}
        </div>
      </Tabs>
    </div>
  );
};

export default NotificationPopup;
