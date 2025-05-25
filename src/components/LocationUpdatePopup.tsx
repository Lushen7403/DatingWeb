import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, X } from "lucide-react";
import { toast } from 'sonner';
import { updateLocation } from '@/lib/locationApi';

interface LocationUpdatePopupProps {
  isOpen: boolean;
  onClose: () => void;
  isMandatory?: boolean;
}

const LocationUpdatePopup = ({
  isOpen,
  onClose,
  isMandatory = false,
}: LocationUpdatePopupProps) => {
  const [loading, setLoading] = useState(false);

  const handleUpdateLocation = async () => {
    setLoading(true);
    try {
      const accountId = localStorage.getItem('accountId');
      if (!accountId) {
        toast.error('Vui lòng đăng nhập');
        return;
      }

      // Get current position
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;

      // Update location in database
      await updateLocation(Number(accountId), latitude, longitude);
      toast.success('Cập nhật vị trí thành công!');
      onClose();
    } catch (error) {
      toast.error('Không thể cập nhật vị trí. Vui lòng kiểm tra quyền truy cập vị trí của bạn.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={isMandatory ? undefined : onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-matchup-purple">
            <MapPin className="h-5 w-5" />
            Cập nhật vị trí
          </DialogTitle>
          <DialogDescription>
            Để tìm kiếm bạn bè gần bạn, chúng tôi cần biết vị trí hiện tại của bạn.
          </DialogDescription>
          {!isMandatory && (
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Đóng</span>
            </DialogClose>
          )}
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Vị trí của bạn sẽ được sử dụng để:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-muted-foreground">
            <li>Tìm kiếm người dùng gần bạn</li>
            <li>Hiển thị khoảng cách giữa bạn và người dùng khác</li>
            <li>Cải thiện trải nghiệm ghép đôi</li>
          </ul>
        </div>

        <DialogFooter className="flex gap-2 justify-end">
          {!isMandatory && (
            <Button variant="outline" onClick={onClose}>
              Để sau
            </Button>
          )}
          <Button 
            onClick={handleUpdateLocation}
            disabled={loading}
            className="bg-matchup-purple hover:bg-matchup-purple-dark"
          >
            {loading ? 'Đang cập nhật...' : 'Cập nhật vị trí'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LocationUpdatePopup; 