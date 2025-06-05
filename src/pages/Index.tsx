import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import ProfileCard from '@/components/ProfileCard';
import { toast } from 'sonner';
import { getProfilesToMatch, Profile, getDistance } from '@/lib/profileApi';
import MatchPreferences from '@/components/MatchPreferences';

const Index = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [distance, setDistance] = useState<number>(0);
  const [showPreferences, setShowPreferences] = useState(false);
  const [criteriaChanged, setCriteriaChanged] = useState(0);

  const fetchProfiles = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles, criteriaChanged]);

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

  const handleCriteriaChange = () => {
    setCriteriaChanged(prev => prev + 1); // Trigger reload
    // Reload the page to get fresh data
    window.location.reload();
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
    <>
      <MatchPreferences
        open={showPreferences}
        onClose={() => setShowPreferences(false)}
        onCriteriaChange={handleCriteriaChange}
      />
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Larger, more vibrant blobs */}
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-r from-purple-300 to-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-300 to-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
          
          {/* Additional smaller blobs */}
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-200 to-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob animation-delay-3000"></div>
        </div>

        {/* Enhanced floating hearts with multiple colors */}
        <div className="floating-hearts">
          {[...Array(20)].map((_, i) => {
            // Define different color combinations
            const colors = [
              'from-pink-400 to-purple-400',
              'from-purple-400 to-blue-400',
              'from-blue-400 to-pink-400',
              'from-red-400 to-pink-400',
              'from-pink-400 to-rose-400',
              'from-rose-400 to-purple-400'
            ];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            
            return (
              <div
                key={i}
                className={`heart bg-gradient-to-r ${randomColor}`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${5 + Math.random() * 5}s`,
                  transform: `scale(${Math.random() * 0.5 + 0.5}) rotate(${Math.random() * 360}deg)`,
                  filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.5))',
                  opacity: Math.random() * 0.3 + 0.4
                }}
              />
            );
          })}
        </div>

        {/* Additional floating mini hearts */}
        <div className="floating-hearts">
          {[...Array(15)].map((_, i) => {
            const colors = [
              'from-pink-300 to-purple-300',
              'from-purple-300 to-blue-300',
              'from-blue-300 to-pink-300'
            ];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            
            return (
              <div
                key={`mini-${i}`}
                className={`heart bg-gradient-to-r ${randomColor}`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${4 + Math.random() * 4}s`,
                  transform: `scale(${Math.random() * 0.3 + 0.2}) rotate(${Math.random() * 360}deg)`,
                  filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.4))',
                  opacity: Math.random() * 0.2 + 0.3
                }}
              />
            );
          })}
        </div>

        {/* Enhanced sparkles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="sparkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                transform: `scale(${Math.random() * 0.5 + 0.5})`
              }}
            />
          ))}
        </div>

        {/* Enhanced gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-blue-500/10 mix-blend-overlay" />

        {/* Shimmer effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />

        <Header />
        <div className="pt-20 pb-20 px-4 relative z-10">
          <div className="swipe-card-container shimmer">
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
    </>
  );
};

export default Index;
