import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminSidebar from '@/components/AdminSidebar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Ban, CheckCircle, UserX, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';

const API_URL = "http://localhost:5291/api/AdminAccount";

interface Account {
  id: number;
  roleId: number;
  userName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  isBanned: boolean;
  diamondCount: number;
}

const AdminAccounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isBanned, setIsBanned] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
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
      navigate('/login');
    }
  };

  const fetchAccounts = async () => {
    try {
      setIsLoading(true);
      const headers = getAuthHeader();
      console.log('Request headers:', headers);

      const response = await axios.get(API_URL, {
        params: {
          searchTerm,
          isBanned,
          page: currentPage,
          pageSize: itemsPerPage
        },
        headers
      });
      
      console.log('API response:', response.data);
      setAccounts(response.data.accounts || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error: any) {
      console.error('Error fetching accounts:', error);
      handleAuthError(error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách tài khoản',
        variant: 'destructive'
      });
      setAccounts([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [currentPage, searchTerm, isBanned]);

  const handleBanAccount = async (id: number) => {
    try {
      const headers = getAuthHeader();

      await axios.post(`${API_URL}/${id}/ban`, {}, { headers });
      toast({
        title: 'Thành công',
        description: 'Tài khoản đã được khóa thành công'
      });
      fetchAccounts();
    } catch (error: any) {
      console.error('Error banning account:', error);
      handleAuthError(error);
      toast({
        title: 'Lỗi',
        description: 'Không thể khóa tài khoản',
        variant: 'destructive'
      });
    }
  };

  const handleUnbanAccount = async (id: number) => {
    try {
      const headers = getAuthHeader();

      await axios.post(`${API_URL}/${id}/unban`, {}, { headers });
      toast({
        title: 'Thành công',
        description: 'Tài khoản đã được mở khóa thành công'
      });
      fetchAccounts();
    } catch (error: any) {
      console.error('Error unbanning account:', error);
      handleAuthError(error);
      toast({
        title: 'Lỗi',
        description: 'Không thể mở khóa tài khoản',
        variant: 'destructive'
      });
    }
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
      
      {/* Main content with responsive margin */}
      <div className="flex-1 lg:ml-64 p-4 lg:p-6">
        <h1 className="text-2xl lg:text-3xl font-bold mb-6">Quản lý tài khoản</h1>
        
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Button
            variant={isBanned === null ? "default" : "outline"}
            onClick={() => setIsBanned(null)}
          >
            Tất cả
          </Button>
          <Button
            variant={isBanned === true ? "default" : "outline"}
            onClick={() => setIsBanned(true)}
          >
            Đã khóa
          </Button>
          <Button
            variant={isBanned === false ? "default" : "outline"}
            onClick={() => setIsBanned(false)}
          >
            Hoạt động
          </Button>
        </div>

        {/* Desktop table view */}
        <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[120px]">Tên đăng nhập</TableHead>
                  <TableHead className="min-w-[180px]">Email</TableHead>
                  <TableHead className="min-w-[100px]">Ngày tạo</TableHead>
                  <TableHead className="min-w-[100px]">Kim cương</TableHead>
                  <TableHead className="min-w-[100px]">Trạng thái</TableHead>
                  <TableHead className="min-w-[200px]">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Không có tài khoản nào
                    </TableCell>
                  </TableRow>
                ) : (
                  accounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell className="font-medium">{account.userName}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{account.email}</TableCell>
                      <TableCell>{new Date(account.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                      <TableCell>{account.diamondCount}</TableCell>
                      <TableCell>
                        <Badge variant={account.isBanned ? "destructive" : "default"}>
                          {account.isBanned ? "Đã khóa" : "Hoạt động"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => navigate(`/admin/user-profile/${account.id}`)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Xem hồ sơ
                          </Button>
                          
                          {account.isBanned ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUnbanAccount(account.id)}
                            >
                              <UserX className="h-4 w-4 mr-1" />
                              Mở khóa
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleBanAccount(account.id)}
                            >
                              <Ban className="h-4 w-4 mr-1" />
                              Khóa
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Mobile card view */}
        <div className="lg:hidden space-y-4">
          {accounts.length === 0 ? (
            <div className="text-center py-4 bg-white rounded-lg shadow">
              Không có tài khoản nào
            </div>
          ) : (
            accounts.map((account) => (
              <Card key={account.id}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{account.userName}</CardTitle>
                    <Badge variant={account.isBanned ? "destructive" : "default"}>
                      {account.isBanned ? "Đã khóa" : "Hoạt động"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <p className="text-sm"><span className="font-medium">Email:</span> {account.email}</p>
                    <p className="text-sm"><span className="font-medium">Kim cương:</span> {account.diamondCount}</p>
                    <p className="text-sm"><span className="font-medium">Ngày tạo:</span> {new Date(account.createdAt).toLocaleDateString('vi-VN')}</p>
                  </div>
                  <div className="flex flex-col gap-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate(`/admin/user-profile/${account.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Xem hồ sơ
                    </Button>
                    {account.isBanned ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUnbanAccount(account.id)}
                        className="w-full"
                      >
                        <UserX className="h-4 w-4 mr-1" />
                        Mở khóa
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleBanAccount(account.id)}
                        className="w-full"
                      >
                        <Ban className="h-4 w-4 mr-1" />
                        Khóa
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        
        {/* Pagination */}
        {accounts.length > 0 && (
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
        )}
      </div>
    </div>
  );
};

export default AdminAccounts; 