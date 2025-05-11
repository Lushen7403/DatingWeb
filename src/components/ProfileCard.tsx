
import { useState } from 'react';
import { Heart, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProfileCardProps {
  id: string;
  name: string;
  age: number;
  distance: number;
  avatar: string;
  onAction?: (action: 'like' | 'dislike') => void;
}

const ProfileCard = ({ id, name, age, distance, avatar, onAction }: ProfileCardProps) => {
  const [action, setAction] = useState<'like' | 'dislike' | null>(null);
  const navigate = useNavigate();
  
  const handleAction = (actionType: 'like' | 'dislike') => {
    setAction(actionType);
    
    // Wait for animation to finish before calling the callback
    setTimeout(() => {
      if (onAction) onAction(actionType);
    }, 500);
  };
  
  const handleCardClick = () => {
    navigate(`/view-profile/${id}`);
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
          src={avatar} 
          alt={name} 
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback if image fails to load
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x500?text=MatchUp';
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
    </div>
  );
};

export default ProfileCard;
