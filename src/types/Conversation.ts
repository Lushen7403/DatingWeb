
import { Message } from './Message';

export interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  isOnline?: boolean;
  lastMessage?: Message;
}
