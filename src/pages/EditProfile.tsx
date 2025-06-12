import { useState, useEffect } from 'react';
import { User } from '@/types/User';
import EditProfileComponent from '@/components/EditProfile';
import { toast } from 'sonner';
import { getProfile, updateProfile } from '@/lib/profileApi';
import { useNavigate } from 'react-router-dom';

const EditProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
        
        // Chuyển đổi dữ liệu từ API sang định dạng User
        const userData: User = {
          id: 'self',
          accountId: parseInt(accountId),
          name: profileData.fullName,
          birthdate: profileData.birthday,
          gender: profileData.genderId === 1 ? 'Nam' : profileData.genderId === 2 ? 'Nữ' : 'Khác',
          bio: profileData.description || '',
          avatar: profileData.avatarUrl,
          photos: profileData.imageUrls || [],
          hobbyIds: profileData.hobbyIds || []
        };

        setUser(userData);
      } catch (error) {
        toast.error('Không thể tải thông tin hồ sơ');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleSave = async (updatedUser: User) => {
    try {
      const toastId = toast.loading('Đang cập nhật hồ sơ...');
      const accountId = localStorage.getItem('accountId');
      if (!accountId) {
        navigate('/login');
        return;
      }

      const formData = new FormData();
      formData.append('AccountId', accountId);
      formData.append('FullName', updatedUser.name);
      formData.append('Birthday', updatedUser.birthdate);
      formData.append('GenderId', updatedUser.gender === 'Nam' ? '1' : updatedUser.gender === 'Nữ' ? '2' : '3');
      formData.append('Description', updatedUser.bio || '');

      // Xử lý avatar
      if (updatedUser.avatar && updatedUser.avatar !== user?.avatar) {
        if (updatedUser.avatar.startsWith('data:')) {
          const response = await fetch(updatedUser.avatar);
          const blob = await response.blob();
          formData.append('Avatar', blob, 'avatar.jpg');
        } else {
          formData.append('AvatarUrl', updatedUser.avatar);
        }
      }

      // Xử lý ảnh phụ
      if (updatedUser.photos && updatedUser.photos.length > 0) {
        const photoPromises = updatedUser.photos.map(async (photo) => {
          const response = await fetch(photo);
          const blob = await response.blob();
          return blob;
        });
        const photoBlobs = await Promise.all(photoPromises);
        photoBlobs.forEach((blob, index) => {
          formData.append('ProfileImages', blob, `photo${index}.jpg`);
        });
      } else {
        formData.append('ProfileImages', JSON.stringify([]));
      }

      if (updatedUser.hobbyIds && updatedUser.hobbyIds.length > 0) {
        updatedUser.hobbyIds.forEach(id => {
          formData.append('HobbyIds', id.toString());
        });
      }

      // Gửi request cập nhật
      const response = await updateProfile(parseInt(accountId), formData);

      if (response && response.status === 200) {
        toast.dismiss(toastId);
        toast.success('Hồ sơ đã được cập nhật thành công!');
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
        return;
      } else {
        toast.dismiss(toastId);
        throw new Error('Cập nhật hồ sơ không thành công');
      }
    } catch (error: any) {
      toast.dismiss();
      toast.error('Có lỗi xảy ra khi cập nhật hồ sơ!');
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Không tìm thấy thông tin hồ sơ</div>;
  }

  return <EditProfileComponent user={user} onSave={handleSave} />;
};

export default EditProfilePage;
