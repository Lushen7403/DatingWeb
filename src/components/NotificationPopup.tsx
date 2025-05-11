
import { useState } from 'react';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Bell, MessageCircle, Heart, Check } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Notification } from "@/types/Notification";
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';

// Sample notification data
const dummyNotifications: Record<string, Notification[]> = {
  system: [
    {
      id: '1',
      type: 'system',
      title: 'Chào mừng đến với MatchUp!',
      content: 'Cảm ơn bạn đã tham gia MatchUp. Bắt đầu khám phá ngay nhé!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      read: false,
    },
    {
      id: '2',
      type: 'system',
      title: 'Cập nhật mới',
      content: 'Chúng tôi vừa ra mắt tính năng mới. Kiểm tra ngay!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      read: true,
    },
  ],
  message: [
    {
      id: '3',
      type: 'message',
      title: 'Tin nhắn mới từ Thảo',
      content: 'Xin chào, bạn có khỏe không?',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      read: false,
      image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
    },
  ],
  match: [
    {
      id: '4',
      type: 'match',
      title: 'Tuấn đã thích bạn',
      content: 'Tuấn đã thích hồ sơ của bạn. Bạn có muốn xem hồ sơ của họ không?',
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      read: false,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      profileId: '5',
    },
    {
      id: '5',
      type: 'match',
      title: 'Phương đã thích bạn',
      content: 'Phương đã thích hồ sơ của bạn. Bạn có muốn xem hồ sơ của họ không?',
      timestamp: new Date(Date.now() - 1000 * 60 * 180),
      read: true,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      profileId: '6',
    },
  ],
  match_success: [
    {
      id: '6',
      type: 'match_success',
      title: 'Bạn đã match với Hùng',
      content: 'Chúc mừng! Bạn và Hùng đã match. Hãy bắt đầu cuộc trò chuyện ngay!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      read: false,
      image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce',
      profileId: '7',
    },
  ],
};

interface NotificationItemProps {
  notification: Notification;
  onRead: (id: string) => void;
  onClose?: () => void;
}

