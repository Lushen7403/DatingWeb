import { useState, useEffect } from 'react';
import { MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getLocationName, getCurrentLocation } from '@/lib/locationApi';
import { toast } from 'sonner';

const LOCATION_API_URL = "http://localhost:5291/api/Location";
const MATCH_CONDITION_API_URL = "http://localhost:5291/api/MatchCondition";

interface UpdateLocationPopupProps {
  onClose: () => void;
}

const UpdateLocationPopup = ({ onClose }: UpdateLocationPopupProps) => {
  const [loading, setLoading] = useState(false);
  const [locationName, setLocationName] = useState<string>('Chưa xác định');
  const [locationId, setLocationId] = useState<number | null>(null);
  const [isGettingLocationName, setIsGettingLocationName] = useState(false);

  useEffect(() => {
    // Lấy location hiện tại khi mở popup
    const fetchLocation = async () => {
      const accountId = localStorage.getItem('accountId');
      if (!accountId) return;
      const location = await getCurrentLocation(Number(accountId));
      if (location) {
        setLocationId(location.id);
        setIsGettingLocationName(true);
        try {
          const name = await getLocationName(location.latitude, location.longitude);
          setLocationName(name);
        } catch {
          setLocationName(`${location.latitude}, ${location.longitude}`);
        } finally {
          setIsGettingLocationName(false);
        }
      }
    };
    fetchLocation();
  }, []);

  const handleUpdateLocation = async () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setIsGettingLocationName(true);
        try {
          const name = await getLocationName(lat, lon);
          setLocationName(name);
        } catch {
          setLocationName(`${lat}, ${lon}`);
        } finally {
          setIsGettingLocationName(false);
        }
        // Gửi API backend
        const accountId = localStorage.getItem('accountId');
        if (!accountId) return;
        if (locationId) {
          // Update
          await fetch(`${LOCATION_API_URL}/update/${accountId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ AccountId: accountId, Latitude: lat, Longitude: lon })
          });
        } else {
          // Create
          const res = await fetch(`${LOCATION_API_URL}/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ AccountId: accountId, Latitude: lat, Longitude: lon })
          });
          if (res.ok) {
            const data = await res.json();
            setLocationId(data.id);
          }
        }
        setLoading(false);
        toast.success('Cập nhật vị trí thành công!');
      }, () => {
        setLocationName('Không lấy được vị trí');
        setLoading(false);
        setIsGettingLocationName(false);
      });
    } else {
      setLocationName('Trình duyệt không hỗ trợ');
      setLoading(false);
      setIsGettingLocationName(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="relative bg-white rounded-xl shadow-lg p-8 w-[340px] flex flex-col items-center animate-fade-in">
        {/* Nút đóng */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
          onClick={onClose}
          aria-label="Đóng"
        >
          <X size={22} />
        </button>
        {/* Icon vị trí */}
        <div className="mb-4 mt-2">
          <MapPin size={56} className="text-matchup-purple" />
        </div>
        {/* Tên địa điểm */}
        <div className="text-lg font-semibold mb-6 text-center text-gray-800 min-h-[48px]">
          {isGettingLocationName ? 'Đang lấy vị trí...' : locationName}
        </div>
        {/* Nút cập nhật vị trí */}
        <Button
          className="w-full bg-matchup-purple hover:bg-matchup-purple-dark text-white text-base font-medium rounded-lg py-2"
          onClick={handleUpdateLocation}
          disabled={loading}
        >
          {loading ? 'Đang cập nhật...' : 'Cập nhật vị trí'}
        </Button>
      </div>
    </div>
  );
};

export default UpdateLocationPopup;

export async function getMatchCondition(accountId: number) {
  const res = await fetch(`${MATCH_CONDITION_API_URL}/account/${accountId}`);
  if (!res.ok) return null;
  return await res.json();
}

export async function createMatchCondition(data: any) {
  const res = await fetch(`${MATCH_CONDITION_API_URL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Tạo tiêu chí thất bại');
  return await res.json();
}

export async function updateMatchCondition(accountId: number, data: any) {
  const res = await fetch(`${MATCH_CONDITION_API_URL}/account/${accountId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Cập nhật tiêu chí thất bại');
  return true;
}