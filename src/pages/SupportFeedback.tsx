import { Link } from 'react-router-dom';
import { ArrowLeft, HeadphonesIcon, MessageSquare, Mail, Phone, Clock, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const SupportFeedback = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link to="/settings">
            <Button variant="ghost" size="icon" className="mr-4 hover:scale-110 transition-transform">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg transform rotate-12 animate-pulse">
              <HeadphonesIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Hỗ trợ & Feedback
              </h1>
              <p className="text-gray-600">Chúng tôi luôn sẵn sàng lắng nghe bạn</p>
            </div>
          </div>
        </div>

        {/* Welcome Section */}
        <Card className="mb-8 border-0 shadow-xl bg-gradient-to-r from-blue-100 to-purple-100 transform hover:scale-[1.02] transition-all duration-500">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-4">
              <MessageSquare className="h-10 w-10 text-blue-500 animate-bounce" />
              <h2 className="text-2xl font-bold text-gray-800">Chào mừng bạn đến với trang Hỗ trợ & Góp ý!</h2>
            </div>
            <p className="text-gray-700 leading-relaxed text-lg mb-4">
              Tại đây, chúng tôi luôn sẵn sàng lắng nghe những thắc mắc, đóng góp và phản hồi từ phía người dùng để khâu hỗ trợ trở nên nhanh chóng, hiệu quả và thân thiện hơn.
            </p>
            <p className="text-gray-700 leading-relaxed text-lg">
              Chúng tôi cam kết đảm bảo quyền lợi người dùng và mang đến trải nghiệm tốt nhất khi sử dụng trang web hẹn hò của chúng tôi. Dù là vấn đề về tính năng, giao diện, hoặc các vấn đề kỹ thuật khác, đội ngũ chúng tôi sẽ phản hồi trong thời gian sớm nhất.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mb-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-r from-green-100 to-blue-100 rounded-full">
                <Mail className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Để liên hệ hỗ trợ:</h3>
            </div>
            
            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl transform hover:scale-105 transition-all duration-300">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">📧 Email hỗ trợ:</h4>
                  <p className="text-lg text-blue-600 font-medium">nguyenvantu7403@gmail.com</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl transform hover:scale-105 transition-all duration-300">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Phone className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">☎️ Hotline:</h4>
                  <p className="text-lg text-purple-600 font-medium">1900 123 456</p>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl transform hover:scale-105 transition-all duration-300">
                <div className="p-3 bg-green-100 rounded-full">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">⏰ Thời gian hoạt động:</h4>
                  <p className="text-lg text-green-600 font-medium">8:00 – 22:00, tất cả các ngày trong tuần</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feedback Section */}
        <Card className="mb-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-r from-orange-50 to-pink-50">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-r from-orange-100 to-pink-100 rounded-full">
                <Star className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Ý kiến đóng góp</h3>
            </div>
            <p className="text-gray-700 leading-relaxed text-lg">
              Chúng tôi trân trọng mọi ý kiến đóng góp và phản hồi của bạn. Đó là nguồn động lực quý giá giúp chúng tôi hoàn thiện và phát triển hơn nữa trong tương lai.
            </p>
          </CardContent>
        </Card>

        {/* Thank You Section */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Heart className="h-16 w-16 text-pink-500 animate-pulse" />
                <div className="absolute -top-2 -right-2">
                  <Star className="h-8 w-8 text-yellow-400 animate-spin" />
                </div>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của 
              <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent"> LoveMatch</span>!!
            </h3>
            <div className="flex justify-center gap-2 text-2xl">
              <span className="animate-bounce">💖</span>
              <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>💕</span>
              <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>💖</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupportFeedback; 