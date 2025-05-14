export interface Message {
  id: string;
  text: string;
  timestamp: string;
  isMe: boolean;
  media?: Array<{
    url: string;
    type: string;
  }>;
}
