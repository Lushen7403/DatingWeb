import { useState } from 'react';
import { Heart, X } from 'lucide-react';
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
  onAction?: (action: 'like' | 'dislike') => void;
}

const ProfileCard = ({ id, accountId, name, age, distance, avatar, onAction }: ProfileCardProps) => {
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

  return (
    <div 
      className={cn(
        "swipe-card transition-all duration-500",
        action === 'like' && "animate-swipe-right",
        action === 'dislike' && "animate-swipe-left"
      )}
    >
      <div 
        className="w-full h-full relative cursor-pointer"
        onClick={handleCardClick}
      >
        <img 
          src={avatar ? `https://res.cloudinary.com/dfvhhpkyg/image/upload/${avatar}` : '/default-avatar.png'} 
          alt={name} 
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback if image fails to load
            (e.target as HTMLImageElement).src = '/default-avatar.png';
          }}
        />
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 text-white">
          <h2 className="text-2xl font-bold mb-1">{name}, {age}</h2>
          <p className="text-sm opacity-80">{distance} km từ bạn</p>
        </div>
        
        {/* Like and dislike overlay indicators */}
        {action === 'like' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full bg-matchup-purple/90 p-6 rotate-[-20deg]">
              <Heart size={80} className="text-white" />
            </div>
          </div>
        )}
        
        {action === 'dislike' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full bg-matchup-pink/90 p-6 rotate-[20deg]">
              <X size={80} className="text-white" />
            </div>
          </div>
        )}
      </div>
      
      <div className="swipe-card-actions">
        <Button 
          onClick={() => handleAction('dislike')}
          className="dislike-button"
          aria-label="Dislike"
        >
          <X size={24} />
        </Button>
        
        <Button 
          onClick={() => handleAction('like')}
          className="like-button"
          aria-label="Like"
        >
          <Heart size={24} />
        </Button>
      </div>

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
