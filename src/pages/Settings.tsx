import Settings from '@/components/Settings';
import UpdateLocationPopup from '@/components/UpdateLocationPopup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { deleteProfile } from '@/lib/profileApi';
import { authService } from '@/lib/authService';

const SettingsPage = () => {
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    toast.success('Đăng xuất thành công!');
    navigate('/login');
  };

  return (
    <>
      <Settings
        onLogout={handleLogout}
        onShowLocationPopup={() => setShowLocationPopup(true)}
      />
      {showLocationPopup && (
        <UpdateLocationPopup onClose={() => setShowLocationPopup(false)} />
      )}
    </>
  );
};

export default SettingsPage;