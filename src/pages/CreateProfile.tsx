import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { createProfile } from '@/lib/profileApi';

const CreateProfile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    accountId: localStorage.getItem('accountId'),
    fullName: '',
    birthday: '',
    genderId: 1, // 1: Nam, 2: Nữ, 3: Khác
    description: '',
    avatar: null as File | null,
    profileImages: [] as File[]
  });

  const handleSave = async () => {
    // Validate required fields
    if (!formData.fullName) {
      toast.error('Vui lòng nhập họ tên');
      return;
    }
    if (!formData.birthday) {
      toast.error('Vui lòng chọn ngày sinh');
      return;
    }
    if (!formData.avatar) {
      toast.error('Vui lòng chọn ảnh đại diện');
      return;
    }

    const accountId = localStorage.getItem('accountId');
    if (!accountId) {
      toast.error('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại');
      navigate('/login');
      return;
    }

    setIsLoading(true);
    try {
      const submitData = new FormData();
      submitData.append('AccountId', accountId);
      submitData.append('FullName', formData.fullName);
      submitData.append('Birthday', formData.birthday);
      submitData.append('GenderId', formData.genderId.toString());
      submitData.append('Description', formData.description || '');
      
      if (formData.avatar) {
        submitData.append('Avatar', formData.avatar);
      }
      
      if (formData.profileImages.length > 0) {
        formData.profileImages.forEach((file) => {
          submitData.append('ProfileImages', file);
        });
      }

      await createProfile(submitData);
      toast.success('Hồ sơ đã được tạo thành công!');
      navigate('/');
    } catch (error: any) {
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          toast.error(error.response.data);
        } else if (error.response.data.message) {
          toast.error(error.response.data.message);
        } else if (error.response.data.title) {
          toast.error(error.response.data.title);
        } else {
          toast.error('Có lỗi xảy ra khi tạo hồ sơ!');
        }
      } else {
        toast.error('Có lỗi xảy ra khi tạo hồ sơ!');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/login');
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        avatar: e.target.files[0]
      });
    }
  };

  const handlePhotoAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        profileImages: [...formData.profileImages, e.target.files[0]]
      });
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3 bg-background border-b">
        <Button variant="ghost" size="icon" onClick={handleCancel}>
          <X size={20} />
        </Button>

        <h1 className="text-xl font-bold">Tạo hồ sơ</h1>

        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleSave}
          disabled={isLoading}
        >
          <Check size={20} />
        </Button>
      </header>

      <div className="container px-4 pt-20 pb-20">
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 rounded-full overflow-hidden mb-4 relative">
            {formData.avatar ? (
              <img 
                src={URL.createObjectURL(formData.avatar)} 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            ) : (
              <label 
                className="w-full h-full flex items-center justify-center bg-muted cursor-pointer"
                htmlFor="avatar-input"
              >
                <Upload size={24} className="text-muted-foreground/50" />
                <span className="sr-only">Chọn ảnh đại diện</span>
              </label>
            )}
            <input 
              type="file"
              id="avatar-input"
              className="hidden"
              accept="image/*"
              onChange={handleAvatarChange}
            />
            {formData.avatar && (
              <div 
                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                onClick={() => document.getElementById('avatar-input')?.click()}
              >
                <Upload size={24} className="text-white" />
              </div>
            )}
          </div>

          <div className="w-full max-w-md space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Họ tên</Label>
              <Input 
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                placeholder="Nhập họ tên của bạn"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthday">Ngày sinh</Label>
              <Input 
                id="birthday"
                type="date"
                value={formData.birthday}
                onChange={(e) => setFormData({...formData, birthday: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Giới tính</Label>
              <RadioGroup 
                value={formData.genderId.toString()} 
                onValueChange={(value) => setFormData({...formData, genderId: parseInt(value)})}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="male" />
                  <Label htmlFor="male">Nam</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2" id="female" />
                  <Label htmlFor="female">Nữ</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3" id="other" />
                  <Label htmlFor="other">Khác</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Giới thiệu</Label>
              <Textarea 
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Viết gì đó về bản thân..."
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Ảnh phụ</Label>
              <div className="grid grid-cols-3 gap-2">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="aspect-square bg-muted rounded-lg relative">
                    {formData.profileImages[index] ? (
                      <img 
                        src={URL.createObjectURL(formData.profileImages[index])} 
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <label 
                        className="w-full h-full flex items-center justify-center cursor-pointer"
                        htmlFor={`photo-input-${index}`}
                      >
                        <Upload size={24} className="text-muted-foreground/50" />
                      </label>
                    )}
                    <input 
                      type="file"
                      id={`photo-input-${index}`}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handlePhotoAdd(e)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;
