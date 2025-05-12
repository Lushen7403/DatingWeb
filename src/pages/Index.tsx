import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ProfileCard from '@/components/ProfileCard';
import { toast } from 'sonner';
import { getProfilesToMatch, Profile } from '@/lib/profileApi';

const Index = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const accountId = localStorage.getItem('accountId');
        if (!accountId) {
          toast.error('Vui lòng đăng nhập để sử dụng tính năng này');
          return;
        }
        const data = await getProfilesToMatch(Number(accountId));
        setProfiles(data);
      } catch (error) {
        toast.error('Không thể tải danh sách hồ sơ');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const handleAction = (action: 'like' | 'dislike') => {
    if (action === 'like') {
      toast.success(`Bạn đã thích ${profiles[currentProfileIndex].fullName}!`);
    }
    
    // Move to next profile after a short delay
    setTimeout(() => {
      setCurrentProfileIndex(prev => {
        if (prev < profiles.length - 1) {
          return prev + 1;
        } else {
          // Reset to first profile if we've seen all profiles
          toast.info("Đã xem hết tất cả hồ sơ! Bắt đầu lại từ đầu.");
          return 0;
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

  if (profiles.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Không có hồ sơ nào để xem!</h2>
            <p className="text-muted-foreground">Hãy thay đổi tiêu chí tìm kiếm của bạn</p>
          </div>
        </div>
      </div>
    );
  }

  const currentProfile = profiles[currentProfileIndex];
  const age = new Date().getFullYear() - new Date(currentProfile.birthday).getFullYear();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20 pb-20 px-4">
        <div className="swipe-card-container">
          {profiles.map((profile, index) => (
            <div
              key={profile.id}
              className={index === currentProfileIndex ? 'block' : 'hidden'}
            >
              <ProfileCard
                id={profile.id.toString()}
                name={profile.fullName}
                age={age}
                distance={0} // TODO: Calculate distance when location is implemented
                avatar={profile.avatar}
                onAction={handleAction}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
