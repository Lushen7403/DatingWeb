import React, { useEffect, useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, Search } from 'lucide-react';
import { toast } from 'sonner';
import { getAllPayments } from '@/lib/adminPaymentApi';

const AdminInvoices = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllPayments(currentPage, itemsPerPage);
        setInvoices(data.payments);
        setTotalPages(data.totalPages);
      } catch (error) {
        toast.error('Không thể tải danh sách hóa đơn');
      }
    };
    fetchData();
  }, [currentPage]);

  const filteredInvoices = invoices.filter((invoice: any) =>
    invoice.id.toString().includes(searchQuery) ||
    (invoice.account?.userName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: boolean) => {
    if (status === true) return 'success';
    if (status === false) return 'destructive';
    return 'default';
  };

  const handleDownloadInvoice = (id: string) => {
    toast.success('Đang tải hóa đơn...');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 lg:ml-64 p-4 lg:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold">Quản lý hóa đơn</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Xuất báo cáo
            </Button>
          </div>
        </div>
        {/* Search bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm theo ID, tên người dùng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        {/* Desktop view */}
        <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[80px]">Mã hóa đơn</TableHead>
                  <TableHead className="min-w-[120px]">Người dùng</TableHead>
                  <TableHead className="min-w-[100px]">Gói nạp</TableHead>
                  <TableHead className="min-w-[100px]">Tiền gốc</TableHead>
                  <TableHead className="min-w-[100px]">Giảm giá</TableHead>
                  <TableHead className="min-w-[100px]">Thực trả</TableHead>
                  <TableHead className="min-w-[100px]">Mã giảm giá</TableHead>
                  <TableHead className="min-w-[100px]">% Giảm</TableHead>
                  <TableHead className="min-w-[120px]">Thời gian thanh toán</TableHead>
                  <TableHead className="min-w-[100px]">Trạng thái</TableHead>
                  <TableHead className="min-w-[100px]">Ngân hàng</TableHead>
                  <TableHead className="min-w-[120px]">Mã GD ngân hàng</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice: any) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.account?.userName}</TableCell>
                    <TableCell>{invoice.package?.diamondCount} KC</TableCell>
                    <TableCell>{formatCurrency(invoice.amountBefore)}</TableCell>
                    <TableCell>{formatCurrency(invoice.discountAmount)}</TableCell>
                    <TableCell>{formatCurrency(invoice.amountAfter)}</TableCell>
                    <TableCell>{invoice.voucher?.code || '-'}</TableCell>
                    <TableCell>{invoice.voucher?.discountPercent ? `${invoice.voucher.discountPercent}%` : '-'}</TableCell>
                    <TableCell>{invoice.vnpPayDate ? new Date(invoice.vnpPayDate).toLocaleString('vi-VN') : '-'}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(invoice.status) as any}>
                        {invoice.status ? 'Thành công' : 'Thất bại'}
                      </Badge>
                    </TableCell>
                    <TableCell>{invoice.vnpBankCode}</TableCell>
                    <TableCell>{invoice.vnpBankTranNo}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        {/* Pagination */}
        <div className="flex justify-center items-center p-4 gap-2 bg-white rounded-lg shadow mt-4">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            size="sm"
          >
            Trước
          </Button>
          <span className="mx-2 text-sm lg:text-base">
            Trang {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            size="sm"
          >
            Sau
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminInvoices; 