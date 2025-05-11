import { User } from '@/types/User';
import { ArrowLeft, Calendar, Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface UserProfileProps {
  user: User;
  editable?: boolean;
}

const UserProfile = ({ user, editable = false }: UserProfileProps) => {
  const getZodiacSign = (birthdate: string) => {
    // Simple zodiac calculation - would need a more sophisticated implementation in production
    const date = new Date(birthdate);
    const month = date.getMonth() + 1;
    const day = date.getDate();

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Bạch Dương ♈";
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Kim Ngưu ♉";
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Song Tử ♊";
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cự Giải ♋";
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Sư Tử ♌";
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Xử Nữ ♍";
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Thiên Bình ♎";
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Bọ Cạp ♏";
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Nhân Mã ♐";
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Ma Kết ♑";
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Bảo Bình ♒";
    return "Song Ngư ♓";
  };

  const calcAge = (birthdate: string) => {
    const ageDifMs = Date.now() - new Date(birthdate).getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const formatBirthdate = (birthdate: string) => {
    const date = new Date(birthdate);
    return date.toLocaleDateString('vi-VN');
  };

  // Hiển thị ảnh
  const mainPhoto = user.avatar;
  const subPhotos = user.photos || [];

  return (
    <div className="bg-background min-h-screen pt-16 pb-20">
      <header className="matchup-header">
        <div className="flex items-center justify-between w-full">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft size={20} />
            </Link>
          </Button>

          <h1 className="text-xl font-bold">Hồ sơ</h1>

          {editable && (
            <Button variant="ghost" size="icon" asChild>
              <Link to="/edit-profile">
                <Pencil size={20} />
              </Link>
            </Button>
          )}

          {!editable && <div className="w-8"></div>}
        </div>
      </header>

      <div className="container px-4 pt-4">
        <div className="flex flex-col items-center">
          {/* Ảnh đại diện lớn */}
          {mainPhoto && (
            <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
              <img 
                src={mainPhoto} 
                alt={user.name} 
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <h1 className="text-2xl font-bold">{user.name}</h1>
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <Calendar size={14} className="mr-1" /> 
            {formatBirthdate(user.birthdate)} · {getZodiacSign(user.birthdate)}
          </div>
          <div className="bg-matchup-purple-light text-matchup-purple-dark px-3 py-1 rounded-full text-xs font-medium mt-2">
            {user.gender}
          </div>

          <p className="text-center mt-4 text-foreground/80 max-w-md">
            {user.bio}
          </p>

          {/* Ảnh phụ */}
          {subPhotos.length > 0 && (
            <div className={`mt-8 w-full ${subPhotos.length <= 3 ? 'grid grid-cols-3 gap-2' : 'grid grid-cols-3 gap-2'}`}>
              {subPhotos.map((photo, idx) => (
                <div key={idx} className="aspect-square rounded-lg overflow-hidden">
                  <img 
                    src={photo} 
                    alt={`${user.name} photo ${idx + 2}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
