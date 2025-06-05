import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Conversation } from '@/types/Conversation';

interface MessagesViewProps {
  conversations: Conversation[];
}

const MessagesView = ({ conversations }: MessagesViewProps) => {
  return (
    <div className="relative min-h-screen pt-16 pb-20 overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-50 via-white to-blue-50 -z-10"></div>
      
      {/* Animated Blobs */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-purple-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
      <div className="fixed top-1/3 right-1/4 w-96 h-96 bg-pink-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      <div className="fixed bottom-1/4 left-1/3 w-96 h-96 bg-blue-300/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>

      {/* Floating Hearts */}
      <div className="fixed top-1/4 left-1/3 w-8 h-8 text-pink-400/30 animate-float">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </div>
      <div className="fixed top-1/2 right-1/4 w-6 h-6 text-purple-400/30 animate-float animation-delay-1000">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </div>
      <div className="fixed bottom-1/3 left-1/4 w-10 h-10 text-blue-400/30 animate-float animation-delay-2000">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </div>
      <div className="fixed top-1/5 right-1/5 w-5 h-5 text-rose-400/30 animate-float animation-delay-500">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </div>
      <div className="fixed bottom-1/5 right-1/5 w-7 h-7 text-fuchsia-400/30 animate-float animation-delay-1500">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </div>
      <div className="fixed top-2/3 left-1/5 w-6 h-6 text-indigo-400/30 animate-float animation-delay-2500">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </div>
      <div className="fixed bottom-2/3 right-1/3 w-9 h-9 text-violet-400/30 animate-float animation-delay-3000">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </div>

      {/* Sparkles */}
      <div className="fixed top-1/3 right-1/3 w-4 h-4 text-yellow-400/40 animate-sparkle">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </div>
      <div className="fixed bottom-1/4 right-1/3 w-3 h-3 text-yellow-400/40 animate-sparkle animation-delay-1500">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </div>
      <div className="fixed top-1/2 left-1/4 w-5 h-5 text-amber-400/40 animate-sparkle animation-delay-500">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </div>
      <div className="fixed bottom-1/3 left-1/3 w-4 h-4 text-orange-400/40 animate-sparkle animation-delay-2000">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </div>
      <div className="fixed top-2/3 right-1/4 w-3 h-3 text-yellow-400/40 animate-sparkle animation-delay-3000">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </div>

      {/* Glowing Orbs */}
      <div className="fixed top-1/4 right-1/4 w-32 h-32 bg-purple-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
      <div className="fixed bottom-1/4 left-1/4 w-40 h-40 bg-pink-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-1000"></div>
      <div className="fixed top-2/3 right-1/3 w-36 h-36 bg-blue-400/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>

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
        <div className="space-y-2">
          {conversations.length === 0 ? (
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
            conversations.map((conv) => (
              <Link
                key={conv.id}
                to={`/messages/${conv.id}`}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/90 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] group relative cursor-pointer backdrop-blur-sm border border-purple-100/50 hover:border-purple-200/50"
                style={{ minHeight: 72 }}
              >
                <div className="relative">
                  <div className="w-14 h-14 rounded-full overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.1)] border-2 border-white group-hover:scale-105 transition-transform duration-300">
                    <img
                      src={conv.avatar || 'https://via.placeholder.com/100?text=User'}
                      alt={conv.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {conv.isOnline && (
                    <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white shadow-[0_2px_4px_rgba(0,0,0,0.1)]"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-semibold text-base truncate group-hover:text-matchup-purple transition-colors">{conv.name}</h3>
                    <span className="text-xs text-muted-foreground ml-2 whitespace-nowrap">
                      {conv.lastMessageAt
                        ? new Date(conv.lastMessageAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                        : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm line-clamp-1 truncate flex-1 text-muted-foreground group-hover:text-matchup-purple transition-colors duration-300">
                      {conv.lastMessage || 'Bắt đầu cuộc trò chuyện...'}
                    </p>
                  </div>
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
