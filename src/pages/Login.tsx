import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { login } from "@/lib/accountApi";
import { checkProfile } from "@/lib/profileApi";
import { authService } from "@/lib/authService";
import { User, Lock } from "lucide-react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.length < 3 || password.length < 6) {
      toast.error('Tên đăng nhập phải có ít nhất 3 ký tự và mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setIsLoading(true);
    try {
      const response = await login({ userName: username, password });
      if (response && response.data && response.data.token) {
        const token = response.data.token;
        authService.setToken(token);
        
        const accountId = authService.getAccountId();
        const roleId = authService.getRoleId();
        console.log('Login Info:', {
          accountId,
          roleId,
          isAdmin: authService.isAdmin(),
          token: token.substring(0, 20) + '...' // Log first 20 chars of token for security
        });

        if (accountId) {
          // Check if user is admin first
          if (authService.isAdmin()) {
            console.log('User is admin, redirecting to admin dashboard');
            navigate('/admin');
            return;
          }

          console.log('User is not admin, checking profile');
          // If not admin, check profile
          try {
            const hasProfile = await checkProfile(accountId);
            if (hasProfile) {
              navigate('/');
            } else {
              navigate('/create-profile');
            }
          } catch (profileError) {
            navigate('/create-profile');
          }
        } else {
          toast.error('Không thể xác thực thông tin người dùng');
        }
      } else {
        toast.error('Đăng nhập thất bại: Không nhận được token');
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        const errorMessage = error.response?.data?.message || '';
        if (errorMessage.toLowerCase().includes('locked')) {
          toast.error('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ admin để được hỗ trợ.');
        } else {
          toast.error('Tên đăng nhập hoặc mật khẩu không đúng');
        }
      } else {
        toast.error('Đăng nhập thất bại. Vui lòng thử lại sau.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Animated background */}
      <div className="auth-background">
        <div className="auth-blob auth-blob-1"></div>
        <div className="auth-blob auth-blob-2"></div>
        <div className="auth-blob auth-blob-3"></div>
        
        {/* Floating hearts */}
        <div className="floating-hearts">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="heart"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                transform: `scale(${Math.random() * 0.5 + 0.5})`
              }}
            />
          ))}
        </div>

        {/* Sparkle effects */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className="sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="auth-card w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-matchup-purple to-matchup-pink shimmer">
              MatchLove
            </CardTitle>
            <CardDescription className="text-center">Đăng nhập vào tài khoản của bạn</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="relative auth-input">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Tên đăng nhập"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative auth-input">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="password"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-3">
              <Button 
                type="submit" 
                className="auth-button w-full text-white" 
                disabled={isLoading}
              >
                {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>

              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Hoặc</span>
                </div>
              </div>

              <Button 
                type="button" 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Đăng nhập bằng Google
              </Button>

              <div className="text-center text-sm">
                Chưa có tài khoản?{" "}
                <Link to="/register" className="auth-link">
                  Đăng ký
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
