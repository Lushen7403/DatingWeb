import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { login } from "@/lib/accountApi";
import { checkProfile } from "@/lib/profileApi";
import { authService } from "@/lib/authService";

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
      const response = await login({ 
        userName: username.trim(),
        password: password 
      });
      
      if (response && response.data && response.data.token) {
        const token = response.data.token;
        authService.setToken(token);
        
        const accountId = authService.getAccountId();
        if (accountId) {
          try {
            const hasProfile = await checkProfile(accountId);
            if (hasProfile) {
              window.location.href = '/';
            } else {
              window.location.href = '/create-profile';
            }
          } catch (profileError) {
            window.location.href = '/create-profile';
          }
        } else {
          toast.error('Không thể xác thực thông tin người dùng');
        }
      } else {
        toast.error('Đăng nhập thất bại: Không nhận được token');
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error('Tên đăng nhập hoặc mật khẩu không đúng');
      } else {
        toast.error('Đăng nhập thất bại. Vui lòng thử lại sau.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-primary">MatchUp</CardTitle>
          <CardDescription className="text-center">Đăng nhập vào tài khoản của bạn</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="matchup-input"
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="matchup-input"
                required
              />
            </div>
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                Quên mật khẩu?
              </Link>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90" 
              disabled={isLoading}
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
            <div className="text-center text-sm">
              Chưa có tài khoản?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Đăng ký
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
