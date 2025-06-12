import { useState, useEffect } from 'react';
import UserProfile from '@/components/UserProfile';
import { User } from '@/types/User';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '@/lib/profileApi';
import { toast } from 'sonner';

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
        const userData: User = {
          id: 'self',
          accountId: profileData.accountId,
          name: profileData.fullName,
          birthdate: profileData.birthday,
          gender: profileData.genderId === 1 ? 'Nam' : profileData.genderId === 2 ? 'Nữ' : 'Khác',
          bio: profileData.description || '',
          avatar: profileData.avatarUrl, // Cloudinary URL được trả về trực tiếp
          photos: profileData.imageUrls || [], // Cloudinary URLs được trả về trực tiếp
          hobbyIds: profileData.hobbyIds || []
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
