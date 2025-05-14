import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MessagesView from '@/components/MessagesView';
import ChatBox from '@/components/ChatBox';
import { Conversation } from '@/types/Conversation';
import { Message } from '@/types/Message';
import { getConversations, getMessages } from '@/lib/chatApi';


const MessagesPage = () => {
  const { id } = useParams<{ id: string }>();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const userId = localStorage.getItem('accountId');
        if (!userId) return;
        const data = await getConversations(Number(userId));
        setConversations(
          data.map((item: any) => ({
            id: item.id,
            otherUserId: item.otherUserId,
            name: item.otherUserName,
            avatar: item.otherUserAvatar,
            isOnline: false,
            lastMessage: item.lastMessage || '',
            lastMessageAt: item.lastMessageAt || undefined
          }))
        );
      } catch (e) {
        // Xử lý lỗi nếu cần
      }
    };
    fetchConversations();
  }, []);

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
