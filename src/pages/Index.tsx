import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ProfileCard from '@/components/ProfileCard';
import { toast } from 'sonner';
import { getProfilesToMatch, Profile, getDistance } from '@/lib/profileApi';

const Index = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [distance, setDistance] = useState<number>(0);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const accountId = localStorage.getItem('accountId');
        if (!accountId) {
          toast.error('Vui lòng đăng nhập để sử dụng tính năng này');
          return;
        }
        const data = await getProfilesToMatch(Number(accountId));
        // Handle .NET $values array structure safely
        if (Array.isArray(data)) {
          setProfiles(data);
        } else if (
          data &&
          typeof data === 'object' &&
          '$values' in data &&
          Array.isArray((data as any).$values)
        ) {
          setProfiles((data as any).$values);
        } else {
          setProfiles([]);
        }
      } catch (error) {
        console.error('Error fetching profiles:', error);
        toast.error('Không thể tải danh sách hồ sơ');
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  // Fetch distance for current profile
  useEffect(() => {
    const fetchDistance = async () => {
      if (!profiles[currentProfileIndex]) return;
      const accountId = localStorage.getItem('accountId');
      if (!accountId) return;
      
      try {
        const d = await getDistance(Number(accountId), profiles[currentProfileIndex].id);
        setDistance(Math.round(d));
      } catch {
        setDistance(0);
      }
    };
    if (profiles.length > 0) fetchDistance();
  }, [currentProfileIndex, profiles]);

  const handleAction = (action: 'like' | 'dislike') => {
    if (action === 'like' && profiles[currentProfileIndex]) {
      toast.success(`Bạn đã thích ${profiles[currentProfileIndex].fullName}!`, {
        icon: '❤️',
        style: { background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' },
        position: 'top-center'
      });
    }
    
    // Move to next profile after a short delay
    setTimeout(() => {
      setCurrentProfileIndex(prev => {
        if (prev < profiles.length - 1) {
          return prev + 1;
        } else {
          // Khi đã swipe hết, reload lại trang để lấy danh sách mới
          window.location.reload();
          return prev; // Không cần reset về 0 nữa
        }
      });
    }, 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Đang tải...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (!Array.isArray(profiles) || profiles.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Chưa có hồ sơ phù hợp!</h2>
            <p className="text-muted-foreground">Hãy thử điều chỉnh tiêu chí tìm kiếm của bạn hoặc quay lại sau nhé</p>
          </div>
        </div>
      </div>
    );
  }

  const currentProfile = profiles[currentProfileIndex];
  
  // Calculate age safely with proper type checking
  const calculateAge = (birthday: string | undefined): number => {
    if (!birthday) return 0;
    try {
      const birthDate = new Date(birthday);
      if (isNaN(birthDate.getTime())) return 0;
      return new Date().getFullYear() - birthDate.getFullYear();
    } catch (error) {
      console.error('Error calculating age:', error);
      return 0;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20 pb-20 px-4">
        <div className="swipe-card-container">
          {profiles.map((profile, index) => {
            if (!profile || !profile.id || !profile.fullName) {
              console.warn('Invalid profile data:', profile);
              return null;
            }
            return (
              <div
                key={profile.id}
                className={index === currentProfileIndex ? 'block' : 'hidden'}
              >
                <ProfileCard
                  id={profile.id.toString()}
                  accountId={profile.accountId.toString()}
                  name={profile.fullName}
                  age={calculateAge(profile.birthday)}
                  distance={distance}
                  avatar={profile.avatar || ''}
                  onAction={handleAction}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Index;
