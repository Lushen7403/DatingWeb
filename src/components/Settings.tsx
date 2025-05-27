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
    <div className="w-full max-w-md mx-auto p-4">
      <header className="matchup-header backdrop-blur-lg bg-background/70 mb-6">
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
      <div className="space-y-4">
        <Button
          variant="outline"
          className="w-full justify-start text-base font-normal h-12"
          onClick={onShowLocationPopup}
        >
          <MapPin className="mr-2 h-5 w-5" />
          Cập nhật vị trí
        </Button>
        
        <Link to="/diamond-recharge" className="w-full">
          <Button variant="outline" className="w-full justify-start text-base font-normal h-12">
            <Diamond className="mr-2 h-5 w-5" />
            Nạp kim cương
          </Button>
        </Link>
        
        <Link to="/blocked-users" className="w-full">
          <Button variant="outline" className="w-full justify-start text-base font-normal h-12">
            <UserX className="mr-2 h-5 w-5" />
            Danh sách đã chặn
          </Button>
        </Link>

        <Link to="/privacy-policy" className="w-full">
          <Button variant="outline" className="w-full justify-start text-base font-normal h-12">
            <FileText className="mr-2 h-5 w-5" />
            Chính sách & Quyền riêng tư
          </Button>
        </Link>
        
        <Link to="/support-feedback" className="w-full">
          <Button variant="outline" className="w-full justify-start text-base font-normal h-12">
            <MessageSquareText className="mr-2 h-5 w-5" />
            Hỗ trợ & Feedback
          </Button>
        </Link>
        
        <Link to="/about-us" className="w-full">
          <Button variant="outline" className="w-full justify-start text-base font-normal h-12">
            <Info className="mr-2 h-5 w-5" />
            Về chúng tôi
          </Button>
        </Link>

        <Link to="/change-password" className="w-full">
          <Button variant="outline" className="w-full justify-start text-base font-normal h-12">
            <Lock className="mr-2 h-5 w-5" />
            Đổi mật khẩu
          </Button>
        </Link>
        <Button
          variant="outline"
          onClick={onLogout}
          className="w-full justify-start text-base font-normal h-12 text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="mr-2 h-5 w-5" />
          Đăng xuất
        </Button>
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
