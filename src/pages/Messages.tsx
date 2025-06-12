import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import MessagesView from '@/components/MessagesView';
import ChatBox from '@/components/ChatBox';
import { Conversation } from '@/types/Conversation';
import { Message } from '@/types/Message';
import { getConversations, getMessages } from '@/lib/chatApi';

const MessagesPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const navigate = useNavigate();

  const fetchConversations = useCallback(async () => {
    try {
      console.log('Fetching conversations...');
      const userId = localStorage.getItem('accountId');
      if (!userId) return;
      const data = await getConversations(Number(userId));
      console.log('Fetched conversations:', data);
      setConversations(
        data.map((item: any) => ({
          id: item.id,
          otherUserId: item.otherUserId,
          name: item.otherUserName,
          avatar: item.otherUserAvatar,
          isOnline: false,
          lastMessage: item.lastMessage || '',
          lastMessageAt: item.lastMessageAt || undefined,
          unreadCount: item.unreadCount || 0
        }))
      );
    } catch (e) {
      console.error('Error fetching conversations:', e);
    }
  }, []);

  // Load conversations initially and set up periodic refresh
  useEffect(() => {
    // Initial fetch
    fetchConversations();

    // Set up interval for periodic refresh
    const intervalId = setInterval(() => {
      fetchConversations();
    }, 5000); // 5 seconds

    return () => clearInterval(intervalId);
  }, [fetchConversations]);

  // Refresh when returning from ChatBox
  useEffect(() => {
    if (!id) {
      console.log('Returning from ChatBox, refreshing conversations...');
      fetchConversations();
    }
  }, [id, fetchConversations]);

  useEffect(() => {
    // Khi có id (chính là conversationId), gọi API lấy tin nhắn
    const fetchMsgs = async () => {
      if (!id) return;
      setLoadingMessages(true);
      try {
        const msgs = await getMessages(Number(id));
        setMessages(
          msgs.map((msg: any) => ({
            id: msg.Id.toString(),
            text: msg.MessageText,
            timestamp: msg.SentAt,
            isMe: msg.SenderId === Number(localStorage.getItem('accountId'))
          }))
        );
      } catch {
        setMessages([]);
      } finally {
        setLoadingMessages(false);
      }
    };
    if (id) fetchMsgs();
  }, [id]);

  const handleSendMessage = (conversationId: string, text: string) => {
    const newMessage: Message = {
      id: `new-${Date.now()}`,
      text,
      timestamp: new Date().toISOString(),
      isMe: true
    };

    setMessages(prev => ([...prev, newMessage]));
    // Có thể gọi API gửi tin nhắn ở đây nếu cần
  };

  if (id) {
    const currentConversation = conversations.find(conv => conv.id.toString() === id);
    if (!currentConversation) {
      return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
    }
    return (
      <ChatBox
        conversationId={Number(id)}
        matchName={currentConversation.name}
        matchAvatar={currentConversation.avatar || ''}
        isOnline={currentConversation.isOnline}
        matchId={currentConversation.otherUserId}
      />
    );
  }

  // Otherwise show the conversations list
  return <MessagesView conversations={conversations} />;
};

export default MessagesPage;
