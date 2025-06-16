import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const API_URL = "https://datingwebbe-jnmo.onrender.com/api/AdminMessage";

interface ToxicMessage {
  id: number;
  messageText: string;
  toxicLevel: string;
  sentAt: string;
}

interface ToxicUser {
  userName: string;
  totalToxicMessages: number;
  latestToxicMessageTime: string;
  messages: ToxicMessage[];
}

const AdminToxicMessages = () => {
  const [users, setUsers] = useState<ToxicUser[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<ToxicUser | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const itemsPerPage = 10;

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const handleAuthError = (error: any) => {
    console.error('Auth error details:', error.response?.data);
    
    if (error.response?.status === 401) {
      toast({
        title: 'Phiên đăng nhập hết hạn',
        description: 'Vui lòng đăng nhập lại',
        variant: 'destructive'
      });
    }
  };

  const fetchToxicMessages = async () => {
    try {
      setIsLoading(true);
      const headers = getAuthHeader();

      const response = await axios.get(`${API_URL}/toxic-messages`, {
        params: {
          page: currentPage,
          pageSize: itemsPerPage
        },
        headers
      });
      
      setUsers(response.data || []);
    } catch (error: any) {
      console.error('Error fetching toxic messages:', error);
      handleAuthError(error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách tin nhắn độc hại',
        variant: 'destructive'
      });
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchToxicMessages();
  }, [currentPage]);

  const getToxicLevelBadge = (level: string) => {
    const variants = {
      'MILD': 'default',
      'MODERATE': 'secondary',
      'SEVERE': 'destructive'
    } as const;

    return (
      <Badge variant={variants[level as keyof typeof variants] || 'default'}>
        {level}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 lg:ml-64 p-4 lg:p-6 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 lg:ml-64 p-4 lg:p-6">
        <h1 className="text-2xl lg:text-3xl font-bold mb-6">Quản lý tin nhắn độc hại</h1>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[120px]">Tên đăng nhập</TableHead>
                  <TableHead className="min-w-[120px]">Số tin nhắn độc hại</TableHead>
                  <TableHead className="min-w-[180px]">Tin nhắn mới nhất</TableHead>
                  <TableHead className="min-w-[100px]">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      Không có tin nhắn độc hại nào
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.userName}>
                      <TableCell className="font-medium">{user.userName}</TableCell>
                      <TableCell>{user.totalToxicMessages}</TableCell>
                      <TableCell>{new Date(user.latestToxicMessageTime).toLocaleString('vi-VN')}</TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedUser(user);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Xem chi tiết
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Chi tiết tin nhắn độc hại</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              {selectedUser && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <span className="font-semibold">Tên đăng nhập: {selectedUser.userName}</span>
                  </div>
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nội dung</TableHead>
                          <TableHead>Mức độ</TableHead>
                          <TableHead>Thời gian</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedUser.messages.map((message) => (
                          <TableRow key={message.id}>
                            <TableCell className="max-w-md truncate">{message.messageText}</TableCell>
                            <TableCell>{getToxicLevelBadge(message.toxicLevel)}</TableCell>
                            <TableCell>{new Date(message.sentAt).toLocaleString('vi-VN')}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminToxicMessages; 