
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate password reset request
    setTimeout(() => {
      toast.success("Đã gửi link đổi mật khẩu vào email của bạn!");
      setIsSent(true);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-primary">Quên mật khẩu</CardTitle>
          <CardDescription className="text-center">
            {!isSent 
              ? "Nhập email của bạn để lấy lại mật khẩu" 
              : "Kiểm tra email của bạn để lấy lại mật khẩu"
            }
          </CardDescription>
        </CardHeader>
        
        {!isSent ? (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="email"
                    placeholder="Email của bạn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="matchup-input pl-10"
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-3">
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90" 
                disabled={isLoading}
              >
                {isLoading ? "Đang gửi..." : "Gửi link đổi mật khẩu"}
              </Button>
            </CardFooter>
          </form>
        ) : (
          <CardContent className="space-y-4">
            <p className="text-center">
              Chúng tôi đã gửi một email cho bạn với liên kết để đặt lại mật khẩu.
            </p>
            <p className="text-center text-sm text-muted-foreground">
              Không nhận được email? Kiểm tra thư spam hoặc
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsSent(false)}
            >
              Thử lại
            </Button>
          </CardContent>
        )}

        <CardFooter>
          <div className="w-full text-center text-sm">
            <Link to="/login" className="text-primary hover:underline">
              Quay lại đăng nhập
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPassword;
