import { useState } from 'react';
import { User } from '@/types/User';
import { ArrowLeft, Check, X, Upload } from 'lucide-react';
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

interface EditProfileProps {
  user: User;
  onSave: (user: User) => void;
}

const EditProfile = ({ user, onSave }: EditProfileProps) => {
  const [editedUser, setEditedUser] = useState<User>({...user});
  const [currentField, setCurrentField] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSave = () => {
    onSave(editedUser);
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
            className="cursor-pointer group"
            onClick={() => handleEditField('name')}
          >
            <h1 className="text-2xl font-bold group-hover:text-matchup-purple transition-colors">
              {editedUser.name || 'Thêm tên của bạn'}
            </h1>
            <div className="h-0.5 w-0 group-hover:w-full bg-matchup-purple transition-all duration-300"></div>
          </div>

          <div 
            className="text-sm text-muted-foreground mt-2 cursor-pointer group"
            onClick={() => handleEditField('birthdate')}
          >
            <span className="group-hover:text-matchup-purple transition-colors">
              {new Date(editedUser.birthdate).toLocaleDateString('vi-VN')}
            </span>
          </div>
          
          <div 
            className="bg-matchup-purple-light text-matchup-purple-dark px-3 py-1 rounded-full text-xs font-medium mt-2 cursor-pointer group"
            onClick={() => handleEditField('gender')}
          >
            <span className="group-hover:text-matchup-purple-dark transition-colors">
              {editedUser.gender}
            </span>
          </div>

          <div 
            className="text-center mt-4 text-foreground/80 max-w-md cursor-pointer group p-2 rounded-lg hover:bg-matchup-purple-light/50 transition-colors"
            onClick={() => handleEditField('bio')}
          >
            <p className="leading-relaxed">{editedUser.bio}</p>
          </div>

          {/* Sở thích */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-3 text-center bg-gradient-to-r from-matchup-purple to-matchup-purple-dark bg-clip-text text-transparent">Sở thích</h2>
            <div className="flex flex-wrap gap-2 justify-center">
              {['Chơi game', 'Đọc sách', 'Du lịch', 'Âm nhạc', 'Nấu ăn'].map((interest, index) => (
                <span 
                  key={index}
                  className="bg-matchup-purple-light text-matchup-purple-dark px-4 py-1.5 rounded-full text-sm font-medium hover:bg-matchup-purple hover:text-white transform hover:scale-105 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
                  onClick={() => handleEditField('interests')}
                >
                  {interest}
                </span>
              ))}
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
      <Dialog open={currentField === 'interests'} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="bg-gradient-to-r from-matchup-purple to-matchup-purple-dark bg-clip-text text-transparent">Chỉnh sửa sở thích</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {['Chơi game', 'Đọc sách', 'Du lịch', 'Âm nhạc', 'Nấu ăn', 'Xem phim', 'Thể thao', 'Nhiếp ảnh', 'Vẽ', 'Âm nhạc'].map((interest) => (
                <Button
                  key={interest}
                  variant="outline"
                  className="hover:bg-matchup-purple hover:text-white transition-colors"
                >
                  {interest}
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
