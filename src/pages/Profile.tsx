import { useState, useEffect } from 'react';
import UserProfile from '@/components/UserProfile';
import { User } from '@/types/User';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '@/lib/profileApi';
import { toast } from 'sonner';

const BASE_IMAGE_URL = "http://localhost:5291/";

// Hàm chuẩn hóa đường dẫn
function getFullImageUrl(path?: string) {
  if (!path) return undefined;
  // Nếu path đã là URL đầy đủ thì trả về luôn
  if (path.startsWith('http')) return path;
  // Nếu path bắt đầu bằng / thì bỏ bớt 1 dấu /
  if (path.startsWith('/')) return BASE_IMAGE_URL + path.substring(1);
  // Ngược lại nối thẳng
  return BASE_IMAGE_URL + path;
}

function getProfileImageUrl(url?: string) {
  if (!url) return undefined;
  if (url.startsWith('http')) {
    // Nếu API trả về sai tên thư mục, sửa lại cho đúng
    return url.replace('/profile-images/', '/ProfileImage/');
  }
  if (url.startsWith('/')) return BASE_IMAGE_URL + url.substring(1).replace('profile-images/', 'ProfileImage/');
  return BASE_IMAGE_URL + "ProfileImage/" + url;
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const accountId = localStorage.getItem('accountId');
        if (!accountId) {
          navigate('/login');
          return;
        }
        const profileData = await getProfile(parseInt(accountId));
        console.log('profileData:', profileData);
        const userData: User = {
          id: 'self',
          name: profileData.fullName,
          birthdate: profileData.birthday,
          gender: profileData.genderId === 1 ? 'Nam' : profileData.genderId === 2 ? 'Nữ' : 'Khác',
          bio: profileData.description || '',
          avatar: profileData.avatarUrl, // Cloudinary URL được trả về trực tiếp
          photos: profileData.imageUrls || [] // Cloudinary URLs được trả về trực tiếp
        };
        setUser(userData);
      } catch (error) {
        toast.error('Không thể tải thông tin hồ sơ');
        navigate('/');
      }
    };
    fetchProfile();
  }, [navigate]);

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
  }

  return <UserProfile user={user} editable={true} />;
};

export default Profile;
