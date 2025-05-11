
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ProfileCard from '@/components/ProfileCard';
import { toast } from 'sonner';

// Sample data
const dummyProfiles = [
  {
    id: '1',
    name: 'Thảo',
    age: 23,
    distance: 4,
    avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
  },
  {
    id: '2',
    name: 'Minh',
    age: 25,
    distance: 2,
    avatar: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80',
  },
  {
    id: '3',
    name: 'Hà',
    age: 24,
    distance: 7,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
  },
  {
    id: '4',
    name: 'Khoa',
    age: 26,
    distance: 3,
    avatar: 'https://images.unsplash.com/photo-1500048993953-d23a436266cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80',
  }
];

const Index = () => {
  const [profiles, setProfiles] = useState(dummyProfiles);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);

  const handleAction = (action: 'like' | 'dislike') => {
    if (action === 'like') {
      toast.success(`Bạn đã thích ${profiles[currentProfileIndex].name}!`);
    }
    
    // Move to next profile after a short delay
    setTimeout(() => {
      setCurrentProfileIndex(prev => {
        if (prev < profiles.length - 1) {
          return prev + 1;
        } else {
          // Reset to first profile if we've seen all profiles
          toast.info("Đã xem hết tất cả hồ sơ! Bắt đầu lại từ đầu.");
          return 0;
        }
      });
    }, 500);
  };

  if (profiles.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Không có hồ sơ nào để xem!</h2>
            <p className="text-muted-foreground">Hãy thay đổi tiêu chí tìm kiếm của bạn</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20 pb-20 px-4">
        <div className="swipe-card-container">
          {profiles.map((profile, index) => (
            <div
              key={profile.id}
              className={index === currentProfileIndex ? 'block' : 'hidden'}
            >
              <ProfileCard
                id={profile.id}
                name={profile.name}
                age={profile.age}
                distance={profile.distance}
                avatar={profile.avatar}
                onAction={handleAction}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
