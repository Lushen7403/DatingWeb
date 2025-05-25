import * as signalR from '@microsoft/signalr';

const HUB_URL = 'http://localhost:5291/notificationhub';

export class NotificationService {
  private connection: signalR.HubConnection | null = null;
  private notificationHandlers: ((notification: any) => void)[] = [];
  private markedAsReadHandlers: ((notificationId: number) => void)[] = [];

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

    this.connection.on('ReceiveNotification', (notification) => {
      console.log('Received notification:', notification);
      this.notificationHandlers.forEach(handler => handler(notification));
    });

    this.connection.on('NotificationMarked', (notificationId) => {
      console.log('Notification marked as read:', notificationId);
      this.markedAsReadHandlers.forEach(handler => handler(notificationId));
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

  public onNotification(handler: (notification: any) => void) {
    this.notificationHandlers.push(handler);
    return () => {
      this.notificationHandlers = this.notificationHandlers.filter(h => h !== handler);
    };
  }

  public onMarkedAsRead(handler: (notificationId: number) => void) {
    this.markedAsReadHandlers.push(handler);
    return () => {
      this.markedAsReadHandlers = this.markedAsReadHandlers.filter(h => h !== handler);
    };
  }

  public async markAsRead(notificationId: number) {
    try {
      if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
        console.error('SignalR not connected');
        return;
      }
      await this.connection.invoke('MarkAsRead', notificationId);
    } catch (err) {
      console.error('Error marking notification as read:', err);
      throw err;
    }
  }
}

// Create a single instance of NotificationService
const notificationService = new NotificationService();

export { notificationService }; 