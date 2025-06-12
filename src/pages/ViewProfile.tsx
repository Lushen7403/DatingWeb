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
import { swipeProfile } from '@/lib/matchApi';
import { blockUser } from '@/lib/blockApi';
import { createReport } from '@/lib/reportApi';
import ReportDialog from '@/components/ReportDialog';

const ViewProfile = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const [profile, setProfile] = useState<User | null>(null);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const navigate = useNavigate();
  const [hobbies, setHobbies] = useState<Hobby[]>([]);

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

        <div className="fixed bottom-6 left-0 right-0 flex justify-center gap-6 z-20">
          <Button 
            onClick={handleDislike}
            className="dislike-button"
            aria-label="Dislike"
          >
            <X size={24} />
          </Button>
          
          <Button 
            onClick={handleMatch}
            className="like-button"
            aria-label="Like"
          >
            <Heart size={24} />
          </Button>
        </div>

        
      </div>
    </>
  );
};

export default ViewProfile;
