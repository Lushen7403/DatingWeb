import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import axios from 'axios';

const API_URL = "http://localhost:5291/api/AdminPackage";
const ITEMS_PER_PAGE = 10;

interface Package {
  id: number;
  price: number;
  diamondCount: number;
  description: string;
  isActivate: boolean;
}

const AdminPackages = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editPackage, setEditPackage] = useState<Package | null>(null);
  const [form, setForm] = useState({ price: '', diamondCount: '', description: '', isActivate: true });

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchPackages = async (page = 1) => {
    try {
      setIsLoading(true);
      const headers = getAuthHeader();
      const response = await axios.get(API_URL, {
        headers,
        params: { page, pageSize: ITEMS_PER_PAGE }
      });
      setPackages(response.data.packages);
      setTotalPages(response.data.totalPages);
    } catch (error: any) {
      toast('Lỗi: Không thể tải danh sách gói nạp');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!form.price || !form.diamondCount) {
      toast('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    try {
      const headers = getAuthHeader();
      await axios.post(API_URL, {
        price: Number(form.price),
        diamondCount: Number(form.diamondCount),
        description: form.description,
        isActivate: form.isActivate
      }, { headers });
      toast('Đã thêm gói nạp mới');
      setIsCreateOpen(false);
      setForm({ price: '', diamondCount: '', description: '', isActivate: true });
      fetchPackages(currentPage);
    } catch (error: any) {
      toast('Lỗi: Không thể thêm gói nạp');
    }
  };

  const handleEdit = async () => {
    if (!editPackage) return;
    try {
      const headers = getAuthHeader();
      await axios.put(`${API_URL}/${editPackage.id}`, {
        price: Number(form.price),
        diamondCount: Number(form.diamondCount),
        description: form.description,
        isActivate: form.isActivate
      }, { headers });
      toast('Đã cập nhật gói nạp');
      setIsEditOpen(false);
      setEditPackage(null);
      setForm({ price: '', diamondCount: '', description: '', isActivate: true });
      fetchPackages(currentPage);
    } catch (error: any) {
      toast('Lỗi: Không thể cập nhật gói nạp');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const headers = getAuthHeader();
      await axios.delete(`${API_URL}/${deleteId}`, { headers });
      toast('Đã xóa gói nạp');
      setDeleteId(null);
      fetchPackages(currentPage);
    } catch (error: any) {
      toast('Lỗi: Không thể xóa gói nạp');
    }
  };

  useEffect(() => {
    fetchPackages(currentPage);
    // eslint-disable-next-line
  }, [currentPage]);

  const openEditDialog = (pkg: Package) => {
    setEditPackage(pkg);
    setForm({
      price: pkg.price.toString(),
      diamondCount: pkg.diamondCount.toString(),
      description: pkg.description,
      isActivate: pkg.isActivate
    });
    setIsEditOpen(true);
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold">Quản lý gói nạp</h1>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Thêm gói nạp
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm gói nạp mới</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Giá (VNĐ):</label>
                  <Input
                    type="number"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    placeholder="Nhập giá"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Số kim cương:</label>
                  <Input
                    type="number"
                    value={form.diamondCount}
                    onChange={e => setForm({ ...form, diamondCount: e.target.value })}
                    placeholder="Nhập số kim cương"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Mô tả:</label>
                  <Input
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="Nhập mô tả"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Kích hoạt:</label>
                  <Switch
                    checked={form.isActivate}
                    onCheckedChange={checked => setForm({ ...form, isActivate: checked })}
                  />
                </div>
                <Button onClick={handleCreate} className="w-full">
                  Thêm
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Giá (VNĐ)</TableHead>
                <TableHead>Số kim cương</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Kích hoạt</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {packages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Không có gói nạp nào
                  </TableCell>
                </TableRow>
              ) : (
                packages.map((pkg) => (
                  <TableRow key={pkg.id}>
                    <TableCell>{pkg.id}</TableCell>
                    <TableCell>{pkg.price.toLocaleString('vi-VN')}</TableCell>
                    <TableCell>{pkg.diamondCount}</TableCell>
                    <TableCell>{pkg.description}</TableCell>
                    <TableCell>
                      <Switch checked={pkg.isActivate} disabled />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(pkg)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Sửa
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setDeleteId(pkg.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Xóa
                        </Button>
                      </div>
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
        {/* Dialog sửa */}
        <Dialog open={isEditOpen} onOpenChange={open => { setIsEditOpen(open); if (!open) setEditPackage(null); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Sửa gói nạp</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Giá (VNĐ):</label>
                <Input
                  type="number"
                  value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })}
                  placeholder="Nhập giá"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Số kim cương:</label>
                <Input
                  type="number"
                  value={form.diamondCount}
                  onChange={e => setForm({ ...form, diamondCount: e.target.value })}
                  placeholder="Nhập số kim cương"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Mô tả:</label>
                <Input
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Nhập mô tả"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Kích hoạt:</label>
                <Switch
                  checked={form.isActivate}
                  onCheckedChange={checked => setForm({ ...form, isActivate: checked })}
                />
              </div>
              <Button onClick={handleEdit} className="w-full">
                Lưu
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        {/* Dialog xác nhận xóa */}
        <Dialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xác nhận xóa gói nạp</DialogTitle>
            </DialogHeader>
            <div className="mb-4">Bạn có chắc chắn muốn xóa gói nạp này?</div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteId(null)}>
                Hủy
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Xóa
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminPackages; 