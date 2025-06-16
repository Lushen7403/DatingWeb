import * as signalR from '@microsoft/signalr';

const API_URL = 'https://datingwebbe-jnmo.onrender.com/api/chat';
const HUB_URL = 'https://datingwebbe-jnmo.onrender.com/chatHub';

export class ChatService {
  private connection: signalR.HubConnection | null = null;
  private messageHandlers: ((message: any) => void)[] = [];
  private onlineStatusHandlers: ((userId: number, isOnline: boolean) => void)[] = [];
  private messagesReadHandlers: ((conversationId: number, userId: number) => void)[] = [];

  constructor() {
    this.initializeConnection();
  }

  private initializeConnection() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No access token found');
      return;
    }

    this.connection = new signalR.HubConnectionBuilder()
    .withUrl(HUB_URL, {
        accessTokenFactory: () => localStorage.getItem('token') || '',
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .build();

    this.connection.on('ReceiveMessage', (message) => {
      console.log('Received message:', message);
      this.messageHandlers.forEach(handler => handler(message));
    });

    this.connection.on('OnlineStatus', (userId: number, isOnline: boolean) => {
      console.log('Received online status:', userId, isOnline);
      this.onlineStatusHandlers.forEach(handler => handler(userId, isOnline));
    });

    this.connection.on('MessagesRead', (conversationId: number, userId: number) => {
      console.log('Messages read:', conversationId, userId);
      this.messagesReadHandlers.forEach(handler => handler(conversationId, userId));
    });

    this.startConnection();
  }

  private async startConnection() {
    try {
      if (this.connection?.state === signalR.HubConnectionState.Connected) {
        console.log('Already connected to SignalR');
        return;
      }
      await this.connection?.start();
      console.log('SignalR Connected.');
    } catch (err) {
      console.error('SignalR Connection Error: ', err);
      setTimeout(() => this.startConnection(), 5000);
    }
  }

  public onMessage(handler: (message: any) => void) {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    };
  }

  public onOnlineStatus(handler: (userId: number, isOnline: boolean) => void) {
    this.onlineStatusHandlers.push(handler);
    return () => {
      this.onlineStatusHandlers = this.onlineStatusHandlers.filter(h => h !== handler);
    };
  }

  public onMessagesRead(handler: (conversationId: number, userId: number) => void) {
    this.messagesReadHandlers.push(handler);
    return () => {
      this.messagesReadHandlers = this.messagesReadHandlers.filter(h => h !== handler);
    };
  }

  public async joinConversation(conversationId: number) {
    try {
      console.log('Joining conversation:', conversationId);
      if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
        console.error('SignalR not connected');
        return;
      }
      await this.connection.invoke('JoinConversation', Number(conversationId));
      console.log('Successfully joined conversation:', conversationId);
    } catch (err) {
      console.error('Error joining conversation:', err);
      throw err;
    }
  }

  public async leaveConversation(conversationId: number) {
    try {
      await this.connection?.invoke('LeaveConversation', conversationId);
    } catch (err) {
      console.error('Error leaving conversation:', err);
    }
  }

  public async sendMessage(
  conversationId: number,
  senderId: number,
  messageText: string,
  mediaUrls: string[] = [],
  mediaTypes: string[] = []
): Promise<number> {
  try {
    console.log('Sending message:', { conversationId, senderId, messageText, mediaUrls, mediaTypes });
    if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
      console.error('SignalR not connected');
      throw new Error('SignalR not connected');
    }
    // Giả sử hub được sửa để trả về messageId
    const messageId = await this.connection.invoke<number>('SendMessage', 
      conversationId,
      senderId,
      messageText,
      mediaUrls,
      mediaTypes
    );
    console.log('Message sent successfully, id:', messageId);
    return messageId;
  } catch (err) {
    console.error('Error sending message:', err);
    throw err;
  }
}

  public async checkOnline(userId: number) {
    try {
      console.log('Checking online status for user:', userId);
      if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
        console.error('SignalR not connected');
        return;
      }
      await this.connection.invoke('CheckOnline', Number(userId));
      console.log('Successfully checked online status for user:', userId);
    } catch (err) {
      console.error('Error checking online status:', err);
      throw err;
    }
  }
}

// Create a single instance of ChatService
const chatService = new ChatService();

// Export the instance and other functions
export { chatService };

// API calls
export const getMessages = async (conversationId: number, page: number = 1, pageSize: number = 50) => {
  try {
    const response = await fetch(`${API_URL}/messages/${conversationId}?page=${page}&pageSize=${pageSize}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch messages');
    return await response.json();
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
};

export const uploadMedia = async (file: File, messageId: number) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/Upload?messageId=${messageId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });

    if (!response.ok) throw new Error('Failed to upload file');
    const result = await response.json();
  return result.mediaUrl as string;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};
