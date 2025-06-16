import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, Users, Sparkles, Star, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const AboutUs = () => {
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
            <div className="p-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl shadow-lg transform -rotate-3 animate-pulse">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Về chúng tôi
              </h1>
              <p className="text-gray-600">Kết nối những trái tim đồng điệu</p>
            </div>
          </div>
        </div>

        {/* Welcome Section */}
        <Card className="mb-8 border-0 shadow-xl bg-gradient-to-r from-pink-100 to-purple-100 transform hover:scale-[1.02] transition-all duration-500">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Heart className="h-16 w-16 text-pink-500 animate-pulse" />
                <Sparkles className="h-8 w-8 text-purple-400 absolute -top-2 -right-2 animate-bounce" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Chào mừng bạn đến với 
              <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent"> LoveMatch</span>
            </h2>
            <p className="text-xl text-gray-600 font-medium">
              – nơi kết nối những trái tim đồng điệu!
            </p>
          </CardContent>
        </Card>

        {/* Mission Statement */}
        <Card className="mb-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full">
                <Star className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Sứ mệnh của chúng tôi</h3>
            </div>
            <p className="text-gray-700 leading-relaxed text-lg">
              Chúng tôi tin rằng trong thế giới rộng lớn này, mỗi người đều xứng đáng tìm thấy một nửa phù hợp của mình. Với sứ mệnh mang đến một không gian an toàn, chân thành và đầy cảm xúc, LoveMatch được xây dựng để giúp bạn tìm kiếm không chỉ một cuộc trò chuyện thú vị, mà còn là một mối quan hệ ý nghĩa.
            </p>
          </CardContent>
        </Card>

        {/* Features Section */}
        <Card className="mb-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-r from-green-100 to-blue-100 rounded-full">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Tại đây, bạn có thể:</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg transform hover:scale-105 transition-all duration-300">
                <div className="p-2 bg-pink-100 rounded-lg mt-1">
                  <Heart className="h-5 w-5 text-pink-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Gặp gỡ người đồng điệu</h4>
                  <p className="text-gray-600">Gặp gỡ những người độc thân thật sự nghiêm túc trong tình cảm.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg transform hover:scale-105 transition-all duration-300">
                <div className="p-2 bg-purple-100 rounded-lg mt-1">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Thể hiện bản thân</h4>
                  <p className="text-gray-600">Tự do thể hiện bản thân một cách chân thành và riêng biệt.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg transform hover:scale-105 transition-all duration-300">
                <div className="p-2 bg-blue-100 rounded-lg mt-1">
                  <Star className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Tìm kiếm thông minh</h4>
                  <p className="text-gray-600">Trải nghiệm tính năng tìm kiếm thông minh giúp bạn kết nối với người phù hợp nhất.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Philosophy Section */}
        <Card className="mb-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-r from-orange-50 to-pink-50">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-r from-orange-100 to-pink-100 rounded-full">
                <MessageCircle className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Triết lý của chúng tôi</h3>
            </div>
            <p className="text-gray-700 leading-relaxed text-lg mb-4">
              Chúng tôi không đơn thuần là một nền tảng công nghệ – mà là cầu nối cho những câu chuyện tình yêu bắt đầu từ sự thấu hiểu, tin tưởng và sẻ chia.
            </p>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="flex items-center gap-2">
                  {[...Array(3)].map((_, i) => (
                    <Heart 
                      key={i} 
                      className={`h-8 w-8 text-pink-500 animate-pulse`} 
                      style={{ animationDelay: `${i * 0.5}s` }} 
                    />
                  ))}
                </div>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Hãy để hành trình tìm kiếm tình yêu của bạn bắt đầu từ đây
            </h3>
            <div className="text-4xl mb-4">❤️</div>
            <Link to="/">
              <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-3 rounded-full text-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg">
                Bắt đầu ngay
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutUs; 