const NotificationItem = ({ notification, onRead, onClose }: NotificationItemProps) => {
  const navigate = useNavigate();
  const formattedTime = format(new Date(notification.timestamp), 'HH:mm', { locale: vi });
  const isToday = new Date().getDate() === notification.timestamp.getDate();
  const dateDisplay = isToday 
    ? `Hôm nay lúc ${formattedTime}` 
    : format(notification.timestamp, 'dd/MM/yyyy HH:mm', { locale: vi });
  
  const handleClick = () => {
    if (!notification.read) {
      onRead(notification.id);
    }
    
    // Navigation logic based on notification type
    switch(notification.type) {
      case 'system':
        // System notifications typically just mark as read
        break;
      case 'message':
        navigate('/messages');
        break;
      case 'match':
        if (notification.profileId) {
          navigate(`/like-detail/${notification.profileId}`);
        } else {
          navigate('/likes');
        }
        break;
      case 'match_success':
        if (notification.profileId) {
          navigate(`/messages`); // Navigate to messages after a successful match
        }
        break;
    }
    
    // Close the popover after navigation
    if (onClose) {
      onClose();
    }
  };

  return (
    <div 
      className={`p-3 border-b hover:bg-muted/50 cursor-pointer flex items-start ${!notification.read ? 'bg-muted/30' : ''}`}
      onClick={handleClick}
    >
      <div className="mr-3 flex-shrink-0">
        {notification.image ? (
          <Avatar>
            <AvatarImage src={notification.image} alt={notification.title} />
            <AvatarFallback>{notification.title.charAt(0)}</AvatarFallback>
          </Avatar>
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            {notification.type === 'system' && <Bell className="text-primary h-5 w-5" />}
            {notification.type === 'message' && <MessageCircle className="text-primary h-5 w-5" />}
            {notification.type === 'match' && <Heart className="text-primary h-5 w-5" />}
            {notification.type === 'match_success' && <Check className="text-primary h-5 w-5" />}
          </div>
        )}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h4 className="font-medium text-sm">{notification.title}</h4>
          {!notification.read && (
            <Badge variant="secondary" className="ml-2 bg-primary text-white text-xs px-1.5 py-0.5">Mới</Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{notification.content}</p>
        <p className="text-xs text-muted-foreground mt-1">{dateDisplay}</p>
      </div>
    </div>
  );
};

interface NotificationPopupProps {
  onClose?: () => void;
}

const NotificationPopup = ({ onClose }: NotificationPopupProps) => {
  const [notifications, setNotifications] = useState<Record<string, Notification[]>>(dummyNotifications);
  const [activeTab, setActiveTab] = useState<string>("all");
  
  const getTypeLabel = (type: string): string => {
    switch (type) {
      case 'system': return 'Hệ thống';
      case 'message': return 'Tin nhắn';
      case 'match': return 'Lượt thích';
      case 'match_success': return 'Match';
      case 'all': return 'Tất cả';
      default: return type;
    }
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'system': return <Bell className="h-4 w-4" />;
      case 'message': return <MessageCircle className="h-4 w-4" />;
      case 'match': return <Heart className="h-4 w-4" />;
      case 'match_success': return <Check className="h-4 w-4" />;
      default: return null;
    }
  };

  const getAllNotifications = (): Notification[] => {
    return [
      ...notifications.system,
      ...notifications.message,
      ...notifications.match,
      ...notifications.match_success
    ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };
  
  const handleReadNotification = (id: string) => {
    const updatedNotifications = {...notifications};
    
    for (const key in updatedNotifications) {
      updatedNotifications[key] = updatedNotifications[key].map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      );
    }
    
    setNotifications(updatedNotifications);
  };
  
  const getUnreadCount = (type: string): number => {
    if (type === 'all') {
      return getAllNotifications().filter(n => !n.read).length;
    }
    return notifications[type]?.filter(n => !n.read).length || 0;
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const renderNotifications = () => {
    if (activeTab === 'all') {
      const allNotifs = getAllNotifications();
      if (!allNotifs.length) return <p className="text-center p-4 text-muted-foreground">Không có thông báo</p>;
      return allNotifs.map(notification => (
        <NotificationItem 
          key={notification.id} 
          notification={notification} 
          onRead={handleReadNotification} 
          onClose={onClose}
        />
      ));
    }
    
    const typeNotifs = notifications[activeTab] || [];
    if (!typeNotifs.length) return <p className="text-center p-4 text-muted-foreground">Không có thông báo</p>;
    return typeNotifs.map(notification => (
      <NotificationItem 
        key={notification.id} 
        notification={notification} 
        onRead={handleReadNotification}
        onClose={onClose} 
      />
    ));
  };

  const totalUnread = getAllNotifications().filter(n => !n.read).length;

  return (
    <div>
      <Tabs defaultValue="all" onValueChange={handleTabChange}>
        <div className="flex justify-between items-center p-3 border-b">
          <h3 className="font-semibold">Thông báo</h3>
          {totalUnread > 0 && (
            <Button variant="ghost" size="sm" onClick={() => {
              // Mark all as read
              const updatedNotifications = {...notifications};
              for (const key in updatedNotifications) {
                updatedNotifications[key] = updatedNotifications[key].map(notif => ({ ...notif, read: true }));
              }
              setNotifications(updatedNotifications);
            }}>
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
          <TabsTrigger value="match_success" className="relative">
            <Check className="h-4 w-4 mr-1" />
            {getUnreadCount('match_success') > 0 && (
              <Badge variant="secondary" className="absolute -top-1 -right-1 bg-primary text-white text-xs px-1.5 py-0.5 rounded-full">
                {getUnreadCount('match_success')}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-1 max-h-80 overflow-y-auto">
          {renderNotifications()}
        </div>
      </Tabs>
    </div>
  );
};

export default NotificationPopup;
