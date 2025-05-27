import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";
import ViewProfile from "./pages/ViewProfile";
import Likes from "./pages/Likes";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ChangePassword from "./pages/ChangePassword";
import DiamondRecharge from "./pages/DiamondRecharge";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import AdminRoute from "./components/AdminRoute";
import CreateProfile from "./pages/CreateProfile";
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import AboutUs from './pages/AboutUs';
import SupportFeedback from './pages/SupportFeedback';
import BlockedUsers from './pages/BlockedUsers';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserX } from "lucide-react";
import Like from "./pages/Likes";
import Payment from './pages/Payment';

// Import admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminAccounts from './pages/admin/Accounts';
import AdminReports from './pages/admin/Reports';
import AdminNotifications from './pages/admin/Notifications';
import AdminDiscountCodes from './pages/admin/DiscountCodes';
import AdminPackages from './pages/admin/Packages';
import AdminInvoices from './pages/admin/Invoices';
import AdminUserProfile from './pages/admin/UserProfile';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/create-profile" element={<CreateProfile />} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/accounts" element={<AdminRoute><AdminAccounts /></AdminRoute>} />
          <Route path="/admin/reports" element={<AdminRoute><AdminReports /></AdminRoute>} />
          <Route path="/admin/notifications" element={<AdminRoute><AdminNotifications /></AdminRoute>} />
          <Route path="/admin/discount-codes" element={<AdminRoute><AdminDiscountCodes /></AdminRoute>} />
          <Route path="/admin/packages" element={<AdminRoute><AdminPackages /></AdminRoute>} />
          <Route path="/admin/invoices" element={<AdminRoute><AdminInvoices /></AdminRoute>} />
          <Route path="/admin/user-profile/:id" element={<AdminRoute><AdminUserProfile /></AdminRoute>} />
          
          {/* Protected routes */}
          <Route path="/" element={<AuthenticatedRoute><Index /></AuthenticatedRoute>} />
          <Route path="/profile" element={<AuthenticatedRoute><Profile /></AuthenticatedRoute>} />
          <Route path="/edit-profile" element={<AuthenticatedRoute><EditProfile /></AuthenticatedRoute>} />
          <Route path="/messages" element={<AuthenticatedRoute><Messages /></AuthenticatedRoute>} />
          <Route path="/messages/:id" element={<AuthenticatedRoute><Messages /></AuthenticatedRoute>} />
          <Route path="/settings" element={<AuthenticatedRoute><Settings /></AuthenticatedRoute>} />
          <Route path="/change-password" element={<AuthenticatedRoute><ChangePassword /></AuthenticatedRoute>} />
          <Route path="/diamond-recharge" element={<AuthenticatedRoute><DiamondRecharge /></AuthenticatedRoute>} />
          <Route path="/view-profile/:profileId" element={<AuthenticatedRoute><ViewProfile /></AuthenticatedRoute>} />
          <Route path="/likes" element={<AuthenticatedRoute><Like /></AuthenticatedRoute>} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/support-feedback" element={<SupportFeedback />} />
          <Route path="/blocked-users" element={<BlockedUsers />} />
          <Route path="/payment" element={<AuthenticatedRoute><Payment /></AuthenticatedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
