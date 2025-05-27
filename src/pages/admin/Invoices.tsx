import { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';

const AdminInvoices = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 10;

  // Mock data for invoices
  const invoices = Array.from({ length: 50 }, (_, i) => ({
    id: `INV${String(i + 1).padStart(6, '0')}`,
    userId: `user${i + 1}`,
    username: `User ${i + 1}`,
    amount: Math.floor(Math.random() * 1000000) + 100000,
    package: `Gói ${Math.floor(Math.random() * 5) + 1}`,
    paymentMethod: ['VNPay', 'Momo', 'ZaloPay', 'Thẻ cào'][Math.floor(Math.random() * 4)],
    status: ['Thành công', 'Đang xử lý', 'Thất bại'][Math.floor(Math.random() * 3)],
    createdAt: new Date(2024, 0, i + 1).toLocaleDateString('vi-VN'),
  }));

  const totalPages = Math.ceil(invoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const filteredInvoices = invoices.filter(invoice => 
    invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.userId.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const currentInvoices = filteredInvoices.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Thành công':
        return 'success';
      case 'Đang xử lý':
        return 'warning';
      case 'Thất bại':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const handleDownloadInvoice = (id: string) => {
    console.log('Downloading invoice:', id);
    toast.success('Đang tải hóa đơn...');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 lg:ml-64 p-4 lg:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold">Quản lý hóa đơn</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Lọc
            </Button>
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
                  <TableHead className="min-w-[120px]">Mã hóa đơn</TableHead>
                  <TableHead className="min-w-[100px]">ID người dùng</TableHead>
                  <TableHead className="min-w-[150px]">Tên người dùng</TableHead>
                  <TableHead className="min-w-[120px]">Số tiền</TableHead>
                  <TableHead className="min-w-[100px]">Gói</TableHead>
                  <TableHead className="min-w-[100px]">Phương thức</TableHead>
                  <TableHead className="min-w-[100px]">Trạng thái</TableHead>
                  <TableHead className="min-w-[100px]">Ngày tạo</TableHead>
                  <TableHead className="min-w-[100px]">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.userId}</TableCell>
                    <TableCell>{invoice.username}</TableCell>
                    <TableCell>{invoice.amount.toLocaleString()}đ</TableCell>
                    <TableCell>{invoice.package}</TableCell>
                    <TableCell>{invoice.paymentMethod}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(invoice.status) as any}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{invoice.createdAt}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadInvoice(invoice.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Mobile view */}
        <div className="lg:hidden space-y-4">
          {currentInvoices.map((invoice) => (
            <Card key={invoice.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{invoice.id}</CardTitle>
                  <Badge variant={getStatusColor(invoice.status) as any}>
                    {invoice.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Người dùng:</span> {invoice.username}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">ID:</span> {invoice.userId}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Số tiền:</span> {invoice.amount.toLocaleString()}đ
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Gói:</span> {invoice.package}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Phương thức:</span> {invoice.paymentMethod}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Ngày tạo:</span> {invoice.createdAt}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownloadInvoice(invoice.id)}
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Tải hóa đơn
                </Button>
              </CardContent>
            </Card>
          ))}
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