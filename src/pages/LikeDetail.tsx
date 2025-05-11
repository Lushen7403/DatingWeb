
import { useState, useEffect } from 'react';
import { ArrowLeft, Heart, X, MoreVertical, Calendar, MapPin, MessageCircle, HeartHandshake, ShieldAlert } from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User } from '@/types/User';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Extended sample likes data with more details
const detailedLikes: Record<string, User> = {
  '5': {
    id: '5',
    name: 'Tuấn',
    birthdate: '1997-07-10',
    gender: 'Nam',
    bio: 'Yêu âm nhạc và cafe. Thích khám phá những địa điểm mới và gặp gỡ những con người thú vị. Đam mê du lịch và chụp ảnh phong cảnh.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
      'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
    ]
  },
  '6': {
    id: '6',
    name: 'Phương',
    birthdate: '1999-02-15',
    gender: 'Nữ',
    bio: 'Thích du lịch và khám phá. Yêu động vật, đặc biệt là chó. Đam mê nấu ăn và thường tìm kiếm công thức mới để thử.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
      'https://images.unsplash.com/photo-1484329081568-bed9ba42793e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
    ]
  },
  '7': {
    id: '7',
    name: 'Hùng',
    birthdate: '1998-05-20',
    gender: 'Nam',
    bio: 'Mê thể thao và phiêu lưu. Thích leo núi vào cuối tuần. Làm việc trong ngành công nghệ và đam mê đọc sách về khoa học.',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1448&q=80',
    photos: [
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1448&q=80',
      'https://images.unsplash.com/photo-1500048993953-d23a436266cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80',
      'https://images.unsplash.com/photo-1506902550945-7645732aaae8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=724&q=80'
    ]
  }
};

