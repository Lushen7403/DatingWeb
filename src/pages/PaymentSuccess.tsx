import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { checkPaymentStatus } from '@/lib/paymentApi';
import axios from 'axios';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const checkPayment = async () => {
      try {
        // Lấy toàn bộ query params
        const params = Object.fromEntries(searchParams.entries());
        // Gửi toàn bộ params lên backend
        const response = await axios.get('http://localhost:5291/api/Payment/return', { params });
        setIsSuccess(response.data.status);
        if (response.data.status) {
          toast.success('Thanh toán thành công!');
        } else {
          toast.error('Thanh toán thất bại');
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        toast.error('Có lỗi xảy ra khi kiểm tra trạng thái thanh toán');
      } finally {
        setIsLoading(false);
      }
    };
    checkPayment();
  }, [searchParams, navigate]);

  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto p-4 flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary rounded-full border-t-transparent animate-spin mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Đang kiểm tra trạng thái thanh toán...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <Card className="p-6 text-center">
        {isSuccess ? (
          <>
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Thanh toán thành công!</h2>
            <p className="text-muted-foreground mb-6">
              Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi
            </p>
          </>
        ) : (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Thanh toán thất bại</h2>
            <p className="text-muted-foreground mb-6">
              Vui lòng thử lại hoặc liên hệ hỗ trợ nếu vấn đề vẫn tiếp tục
            </p>
          </>
        )}

        <Button 
          className="w-full"
          onClick={() => navigate('/diamond-recharge')}
        >
          Quay lại trang nạp kim cương
        </Button>
      </Card>
    </div>
  );
};

export default PaymentSuccess; 