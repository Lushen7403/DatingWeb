
import { useState, useEffect } from 'react';
import { ArrowLeft, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User } from '@/types/User';
import { motion } from 'framer-motion';

// Sample likes data
const dummyLikes: User[] = [
  {
    id: '5',
    name: 'Tuấn',
    birthdate: '1997-07-10',
    gender: 'Nam',
    bio: 'Yêu âm nhạc và cafe',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
  },
  {
    id: '6',
    name: 'Phương',
    birthdate: '1999-02-15',
    gender: 'Nữ',
    bio: 'Thích du lịch và khám phá',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
  },
  {
    id: '7',
    name: 'Hùng',
    birthdate: '1998-05-20',
    gender: 'Nam',
    bio: 'Mê thể thao và phiêu lưu',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1448&q=80',
  },
];

const Likes = () => {
  const [likes, setLikes] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, we would fetch likes from an API
    setTimeout(() => {
      setLikes(dummyLikes);
      setLoading(false);
    }, 500);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="bg-gradient-to-b from-background to-matchup-purple-light min-h-screen pt-16 pb-20">
      <header className="matchup-header backdrop-blur-lg bg-background/70">
        <div className="flex items-center justify-between w-full">
          <Button variant="ghost" size="icon" asChild className="hover:scale-110 transition-transform">
            <Link to="/">
              <ArrowLeft size={20} className="text-matchup-purple" />
            </Link>
          </Button>

          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-matchup-purple to-matchup-pink">
            Ai thích bạn?
          </h1>

          <div className="w-8"></div>
        </div>
      </header>

      <div className="container px-4 pt-6">
        {loading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-matchup-purple rounded-full border-t-transparent animate-spin mx-auto shadow-lg shadow-matchup-purple/40"></div>
              <p className="mt-4 text-muted-foreground font-medium">Đang tải...</p>
            </div>
          </div>
        ) : likes.length === 0 ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center p-8 h-[60vh]"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-matchup-purple-light to-matchup-purple flex items-center justify-center mb-4 shadow-xl shadow-matchup-purple/30">
              <HeartHandshake size={32} className="text-white" />
            </div>
            <h2 className="text-lg font-semibold text-center mb-2">Chưa có ai thích bạn</h2>
            <p className="text-muted-foreground text-center mt-2 max-w-md">
              Hãy tiếp tục swipe để tìm những người phù hợp!
            </p>
            <Button asChild className="mt-6 bg-gradient-to-r from-matchup-purple to-matchup-pink hover:opacity-90 shadow-lg shadow-matchup-purple/20 transition-all duration-300">
              <Link to="/">Quay lại trang chủ</Link>
            </Button>
          </motion.div>
        ) : (
          <>
            <motion.h2 
              initial={{ y: -20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }}
              className="text-lg font-semibold mb-6 flex items-center"
            >
              <HeartHandshake size={20} className="mr-2 text-matchup-pink" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-matchup-purple to-matchup-pink">
                {likes.length} người đã thích bạn
              </span>
            </motion.h2>
            
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 sm:grid-cols-3 gap-4"
            >
              {likes.map((user) => (
                <motion.div key={user.id} variants={item}>
                  <Link
                    to={`/like-detail/${user.id}`}
                    className="block"
                  >
                    <div className="bg-white/90 backdrop-blur rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all hover:scale-105 transform hover:-rotate-1 duration-300 border border-white/20">
                      <div className="aspect-square overflow-hidden relative">
                        <img
                          src={user.avatar || 'https://via.placeholder.com/300?text=User'}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                          <h3 className="text-white font-bold text-lg">{user.name}</h3>
                          <div className="mt-1 flex items-center">
                            <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-white">
                              {user.gender}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default Likes;
