import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { getDashboardData, getWeeklyDashboardData, getMonthlyDashboardData, DashboardData } from '@/lib/adminDashApi';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

type TimePeriod = 'daily' | 'weekly' | 'monthly';

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('daily');

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        switch (timePeriod) {
          case 'weekly':
            response = await getWeeklyDashboardData();
            break;
          case 'monthly':
            response = await getMonthlyDashboardData();
            break;
          default:
            response = await getDashboardData();
        }
        setDashboard(response);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    fetchData();
  }, [timePeriod]);

  if (!dashboard) return <div className="flex min-h-screen bg-gray-50"><AdminSidebar /><div className="flex-1 ml-64 p-6 flex items-center justify-center">Đang tải...</div></div>;

  // Chuẩn hóa dữ liệu cho các chart
  const registrationData = dashboard.chart.labels.map((label: string, i: number) => ({
    day: label,
    count: dashboard.chart.newRegistrations[i]
  }));
  const matchData = dashboard.chart.labels.map((label: string, i: number) => ({
    day: label,
    matches: dashboard.chart.matchedCounts[i]
  }));
  const paymentData = dashboard.chart.labels.map((label: string, i: number) => ({
    day: label,
    amount: dashboard.chart.revenues[i]
  }));

  const totalUsers = dashboard.totalUsers;
  const totalPayment = dashboard.totalPayments;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 ml-64 p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Tổng quan</h1>
          <Tabs value={timePeriod} onValueChange={(value) => setTimePeriod(value as TimePeriod)} className="w-[400px]">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger 
                value="daily"
                className={timePeriod === 'daily' ? 'bg-primary text-primary-foreground' : ''}
              >
                Theo ngày
              </TabsTrigger>
              <TabsTrigger 
                value="weekly"
                className={timePeriod === 'weekly' ? 'bg-primary text-primary-foreground' : ''}
              >
                Theo tuần
              </TabsTrigger>
              <TabsTrigger 
                value="monthly"
                className={timePeriod === 'monthly' ? 'bg-primary text-primary-foreground' : ''}
              >
                Theo tháng
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Tổng thanh toán</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalPayment)}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Đăng ký mới</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={registrationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cặp đôi match thành công</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={matchData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="matches" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Doanh thu thanh toán</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={paymentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                <Tooltip formatter={(value) => [formatCurrency(value as number), 'Doanh thu']} />
                <Line type="monotone" dataKey="amount" stroke="#ff7300" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard; 