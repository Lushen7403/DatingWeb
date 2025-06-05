import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Image, X, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Message } from '@/types/Message';
import { chatService, getMessages, uploadMedia } from '@/lib/chatService';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { isEitherBlocked, blockUser, unblockUser } from '@/lib/blockApi';
import { authService } from '@/lib/authService';

interface ChatBoxProps {
  conversationId: number;
  matchName: string;
  matchAvatar: string;
  matchId: number;
  isOnline?: boolean;
  otherUserId: number;
  otherUserName: string;
  onBack: () => void;
}

interface MediaPreview {
  file: File;
  type: string;
  previewUrl: string;
}

const ChatBox = ({ 
  conversationId, 
  matchName, 
  matchAvatar,
  matchId,
  isOnline = false,
  otherUserId,
  otherUserName,
  onBack
}: ChatBoxProps) => {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isUserOnline, setIsUserOnline] = useState(isOnline);
  const [isLoadingMoreState, setIsLoadingMoreState] = useState(false);
  const [mediaPreview, setMediaPreview] = useState<MediaPreview | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [showUnblockDialog, setShowUnblockDialog] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);
  const pageSize = 50;
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevScrollHeight = useRef(0);
  const isLoadingMore = useRef(false);
  const shouldScrollToBottom = useRef(true);

  const fetchMessages = async (pageToLoad = 1) => {
    if (!conversationId) return;
    const msgs = await getMessages(conversationId, pageToLoad, pageSize);
    const accountId = authService.getAccountId();
    const mapped = msgs
      .filter(Boolean)
      .map((msg: any) => ({
        id: msg.id.toString(),
        text: msg.messageText,
        timestamp: msg.sentAt,
        isMe: msg.senderId === accountId,
        media: (msg.media || []).map((m: any) => ({
          url: m.mediaUrl,
          type: m.mediaType
        }))
      }));
    const ordered = mapped.reverse();
    if (pageToLoad === 1) {
      setMessages(ordered);
    } else {
      setMessages(prev => [...ordered, ...prev]);
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

    const accountId = authService.getAccountId();
    const unsubscribeMessage = chatService.onMessage((message) => {
      console.log('Received message:', message);
      if (message.conversationId === conversationId) {
        setMessages(prev => [...prev, {
          id: message.id.toString(),
          text: message.messageText,
          timestamp: message.sentAt,
          isMe: message.senderId === accountId,
          media: message.media || []
        }]);
      }
    });

    const unsubscribeOnline = chatService.onOnlineStatus((userId, online) => {
      console.log('Online status changed:', userId, online);
      if (userId === matchId) {
        setIsUserOnline(online);
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
    const container = containerRef.current;
    if (!container) return;
    
    const handleScroll = () => {
      if (!container) return;
      const isNearBottom = 
        container.scrollHeight - container.scrollTop - container.clientHeight < 100;
      shouldScrollToBottom.current = isNearBottom;
    };
    
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isLoadingMore.current && messagesEndRef.current && shouldScrollToBottom.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    return () => {
      if (mediaPreview?.previewUrl) {
        URL.revokeObjectURL(mediaPreview.previewUrl);
      }
    };
  }, [mediaPreview]);

  useEffect(() => {
    const accountId = authService.getAccountId();
    if (!accountId) return;

    const checkBlockStatus = async () => {
      try {
        const blocked = await isEitherBlocked(accountId, matchId);
        setIsBlocked(blocked);
      } catch (error) {
        console.error('Error checking block status:', error);
      }
    };

    checkBlockStatus();
  }, [matchId]);

  const loadMore = async () => {
    if (!hasMore || !containerRef.current || isLoadingMore.current) return;
    
    isLoadingMore.current = true;
    setIsLoadingMoreState(true);
    
    const container = containerRef.current;
    const scrollPos = container.scrollTop;
    prevScrollHeight.current = container.scrollHeight;
    
    const nextPage = page + 1;
    await fetchMessages(nextPage);
    setPage(nextPage);

    requestAnimationFrame(() => {
      if (containerRef.current) {
        const newHeight = containerRef.current.scrollHeight;
        containerRef.current.scrollTop = newHeight - prevScrollHeight.current + scrollPos;
      }
      isLoadingMore.current = false;
      setIsLoadingMoreState(false);
    });
  };

  const handleSend = async () => {
    try {
      const accountId = authService.getAccountId();
      if (!accountId) return;
      
      // If there's media to send
      if (mediaPreview) {
        const messageId = await chatService.sendMessage(
          conversationId,
          accountId,
          text.trim(),
          [],
          []
        );
        await uploadMedia(mediaPreview.file, messageId);
        setMediaPreview(null);
      } 
      // If there's only text to send
      else if (text.trim()) {
        console.log('Sending message:', { conversationId, accountId, text: text.trim() });
        await chatService.sendMessage(
          conversationId,
          accountId,
          text.trim(),
          [],
          []
        );
      } else {
        // Nothing to send
        return;
      }
      
      setText('');
      shouldScrollToBottom.current = true;
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && (text.trim() || mediaPreview)) {
      handleSend();
    }
  };

  const handleImageUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      try {
        const file = files[0];
        const fileType = file.type.startsWith('image/') ? 'image' : 'video';
        
        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        
        // Set media preview instead of directly uploading
        setMediaPreview({
          file,
          type: fileType,
          previewUrl
        });
        
        // Reset file input
        event.target.value = '';
      } catch (error) {
        console.error('Error preparing file:', error);
      }
    }
  };

  const cancelMediaPreview = () => {
    if (mediaPreview?.previewUrl) {
      URL.revokeObjectURL(mediaPreview.previewUrl);
    }
    setMediaPreview(null);
  };

  const handleBlock = async () => {
    const accountId = authService.getAccountId();
    if (!accountId || !matchId) {
      toast.error('Không thể thực hiện thao tác này');
      return;
    }
    setIsBlocking(true);
    try {
      await blockUser(accountId, matchId);
      setIsBlocked(true);
      toast.success('Đã chặn người dùng này');
    } catch (error) {
      toast.error('Không thể chặn người dùng');
    } finally {
      setIsBlocking(false);
      setShowBlockDialog(false);
    }
  };

  const handleUnblock = async () => {
    const accountId = authService.getAccountId();
    if (!accountId || !matchId) {
      toast.error('Không thể thực hiện thao tác này');
      return;
    }
    setIsBlocking(true);
    try {
      await unblockUser(accountId, matchId);
      setIsBlocked(false);
      toast.success('Đã bỏ chặn người dùng này');
    } catch (error) {
      toast.error('Không thể bỏ chặn người dùng');
    } finally {
      setIsBlocking(false);
      setShowUnblockDialog(false);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 relative">
      {/* Header cố định trên cùng */}
      <div className="fixed top-0 left-0 right-0 z-40">
        <div className="matchup-header bg-white/80 backdrop-blur border-b border-border shadow-md flex items-center justify-between w-full px-4 py-1 min-h-[56px]">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/messages">
              <ArrowLeft size={22} />
            </Link>
          </Button>
          <div className="flex items-center flex-1 justify-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-pink-300 shadow-md">
              <img
                src={matchAvatar || 'https://via.placeholder.com/100?text=User'}
                alt={matchName}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-bold text-base bg-gradient-to-r from-matchup-purple to-matchup-pink bg-clip-text text-transparent mr-2">{matchName}</span>
            {isUserOnline && (
              <span className="text-xs text-green-500 animate-pulse ml-1">●</span>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isBlocked ? (
                <DropdownMenuItem 
                  onClick={() => {
                    if (!matchId) {
                      toast.error('Không thể thực hiện thao tác này');
                      return;
                    }
                    setShowUnblockDialog(true);
                  }}
                  className="text-green-600"
                >
                  Bỏ chặn
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem 
                  onClick={() => {
                    if (!matchId) {
                      toast.error('Không thể thực hiện thao tác này');
                      return;
                    }
                    setShowBlockDialog(true);
                  }}
                  className="text-red-600"
                >
                  Chặn
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-r from-purple-300 to-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-300 to-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
        {/* Floating hearts: xanh, tím */}
        <div className="floating-hearts">
          {[...Array(20)].map((_, i) => {
            const colors = [
              'from-blue-400 to-purple-400',
              'from-purple-400 to-blue-400',
              'from-blue-400 to-cyan-400',
              'from-cyan-400 to-blue-400',
              'from-indigo-400 to-blue-400',
              'from-purple-400 to-indigo-400'
            ];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            return (
              <div
                key={i}
                className={`heart bg-gradient-to-r ${randomColor}`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 3}s`,
                  transform: `scale(${Math.random() * 0.4 + 0.4}) rotate(${Math.random() * 360}deg)`,
                  filter: 'drop-shadow(0 0 8px rgba(120, 120, 255, 0.5))',
                  opacity: Math.random() * 0.3 + 0.4
                }}
              />
            );
          })}
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-2 pb-2 pt-[100px] space-y-3 flex flex-col relative z-10 bg-transparent"
      >
        <div className="mt-auto" />
        {hasMore && (
          <div className="text-center mb-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={loadMore}
              disabled={isLoadingMoreState}
            >
              {isLoadingMoreState ? 'Đang tải...' : 'Xem tin nhắn cũ hơn'}
            </Button>
          </div>
        )}
        {messages
          .filter(m => m.text.trim() !== '' || (m.media && m.media.length > 0))
          .map((message, index, arr) => {
            // Xác định có phải là tin nhắn đầu cụm của đối phương không
            const isFirstOfGroup =
              !message.isMe &&
              (index === 0 || arr[index - 1].isMe);
            return (
              <div
                key={index}
                className={`flex items-end gap-2 ${message.isMe ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                {/* Avatar nhỏ đầu cụm tin nhắn đối phương */}
                {!message.isMe && isFirstOfGroup ? (
                  <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-purple-200 shadow mr-1 flex-shrink-0">
                    <img
                      src={matchAvatar || 'https://via.placeholder.com/100?text=User'}
                      alt={matchName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (!message.isMe ? <div className="w-8 h-8 mr-1" /> : null)}
                <div
                  className={`relative max-w-[70%] px-4 py-3 rounded-2xl shadow-2xl transition-all duration-300 group
                    ${message.isMe
                      ? 'bg-gradient-to-br from-matchup-purple to-pink-400 text-white rounded-br-2xl rounded-tr-none border-2 border-pink-200 backdrop-blur-[2px] hover:shadow-pink-300/40 hover:shadow-2xl'
                      : 'bg-white/60 text-gray-900 rounded-bl-2xl rounded-tl-none border-2 border-purple-100 backdrop-blur-[2px] hover:shadow-purple-200/40 hover:shadow-2xl'}
                  hover:scale-[1.03]`}
                  style={{boxShadow: '0 4px 32px 0 rgba(120, 80, 200, 0.10), 0 1.5px 8px 0 rgba(180, 120, 255, 0.08)'}}
                >
                  {/* Tail hiệu ứng */}
                  {message.isMe ? (
                    <span className="absolute right-[-10px] bottom-2 w-3 h-3 bg-gradient-to-br from-matchup-purple to-pink-400 rounded-br-2xl rotate-45 shadow-md"></span>
                  ) : (
                    <span className="absolute left-[-10px] bottom-2 w-3 h-3 bg-white/60 border-l-2 border-b-2 border-purple-100 rounded-bl-2xl rotate-45 shadow-md"></span>
                  )}
                  {message.media && message.media.length > 0 ? (
                    message.media.map((media, idx) => (
                      <div key={idx} className="mb-2">
                        {media.type === 'image' ? (
                          <img src={media.url} alt="Media" className="max-w-full rounded-2xl shadow-lg transition-transform duration-200 hover:scale-105" />
                        ) : (
                          <video src={media.url} controls className="max-w-full rounded-2xl shadow-lg transition-transform duration-200 hover:scale-105" />
                        )}
                      </div>
                    ))
                  ) : null}
                  {message.text && <p className="leading-relaxed text-base break-words whitespace-pre-line">{message.text}</p>}
                  <span className="text-xs opacity-70 block text-right mt-1 font-mono select-none">
                    {message.timestamp && !isNaN(new Date(message.timestamp).getTime())
                      ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : ''}
                  </span>
                </div>
                {/* Avatar ảo cho tin nhắn của mình để giữ layout đều */}
                {message.isMe && <div className="w-8 h-8" />}
              </div>
            );
          })}
        <div ref={messagesEndRef} />
      </div>

      {/* Media Preview Area */}
      {mediaPreview && (
        <div className="p-4 border-t border-b bg-gradient-to-r from-purple-50 to-pink-50 relative z-10">
          <div className="relative w-fit mx-auto group">
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute -top-2 -right-2 bg-black/60 hover:bg-black/80 rounded-full p-1 h-8 w-8 transition-all duration-300 hover:scale-110 z-50 shadow-lg"
              onClick={cancelMediaPreview}
            >
              <X size={16} className="text-white" />
            </Button>
            
            {mediaPreview.type === 'image' ? (
              <img 
                src={mediaPreview.previewUrl} 
                alt="Preview" 
                className="max-h-64 rounded-xl mx-auto object-contain shadow-lg border-4 border-white transform transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl relative"
              />
            ) : (
              <video 
                src={mediaPreview.previewUrl} 
                className="max-h-64 rounded-xl mx-auto object-contain shadow-lg border-4 border-white transform transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl relative" 
                controls
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl pointer-events-none z-10"></div>
          </div>
        </div>
      )}

      {/* Input area */}
      {isBlocked ? (
        <div className="p-4 border-t bg-muted/50 relative z-10">
          <p className="text-center text-sm text-muted-foreground">
            Hiện tại không thể liên lạc với người dùng này
          </p>
        </div>
      ) : (
        <div className="p-4 border-t bg-white/80 backdrop-blur flex items-center gap-2 relative z-10">
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
          
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhắn tin..."
            className="matchup-input flex-1 rounded-full bg-white/90 border border-purple-100 px-5 py-3 shadow-sm focus:ring-2 focus:ring-matchup-purple"
          />
          <Button
            onClick={handleSend}
            className="h-12 w-12 rounded-full p-0 bg-gradient-to-br from-matchup-purple to-pink-400 text-white shadow hover:from-pink-400 hover:to-matchup-purple transition-all duration-300 flex items-center justify-center"
            disabled={!text.trim() && !mediaPreview}
          >
            <Send size={18} />
          </Button>
        </div>
      )}

      {/* Block Confirmation Dialog */}
      <AlertDialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận chặn</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn chặn người dùng này? Sau khi chặn, bạn sẽ không thể nhắn tin với họ.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isBlocking}>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleBlock}
              disabled={isBlocking}
              className="bg-red-600 hover:bg-red-700"
            >
              {isBlocking ? 'Đang xử lý...' : 'Chặn'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Unblock Confirmation Dialog */}
      <AlertDialog open={showUnblockDialog} onOpenChange={setShowUnblockDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận bỏ chặn</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn bỏ chặn người dùng này? Sau khi bỏ chặn, bạn có thể nhắn tin với họ.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isBlocking}>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleUnblock}
              disabled={isBlocking}
              className="bg-green-600 hover:bg-green-700"
            >
              {isBlocking ? 'Đang xử lý...' : 'Bỏ chặn'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ChatBox;