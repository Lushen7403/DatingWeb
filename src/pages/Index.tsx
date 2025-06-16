import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import ProfileCard from '@/components/ProfileCard';
import { toast } from 'sonner';
import { getProfilesToMatch, Profile, getDistance } from '@/lib/profileApi';
import MatchPreferences from '@/components/MatchPreferences';
import { Link } from 'react-router-dom';
import { Heart, MessageSquare, HeadphonesIcon, Mail, Phone, X, RotateCcw } from 'lucide-react';

// Hàm reverse geocoding đơn giản sử dụng Nominatim API
async function getAddressFromLatLng(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
    const data = await res.json();
    const addr = data.address || {};
    // Lấy tỉnh/thành phố
    let province = addr.state || addr.city || addr.region || addr.state_district || '';
    // Lấy mức nhỏ hơn nhất có thể
    let detail = addr.suburb || addr.village || addr.hamlet || addr.county || addr.city_district || addr.district || addr.city || addr.town || '';
    if (province && detail) return `${detail}, ${province}`;
    if (province) return province;
    if (detail) return detail;
    return addr.country || '';
  } catch {
    return '';
  }
}

const Index = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [distance, setDistance] = useState<number>(0);
  const [showPreferences, setShowPreferences] = useState(false);
  const [criteriaChanged, setCriteriaChanged] = useState(0);
  const [address, setAddress] = useState<string>('');

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
      toast.error('Không thể tải danh sách hồ sơ');
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles, criteriaChanged]);

  // Fetch distance & address for current profile
  useEffect(() => {
    const fetchDistanceAndAddress = async () => {
      if (!profiles[currentProfileIndex]) return;
      const accountId = localStorage.getItem('accountId');
      if (!accountId) return;
      try {
        const d = await getDistance(Number(accountId), profiles[currentProfileIndex].id);
        setDistance(Math.round(d));
        // Lấy địa chỉ từ lat/lng nếu có
        const { latitude, longitude } = profiles[currentProfileIndex];
        if (latitude && longitude) {
          const addr = await getAddressFromLatLng(latitude, longitude);
          setAddress(addr);
        } else {
          setAddress('');
        }
      } catch {
        setDistance(0);
        setAddress('');
      }
    };
    if (profiles.length > 0) fetchDistanceAndAddress();
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
      <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 relative overflow-hidden">
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
        <div className="pt-20 pb-6 px-4 relative z-10">
          <div className="swipe-card-container shimmer h-full flex flex-col justify-center items-center">
            {profiles.map((profile, index) => {
              if (!profile || !profile.id || !profile.fullName) {
                console.warn('Invalid profile data:', profile);
                return null;
              }
              if (index !== currentProfileIndex) return null;
              return (
                <ProfileCard
                  key={profile.id}
                  id={profile.id.toString()}
                  accountId={profile.accountId.toString()}
                  name={profile.fullName}
                  age={calculateAge(profile.birthday)}
                  distance={distance}
                  avatar={profile.avatar || ''}
                  address={address}
                  onAction={handleAction}
                  onPrev={() => setCurrentProfileIndex(i => Math.max(0, i - 1))}
                  onNext={() => setCurrentProfileIndex(i => Math.min(profiles.length - 1, i + 1))}
                  showPrev={currentProfileIndex > 0}
                  showNext={currentProfileIndex < profiles.length - 1}
                  className="h-full"
                />
              );
            })}
          </div>

          {/* Navigation Icons */}
          <div className="flex justify-center items-end gap-4 sm:gap-6 mt-6 mb-6">
            <Link 
              to="/likes" 
              className="flex flex-col items-center group hover:scale-110 transition-transform min-w-[80px]"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-matchup-purple mt-2 text-center min-h-[32px] leading-tight">Đã thích bạn</span>
            </Link>

            <Link 
              to="/dislikes" 
              className="flex flex-col items-center group hover:scale-110 transition-transform min-w-[80px]"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-400 to-pink-400 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <RotateCcw className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-matchup-purple mt-2 text-center min-h-[32px] leading-tight">Xem lần nữa</span>
            </Link>

            <Link 
              to="/swiped" 
              className="flex flex-col items-center group hover:scale-110 transition-transform min-w-[80px]"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-matchup-purple mt-2 text-center min-h-[32px] leading-tight">Bạn đã thích</span>
            </Link>
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 border-t border-gray-200 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-r from-purple-300 to-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-300 to-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* About Section */}
            <div className="space-y-6 transform hover:scale-105 transition-all duration-300">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3 group">
                <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Về LoveMatch
                </span>
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Nơi kết nối những trái tim đồng điệu, mang đến không gian an toàn và chân thành cho tình yêu.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3 group">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Liên kết nhanh
                </span>
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link 
                    to="/about-us" 
                    className="flex items-center gap-2 text-gray-600 hover:text-pink-500 transition-all duration-300 group"
                  >
                    <div className="w-1.5 h-1.5 bg-pink-500 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                    <span className="text-sm group-hover:translate-x-1 transition-transform duration-300">Về chúng tôi</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/privacy-policy" 
                    className="flex items-center gap-2 text-gray-600 hover:text-pink-500 transition-all duration-300 group"
                  >
                    <div className="w-1.5 h-1.5 bg-pink-500 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                    <span className="text-sm group-hover:translate-x-1 transition-transform duration-300">Chính sách & Quyền riêng tư</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/support-feedback" 
                    className="flex items-center gap-2 text-gray-600 hover:text-pink-500 transition-all duration-300 group"
                  >
                    <div className="w-1.5 h-1.5 bg-pink-500 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                    <span className="text-sm group-hover:translate-x-1 transition-transform duration-300">Hỗ trợ & Feedback</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3 group">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-pink-500 rounded-lg shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                  <HeadphonesIcon className="h-6 w-6 text-white" />
                </div>
                <span className="bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
                  Liên hệ
                </span>
              </h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 group">
                  <div className="p-2 bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg shadow-sm transform group-hover:scale-110 transition-all duration-300">
                    <Mail className="h-5 w-5 text-pink-500" />
                  </div>
                  <span className="text-sm text-gray-600 group-hover:text-pink-500 transition-colors duration-300">
                    nguyenvantu7403@gmail.com
                  </span>
                </li>
                <li className="flex items-center gap-3 group">
                  <div className="p-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg shadow-sm transform group-hover:scale-110 transition-all duration-300">
                    <Phone className="h-5 w-5 text-purple-500" />
                  </div>
                  <span className="text-sm text-gray-600 group-hover:text-purple-500 transition-colors duration-300">
                    1900 123 456
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-center relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100 to-transparent opacity-50"></div>
            <p className="text-sm text-gray-600 relative z-10">
              © {new Date().getFullYear()} LoveMatch. Tất cả quyền được bảo lưu.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Index;
