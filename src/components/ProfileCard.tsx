import { useState } from 'react';
import { Heart, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { swipeProfile, getTodaySwipeCount } from '@/lib/matchApi';
import SwipeConfirmDialog from '@/components/SwipeConfirmDialog';

interface ProfileCardProps {
  id: string;
  accountId: string;
  name: string;
  age: number;
  distance: number;
  avatar: string;
  address?: string;
  onAction?: (action: 'like' | 'dislike') => void;
  onPrev?: () => void;
  onNext?: () => void;
  showPrev?: boolean;
  showNext?: boolean;
  description?: string;
  className?: string;
}

const ProfileCard = ({ id, accountId, name, age, distance, avatar, address, onAction, onPrev, onNext, showPrev, showNext, description, className }: ProfileCardProps) => {
  const [action, setAction] = useState<'like' | 'dislike' | null>(null);
  const [showSwipeDialog, setShowSwipeDialog] = useState(false);
  const [remainingSwipes, setRemainingSwipes] = useState(10);
  const [willUseDiamonds, setWillUseDiamonds] = useState(false);
  const navigate = useNavigate();
  
  const checkSwipeCount = async () => {
    try {
      const accountId = localStorage.getItem('accountId');
      if (!accountId) {
        navigate('/login');
        return;
      }

      const count = await getTodaySwipeCount(parseInt(accountId));
      const remaining = 10 - count;
      setRemainingSwipes(remaining);
      setWillUseDiamonds(remaining <= 0);
      setShowSwipeDialog(true);
    } catch (error) {
      toast.error('Không thể kiểm tra lượt thích');
    }
  };

  const handleAction = async (actionType: 'like' | 'dislike') => {
    if (actionType === 'like') {
      await checkSwipeCount();
    } else {
      await handleDislike();
    }
  };

  const handleSwipeConfirm = async () => {
    try {
      const accountId = localStorage.getItem('accountId');
      if (!accountId) {
        navigate('/login');
        return;
      }

      const result = await swipeProfile(
        parseInt(accountId),
        parseInt(id),
        true
      );

      setAction('like');
      
      // Wait for animation to finish before calling the callback
      setTimeout(() => {
        if (onAction) onAction('like');
        
        // If result has conversation property, it means it's a match
        if (result.isMatch && result.conversation) {
          toast.success(`Thành công! Bạn đã match với ${name}!`);
          navigate('/messages');
        } else {
          toast.info(`Bạn đã thích ${name}`);
        }
      }, 500);
    } catch (error: any) {
      if (error.response?.status === 400) {
        toast.error(error.response.data);
      } else {
        toast.error('Có lỗi xảy ra khi thích profile');
      }
    }
  };
  
  const handleDislike = async () => {
    try {
      const accountId = localStorage.getItem('accountId');
      if (!accountId) {
        navigate('/login');
        return;
      }

      const result = await swipeProfile(
        parseInt(accountId),
        parseInt(id),
        false
      );

      setAction('dislike');
      
      // Wait for animation to finish before calling the callback
      setTimeout(() => {
        if (onAction) onAction('dislike');
        toast.info(`Bạn đã bỏ qua ${name}`);
      }, 500);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi bỏ qua profile');
    }
  };
  
  const handleCardClick = () => {
    navigate(`/view-profile/${accountId}`);
  };

  const handleDislikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleAction('dislike');
  };
  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleAction('like');
  };

  return (
    <div 
      className="relative w-full max-w-md mx-auto rounded-3xl overflow-hidden shadow-xl bg-black sm:min-h-[600px] cursor-pointer"
      onClick={() => navigate(`/view-profile/${accountId}`)}
    >
      {/* Ảnh nền cho toàn card */}
      <img
        src={avatar ? `https://res.cloudinary.com/dfvhhpkyg/image/upload/${avatar}` : '/default-avatar.png'}
        alt={name}
        className="w-full h-[420px] sm:h-[600px] object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/default-avatar.png';
        }}
      />
      {/* Overlay gradient mờ dần từ dưới lên */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10 pointer-events-none"></div>
      {/* Nút like/dislike absolute, nhỏ lại, ngay trên mục tên, không che text */}
      <div className="absolute left-1/2 bottom-[83px] -translate-x-1/2 z-30 flex gap-6">
        <button
          onClick={handleDislikeClick}
          className="rounded-full w-14 h-14 flex items-center justify-center shadow-md bg-white border-2 border-white hover:scale-110 transition-transform ring-1 ring-pink-200 hover:ring-pink-300 focus:ring-pink-400"
          aria-label="Dislike"
        >
          <X size={32} className="text-pink-400" />
        </button>
        <button
          onClick={handleLikeClick}
          className="rounded-full w-14 h-14 flex items-center justify-center shadow-md bg-white border-2 border-white hover:scale-110 transition-transform ring-1 ring-purple-200 hover:ring-purple-300 focus:ring-purple-400"
          aria-label="Like"
        >
          <Heart size={32} className="text-purple-400" />
        </button>
      </div>
      {/* Info absolute bottom, text trắng, padding, nổi trên gradient */}
      <div className="absolute bottom-0 left-0 w-full px-6 pb-6 z-20 text-left">
        <h2 className="text-2xl font-bold mb-1 text-white drop-shadow">{name}, {age}</h2>
        {address ? (
          <p className="text-base text-white/90 mb-1">{address} - cách {distance} km</p>
        ) : (
          <p className="text-base text-white/90 mb-1">{distance} km từ bạn</p>
        )}
        {typeof description === 'string' && description.trim() && (
          <p className="text-base text-white/80">{description}</p>
        )}
      </div>
      {/* Nút prev/next */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev && onPrev(); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white rounded-full shadow p-2 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Hồ sơ trước"
        disabled={!showPrev}
      >
        <ChevronLeft className="w-7 h-7 text-matchup-purple" />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onNext && onNext(); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white rounded-full shadow p-2 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Hồ sơ tiếp"
        disabled={!showNext}
      >
        <ChevronRight className="w-7 h-7 text-matchup-purple" />
      </button>
      {/* Like/Dislike overlay indicators */}
      {action === 'like' && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <div className="rounded-full bg-matchup-purple/90 p-6 rotate-[-20deg]">
            <Heart size={80} className="text-white" />
          </div>
        </div>
      )}
      {action === 'dislike' && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <div className="rounded-full bg-matchup-pink/90 p-6 rotate-[20deg]">
            <X size={80} className="text-white" />
          </div>
        </div>
      )}
      <SwipeConfirmDialog
        isOpen={showSwipeDialog}
        onClose={() => setShowSwipeDialog(false)}
        onConfirm={handleSwipeConfirm}
        remainingSwipes={remainingSwipes}
        willUseDiamonds={willUseDiamonds}
      />
    </div>
  );
};

export default ProfileCard;
