
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Match } from '@/types/Match';

interface MessagesViewProps {
  matches: Match[];
}

const MessagesView = ({ matches }: MessagesViewProps) => {
  return (
    <div className="bg-background min-h-screen pt-16 pb-20">
      <header className="matchup-header">
        <div className="flex items-center justify-between w-full">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft size={20} />
            </Link>
          </Button>

          <h1 className="text-xl font-bold">Tin nhắn</h1>

          <div className="w-8"></div>
        </div>
      </header>

      <div className="container px-4 pt-4">
        <div className="space-y-1">
          {matches.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8">
              <div className="w-24 h-24 rounded-full bg-matchup-purple/10 flex items-center justify-center mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-matchup-purple">
                  <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
                  <path d="M14 16h-3"/>
                  <path d="M11.742 13.742a2.5 2.5 0 1 0 0-3.484"/>
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-center">Chưa có tin nhắn nào</h2>
              <p className="text-muted-foreground text-center mt-2">
                Hãy match với ai đó để bắt đầu trò chuyện!
              </p>
              <Button asChild className="mt-6 bg-matchup-purple hover:bg-matchup-purple-dark">
                <Link to="/">Quay lại trang chủ</Link>
              </Button>
            </div>
          ) : (
            matches.map((match) => (
              <Link
                key={match.id}
                to={`/messages/${match.id}`}
                className="flex items-center p-4 rounded-xl hover:bg-muted transition-colors"
              >
                <div className="relative">
                  <div className="w-14 h-14 rounded-full overflow-hidden">
                    <img
                      src={match.avatar || 'https://via.placeholder.com/100?text=User'}
                      alt={match.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {match.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{match.name}</h3>
                    <span className="text-xs text-muted-foreground">
                      {match.lastMessage?.timestamp 
                        ? new Date(match.lastMessage.timestamp).toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' }) 
                        : ''}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {match.lastMessage?.text || 'Bắt đầu cuộc trò chuyện...'}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesView;
