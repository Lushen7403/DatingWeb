import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { getDashboardData } from '@/lib/adminDashApi';

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getDashboardData();
      setDashboard(data);
    };
    fetchData();
  }, []);

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
  const totalPayment = dashboard.totalPayments7d;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 ml-64 p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Tổng quan</h1>
          {/* Filter buttons: chỉ giao diện */}
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-full bg-white shadow border border-gray-200 text-gray-700 font-medium hover:bg-purple-100 hover:text-purple-700 transition">Ngày</button>
            <button className="px-4 py-2 rounded-full bg-white shadow border border-gray-200 text-gray-700 font-medium hover:bg-pink-100 hover:text-pink-700 transition">Tuần</button>
            <button className="px-4 py-2 rounded-full bg-white shadow border border-gray-200 text-gray-700 font-medium hover:bg-blue-100 hover:text-blue-700 transition">Tháng</button>
          </div>
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
              <CardTitle className="text-sm font-medium">Tổng thanh toán (7 ngày)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalPayment)}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Đăng ký mới (7 ngày gần nhất)</CardTitle>
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
              <CardTitle>Cặp đôi match thành công (7 ngày gần nhất)</CardTitle>
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
            <CardTitle>Doanh thu thanh toán (7 ngày gần nhất)</CardTitle>
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