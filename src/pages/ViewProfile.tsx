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
import { getProfile } from '@/lib/profileApi';

const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/dfvhhpkyg/image/upload';

const ViewProfile = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const [profile, setProfile] = useState<User | null>(null);
  const navigate = useNavigate();

  const formatImageUrl = (path: string) => {
    if (!path) return '';
    // If path is already a full URL, return it
    if (path.startsWith('http')) return path;
    // If path starts with /, remove it
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    // Construct the full Cloudinary URL
    return `${CLOUDINARY_BASE_URL}/${cleanPath}`;
  };

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
          id: profileId,
          name: profileData.fullName,
          birthdate: profileData.birthday,
          gender: profileData.genderId === 1 ? 'Nam' : profileData.genderId === 2 ? 'Nữ' : 'Khác',
          bio: profileData.description || '',
          avatar: formatImageUrl(profileData.avatarUrl),
          photos: (profileData.imageUrls || []).map(url => formatImageUrl(url))
        };

        setProfile(userData);
      } catch (error) {
        toast.error('Không thể tải thông tin hồ sơ');
        navigate('/');
      }
    };

    fetchProfile();
  }, [profileId, navigate]);

  const handleMatch = () => {
    toast.success(`Thành công! Bạn đã match với ${profile?.name}!`);
    navigate('/messages');
  };

  const handleDislike = () => {
    toast.info(`Bạn đã bỏ qua ${profile?.name}`);
    navigate('/');
  };

  const handleBlock = () => {
    toast.success(`Đã chặn ${profile?.name}`);
    navigate('/');
  };

  const handleReport = () => {
    toast.success(`Đã báo cáo ${profile?.name}`);
    navigate('/');
  };

  if (!profile) {
    return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
  }

  return (
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
  );
};

export default ViewProfile;
