import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Diamond, Tag, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentState {
  packageId: number;
  amount: number;
  price: number;
}

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentData, setPaymentData] = useState<PaymentState | null>(null);
  const [discountCode, setDiscountCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (location.state && location.state.packageData) {
      setPaymentData(location.state.packageData);
    } else {
      // If no payment data, redirect back to diamond recharge
      navigate('/diamond-recharge');
    }
  }, [location.state, navigate]);

  const applyDiscount = () => {
    if (!discountCode.trim()) {
      toast.error("Vui lòng nhập mã giảm giá");
      return;
    }

    // Sample discount codes
    const discountCodes: { [key: string]: number } = {
      'SAVE10': 0.1,
      'WELCOME20': 0.2,
      'FIRST50': 0.5,
    };

    const code = discountCode.toUpperCase();
    if (discountCodes[code]) {
      const discount = paymentData!.price * discountCodes[code];
      setDiscountAmount(discount);
      toast.success(`Áp dụng mã giảm giá thành công! Giảm ${formatPrice(discount)}`);
    } else {
      toast.error("Mã giảm giá không hợp lệ");
    }
  };

  const handlePayment = async () => {
    if (!paymentData) return;

    setIsProcessing(true);
    
    try {
      const finalPrice = paymentData.price - discountAmount;
      const txnRef = Date.now().toString();
      const orderInfo = `Nap kim cuong MatchUp - ${paymentData.amount} kim cuong`;
      const returnUrl = `${window.location.origin}/payment-success`;
      const ipAddr = "127.0.0.1";
      const createDate = new Date().toISOString().replace(/[-:]/g, '').split('.')[0];
      
      // Tạo URL thanh toán VNPay
      const vnpayUrl = `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=${(finalPrice * 100).toString()}&vnp_Command=pay&vnp_CreateDate=${createDate}&vnp_CurrCode=VND&vnp_IpAddr=${ipAddr}&vnp_Locale=vn&vnp_OrderInfo=${encodeURIComponent(orderInfo)}&vnp_OrderType=other&vnp_ReturnUrl=${encodeURIComponent(returnUrl)}&vnp_TmnCode=1CDZYHT2&vnp_TxnRef=${txnRef}&vnp_Version=2.1.0`;
      
      // Open VNPay in new tab
      window.open(vnpayUrl, '_blank');
      
      // Simulate successful payment after 2 seconds
      setTimeout(() => {
        setIsProcessing(false);
        
        // Update diamonds
        const currentDiamonds = parseInt(localStorage.getItem('diamonds') || '100');
        localStorage.setItem('diamonds', (currentDiamonds + paymentData.amount).toString());
        
        toast.success(`Thanh toán thành công! Đã nạp ${paymentData.amount} kim cương`);
        navigate('/diamond-recharge');
      }, 2000);
      
    } catch (error) {
      setIsProcessing(false);
      toast.error("Có lỗi xảy ra trong quá trình thanh toán");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (!paymentData) {
    return (
      <div className="w-full max-w-md mx-auto p-4 flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary rounded-full border-t-transparent animate-spin mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  const finalPrice = paymentData.price - discountAmount;

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/diamond-recharge')}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-2xl font-bold">Thanh toán</h2>
      </div>

      <div className="space-y-6">
        {/* Package Info */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Diamond className="h-6 w-6 text-amber-400 mr-2" />
              <span className="font-bold text-lg">{paymentData.amount} kim cương</span>
            </div>
          </div>
        </Card>

        {/* Price Breakdown */}
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Chi tiết thanh toán</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Số tiền gốc:</span>
              <span className="font-semibold">{formatPrice(paymentData.price)}</span>
            </div>
            
            {/* Discount Code Section */}
            <div className="border-t pt-3">
              <label className="block text-sm font-medium mb-2">Mã giảm giá</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Nhập mã giảm giá"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={applyDiscount} variant="outline" className="px-4">
                  <Tag className="h-4 w-4 mr-1" />
                  Áp dụng
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Thử: SAVE10, WELCOME20, FIRST50
              </p>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Giảm giá:</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}
            
            <div className="border-t pt-3 flex justify-between text-lg font-bold">
              <span>Tổng thanh toán:</span>
              <span className="text-primary">{formatPrice(finalPrice)}</span>
            </div>
          </div>
        </Card>

        {/* Payment Methods */}
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Phương thức thanh toán</h3>
          <div className="flex items-center p-3 border rounded-lg bg-blue-50">
            <img 
              src="https://vnpay.vn/s1/statics.vnpay.vn/2023/9/06ncktiwd6dc1694418196384.png" 
              alt="VNPay" 
              className="h-8 mr-3"
            />
            <div>
              <p className="font-medium">VNPay</p>
              <p className="text-sm text-muted-foreground">Thanh toán qua VNPay</p>
            </div>
          </div>
        </Card>

        {/* Payment Button */}
        <Button 
          className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700"
          onClick={handlePayment}
          disabled={isProcessing}
        >
          <CreditCard className="mr-2 h-5 w-5" />
          {isProcessing ? 'Đang xử lý thanh toán...' : `Thanh toán ${formatPrice(finalPrice)}`}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Bằng việc thanh toán, bạn đồng ý với điều khoản và chính sách của chúng tôi
        </p>
      </div>
    </div>
  );
};

export default Payment; 