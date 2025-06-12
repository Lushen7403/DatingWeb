import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BarChart3, Users, AlertTriangle, Bell, Percent, Package, Receipt, Menu, X, MessageSquareWarning } from 'lucide-react';
import { useState } from 'react';

const AdminSidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { path: '/admin', label: 'Tổng quan', icon: BarChart3 },
    { path: '/admin/accounts', label: 'Quản lý tài khoản', icon: Users },
    { path: '/admin/reports', label: 'Quản lý vi phạm báo cáo', icon: AlertTriangle },
    { path: '/admin/toxic-messages', label: 'Quản lý tin nhắn độc hại', icon: MessageSquareWarning },
    { path: '/admin/notifications', label: 'Quản lý thông báo', icon: Bell },
    { path: '/admin/discount-codes', label: 'Quản lý mã giảm giá', icon: Percent },
    { path: '/admin/packages', label: 'Quản lý các gói nạp', icon: Package },
    { path: '/admin/invoices', label: 'Quản lý hóa đơn', icon: Receipt },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white shadow-md"
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        w-64 bg-white shadow-lg h-screen fixed left-0 top-0 z-40 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-primary">MatchLove Admin</h2>
        </div>
        
        <nav className="mt-6">
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)}>
              <Button
                variant={location.pathname === item.path ? "default" : "ghost"}
                className="w-full justify-start mb-2 mx-2 text-sm"
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </Button>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default AdminSidebar; 