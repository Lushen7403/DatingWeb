import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Diamond, CreditCard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const DiamondRecharge = () => {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const diamondPackages = [
    { id: 1, amount: 100, price: 20000, popular: false },
    { id: 2, amount: 300, price: 50000, popular: true },
    { id: 3, amount: 500, price: 80000, popular: false },
    { id: 4, amount: 1000, price: 150000, popular: false },
  ];

  const handlePurchase = () => {
    if (selectedPackage === null) {
      toast.error("Vui lòng chọn gói kim cương");
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const selectedAmount = diamondPackages.find(pkg => pkg.id === selectedPackage)?.amount || 0;
      const currentDiamonds = parseInt(localStorage.getItem('diamonds') || '100');
      localStorage.setItem('diamonds', (currentDiamonds + selectedAmount).toString());
      toast.success(`Nạp thành công ${selectedAmount} kim cương!`);
      navigate('/');
    }, 1500);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <header className="matchup-header mb-6">
        <div className="flex items-center justify-between w-full">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="hover:scale-110 transition-transform">
            <ArrowLeft size={20} className="text-matchup-purple" />
          </Button>
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-matchup-purple to-matchup-pink text-center flex-1">
            Nạp kim cương
          </h2>
          <div className="w-8"></div>
        </div>
      </header>

      <div className="mb-6 bg-gradient-to-r from-amber-100 to-amber-200 p-4 rounded-lg flex items-center">
        <Diamond className="h-10 w-10 text-amber-500 mr-3" />
        <div>
          <p className="text-sm font-medium text-amber-800">Kim cương hiện tại</p>
          <p className="text-2xl font-bold text-amber-900">
            {localStorage.getItem('diamonds') || '100'}
          </p>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-3">Chọn gói kim cương</h3>
      <div className="flex flex-col gap-3 mb-6">
        {diamondPackages.map((pkg) => (
          <Card
            key={pkg.id}
            className={`w-full p-5 flex items-center justify-between cursor-pointer transition-all text-lg font-medium ${
              selectedPackage === pkg.id
                ? 'border-primary ring-2 ring-primary bg-primary/5' : 'hover:border-primary/50'
            }`}
            onClick={() => setSelectedPackage(pkg.id)}
          >
            <div className="flex items-center gap-2">
              <Diamond className="h-6 w-6 text-amber-400" />
              <span>{pkg.amount}</span>
              {pkg.popular && (
                <Badge variant="secondary" className="bg-amber-400 text-white ml-2">
                  Phổ biến
                </Badge>
              )}
            </div>
            <span className="text-primary text-xl font-bold">{formatPrice(pkg.price)}</span>
          </Card>
        ))}
      </div>

      <Button
        className="w-full h-12 text-base font-semibold rounded-xl"
        onClick={handlePurchase}
        disabled={isProcessing || selectedPackage === null}
      >
        {isProcessing ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
            Đang xử lý...
          </div>
        ) : (
          <>
            <CreditCard className="mr-2 h-5 w-5" />
            Thanh toán ngay
          </>
        )}
      </Button>
    </div>
  );
};

export default DiamondRecharge;