const LikeDetail = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (profileId && detailedLikes[profileId]) {
      setUser(detailedLikes[profileId]);
    } else {
      // Navigate back if profile not found
      navigate('/likes');
    }
  }, [profileId, navigate]);

  const handlePreviousPhoto = () => {
    if (user && user.photos) {
      setCurrentPhotoIndex((prev) => (prev === 0 ? user.photos!.length - 1 : prev - 1));
    }
  };

  const handleNextPhoto = () => {
    if (user && user.photos) {
      setCurrentPhotoIndex((prev) => (prev === user.photos!.length - 1 ? 0 : prev + 1));
    }
  };

  const handleLike = () => {
    toast.success(`Bạn đã thích ${user?.name}!`, {
      icon: <Heart size={18} className="text-red-500" fill="currentColor" />,
      style: { background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' },
      position: 'top-center'
    });
    
    setTimeout(() => {
      toast.success(`Chúc mừng! Bạn và ${user?.name} đã match!`, {
        icon: <HeartHandshake size={18} className="text-matchup-purple" />,
        style: { background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' },
        position: 'top-center'
      });
    }, 1000);
    
    setTimeout(() => {
      navigate('/messages');
    }, 2000);
  };

  const handleDislike = () => {
    toast.info(`Bạn đã bỏ qua ${user?.name}`, {
      icon: <X size={18} className="text-gray-500" />,
      style: { background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' },
      position: 'top-center'
    });
    navigate('/likes');
  };

  const handleBlock = () => {
    toast.success(`Đã chặn ${user?.name}`, {
      icon: <ShieldAlert size={18} className="text-red-500" />,
      style: { background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' },
      position: 'top-center'
    });
    navigate('/likes');
  };

  const handleReport = () => {
    toast.success(`Đã báo cáo ${user?.name}`, {
      icon: <ShieldAlert size={18} className="text-orange-500" />,
      style: { background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' },
      position: 'top-center'
    });
    navigate('/likes');
  };

  const handleMessage = () => {
    toast.success(`Gửi tin nhắn cho ${user?.name}!`, {
      icon: <MessageCircle size={18} className="text-matchup-purple" />,
      style: { background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' },
      position: 'top-center'
    });
    navigate('/messages');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-matchup-purple-light">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-matchup-purple rounded-full border-t-transparent animate-spin mx-auto shadow-lg shadow-matchup-purple/40"></div>
          <p className="mt-4 text-muted-foreground font-medium">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Calculate age from birthdate
  const calculateAge = (birthdate: string) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(user.birthdate);

  return (
    <div className="bg-gradient-to-b from-background to-matchup-purple-light min-h-screen pt-16 pb-20">
      <header className="matchup-header backdrop-blur-lg bg-background/70">
        <div className="flex items-center justify-between w-full">
          <Button variant="ghost" size="icon" asChild className="hover:scale-110 transition-transform">
            <Link to="/likes">
              <ArrowLeft size={20} className="text-matchup-purple" />
            </Link>
          </Button>

          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-matchup-purple to-matchup-pink">
            {user.name}
          </h1>

          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:scale-110 transition-transform">
                  <MoreVertical size={20} className="text-matchup-purple" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white/80 backdrop-blur-md border border-matchup-purple/20">
                <DropdownMenuItem onClick={handleBlock} className="text-red-500 cursor-pointer hover:bg-red-50">
                  <ShieldAlert size={16} className="mr-2" /> Chặn người dùng
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleReport} className="cursor-pointer hover:bg-orange-50">
                  <ShieldAlert size={16} className="mr-2" /> Báo cáo vi phạm
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="h-[60vh] relative"
      >
        {user.photos && user.photos.length > 0 ? (
          <>
            <motion.img
              key={currentPhotoIndex}
              initial={{ opacity: 0.8, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              src={user.photos[currentPhotoIndex]}
              alt={user.name}
              className="w-full h-full object-cover rounded-b-3xl shadow-2xl"
            />
            {/* Photo navigation dots */}
            <div className="absolute top-4 left-0 right-0 flex justify-center gap-2">
              {user.photos.map((_, index) => (
                <motion.div
                  key={index}
                  className={`w-2 h-2 rounded-full cursor-pointer ${
                    index === currentPhotoIndex ? 'bg-white scale-125' : 'bg-white/50'
                  }`}
                  onClick={() => setCurrentPhotoIndex(index)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
            {/* Left/right swipe areas */}
            <div
              className="absolute top-0 left-0 w-1/5 h-full cursor-pointer"
              onClick={handlePreviousPhoto}
            />
            <div
              className="absolute top-0 right-0 w-1/5 h-full cursor-pointer"
              onClick={handleNextPhoto}
            />
            {/* Info overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 text-white rounded-b-3xl">
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold mb-1"
              >
                {user.name}, <span className="text-matchup-pink">{age}</span>
              </motion.h2>
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-2"
              >
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium flex items-center">
                  <Calendar size={14} className="mr-1 text-matchup-pink" /> 
                  {new Date(user.birthdate).toLocaleDateString('vi-VN')}
                </span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                  {user.gender}
                </span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium flex items-center">
                  <MapPin size={14} className="mr-1 text-matchup-pink" /> 
                  3km
                </span>
              </motion.div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted rounded-3xl">
            <Avatar className="w-32 h-32 shadow-xl border-4 border-white">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        )}
      </motion.div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="p-6 bg-white/60 backdrop-blur-md mt-4 mx-4 rounded-3xl shadow-lg"
      >
        <h3 className="text-xl font-semibold mb-3 flex items-center text-matchup-purple">
          <Heart size={18} className="mr-2 text-matchup-pink" fill="#D946EF" /> 
          Giới thiệu
        </h3>
        <p className="text-muted-foreground leading-relaxed">{user.bio}</p>
      </motion.div>

      {/* Action buttons */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-6 left-0 right-0 flex justify-center gap-6 z-20"
      >
        <Button 
          onClick={handleDislike}
          className="dislike-button bg-white shadow-xl hover:bg-red-50"
          aria-label="Dislike"
        >
          <X size={24} className="text-red-500" />
        </Button>
        
        <Button 
          onClick={handleMessage}
          className="matchup-button rounded-full w-14 h-14 bg-gradient-to-r from-matchup-blue to-blue-400 text-white shadow-xl hover:shadow-blue-300/40 hover:scale-105 transition-all"
          aria-label="Message"
        >
          <MessageCircle size={24} />
        </Button>
        
        <Button 
          onClick={handleLike}
          className="like-button bg-gradient-to-r from-matchup-purple to-matchup-pink shadow-xl hover:shadow-matchup-pink/40 hover:scale-105 transition-all"
          aria-label="Like"
        >
          <Heart size={24} />
        </Button>
      </motion.div>
    </div>
  );
};

export default LikeDetail;
