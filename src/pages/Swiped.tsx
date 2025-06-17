import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { authService } from '@/lib/authService';
import { getSwiped } from '@/lib/matchApi';

interface SwipedUser {
  accountId: number;
  avatar: string;
  fullName: string;
  isMatched: boolean;
}

const Swiped = () => {
  const [swipedUsers, setSwipedUsers] = useState<SwipedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSwipedUsers = async () => {
      setLoading(true);
      try {
        const accountId = authService.getAccountId();
        const data = await getSwiped(accountId);
        setSwipedUsers(data);
      } catch (error) {
        toast.error('Không thể tải danh sách');
        setSwipedUsers([]);
      }
      setLoading(false);
    };
    fetchSwipedUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-r from-purple-300 to-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-300 to-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-200 to-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-3000"></div>
      </div>
      <div className="floating-hearts">
        {[...Array(10)].map((_, i) => {
          const colors = [
            'from-pink-400 to-purple-400',
            'from-purple-400 to-blue-400',
            'from-blue-400 to-pink-400',
            'from-red-400 to-pink-400',
            'from-pink-400 to-rose-400'
          ];
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          return (
            <div
              key={i}
              className={`heart bg-gradient-to-r ${randomColor}`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 5}s`,
                transform: `scale(${Math.random() * 0.5 + 0.5}) rotate(${Math.random() * 360}deg)`,
                filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.5))',
                opacity: Math.random() * 0.3 + 0.4
              }}
            />
          );
        })}
      </div>
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              transform: `scale(${Math.random() * 0.5 + 0.5})`
            }}
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-blue-500/10 mix-blend-overlay" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
      <div className="w-full max-w-md mx-auto p-4 relative z-10">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="mr-2 hover:scale-110 transition-transform">
            <ArrowLeft className="h-5 w-5 text-matchup-purple" />
          </Button>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-matchup-purple to-matchup-pink bg-clip-text text-transparent flex items-center gap-2">
            <Heart className="h-7 w-7 mr-1 text-matchup-pink animate-pulse" />
            Người bạn đã thích
          </h2>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="w-16 h-16 border-4 border-primary rounded-full border-t-transparent animate-spin mx-auto"></div>
          </div>
        ) : swipedUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 h-[60vh]">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4 shadow-lg">
              <Heart size={32} className="text-muted-foreground animate-bounce" />
            </div>
            <h3 className="text-lg font-semibold text-center mb-2">Bạn chưa thích ai</h3>
            <p className="text-muted-foreground text-center">
              Danh sách người bạn đã thích sẽ hiển thị tại đây
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {swipedUsers.map((user) => (
              <Card
                key={user.accountId}
                className="p-4 rounded-2xl shadow-xl bg-white/80 backdrop-blur-md hover:scale-[1.02] transition-all border-0 cursor-pointer"
                onClick={() => navigate(`/view-profile/${user.accountId}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-14 w-14 ring-2 ring-pink-300 hover:scale-110 transition-transform shadow-md">
                      <AvatarImage src={user.avatar} alt={user.fullName} />
                      <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg text-matchup-purple">{user.fullName}</h3>
                    </div>
                  </div>
                  {user.isMatched && (
                    <div className="flex items-center gap-1 text-matchup-pink">
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="text-sm font-medium">Đã match</span>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Swiped; 