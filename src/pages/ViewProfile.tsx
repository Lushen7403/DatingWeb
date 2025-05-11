
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

// Sample profile data
const dummyProfiles: Record<string, User> = {
  '1': {
    id: '1',
    name: 'Thảo',
    birthdate: '1999-08-20',
    gender: 'Nữ',
    bio: 'Yêu động vật 🐶 | Đam mê ẩm thực 🍜 | Thích đọc sách và du lịch ✈️ | Đang tìm một người có thể cùng khám phá thế giới',
    avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    photos: [
      'https://images.unsplash.com/photo-1551024709-8f23befc6f87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1557&q=80',
      'https://images.unsplash.com/photo-1540331547168-8b63109225b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=719&q=80',
      'https://images.unsplash.com/photo-1504199367641-aba8151af406?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80'
    ]
  },
  '2': {
    id: '2',
    name: 'Minh',
    birthdate: '1997-04-15',
    gender: 'Nam',
    bio: 'Mê thể thao 🏀 | Yêu âm nhạc 🎵 | Thích khám phá những nhà hàng mới 🍕 | Đang tìm người có thể cùng tạo ra những kỷ niệm đáng nhớ',
    avatar: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80',
    photos: [
      'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1506902550945-7645732aaae8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=724&q=80'
    ]
  },
  '3': {
    id: '3',
    name: 'Hà',
    birthdate: '1998-12-05',
    gender: 'Nữ',
    bio: 'Mình yêu nghệ thuật 🎨 | Thích uống cà phê và đọc sách 📚 | Luôn tìm cách học hỏi điều mới ✌️',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    photos: [
      'https://images.unsplash.com/photo-1484329081568-bed9ba42793e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
      'https://images.unsplash.com/photo-1425421598808-4a22ce59cc97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80',
      'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=718&q=80'
    ]
  },
  '4': {
    id: '4',
    name: 'Khoa',
    birthdate: '1996-07-20',
    gender: 'Nam',
    bio: 'Nhiếp ảnh gia 📷 | Yêu thiên nhiên 🌲 | Thích trò chơi điện tử 🎮 | Đang tìm người có chung đam mê',
    avatar: 'https://images.unsplash.com/photo-1500048993953-d23a436266cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80',
    photos: [
      'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80'
    ]
  }
};

const ViewProfile = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const [profile, setProfile] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // In a real app, we would fetch profile data from an API
    if (profileId && dummyProfiles[profileId]) {
      setProfile(dummyProfiles[profileId]);
    }
  }, [profileId]);

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
