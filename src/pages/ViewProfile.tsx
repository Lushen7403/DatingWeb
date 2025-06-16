import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User } from '@/types/User';
import UserProfile from '@/components/UserProfile';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, X, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';
import { getProfile, getAllHobbies, Hobby } from '@/lib/profileApi';
import { swipeProfile, getTodaySwipeCount } from '@/lib/matchApi';
import { blockUser } from '@/lib/blockApi';
import { createReport } from '@/lib/reportApi';
import ReportDialog from '@/components/ReportDialog';
import SwipeConfirmDialog from '@/components/SwipeConfirmDialog';

const ViewProfile = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const [profile, setProfile] = useState<User | null>(null);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const navigate = useNavigate();
  const [hobbies, setHobbies] = useState<Hobby[]>([]);
  const [showSwipeDialog, setShowSwipeDialog] = useState(false);
  const [remainingSwipes, setRemainingSwipes] = useState(10);
  const [willUseDiamonds, setWillUseDiamonds] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!profileId) {
          navigate('/');
          return;
        }

        const profileData = await getProfile(parseInt(profileId));
        
        // Convert API data to User format
        const userData: User = {
          id: profileData.id,
          accountId: profileData.accountId,
          name: profileData.fullName,
          birthdate: profileData.birthday,
          gender: profileData.genderId === 1 ? 'Nam' : profileData.genderId === 2 ? 'Nữ' : 'Khác',
          bio: profileData.description || '',
          avatar: profileData.avatarUrl,
          photos: (profileData.imageUrls || []),
          hobbyIds: profileData.hobbyIds || []
        };

        setProfile(userData);
      } catch (error) {
        toast.error('Không thể tải thông tin hồ sơ');
        navigate('/');
      }
    };

    const fetchHobbies = async () => {
      try {
        const hobbiesData = await getAllHobbies();
        setHobbies(hobbiesData);
      } catch (error) {
        // silent
      }
    };

    fetchProfile();
    fetchHobbies();
  }, [profileId, navigate]);

  useEffect(() => {
    const fetchHobbies = async () => {
      try {
        const hobbiesData = await getAllHobbies();
        setHobbies(hobbiesData);
      } catch (error) {
        // silent
      }
    };
    fetchHobbies();
  }, []);

  const handleMatch = async () => {
    if (!profile) return;
    try {
      const accountId = localStorage.getItem('accountId');
      if (!accountId) {
        toast.error('Vui lòng đăng nhập');
        navigate('/login');
        return;
      }
      
      const result = await swipeProfile(Number(accountId), Number(profile.id), true);
      
      if (result.isMatch && result.conversation) {
        toast.success(`Thành công! Bạn đã match với ${profile.name}!`);
        navigate('/messages');
      } else {
        toast.info(`Bạn đã thích ${profile.name}`);
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra khi thích');
    }
  };

  const handleDislike = async () => {
    if (!profile) return;
    try {
      const accountId = localStorage.getItem('accountId');
      if (!accountId) {
        toast.error('Vui lòng đăng nhập');
        navigate('/login');
        return;
      }
      await swipeProfile(Number(accountId), Number(profile.id), false);
      toast.info(`Bạn đã bỏ qua ${profile.name}`);
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra khi bỏ qua');
    }
  };

  const handleBlock = async () => {
    if (!profile) return;
    try {
      const accountId = localStorage.getItem('accountId');
      if (!accountId) {
        toast.error('Vui lòng đăng nhập');
        navigate('/login');
        return;
      }
      
      await blockUser(Number(accountId), Number(profile.accountId));
      toast.success(`Đã chặn ${profile.name}`);
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra khi chặn người dùng');
    }
  };

  const handleReport = () => {
    setShowReportDialog(true);
  };

  const handleReportSubmit = async (reportTypeId: number, content: string) => {
    if (!profile) return;
    try {
      const accountId = localStorage.getItem('accountId');
      if (!accountId) {
        toast.error('Vui lòng đăng nhập');
        navigate('/login');
        return;
      }

      await createReport(
        Number(accountId),
        Number(profile.accountId),
        reportTypeId,
        content
      );
      
      toast.success('Báo cáo đã được gửi thành công');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra khi gửi báo cáo');
    }
  };

  const checkSwipeCount = async () => {
    try {
      const accountId = localStorage.getItem('accountId');
      if (!accountId) {
        toast.error('Vui lòng đăng nhập');
        navigate('/login');
        return;
      }
      const count = await getTodaySwipeCount(parseInt(accountId));
      const remaining = 10 - count;
      setRemainingSwipes(remaining);
      setWillUseDiamonds(remaining <= 0);
      setShowSwipeDialog(true);
    } catch (error) {
      toast.error('Không thể kiểm tra lượt thích');
    }
  };

  const handleLikeConfirm = async () => {
    await handleMatch();
  };

  if (!profile) {
    return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
  }

  return (
    <>
      <ReportDialog
        isOpen={showReportDialog}
        onClose={() => setShowReportDialog(false)}
        onConfirm={handleReportSubmit}
        userName={profile.name}
      />
      <SwipeConfirmDialog
        isOpen={showSwipeDialog}
        onClose={() => setShowSwipeDialog(false)}
        onConfirm={handleLikeConfirm}
        remainingSwipes={remainingSwipes}
        willUseDiamonds={willUseDiamonds}
      />
      <div className="bg-background min-h-screen pb-20 relative">
        <UserProfile user={profile} editable={false} />

        <div className="fixed top-4 right-4 z-50">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical size={20} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleBlock} className="text-red-500 cursor-pointer">
                Chặn người dùng
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleReport} className="cursor-pointer">
                Báo cáo vi phạm
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="fixed bottom-6 left-0 right-0 flex justify-center gap-6 z-30">
          <button
            onClick={e => { e.stopPropagation(); handleDislike(); }}
            className="rounded-full w-14 h-14 flex items-center justify-center shadow-md bg-white border-2 border-white hover:scale-110 transition-transform ring-1 ring-pink-200 hover:ring-pink-300 focus:ring-pink-400"
            aria-label="Dislike"
          >
            <X size={32} className="text-pink-400" />
          </button>
          <button
            onClick={e => { e.stopPropagation(); checkSwipeCount(); }}
            className="rounded-full w-14 h-14 flex items-center justify-center shadow-md bg-white border-2 border-white hover:scale-110 transition-transform ring-1 ring-purple-200 hover:ring-purple-300 focus:ring-purple-400"
            aria-label="Like"
          >
            <Heart size={32} className="text-purple-400" />
          </button>
        </div>

        
      </div>
    </>
  );
};

export default ViewProfile;
