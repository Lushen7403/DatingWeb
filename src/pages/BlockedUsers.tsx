import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, UserX, Unlock } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { getBlockedUsers, unblockUser } from '@/lib/blockApi';
import { authService } from '@/lib/authService'; // Để lấy accountId

interface BlockedUser {
  blockerId: number;
  blockedUserId: number;
  blockAt: string;
  profile: {
    avatar: string;
    fullName: string;
  } | null;
}

const BlockedUsers = () => {
  const navigate = useNavigate();
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlocked = async () => {
      setLoading(true);
      try {
        const accountId = authService.getAccountId();
        const data = await getBlockedUsers(accountId);
        setBlockedUsers(data);
      } catch {
        toast.error('Không thể tải danh sách chặn');
      }
      setLoading(false);
    };
    fetchBlocked();
  }, []);

  const handleUnblock = async (blockedUserId: number, userName: string) => {
    try {
      const accountId = authService.getAccountId();
      await unblockUser(accountId, blockedUserId);
      setBlockedUsers(prev => prev.filter(user => user.blockedUserId !== blockedUserId));
      toast.success(`Đã bỏ chặn ${userName}`);
    } catch {
      toast.error('Không thể bỏ chặn');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/settings')}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-2xl font-bold">Danh sách người bị chặn</h2>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary rounded-full border-t-transparent animate-spin mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Đang tải...</p>
          </div>
        </div>
      ) : blockedUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 h-[60vh]">
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
            <UserX size={32} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-center mb-2">Bạn chưa block ai</h3>
          <p className="text-muted-foreground text-center">
            Danh sách người bị chặn sẽ hiển thị tại đây
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {blockedUsers.map((user) => (
            <Card key={`${user.blockerId}-${user.blockedUserId}`} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={user.profile?.avatar || '/default-avatar.png'}
                      alt={user.profile?.fullName || 'Không rõ'}
                    />
                    <AvatarFallback>{user.profile?.fullName?.charAt(0) || '?'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{user.profile?.fullName || 'Không rõ'}</h3>
                    <p className="text-sm text-muted-foreground">Đã bị chặn</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUnblock(user.blockedUserId, user.profile?.fullName || '')}
                  className="flex items-center gap-2"
                >
                  <Unlock size={16} />
                  Bỏ chặn
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlockedUsers;
