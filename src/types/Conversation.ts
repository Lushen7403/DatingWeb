
import { Message } from './Message';

export interface Conversation {
  id: number;
  otherUserId: number;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastMessage: string;
  lastMessageAt?: string;
}
