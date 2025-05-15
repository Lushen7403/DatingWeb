import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Image, Video } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Message } from '@/types/Message';
import { chatService, getMessages, uploadMedia } from '@/lib/chatService';

interface ChatBoxProps {
  conversationId: number;
  matchName: string;
  matchAvatar: string;
  matchId: number;
  isOnline?: boolean;
}

const ChatBox = ({ 
  conversationId, 
  matchName, 
  matchAvatar,
  matchId,
  isOnline = false
}: ChatBoxProps) => {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isUserOnline, setIsUserOnline] = useState(isOnline);
  const pageSize = 50;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async (pageToLoad = 1) => {
    if (!conversationId) return;
    const msgs = await getMessages(conversationId, pageToLoad, pageSize);
    const mapped = msgs
      .filter(Boolean)
      .map((msg: any) => ({
        id: msg.id.toString(),
        text: msg.messageText,
        timestamp: msg.sentAt,
        isMe: msg.senderId === Number(localStorage.getItem('accountId')),
        media: msg.media || []
      }));
    
    if (pageToLoad === 1) {
      setMessages(mapped);
    } else {
      setMessages(prev => [...prev, ...mapped]);
    }
    setHasMore(msgs.length === pageSize);
  };

  useEffect(() => {
    const initializeChat = async () => {
      try {
        setPage(1);
        await fetchMessages(1);
        console.log('Joining conversation:', conversationId);
        await chatService.joinConversation(conversationId);
        console.log('Checking online status for user:', matchId);
        await chatService.checkOnline(matchId);
      } catch (error) {
        console.error('Error initializing chat:', error);
      }
    };

    initializeChat();

    const unsubscribeMessage = chatService.onMessage((message) => {
      console.log('Received message:', message);
      if (message.conversationId === conversationId) {
        setMessages(prev => [...prev, {
          id: message.id.toString(),
          text: message.messageText,
          timestamp: message.sentAt,
          isMe: message.senderId === Number(localStorage.getItem('accountId')),
          media: message.media || []
        }]);
      }
    });

    const unsubscribeOnline = chatService.onOnlineStatus((userId, isOnline) => {
      console.log('Online status changed:', userId, isOnline);
      if (userId === matchId) {
        setIsUserOnline(isOnline);
      }
    });

    return () => {
      try {
        chatService.leaveConversation(conversationId);
      } catch (error) {
        console.error('Error leaving conversation:', error);
      }
      unsubscribeMessage();
      unsubscribeOnline();
    };
  }, [conversationId, matchId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const loadMore = () => {
    if (hasMore) {
      const nextPage = page + 1;
      fetchMessages(nextPage);
      setPage(nextPage);
    }
  };

  const handleSend = async () => {
    if (text.trim()) {
      try {
        const accountId = Number(localStorage.getItem('accountId'));
        console.log('Sending message:', { conversationId, accountId, text: text.trim() });
        await chatService.sendMessage(
          conversationId,
          accountId,
          text.trim(),
          [],
          []
        );
        setText('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
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

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const files = event.target.files;
  if (files && files.length > 0) {
    try {
      const file = files[0];
      const accountId = Number(localStorage.getItem('accountId'));
      const messageId = await chatService.sendMessage(
        conversationId,
        accountId,
        '',
        [],
        []
      );
      const mediaUrl = await uploadMedia(file, messageId);
      console.log('File uploaded, URL:', mediaUrl);
      event.target.value = '';
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }
};

  return (
    <div className="flex flex-col h-screen pt-16 overflow-hidden">
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
              {isUserOnline && (
                <span className="text-xs text-green-500">Đang hoạt động</span>
              )}
            </div>
          </div>

          <div className="w-8"></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col justify-end">
        {hasMore && (
          <div className="text-center mb-2">
            <Button size="sm" variant="outline" onClick={loadMore}>
              Xem tin nhắn cũ hơn
            </Button>
          </div>
        )}
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
              {message.media && message.media.length > 0 ? (
                message.media.map((media, idx) => (
                  <div key={idx} className="mb-2">
                    {media.type === 'image' ? (
                      <img src={media.url} alt="Media" className="max-w-full rounded-lg" />
                    ) : (
                      <video src={media.url} controls className="max-w-full rounded-lg" />
                    )}
                  </div>
                ))
              ) : null}
              {message.text && <p>{message.text}</p>}
              <span className="text-xs opacity-70 block text-right mt-1">
                {message.timestamp && !isNaN(new Date(message.timestamp).getTime())
                  ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : ''}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
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