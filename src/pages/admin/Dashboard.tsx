import { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const AdminDashboard = () => {
  // Mock data
  const totalUsers = 15420;
  
  const registrationData = [
    { day: 'T2', count: 45 },
    { day: 'T3', count: 52 },
    { day: 'T4', count: 38 },
    { day: 'T5', count: 61 },
    { day: 'T6', count: 73 },
    { day: 'T7', count: 89 },
    { day: 'CN', count: 94 },
  ];

  const matchData = [
    { day: 'T2', matches: 23 },
    { day: 'T3', matches: 31 },
    { day: 'T4', matches: 28 },
    { day: 'T5', matches: 42 },
    { day: 'T6', matches: 38 },
    { day: 'T7', matches: 55 },
    { day: 'CN', matches: 47 },
  ];

  const paymentData = [
    { day: 'T2', amount: 2450000 },
    { day: 'T3', amount: 3200000 },
    { day: 'T4', amount: 1800000 },
    { day: 'T5', amount: 4100000 },
    { day: 'T6', amount: 3800000 },
    { day: 'T7', amount: 5200000 },
    { day: 'CN', amount: 4700000 },
  ];

  const totalPayment = paymentData.reduce((sum, item) => sum + item.amount, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 ml-64 p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Tổng quan</h1>
        
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