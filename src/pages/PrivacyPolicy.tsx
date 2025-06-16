import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Heart, Users, Lock, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const PrivacyPolicy = () => {
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
            <div className="p-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl shadow-lg transform rotate-3">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Chính sách & Quyền riêng tư
              </h1>
              <p className="text-gray-600">Bảo vệ thông tin của bạn là ưu tiên hàng đầu</p>
            </div>
          </div>
        </div>

        {/* Welcome Card */}
        <Card className="mb-8 border-0 shadow-xl bg-gradient-to-r from-pink-100 to-purple-100 transform hover:scale-[1.02] transition-all duration-300">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-4">
              <Heart className="h-8 w-8 text-pink-500 animate-pulse" />
              <h2 className="text-2xl font-bold text-gray-800">Chào mừng bạn đến với LoveMatch!</h2>
            </div>
            <p className="text-gray-700 leading-relaxed text-lg">
              Chúc mừng bạn đã truy cập trang web hẹn hò trực tuyến của chúng tôi! Việc bảo vệ quyền riêng tư và dữ liệu cá nhân của bạn là điều chúng tôi đặc biệt coi trọng. Dưới đây là các chính sách về quyền riêng tư của chúng tôi:
            </p>
          </CardContent>
        </Card>

        {/* Policy Sections */}
        <div className="space-y-6">
          {/* Section 1 */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">1. Thông tin chúng tôi thu thập:</h3>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                  Tên, email, hành vi truy cập, vị trí.
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  Thông tin trong hồ sơ cá nhân như độ tuổi, giới tính, hình ảnh.
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 2 */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Heart className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">2. Mục đích sử dụng thông tin:</h3>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                  Cung cấp dịch vụ kết nối và tương thích người dùng.
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  Cải thiện trải nghiệm sử dụng và hỗ trợ khách hàng.
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  Gửi thông báo, cập nhật, hoặc khuyến mãi (nếu được đồng ý).
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 3 */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">3. Chia sẻ thông tin:</h3>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  Chúng tôi KHÔNG bán hoặc chia sẻ thông tin cá nhân cho bên thứ ba khi chưa có sự đồng ý của bạn.
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Thông tin có thể được chia sẻ với đối tác đáng tin cậy để cung cấp dịch vụ.
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 4 */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Users className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">4. Quyền của bạn:</h3>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                  Truy cập, chỉnh sửa hoặc xóa thông tin cá nhân.
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  Rút lại đồng ý cho việc sử dụng thông tin.
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 5 */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Lock className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">5. Bảo mật dữ liệu:</h3>
              </div>
              <p className="text-gray-700">
                Chúng tôi sử dụng các biện pháp kỹ thuật và tổ chức để đảm bảo an toàn cho dữ liệu cá nhân.
              </p>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-r from-pink-50 to-purple-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <Mail className="h-6 w-6 text-pink-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">6. Liên hệ:</h3>
              </div>
              <p className="text-gray-700 mb-4">Mọi thắc mắc về chính sách quyền riêng tư vui lòng liên hệ qua:</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-pink-500" />
                  <span className="text-gray-700">Email: nguyenvantu7403@gmail.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-purple-500" />
                  <span className="text-gray-700">Hotline: 1900 123 456</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <Card className="mt-8 border-0 shadow-lg bg-gradient-to-r from-gray-50 to-gray-100">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600 italic">
              Bằng việc sử dụng trang web này, bạn đã đồng ý với chính sách quyền riêng tư của chúng tôi. Chúng tôi có thể cập nhật chính sách này vào bất kỳ lúc nào, vui lòng theo dõi thường xuyên.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 