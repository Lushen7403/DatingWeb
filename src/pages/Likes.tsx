import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { authService } from '@/lib/authService';

interface Swiper {
  accountId: number;
  avatar: string;
  fullName: string;
}

const Like = () => {
  const [swipers, setSwipers] = useState<Swiper[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSwipers = async () => {
      setLoading(true);
      try {
        const accountId = authService.getAccountId();
        const res = await fetch(`http://localhost:5291/api/Match/swipers/${accountId}`);
        if (!res.ok) {
          const msg = await res.text();
          toast.error(msg || 'Không thể tải danh sách');
          setSwipers([]);
        } else {
          const data = await res.json();
          setSwipers(data);
        }
      } catch {
        toast.error('Không thể tải danh sách');
        setSwipers([]);
      }
      setLoading(false);
    };
    fetchSwipers();
  }, []);

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-2xl font-bold">Người đã thích bạn</h2>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-[60vh]">
          <div className="w-16 h-16 border-4 border-primary rounded-full border-t-transparent animate-spin mx-auto"></div>
        </div>
      ) : swipers.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 h-[60vh]">
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
            <Heart size={32} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-center mb-2">Chưa có ai thích bạn</h3>
          <p className="text-muted-foreground text-center">
            Danh sách người đã thích bạn sẽ hiển thị tại đây
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {swipers.map((user) => (
            <Card
              key={user.accountId}
              className="p-4 cursor-pointer hover:bg-purple-50 transition"
              onClick={() => navigate(`/view-profile/${user.accountId}`)}
            >
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.avatar} alt={user.fullName} />
                  <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{user.fullName}</h3>
                  <p className="text-sm text-muted-foreground">Đã thích bạn</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Like;
