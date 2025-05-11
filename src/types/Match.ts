
import { Message } from './Message';

export interface Match {
  id: string;
  name: string;
  avatar?: string;
  isOnline?: boolean;
  lastMessage?: Message;
}
