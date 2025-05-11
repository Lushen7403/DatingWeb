
import { useState, useRef } from 'react';
import { ArrowLeft, Send, Image, Video } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Message } from '@/types/Message';

interface ChatBoxProps {
  matchId: string;
  matchName: string;
  matchAvatar: string;
  isOnline?: boolean;
  messages: Message[];
  onSendMessage: (text: string) => void;
}

const ChatBox = ({ 
  matchId, 
  matchName, 
  matchAvatar, 
  isOnline = false, 
  messages = [],
  onSendMessage
}: ChatBoxProps) => {
  const [text, setText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (text.trim()) {
      onSendMessage(text.trim());
      setText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleImageUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleVideoUpload = () => {
    if (videoInputRef.current) {
      videoInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Here you would normally upload the file to a server
      // For now, just send a message indicating a file was sent
      const fileType = event.target.accept.includes('image') ? 'ảnh' : 'video';
      onSendMessage(`Đã gửi ${fileType}: ${files[0].name}`);
      
      // Reset the input
      event.target.value = '';
    }
  };

  return (
    <div className="flex flex-col h-screen pt-16">
      <div className="matchup-header">
        <div className="flex items-center justify-between w-full">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/messages">
              <ArrowLeft size={20} />
            </Link>
          </Button>

          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
              <img
                src={matchAvatar || 'https://via.placeholder.com/100?text=User'}
                alt={matchName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-sm">{matchName}</span>
              {isOnline && (
                <span className="text-xs text-green-500">Đang hoạt động</span>
              )}
            </div>
          </div>

          <div className="w-8"></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[70%] p-3 rounded-2xl ${
                message.isMe 
                  ? 'bg-matchup-purple text-white rounded-br-none' 
                  : 'bg-muted rounded-bl-none'
              }`}
            >
              <p>{message.text}</p>
              <span className="text-xs opacity-70 block text-right mt-1">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="bg-muted h-12 w-12 rounded-full"
            onClick={handleImageUpload}
          >
            <Image size={20} />
          </Button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleFileChange}
          />
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="bg-muted h-12 w-12 rounded-full"
            onClick={handleVideoUpload}
          >
            <Video size={20} />
          </Button>
          <input 
            type="file" 
            ref={videoInputRef} 
            className="hidden" 
            accept="video/*"
            onChange={handleFileChange}
          />
          
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhắn tin..."
            className="matchup-input flex-1"
          />
          <Button
            onClick={handleSend}
            className="bg-matchup-purple hover:bg-matchup-purple-dark h-12 w-12 rounded-full p-0"
            disabled={!text.trim()}
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
