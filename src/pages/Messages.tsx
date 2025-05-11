import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MessagesView from '@/components/MessagesView';
import ChatBox from '@/components/ChatBox';
import { Match } from '@/types/Match';
import { Message } from '@/types/Message';

// Sample matches data
const dummyMatches: Match[] = [
  {
    id: '1',
    name: 'Thảo',
    avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    isOnline: true,
    lastMessage: {
      id: 'm1',
      text: 'Hẹn gặp lại nhé!',
      timestamp: '2023-05-01T15:30:00',
      isMe: false
    }
  },
  {
    id: '2',
    name: 'Minh',
    avatar: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80',
    isOnline: false,
    lastMessage: {
      id: 'm2',
      text: 'Ok, mai mình nói chuyện tiếp nhé',
      timestamp: '2023-04-30T20:15:00',
      isMe: true
    }
  },
  {
    id: '3',
    name: 'Hà',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    isOnline: true
  }
];

// Sample messages data
const dummyMessages: Record<string, Message[]> = {
  '1': [
    {
      id: '1-1',
      text: 'Chào bạn, mình là Thảo!',
      timestamp: '2023-05-01T10:00:00',
      isMe: false
    },
    {
      id: '1-2',
      text: 'Chào Thảo, rất vui được gặp bạn!',
      timestamp: '2023-05-01T10:05:00',
      isMe: true
    },
    {
      id: '1-3',
      text: 'Bạn đang làm gì thế?',
      timestamp: '2023-05-01T10:10:00',
      isMe: false
    },
    {
      id: '1-4',
      text: 'Mình đang nghe nhạc thôi. Còn bạn?',
      timestamp: '2023-05-01T10:12:00',
      isMe: true
    },
    {
      id: '1-5',
      text: 'Mình đang chuẩn bị đi cafe với bạn bè. Bạn có muốn tham gia không?',
      timestamp: '2023-05-01T10:15:00',
      isMe: false
    },
    {
      id: '1-6',
      text: 'Bạn định đi đâu vậy?',
      timestamp: '2023-05-01T10:18:00',
      isMe: true
    },
    {
      id: '1-7',
      text: 'Mình định đi The Coffee House ở Nguyễn Huệ',
      timestamp: '2023-05-01T10:20:00',
      isMe: false
    },
    {
      id: '1-8',
      text: 'Nghe hay đấy, nhưng hôm nay mình có hẹn rồi. Để lần sau nhé!',
      timestamp: '2023-05-01T10:25:00',
      isMe: true
    },
    {
      id: '1-9',
      text: 'Ok, không sao! Lần sau vậy',
      timestamp: '2023-05-01T10:28:00',
      isMe: false
    },
    {
      id: '1-10',
      text: 'Hẹn gặp lại nhé!',
      timestamp: '2023-05-01T15:30:00',
      isMe: false
    }
  ],
  '2': [
    {
      id: '2-1',
      text: 'Hi, mình là Minh!',
      timestamp: '2023-04-29T14:00:00',
      isMe: false
    },
    {
      id: '2-2',
      text: 'Hi Minh, rất vui được gặp bạn!',
      timestamp: '2023-04-29T14:10:00',
      isMe: true
    },
    {
      id: '2-3',
      text: 'Bạn có thích đi xem phim không?',
      timestamp: '2023-04-29T14:20:00',
      isMe: false
    },
    {
      id: '2-4',
      text: 'Có chứ, mình thích xem phim lắm',
      timestamp: '2023-04-29T14:30:00',
      isMe: true
    },
    {
      id: '2-5',
      text: 'Thế cuối tuần này mình đi xem phim nhé?',
      timestamp: '2023-04-30T09:00:00',
      isMe: false
    },
    {
      id: '2-6',
      text: 'Được đấy! Mình đang muốn xem phim mới của Marvel',
      timestamp: '2023-04-30T09:30:00',
      isMe: true
    },
    {
      id: '2-7',
      text: 'Ok, vậy thứ 7 mình đi. Mình sẽ liên hệ với bạn sau',
      timestamp: '2023-04-30T10:00:00',
      isMe: false
    },
    {
      id: '2-8',
      text: 'Ok, mai mình nói chuyện tiếp nhé',
      timestamp: '2023-04-30T20:15:00',
      isMe: true
    }
  ],
  '3': []
};

const MessagesPage = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const [matches, setMatches] = useState<Match[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const navigate = useNavigate();

  useEffect(() => {
    // In a real app, we would fetch matches from an API
    setMatches(dummyMatches);
    setMessages(dummyMessages);
  }, []);

  const handleSendMessage = (matchId: string, text: string) => {
    const newMessage: Message = {
      id: `new-${Date.now()}`,
      text,
      timestamp: new Date().toISOString(),
      isMe: true
    };

    // Update messages
    setMessages(prev => ({
      ...prev,
      [matchId]: [...(prev[matchId] || []), newMessage]
    }));

    // Update last message in matches
    setMatches(prev => 
      prev.map(match => 
        match.id === matchId 
          ? { ...match, lastMessage: newMessage } 
          : match
      )
    );
  };

  // If a match ID is provided, show the chat box
  if (matchId) {
    const currentMatch = matches.find(match => match.id === matchId);
    const currentMessages = messages[matchId] || [];
    
    if (!currentMatch) {
      return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
    }
    
    return (
      <ChatBox
        matchId={matchId}
        matchName={currentMatch.name}
        matchAvatar={currentMatch.avatar || ''}
        isOnline={currentMatch.isOnline}
        messages={currentMessages}
        onSendMessage={(text) => handleSendMessage(matchId, text)}
      />
    );
  }

  // Otherwise show the matches list
  return <MessagesView matches={matches} />;
};

export default MessagesPage;
