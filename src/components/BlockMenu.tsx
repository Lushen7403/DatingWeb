import { useState, useEffect } from 'react';
import { MoreVertical, Ban, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { blockUser, unblockUser, isBlocked } from '@/lib/blockApi';
import { authService } from '@/lib/authService';

interface BlockMenuProps {
  otherUserId: number;
  onBlockStatusChange?: (isBlocked: boolean) => void;
}

const BlockMenu = ({ otherUserId, onBlockStatusChange }: BlockMenuProps) => {
  const [isBlockedUser, setIsBlockedUser] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkBlockStatus();
  }, [otherUserId]);

  const checkBlockStatus = async () => {
    try {
      const accountId = authService.getAccountId();
      if (!accountId) return;

      const blocked = await isBlocked(accountId, otherUserId);
      setIsBlockedUser(blocked);
      if (onBlockStatusChange) {
        onBlockStatusChange(blocked);
      }
    } catch (error) {
      console.error('Error checking block status:', error);
    }
  };

  const handleBlock = async () => {
    setLoading(true);
    try {
      const accountId = authService.getAccountId();
      if (!accountId) {
        toast.error('Vui lòng đăng nhập lại');
        return;
      }

      await blockUser(accountId, otherUserId);
      setIsBlockedUser(true);
      if (onBlockStatusChange) {
        onBlockStatusChange(true);
      }
      toast.success('Đã chặn người dùng này');
    } catch (error) {
      toast.error('Không thể chặn người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleUnblock = async () => {
    setLoading(true);
    try {
      const accountId = authService.getAccountId();
      if (!accountId) {
        toast.error('Vui lòng đăng nhập lại');
        return;
      }

      await unblockUser(accountId, otherUserId);
      setIsBlockedUser(false);
      if (onBlockStatusChange) {
        onBlockStatusChange(false);
      }
      toast.success('Đã bỏ chặn người dùng này');
    } catch (error) {
      toast.error('Không thể bỏ chặn người dùng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {isBlockedUser ? (
          <DropdownMenuItem 
            onClick={handleUnblock}
            disabled={loading}
            className="text-green-600"
          >
            <Check className="mr-2 h-4 w-4" />
            Bỏ chặn
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem 
            onClick={handleBlock}
            disabled={loading}
            className="text-red-600"
          >
            <Ban className="mr-2 h-4 w-4" />
            Chặn
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BlockMenu; 