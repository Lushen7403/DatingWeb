import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, MapPin, FileText, MessageSquareText, LogOut, Info, Lock, Diamond, ArrowLeft, UserX } from 'lucide-react';
import UpdateLocationPopup from '@/components/UpdateLocationPopup';
import { useState } from 'react';

interface SettingsProps {
  onLogout: () => void;
  onShowLocationPopup: () => void;
}

const Settings = ({ onLogout, onShowLocationPopup }: SettingsProps) => {
  const navigate = useNavigate();
  const [showLocationPopup, setShowLocationPopup] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="matchup-header border-0">
        <div className="flex items-center justify-between w-full">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="hover:scale-110 transition-transform">
            <ArrowLeft size={20} className="text-matchup-purple" />
          </Button>
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-matchup-purple to-matchup-pink text-center flex-1">
            Cài đặt
          </h2>
          <div className="w-8"></div>
        </div>
      </header>

      <div className="pt-20 pb-20 px-4 relative border-0">
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

        {/* Enhanced floating hearts */}
        <div className="floating-hearts">
          {[...Array(15)].map((_, i) => {
            const colors = [
              'from-pink-400 to-purple-400',
              'from-purple-400 to-blue-400',
              'from-blue-400 to-pink-400',
              'from-red-400 to-pink-400',
              'from-pink-400 to-rose-400'
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

        {/* Enhanced sparkles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
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

        <div className="w-full max-w-md mx-auto relative z-10">
          <div className="space-y-3">
            <Link to="/diamond-recharge" className="w-full block">
              <Button variant="outline" className="w-full justify-start text-base font-normal h-12 hover:scale-105 transition-transform backdrop-blur-sm bg-white/80">
                <Diamond className="mr-2 h-5 w-5 text-amber-400" />
                Nạp kim cương
              </Button>
            </Link>

            <Button
              variant="outline"
              className="w-full justify-start text-base font-normal h-12 hover:scale-105 transition-transform backdrop-blur-sm bg-white/80"
              onClick={onShowLocationPopup}
            >
              <MapPin className="mr-2 h-5 w-5 text-matchup-purple" />
              Cập nhật vị trí
            </Button>
            
            <Link to="/blocked-users" className="w-full block">
              <Button variant="outline" className="w-full justify-start text-base font-normal h-12 hover:scale-105 transition-transform backdrop-blur-sm bg-white/80">
                <UserX className="mr-2 h-5 w-5 text-matchup-pink" />
                Danh sách đã chặn
              </Button>
            </Link>
            
            <Link to="/privacy-policy" className="w-full block">
              <Button variant="outline" className="w-full justify-start text-base font-normal h-12 hover:scale-105 transition-transform backdrop-blur-sm bg-white/80">
                <FileText className="mr-2 h-5 w-5 text-matchup-blue" />
                Chính sách & Quyền riêng tư
              </Button>
            </Link>
            
            <Link to="/support-feedback" className="w-full block">
              <Button variant="outline" className="w-full justify-start text-base font-normal h-12 hover:scale-105 transition-transform backdrop-blur-sm bg-white/80">
                <MessageSquareText className="mr-2 h-5 w-5 text-matchup-purple" />
                Hỗ trợ & Feedback
              </Button>
            </Link>
            
            <Link to="/about-us" className="w-full block">
              <Button variant="outline" className="w-full justify-start text-base font-normal h-12 hover:scale-105 transition-transform backdrop-blur-sm bg-white/80">
                <Info className="mr-2 h-5 w-5 text-matchup-pink" />
                Về chúng tôi
              </Button>
            </Link>

            <Link to="/change-password" className="w-full block">
              <Button variant="outline" className="w-full justify-start text-base font-normal h-12 hover:scale-105 transition-transform backdrop-blur-sm bg-white/80">
                <Lock className="mr-2 h-5 w-5 text-matchup-blue" />
                Đổi mật khẩu
              </Button>
            </Link>

            <Button
              variant="outline"
              onClick={onLogout}
              className="w-full justify-start text-base font-normal h-12 hover:scale-105 transition-transform backdrop-blur-sm bg-white/80 text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="mr-2 h-5 w-5" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </div>

      {showLocationPopup && (
        <UpdateLocationPopup
          onClose={() => setShowLocationPopup(false)}
        />
      )}
    </div>
  );
};

export default Settings;
