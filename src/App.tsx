
import { Toaster } from "@/components/ui/toaster";
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
import CreateProfile from "./pages/CreateProfile";
import LikeDetail from "./pages/LikeDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/create-profile" element={<CreateProfile />} />
          
          {/* Protected routes */}
          <Route path="/" element={<AuthenticatedRoute><Index /></AuthenticatedRoute>} />
          <Route path="/profile" element={<AuthenticatedRoute><Profile /></AuthenticatedRoute>} />
          <Route path="/edit-profile" element={<AuthenticatedRoute><EditProfile /></AuthenticatedRoute>} />
          <Route path="/messages" element={<AuthenticatedRoute><Messages /></AuthenticatedRoute>} />
          <Route path="/messages/:matchId" element={<AuthenticatedRoute><Messages /></AuthenticatedRoute>} />
          <Route path="/settings" element={<AuthenticatedRoute><Settings /></AuthenticatedRoute>} />
          <Route path="/change-password" element={<AuthenticatedRoute><ChangePassword /></AuthenticatedRoute>} />
          <Route path="/diamond-recharge" element={<AuthenticatedRoute><DiamondRecharge /></AuthenticatedRoute>} />
          <Route path="/view-profile/:profileId" element={<AuthenticatedRoute><ViewProfile /></AuthenticatedRoute>} />
          <Route path="/likes" element={<AuthenticatedRoute><Likes /></AuthenticatedRoute>} />
          <Route path="/like-detail/:profileId" element={<AuthenticatedRoute><LikeDetail /></AuthenticatedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
