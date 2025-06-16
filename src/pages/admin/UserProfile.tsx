import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminSidebar from '@/components/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Ban, ArrowLeft, UserX } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import { getProfile } from '@/lib/profileApi';
import { User } from '@/types/User';

const API_URL = "https://datingwebbe-jnmo.onrender.com/api/AdminAccount";

const AdminUserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBanned, setIsBanned] = useState(false);

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      if (!id) {
        navigate('/admin/accounts');
        return;
      }

      const profileData = await getProfile(parseInt(id));
      
      // Convert API data to User format
      const userData: User = {
        id: profileData.id.toString(),
        accountId: profileData.accountId,
        name: profileData.fullName,
        birthdate: profileData.birthday,
        gender: profileData.genderId === 1 ? 'Nam' : profileData.genderId === 2 ? 'Nữ' : 'Khác',
        bio: profileData.description || '',
        avatar: profileData.avatarUrl || '',
        photos: profileData.imageUrls || []
      };

      setUser(userData);
      setIsBanned(profileData.account?.isBanned || false);
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải thông tin người dùng',
        variant: 'destructive'
      });
      navigate('/admin/accounts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBanUser = async () => {
    try {
      const headers = getAuthHeader();
      await axios.post(`${API_URL}/${id}/ban`, {}, { headers });
      toast({
        title: 'Thành công',
        description: 'Tài khoản đã được khóa thành công'
      });
      setIsBanned(true);
    } catch (error: any) {
      console.error('Error banning user:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể khóa tài khoản',
        variant: 'destructive'
      });
    }
  };

  const handleUnbanUser = async () => {
    try {
      const headers = getAuthHeader();
      await axios.post(`${API_URL}/${id}/unban`, {}, { headers });
      toast({
        title: 'Thành công',
        description: 'Tài khoản đã được mở khóa thành công'
      });
      setIsBanned(false);
    } catch (error: any) {
      console.error('Error unbanning user:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể mở khóa tài khoản',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 lg:ml-64 p-4 lg:p-6 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 lg:ml-64 p-4 lg:p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-2xl lg:text-3xl font-bold">Thông tin người dùng</h1>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold">Hồ sơ người dùng</h1>
          {isBanned ? (
            <Button variant="outline" onClick={handleUnbanUser}>
              <UserX className="h-4 w-4 mr-2" />
              Mở khóa tài khoản
            </Button>
          ) : (
            <Button variant="destructive" onClick={handleBanUser}>
              <Ban className="h-4 w-4 mr-2" />
              Khóa tài khoản
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg lg:text-xl">Thông tin cá nhân</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                <Avatar className="h-16 w-16 lg:h-20 lg:w-20">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left">
                  <h3 className="text-lg lg:text-xl font-semibold">{user.name}</h3>
                  <p className="text-gray-600 text-sm">ID: {user.id}</p>
                  <Badge variant={isBanned ? "destructive" : "default"} className="mt-2">
                    {isBanned ? "Đã khóa" : "Hoạt động"}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-medium text-gray-700 text-sm">Họ và tên:</label>
                  <p className="text-gray-900 text-sm lg:text-base">{user.name}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700 text-sm">Ngày sinh:</label>
                  <p className="text-gray-900 text-sm lg:text-base">{user.birthdate}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700 text-sm">Giới tính:</label>
                  <p className="text-gray-900 text-sm lg:text-base">{user.gender}</p>
                </div>
              </div>
              
              <div>
                <label className="font-medium text-gray-700 text-sm">Mô tả:</label>
                <p className="text-gray-900 mt-2 text-sm lg:text-base leading-relaxed">{user.bio}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg lg:text-xl">Hình ảnh hồ sơ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 lg:gap-4">
                {user.photos.map((image, index) => (
                  <div key={index} className="aspect-square">
                    <img
                      src={image}
                      alt={`Profile ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminUserProfile; 