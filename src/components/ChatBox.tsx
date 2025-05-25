import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Image, Video, X, MoreVertical } from 'lucide-react';
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
  const videoInputRef = useRef<HTMLInputElement>(null);
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

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col"
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
          .map((message, index) => (
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

      {/* Media Preview Area */}
      {mediaPreview && (
        <div className="p-4 border-t border-b bg-gray-50">
          <div className="relative w-fit mx-auto">
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 rounded-full p-1 h-8 w-8"
              onClick={cancelMediaPreview}
            >
              <X size={16} className="text-white" />
            </Button>
            
            {mediaPreview.type === 'image' ? (
              <img 
                src={mediaPreview.previewUrl} 
                alt="Preview" 
                className="max-h-48 rounded-lg mx-auto object-contain"
              />
            ) : (
              <video 
                src={mediaPreview.previewUrl} 
                className="max-h-48 rounded-lg mx-auto object-contain" 
                controls
              />
            )}
          </div>
        </div>
      )}

      {/* Input area */}
      {isBlocked ? (
        <div className="p-4 border-t bg-muted/50">
          <p className="text-center text-sm text-muted-foreground">
            Hiện tại không thể liên lạc với người dùng này
          </p>
        </div>
      ) : (
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
              disabled={!text.trim() && !mediaPreview}
            >
              <Send size={18} />
            </Button>
          </div>
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