import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Heart, MessageCircle, Settings, Diamond, Bell, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MatchPreferences from './MatchPreferences';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import NotificationPopup from './NotificationPopup';
import { notificationService } from '@/lib/notificationService';
import { getUnreadNotificationCount } from '@/lib/notificationApi';
import { getDiamondBalance } from '@/lib/diamondApi';
import { authService } from '@/lib/authService';

const Header = () => {
  const [showPreferences, setShowPreferences] = useState(false);
  const [diamonds, setDiamonds] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [notificationOpen, setNotificationOpen] = useState(false);

  useEffect(() => {
    const fetchDiamond = async () => {
      const accountId = authService.getAccountId();
      if (accountId) {
        try {
          const balance = await getDiamondBalance(accountId);
          setDiamonds(balance);
        } catch {
          setDiamonds(0);
        }
      }
    };
    fetchDiamond();

    // Khi vào trang, luôn lấy số lượng chưa đọc từ API
    const fetchUnread = async () => {
      const accountId = Number(localStorage.getItem('accountId'));
      if (accountId) {
        const count = await getUnreadNotificationCount(accountId);
        setUnreadNotifications(count);
      }
    };
    fetchUnread();

    // Realtime: tăng khi có notification mới, giảm khi mark as read
    const unsubscribeNotification = notificationService.onNotification((notification) => {
      if (!notification.isRead) {
        setUnreadNotifications(prev => prev + 1);
      }
    });
    const unsubscribeMarkedAsRead = notificationService.onMarkedAsRead(() => {
      setUnreadNotifications(prev => Math.max(0, prev - 1));
    });

    return () => {
      unsubscribeNotification();
      unsubscribeMarkedAsRead();
    };
  }, []);

  const handleCloseNotifications = () => {
    setNotificationOpen(false);
  };

  return (
    <header className="matchup-header">
      <div className="flex items-center justify-between w-full">
        <div className="text-2xl font-bold text-matchup-purple">MatchLove</div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild className="text-foreground">
            <Link to="/profile">
              <User size={20} />
            </Link>
          </Button>
          
          <Button variant="ghost" size="icon" asChild className="text-foreground">
            <Link to="/likes">
              <Heart size={20} />
            </Link>
          </Button>
          
          <Button variant="ghost" size="icon" asChild className="text-foreground">
            <Link to="/messages">
              <MessageCircle size={20} />
            </Link>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="text-foreground"
            onClick={() => setShowPreferences(true)}
          >
            <SlidersHorizontal size={20} />
          </Button>
          
          <Popover open={notificationOpen} onOpenChange={setNotificationOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground relative">
                <Bell size={20} />
                {unreadNotifications > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full"
                  >
                    {unreadNotifications}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[340px] p-0" align="end">
              <NotificationPopup onClose={handleCloseNotifications} setUnreadCount={setUnreadNotifications} />
            </PopoverContent>
          </Popover>
          
          <div className="relative">
            <Button variant="ghost" size="icon" asChild className="text-foreground">
              <Link to="/diamond-recharge">
                <Diamond size={20} className="text-amber-400" />
              </Link>
            </Button>
            <Badge 
              variant="secondary" 
              className="absolute -top-2 -right-2 bg-amber-400 text-white text-xs px-1.5 py-0.5 rounded-full"
            >
              {diamonds}
            </Badge>
          </div>

          <Button 
            variant="ghost" 
            size="icon"
            className="text-foreground"
            asChild
          >
            <Link to="/settings">
              <Settings size={20} />
            </Link>
          </Button>
        </div>
      </div>

      <MatchPreferences open={showPreferences} onClose={() => setShowPreferences(false)} />
    </header>
  );
};

export default Header;
