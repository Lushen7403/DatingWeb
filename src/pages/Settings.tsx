import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SettingsComponent from '@/components/Settings';
import UpdateLocationPopup from '@/components/UpdateLocationPopup';
import { toast } from 'sonner';

const SettingsPage = () => {
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove authentication state
    localStorage.removeItem("token");
    localStorage.removeItem("isAuthenticated");
    toast.success('Đăng xuất thành công!');
    
    // Navigate to login page
    navigate('/login');
  };

  // Hàm cập nhật vị trí (có thể dùng navigator.geolocation)
  const handleUpdateLocation = async () => {
    // TODO: Thêm logic lấy vị trí thực tế nếu muốn
    toast.success('Vị trí đã được cập nhật!');
    setShowLocationPopup(false);
  };

  return (
    <>
      <SettingsComponent
        onLogout={handleLogout}
        onShowLocationPopup={() => setShowLocationPopup(true)}
      />
      {showLocationPopup && (
        <UpdateLocationPopup
          onClose={() => setShowLocationPopup(false)}
        />
      )}
    </>
  );
};

export default SettingsPage;
