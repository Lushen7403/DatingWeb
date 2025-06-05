import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Diamond, CreditCard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { getActiveRechargePackages, getDiamondBalance, RechargePackage } from '@/lib/diamondApi';

const DiamondRecharge = () => {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [packages, setPackages] = useState<RechargePackage[]>([]);
  const [diamond, setDiamond] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [loadingDiamond, setLoadingDiamond] = useState(true);

  const diamondPackages = [
    { id: 1, amount: 100, price: 20000, popular: false },
    { id: 2, amount: 300, price: 50000, popular: true },
    { id: 3, amount: 500, price: 80000, popular: false },
    { id: 4, amount: 1000, price: 150000, popular: false },
  ];

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const data = await getActiveRechargePackages();
        setPackages(data);
      } catch (e) {
        setPackages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  useEffect(() => {
    const fetchDiamond = async () => {
      setLoadingDiamond(true);
      try {
        const accountId = Number(localStorage.getItem('accountId'));
        if (accountId) {
          const balance = await getDiamondBalance(accountId);
          setDiamond(balance);
        }
      } catch (e) {
        setDiamond(0);
      } finally {
        setLoadingDiamond(false);
      }
    };
    fetchDiamond();
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 relative overflow-hidden">
      {/* Header cố định */}
      <header className="matchup-header w-full max-w-xl mx-auto mb-8 pt-8 bg-transparent border-0 shadow-none">
        <div className="flex items-center justify-between w-full">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="hover:scale-110 transition-transform">
            <ArrowLeft size={24} className="text-matchup-purple" />
          </Button>
          <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-matchup-purple to-matchup-pink bg-clip-text text-transparent flex-1">
            Nạp kim cương
          </h2>
          <div className="w-8"></div>
        </div>
      </header>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-r from-purple-300 to-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-300 to-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-4000"></div>
      </div>

      {/* Nội dung nạp kim cương căn giữa dưới header */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] pt-8">
        <div className="relative w-full max-w-xl mx-auto overflow-visible rounded-3xl shadow-2xl bg-white/80 backdrop-blur-lg p-0">
          <div className="relative z-10 p-10 flex flex-col items-center">
            <div className="mb-8 w-full flex flex-col items-center">
              <div className="bg-gradient-to-r from-yellow-100 to-yellow-200 p-6 rounded-2xl flex flex-col items-center shadow-lg w-full max-w-xs relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 to-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Diamond className="h-14 w-14 text-amber-400 mb-2 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                <p className="text-base font-semibold text-amber-800 mb-1 relative z-10">Kim cương hiện tại</p>
                <p className="text-3xl font-extrabold text-amber-900 relative z-10">
                  {loadingDiamond ? (
                    <span className="text-muted-foreground">Đang tải...</span>
                  ) : (
                    diamond
                  )}
                </p>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-6 text-center bg-gradient-to-r from-matchup-purple to-matchup-pink bg-clip-text text-transparent">Chọn gói kim cương</h3>
            {loading ? (
              <div className="text-center text-muted-foreground">Đang tải gói nạp...</div>
            ) : (
              <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
                {packages.map(pkg => (
                  <div 
                    key={pkg.id} 
                    className="flex items-center justify-between rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur group border-0"
                  >
                    <div>
                      <div className="text-lg font-bold text-matchup-purple group-hover:scale-105 transition-transform duration-300">
                        {pkg.diamond} Kim cương
                      </div>
                      <div className="text-base text-gray-500 group-hover:text-matchup-purple transition-colors duration-300">
                        {pkg.price.toLocaleString()} VNĐ
                      </div>
                    </div>
                    <Button
                      onClick={() => navigate('/payment', {
                        state: {
                          packageData: {
                            packageId: pkg.id,
                            amount: pkg.diamond,
                            price: pkg.price,
                          }
                        }
                      })}
                      className="px-6 py-2 rounded-full bg-gradient-to-r from-matchup-purple to-matchup-pink text-white font-semibold shadow hover:from-matchup-pink hover:to-matchup-purple transition-all duration-300 transform hover:scale-110"
                    >
                      Nạp ngay
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiamondRecharge;
