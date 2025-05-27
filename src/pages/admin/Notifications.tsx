import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';

const API_URL = "http://localhost:5291/api/AdminNotification";
const ITEMS_PER_PAGE = 10;

interface Notification {
  notificationId: number;
  userId: number;
  notificationTypeId: number;
  typeName: string;
  content: string;
  referenceId: number | null;
  createdAt: string;
}

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newNotification, setNewNotification] = useState({ content: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { toast } = useToast();

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchNotifications = async (page = 1) => {
    try {
      setIsLoading(true);
      const headers = getAuthHeader();
      const response = await axios.get(API_URL, {
        headers,
        params: { page, pageSize: ITEMS_PER_PAGE }
      });
      setNotifications(response.data.notifications);
      setTotalPages(response.data.totalPages);
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách thông báo',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNotification = async () => {
    const adminId = localStorage.getItem('accountId');
    if (!adminId || !newNotification.content) {
      toast({ title: 'Lỗi', description: 'Thiếu thông tin tài khoản hoặc nội dung', variant: 'destructive' });
      return;
    }
    try {
      const headers = getAuthHeader();
      await axios.post(API_URL, {
        userId: Number(adminId),
        content: newNotification.content
      }, { headers });
      toast({ title: 'Thành công', description: 'Đã tạo thông báo mới' });
      setIsCreateOpen(false);
      setNewNotification({ content: '' });
      fetchNotifications(currentPage);
    } catch (error: any) {
      toast({ title: 'Lỗi', description: 'Không thể tạo thông báo', variant: 'destructive' });
    }
  };

  const handleDeleteNotification = async () => {
    if (!deleteId) return;
    try {
      const headers = getAuthHeader();
      await axios.delete(`${API_URL}/${deleteId}`, { headers });
      toast({ title: 'Thành công', description: 'Đã xóa thông báo' });
      setDeleteId(null);
      fetchNotifications(currentPage);
    } catch (error: any) {
      toast({ title: 'Lỗi', description: 'Không thể xóa thông báo', variant: 'destructive' });
    }
  };

  useEffect(() => {
    fetchNotifications(currentPage);
    // eslint-disable-next-line
  }, [currentPage]);

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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold">Quản lý thông báo hệ thống</h1>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Tạo thông báo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tạo thông báo mới</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Nội dung thông báo:</label>
                  <Textarea
                    value={newNotification.content}
                    onChange={e => setNewNotification({ content: e.target.value })}
                    placeholder="Nhập nội dung thông báo..."
                    rows={4}
                  />
                </div>
                <Button onClick={handleCreateNotification} className="w-full">
                  Tạo thông báo
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>STT</TableHead>
                <TableHead>Nội dung</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    Không có thông báo nào
                  </TableCell>
                </TableRow>
              ) : (
                notifications.map((notification, idx) => (
                  <TableRow key={notification.notificationId}>
                    <TableCell>{(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}</TableCell>
                    <TableCell className="max-w-xs truncate">{notification.content}</TableCell>
                    <TableCell>{new Date(notification.createdAt).toLocaleString('vi-VN')}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeleteId(notification.notificationId)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Xóa
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center p-4 gap-2">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Trước
              </Button>
              <span className="mx-4">
                Trang {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Sau
              </Button>
            </div>
          )}
        </div>
        {/* Dialog xác nhận xóa */}
        <Dialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xác nhận xóa thông báo</DialogTitle>
            </DialogHeader>
            <div className="mb-4">Bạn có chắc chắn muốn xóa thông báo này?</div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteId(null)}>
                Hủy
              </Button>
              <Button variant="destructive" onClick={handleDeleteNotification}>
                Xóa
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminNotifications; 