import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const API_URL = "http://localhost:5291/api/AdminVoucher";
const ITEMS_PER_PAGE = 10;

interface Voucher {
  id: number;
  code: string;
  description: string;
  discountPercent: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

const AdminDiscountCodes = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editVoucher, setEditVoucher] = useState<Voucher | null>(null);
  const [form, setForm] = useState({
    code: '',
    description: '',
    discountPercent: '',
    startDate: '',
    endDate: '',
    isActive: true
  });

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchVouchers = async (page = 1) => {
    try {
      setIsLoading(true);
      const headers = getAuthHeader();
      const response = await axios.get(API_URL, {
        headers,
        params: { page, pageSize: ITEMS_PER_PAGE }
      });
      setVouchers(response.data.vouchers);
      setTotalPages(response.data.totalPages);
    } catch (error: any) {
      toast('Lỗi: Không thể tải danh sách voucher');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!form.code || !form.discountPercent || !form.startDate || !form.endDate) {
      toast('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    if (new Date(form.startDate) >= new Date(form.endDate)) {
      toast('Ngày bắt đầu phải trước ngày kết thúc');
      return;
    }
    try {
      const headers = getAuthHeader();
      await axios.post(API_URL, {
        code: form.code.trim(),
        description: form.description,
        discountPercent: Number(form.discountPercent),
        startDate: form.startDate,
        endDate: form.endDate,
        isActive: form.isActive
      }, { headers });
      toast('Đã thêm voucher mới');
      setIsCreateOpen(false);
      setForm({ code: '', description: '', discountPercent: '', startDate: '', endDate: '', isActive: true });
      fetchVouchers(currentPage);
    } catch (error: any) {
      toast('Lỗi: Không thể thêm voucher');
    }
  };

  const handleEdit = async () => {
    if (!editVoucher) return;
    if (!form.code || !form.discountPercent || !form.startDate || !form.endDate) {
      toast('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    if (new Date(form.startDate) >= new Date(form.endDate)) {
      toast('Ngày bắt đầu phải trước ngày kết thúc');
      return;
    }
    try {
      const headers = getAuthHeader();
      await axios.put(`${API_URL}/${editVoucher.id}`, {
        code: form.code.trim(),
        description: form.description,
        discountPercent: Number(form.discountPercent),
        startDate: form.startDate,
        endDate: form.endDate,
        isActive: form.isActive
      }, { headers });
      toast('Đã cập nhật voucher');
      setIsEditOpen(false);
      setEditVoucher(null);
      setForm({ code: '', description: '', discountPercent: '', startDate: '', endDate: '', isActive: true });
      fetchVouchers(currentPage);
    } catch (error: any) {
      toast('Lỗi: Không thể cập nhật voucher');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const headers = getAuthHeader();
      await axios.delete(`${API_URL}/${deleteId}`, { headers });
      toast('Đã xóa voucher');
      setDeleteId(null);
      fetchVouchers(currentPage);
    } catch (error: any) {
      toast('Lỗi: Không thể xóa voucher');
    }
  };

  useEffect(() => {
    fetchVouchers(currentPage);
    // eslint-disable-next-line
  }, [currentPage]);

  const openEditDialog = (voucher: Voucher) => {
    setEditVoucher(voucher);
    setForm({
      code: voucher.code,
      description: voucher.description,
      discountPercent: voucher.discountPercent.toString(),
      startDate: voucher.startDate.slice(0, 10),
      endDate: voucher.endDate.slice(0, 10),
      isActive: voucher.isActive
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
          <h1 className="text-2xl lg:text-3xl font-bold">Quản lý voucher</h1>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Thêm voucher
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm voucher mới</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Mã voucher:</label>
                  <Input
                    value={form.code}
                    onChange={e => setForm({ ...form, code: e.target.value })}
                    placeholder="Nhập mã voucher"
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
                <div>
                  <label className="text-sm font-medium">% Giảm giá:</label>
                  <Input
                    type="number"
                    value={form.discountPercent}
                    onChange={e => setForm({ ...form, discountPercent: e.target.value })}
                    placeholder="Nhập % giảm giá"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Ngày bắt đầu:</label>
                  <Input
                    type="date"
                    value={form.startDate}
                    onChange={e => setForm({ ...form, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Ngày kết thúc:</label>
                  <Input
                    type="date"
                    value={form.endDate}
                    onChange={e => setForm({ ...form, endDate: e.target.value })}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Kích hoạt:</label>
                  <Switch
                    checked={form.isActive}
                    onCheckedChange={checked => setForm({ ...form, isActive: checked })}
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
                <TableHead>Mã</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>% Giảm giá</TableHead>
                <TableHead>Ngày bắt đầu</TableHead>
                <TableHead>Ngày kết thúc</TableHead>
                <TableHead>Kích hoạt</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vouchers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    Không có voucher nào
                  </TableCell>
                </TableRow>
              ) : (
                vouchers.map((voucher) => (
                  <TableRow key={voucher.id}>
                    <TableCell>{voucher.id}</TableCell>
                    <TableCell>{voucher.code}</TableCell>
                    <TableCell>{voucher.description}</TableCell>
                    <TableCell>{voucher.discountPercent}%</TableCell>
                    <TableCell>{new Date(voucher.startDate).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell>{new Date(voucher.endDate).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell>
                      <Switch checked={voucher.isActive} disabled />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(voucher)}
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          Sửa
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setDeleteId(voucher.id)}
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
        <Dialog open={isEditOpen} onOpenChange={open => { setIsEditOpen(open); if (!open) setEditVoucher(null); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Sửa voucher</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Mã voucher:</label>
                <Input
                  value={form.code}
                  onChange={e => setForm({ ...form, code: e.target.value })}
                  placeholder="Nhập mã voucher"
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
              <div>
                <label className="text-sm font-medium">% Giảm giá:</label>
                <Input
                  type="number"
                  value={form.discountPercent}
                  onChange={e => setForm({ ...form, discountPercent: e.target.value })}
                  placeholder="Nhập % giảm giá"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Ngày bắt đầu:</label>
                <Input
                  type="date"
                  value={form.startDate}
                  onChange={e => setForm({ ...form, startDate: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Ngày kết thúc:</label>
                <Input
                  type="date"
                  value={form.endDate}
                  onChange={e => setForm({ ...form, endDate: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Kích hoạt:</label>
                <Switch
                  checked={form.isActive}
                  onCheckedChange={checked => setForm({ ...form, isActive: checked })}
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
              <DialogTitle>Xác nhận xóa voucher</DialogTitle>
            </DialogHeader>
            <div className="mb-4">Bạn có chắc chắn muốn xóa voucher này?</div>
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

export default AdminDiscountCodes; 