import Settings from '@/components/Settings';
import UpdateLocationPopup from '@/components/UpdateLocationPopup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const SettingsPage = () => {
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAuthenticated");
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