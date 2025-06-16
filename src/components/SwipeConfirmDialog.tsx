import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface SwipeConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  remainingSwipes: number;
  willUseDiamonds: boolean;
}

const SwipeConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  remainingSwipes,
  willUseDiamonds,
}: SwipeConfirmDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent onClick={e => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="text-matchup-purple" />
            Xác nhận thích
          </DialogTitle>
          <DialogDescription>
            {willUseDiamonds ? (
              <span>Bạn đã hết lượt thích trong ngày. Thích thêm sẽ tốn 10 kim cương.</span>
            ) : (
              <span>Bạn còn {remainingSwipes} lượt thích trong ngày hôm nay.</span>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={() => { onConfirm(); onClose(); }} className="like-button">
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SwipeConfirmDialog; 