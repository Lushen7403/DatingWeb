import { useState, useEffect } from 'react';
import { User } from '@/types/User';
import { ArrowLeft, Check, X, Upload, Pencil } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { getAllHobbies } from '@/lib/profileApi';
import { Badge } from '@/components/ui/badge';

interface Hobby {
  id: number;
  hobbyName: string;
  userHobbies: any;
}

interface EditProfileProps {
  user: User;
  onSave: (user: User) => void;
}

const EditProfile = ({ user, onSave }: EditProfileProps) => {
  const [editedUser, setEditedUser] = useState<User>({...user});
  const [currentField, setCurrentField] = useState<string | null>(null);
  const [hobbies, setHobbies] = useState<Hobby[]>([]);
  const [selectedHobbies, setSelectedHobbies] = useState<number[]>(user.hobbyIds || []);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHobbies = async () => {
      try {
        const hobbiesData = await getAllHobbies();
        setHobbies(hobbiesData);
      } catch (error) {
        toast.error('Không thể tải danh sách sở thích');
      }
    };
    fetchHobbies();
  }, []);

  useEffect(() => {
    setSelectedHobbies(user.hobbyIds || []);
  }, [user]);

  const handleSave = () => {
    onSave({
      ...editedUser,
      hobbyIds: selectedHobbies
    });
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  const handleDialogClose = () => {
    setCurrentField(null);
  };

  const handleEditField = (field: string) => {
    setCurrentField(field);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setEditedUser({
            ...editedUser,
            avatar: event.target.result as string
          });
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handlePhotoAdd = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const photos = [...(editedUser.photos || [])];
          photos[index] = event.target.result as string;
          setEditedUser({
            ...editedUser,
            photos
          });
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const toggleHobby = (hobbyId: number) => {
    setSelectedHobbies(prev => {
      if (prev.includes(hobbyId)) {
        return prev.filter(id => id !== hobbyId);
      } else {
        return [...prev, hobbyId];
      }
    });
  };

  return (
    <div className="bg-background min-h-screen pt-16 pb-20">
      <header className="matchup-header">
        <div className="flex items-center justify-between w-full">
          <Button variant="ghost" size="icon" onClick={handleCancel}>
            <X size={20} />
          </Button>

          <h1 className="text-xl font-bold">Chỉnh sửa hồ sơ</h1>

          <Button variant="ghost" size="icon" onClick={handleSave}>
            <Check size={20} />
          </Button>
        </div>
      </header>

      <div className="container px-4 pt-4">
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 rounded-full overflow-hidden mb-4 relative group">
            <img 
              src={editedUser.avatar || 'https://via.placeholder.com/300?text=Avatar'} 
              alt={editedUser.name} 
              className="w-full h-full object-cover"
            />
            <div 
              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              onClick={() => handleEditField('avatar')}
            >
              <Upload size={24} className="text-white" />
            </div>
          </div>

          <div 
            className="cursor-pointer group relative"
            onClick={() => handleEditField('name')}
          >
            <h1 className="text-2xl font-bold group-hover:text-matchup-purple transition-colors">
              {editedUser.name || 'Thêm tên của bạn'}
            </h1>
            <div className="h-0.5 w-0 group-hover:w-full bg-matchup-purple transition-all duration-300"></div>
            <Button variant="ghost" size="icon" className="absolute -right-8 top-0">
              <Pencil size={16} />
            </Button>
          </div>

          <div 
            className="text-sm text-muted-foreground mt-2 cursor-pointer group relative"
            onClick={() => handleEditField('birthdate')}
          >
            <span className="group-hover:text-matchup-purple transition-colors">
              {new Date(editedUser.birthdate).toLocaleDateString('vi-VN')}
            </span>
            <Button variant="ghost" size="icon" className="absolute -right-8 top-0">
              <Pencil size={16} />
            </Button>
          </div>
          
          <div 
            className="bg-matchup-purple-light text-matchup-purple-dark px-3 py-1 rounded-full text-xs font-medium mt-2 cursor-pointer group relative"
            onClick={() => handleEditField('gender')}
          >
            <span className="group-hover:text-matchup-purple-dark transition-colors">
              {editedUser.gender}
            </span>
            <Button variant="ghost" size="icon" className="absolute -right-8 top-0">
              <Pencil size={16} />
            </Button>
          </div>

          <div 
            className="text-center mt-4 text-foreground/80 max-w-md cursor-pointer group p-2 rounded-lg hover:bg-matchup-purple-light/50 transition-colors relative"
            onClick={() => handleEditField('bio')}
          >
            <p className="leading-relaxed">{editedUser.bio}</p>
            <Button variant="ghost" size="icon" className="absolute -right-8 top-0">
              <Pencil size={16} />
            </Button>
          </div>

          {/* Sở thích */}
          <div className="mt-6 w-full flex flex-col items-center">
            <div className="flex items-center gap-2 mb-3 justify-center">
              <h2 className="text-lg font-semibold bg-gradient-to-r from-matchup-purple to-matchup-purple-dark bg-clip-text text-transparent">Sở thích</h2>
              <Button variant="ghost" size="icon" onClick={() => handleEditField('hobbies')} className="p-1">
                <Pencil size={16} />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {selectedHobbies.length > 0 ? (
                selectedHobbies.map((hobbyId) => {
                  const hobby = hobbies.find(h => h.id === hobbyId);
                  return hobby ? (
                    <span 
                      key={hobby.id}
                      className="bg-matchup-purple-light text-matchup-purple-dark px-4 py-1.5 rounded-full text-sm font-medium"
                    >
                      {hobby.hobbyName}
                    </span>
                  ) : null;
                })
              ) : (
                <p className="text-muted-foreground text-sm">Chưa có sở thích nào</p>
              )}
            </div>
          </div>

          {/* Ảnh bổ sung */}
          <div className="mt-8 w-full">
            <h2 className="text-lg font-semibold mb-4 text-center bg-gradient-to-r from-matchup-purple to-matchup-purple-dark bg-clip-text text-transparent">Ảnh bổ sung</h2>
            <div className="grid grid-cols-3 gap-3">
              {Array(6).fill(0).map((_, index) => (
                <div key={index} className="aspect-square rounded-lg overflow-hidden relative group">
                  {(editedUser.photos && editedUser.photos[index]) ? (
                    <>
                      <img 
                        src={editedUser.photos[index]} 
                        alt={`${editedUser.name} photo ${index + 1}`} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div 
                        className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer"
                        onClick={() => handleEditField(`photo-${index}`)}
                      >
                        <Upload size={24} className="text-white" />
                      </div>
                    </>
                  ) : (
                    <label 
                      className="w-full h-full flex items-center justify-center bg-muted cursor-pointer hover:bg-matchup-purple-light/50 transition-colors"
                      htmlFor={`photo-input-${index}`}
                    >
                      <Upload size={24} className="text-muted-foreground/50 group-hover:text-matchup-purple transition-colors" />
                      <input 
                        type="file"
                        id={`photo-input-${index}`}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handlePhotoAdd(e, index)}
                      />
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit dialogs */}
      <Dialog open={currentField === 'avatar'} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="bg-gradient-to-r from-matchup-purple to-matchup-purple-dark bg-clip-text text-transparent">Thay đổi ảnh đại diện</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-32 h-32 rounded-full overflow-hidden group">
              <img 
                src={editedUser.avatar || 'https://via.placeholder.com/300?text=Avatar'} 
                alt="Avatar" 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <label className="cursor-pointer bg-matchup-purple text-white px-4 py-2 rounded-full hover:bg-matchup-purple-dark transition-colors">
              Chọn ảnh mới
              <input 
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </label>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={currentField === 'name'} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="bg-gradient-to-r from-matchup-purple to-matchup-purple-dark bg-clip-text text-transparent">Thay đổi tên</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input 
              value={editedUser.name}
              onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
              placeholder="Nhập tên của bạn"
              className="focus:ring-matchup-purple"
            />
            <Button 
              className="w-full bg-matchup-purple hover:bg-matchup-purple-dark transition-colors"
              onClick={handleDialogClose}
            >
              Lưu
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={currentField === 'birthdate'} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="bg-gradient-to-r from-matchup-purple to-matchup-purple-dark bg-clip-text text-transparent">Thay đổi ngày sinh</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input 
              type="date"
              value={new Date(editedUser.birthdate).toISOString().split('T')[0]}
              onChange={(e) => setEditedUser({...editedUser, birthdate: e.target.value})}
              className="focus:ring-matchup-purple"
            />
            <Button 
              className="w-full bg-matchup-purple hover:bg-matchup-purple-dark transition-colors"
              onClick={handleDialogClose}
            >
              Lưu
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={currentField === 'gender'} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="bg-gradient-to-r from-matchup-purple to-matchup-purple-dark bg-clip-text text-transparent">Thay đổi giới tính</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              {['Nam', 'Nữ', 'Khác'].map((gender) => (
                <Button 
                  key={gender}
                  variant={editedUser.gender === gender ? "default" : "outline"}
                  className={editedUser.gender === gender ? "bg-matchup-purple hover:bg-matchup-purple-dark" : "hover:bg-matchup-purple-light"}
                  onClick={() => setEditedUser({...editedUser, gender})}
                >
                  {gender}
                </Button>
              ))}
            </div>
            <Button 
              className="w-full bg-matchup-purple hover:bg-matchup-purple-dark transition-colors"
              onClick={handleDialogClose}
            >
              Lưu
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={currentField === 'bio'} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="bg-gradient-to-r from-matchup-purple to-matchup-purple-dark bg-clip-text text-transparent">Thay đổi tiểu sử</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea 
              value={editedUser.bio}
              onChange={(e) => setEditedUser({...editedUser, bio: e.target.value})}
              placeholder="Viết gì đó về bản thân..."
              rows={5}
              className="focus:ring-matchup-purple"
            />
            <Button 
              className="w-full bg-matchup-purple hover:bg-matchup-purple-dark transition-colors"
              onClick={handleDialogClose}
            >
              Lưu
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog cho sở thích */}
      <Dialog open={currentField === 'hobbies'} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-md" aria-describedby="desc-hobbies">
          <DialogHeader>
            <DialogTitle className="bg-gradient-to-r from-matchup-purple to-matchup-purple-dark bg-clip-text text-transparent">Chỉnh sửa sở thích</DialogTitle>
          </DialogHeader>
          <p className="sr-only" id="desc-hobbies">Chọn sở thích của bạn</p>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {hobbies.map((hobby) => (
                <Button
                  key={hobby.id}
                  variant={selectedHobbies.includes(hobby.id) ? "default" : "outline"}
                  className={selectedHobbies.includes(hobby.id) ? "bg-matchup-purple hover:bg-matchup-purple-dark" : "hover:bg-matchup-purple-light"}
                  onClick={() => toggleHobby(hobby.id)}
                >
                  {hobby.hobbyName}
                </Button>
              ))}
            </div>
            <Button 
              className="w-full bg-matchup-purple hover:bg-matchup-purple-dark transition-colors"
              onClick={handleDialogClose}
            >
              Lưu
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Photos edit dialogs */}
      {Array(6).fill(0).map((_, index) => (
        <Dialog 
          key={`dialog-photo-${index}`} 
          open={currentField === `photo-${index}`} 
          onOpenChange={handleDialogClose}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Thay đổi ảnh #{index + 1}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-full aspect-square rounded-lg overflow-hidden">
                {editedUser.photos && editedUser.photos[index] && (
                  <img 
                    src={editedUser.photos[index]} 
                    alt={`Photo ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex space-x-2 w-full">
                <label className="flex-1 cursor-pointer bg-matchup-purple text-white px-4 py-2 rounded-full text-center">
                  Thay đổi ảnh
                  <input 
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handlePhotoAdd(e, index)}
                  />
                </label>
                <Button 
                  variant="outline" 
                  className="flex-1 border-matchup-pink text-matchup-pink"
                  onClick={() => {
                    const photos = [...(editedUser.photos || [])];
                    photos.splice(index, 1);
                    setEditedUser({...editedUser, photos});
                    handleDialogClose();
                  }}
                >
                  Xóa ảnh
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
};

export default EditProfile;
