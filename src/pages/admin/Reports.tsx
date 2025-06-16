import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '@/components/AdminSidebar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Ban, Eye, Unlock, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';

const API_URL = "https://datingwebbe-jnmo.onrender.com/api/AdminReport";
const ACCOUNT_API_URL = "https://datingwebbe-jnmo.onrender.com/api/AdminAccount";

interface Report {
  id: number;
  reporterId: number;
  reporter: string;
  reportedUserId: number;
  reported: string;
  violation: string;
  content: string;
  reportedAt: string;
  reportedIsBanned: boolean;
}

const AdminReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
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
    
    if (error.response?.status === 401 || error.response?.status === 403) {
      toast({
        title: 'Phiên đăng nhập hết hạn',
        description: 'Vui lòng đăng nhập lại',
        variant: 'destructive'
      });
      navigate('/login');
    }
  };

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      const headers = getAuthHeader();
      console.log('Request headers:', headers);

      const response = await axios.get(API_URL, {
        params: {
          page: currentPage,
          pageSize: itemsPerPage
        },
        headers
      });
      
      console.log('API response:', response.data);
      // Log each report to check the reportedIsBanned value
      response.data.reports.forEach((report: any) => {
        console.log('Report:', {
          id: report.id,
          reportedUserId: report.reportedUserId,
          reportedIsBanned: report.reportedIsBanned
        });
      });
      setReports(response.data.reports);
      setTotalPages(response.data.totalPages);
    } catch (error: any) {
      console.error('Error fetching reports:', error);
      handleAuthError(error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách báo cáo',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBanUser = async (reportedUserId: number) => {
    try {
      const headers = getAuthHeader();
      console.log('Banning user:', reportedUserId);
      console.log('Request URL:', `${ACCOUNT_API_URL}/${reportedUserId}/ban`);
      
      const response = await axios.post(
        `${ACCOUNT_API_URL}/${reportedUserId}/ban`, 
        {}, 
        { headers }
      );
      
      console.log('Ban response:', response.data);
      
      // Update the isBanned status in the reports list
      setReports(prevReports => 
        prevReports.map(report => 
          report.reportedUserId === reportedUserId 
            ? { ...report, reportedIsBanned: true }
            : report
        )
      );
      
      toast({
        title: 'Thành công',
        description: 'Tài khoản đã được khóa thành công'
      });
    } catch (error: any) {
      console.error('Error banning user:', error);
      handleAuthError(error);
      toast({
        title: 'Lỗi',
        description: 'Không thể khóa tài khoản',
        variant: 'destructive'
      });
    }
  };

  const handleUnbanUser = async (reportedUserId: number) => {
    try {
      const headers = getAuthHeader();
      console.log('Unbanning user:', reportedUserId);
      console.log('Request URL:', `${ACCOUNT_API_URL}/${reportedUserId}/unban`);
      
      const response = await axios.post(
        `${ACCOUNT_API_URL}/${reportedUserId}/unban`, 
        {}, 
        { headers }
      );
      
      console.log('Unban response:', response.data);
      
      // Update the isBanned status in the reports list
      setReports(prevReports => 
        prevReports.map(report => 
          report.reportedUserId === reportedUserId 
            ? { ...report, reportedIsBanned: false }
            : report
        )
      );
      
      toast({
        title: 'Thành công',
        description: 'Tài khoản đã được mở khóa thành công'
      });
    } catch (error: any) {
      console.error('Error unbanning user:', error);
      handleAuthError(error);
      toast({
        title: 'Lỗi',
        description: 'Không thể mở khóa tài khoản',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    fetchReports();
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
        <h1 className="text-2xl lg:text-3xl font-bold mb-6">Quản lý vi phạm báo cáo</h1>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Người báo cáo</TableHead>
                <TableHead>Người bị báo cáo</TableHead>
                <TableHead>Loại vi phạm</TableHead>
                <TableHead>Nội dung</TableHead>
                <TableHead>Ngày báo cáo</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Không có báo cáo nào
                  </TableCell>
                </TableRow>
              ) : (
                reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.reporter}</TableCell>
                    <TableCell>{report.reported}</TableCell>
                    <TableCell>{report.violation}</TableCell>
                    <TableCell className="max-w-xs truncate">{report.content}</TableCell>
                    <TableCell>{new Date(report.reportedAt).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/admin/user-profile/${report.reportedUserId}`)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Xem hồ sơ
                        </Button>
                        {(() => {
                          console.log('Rendering button for report:', {
                            id: report.id,
                            reportedUserId: report.reportedUserId,
                            reportedIsBanned: report.reportedIsBanned
                          });
                          return report.reportedIsBanned === true ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUnbanUser(report.reportedUserId)}
                            >
                              <Unlock className="h-4 w-4 mr-1" />
                              Mở khóa
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleBanUser(report.reportedUserId)}
                            >
                              <Ban className="h-4 w-4 mr-1" />
                              Khóa
                            </Button>
                          );
                        })()}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          
          {/* Pagination */}
          {reports.length > 0 && (
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
      </div>
    </div>
  );
};

export default AdminReports; 