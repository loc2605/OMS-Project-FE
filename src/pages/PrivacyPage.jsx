import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/home/Header';
import Footer from '../components/home/Footer';

const PrivacyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#fcfcfc] min-h-screen flex flex-col font-sans">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-primary pt-32 pb-20 px-4 text-center relative">
        <button 
          onClick={() => navigate(-1)}
          className="absolute left-8 top-8 flex items-center gap-2 text-white/80 hover:text-white transition-colors font-bold text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full backdrop-blur-md z-20"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Trở lại
        </button>
        <div className="container mx-auto max-w-5xl relative">
          <h1 className="text-5xl font-black text-white mb-4 tracking-tight">Chính sách Bảo mật</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">Quyền riêng tư của bạn là ưu tiên hàng đầu của chúng tôi. Tìm hiểu cách chúng tôi thu thập, sử dụng và bảo vệ dữ liệu cá nhân của bạn tại ShopModern.</p>
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-12 max-w-5xl">
        {/* Content Area */}
        <div className="bg-white p-8 md:p-16 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100">
          <div className="prose prose-orange max-w-none space-y-12">
            <section id="collection">
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary">analytics</span>
                </span>
                <h2 className="text-2xl font-bold text-gray-900 m-0">1. Thu thập thông tin</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                Chúng tôi thu thập thông tin bạn cung cấp trực tiếp cho chúng tôi, chẳng hạn như khi bạn tạo tài khoản, đặt hàng hoặc liên hệ với chúng tôi để được hỗ trợ. Thông tin cá nhân này có thể bao gồm tên, địa chỉ email, số điện thoại và địa chỉ giao hàng của bạn, điều cần thiết để xử lý các giao dịch của bạn.
              </p>
            </section>

            <section id="use">
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary">smart_toy</span>
                </span>
                <h2 className="text-2xl font-bold text-gray-900 m-0">2. Sử dụng thông tin</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                Chúng tôi sử dụng thông tin thu thập được để xử lý đơn đặt hàng của bạn, cung cấp hỗ trợ khách hàng, cải thiện dịch vụ của chúng tôi và gửi cho bạn các thông tin tiếp thị. Dữ liệu của bạn giúp chúng tôi cá nhân hóa trải nghiệm mua sắm của bạn và cung cấp cho bạn các đề xuất sản phẩm có liên quan.
              </p>
            </section>

            <section id="security">
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary">security</span>
                </span>
                <h2 className="text-2xl font-bold text-gray-900 m-0">3. Bảo mật dữ liệu</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                Chúng tôi thực hiện một loạt các biện pháp bảo mật cấp cao, bao gồm mã hóa SSL và cơ sở dữ liệu an toàn, để duy trì sự an toàn cho thông tin cá nhân của bạn. Quyền truy cập vào dữ liệu nhạy cảm của bạn chỉ giới hạn ở những nhân sự được ủy quyền được yêu cầu giữ bí mật thông tin.
              </p>
            </section>

            <section id="disclosure">
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary">share</span>
                </span>
                <h2 className="text-2xl font-bold text-gray-900 m-0">4. Tiết lộ cho bên thứ ba</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                Chúng tôi không bán, trao đổi hoặc chuyển giao thông tin nhận dạng cá nhân của bạn cho các bên ngoài khi chưa có sự đồng ý của bạn, ngoại trừ các bên thứ ba đáng tin cậy hỗ trợ chúng tôi điều hành trang web, tiến hành hoạt động kinh doanh hoặc phục vụ người dùng của chúng tôi, miễn là các bên đó đồng ý giữ bí mật thông tin này.
              </p>
            </section>

            <section id="cookies">
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary">cookie</span>
                </span>
                <h2 className="text-2xl font-bold text-gray-900 m-0">5. Cookies</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                Trang web của chúng tôi sử dụng cookie để nâng cao trải nghiệm của bạn. Đây là những tệp nhỏ cho phép chúng tôi ghi nhớ các tùy chọn của bạn và nhận ra bạn trong những lần truy cập lại. Bạn có thể chọn tắt cookie thông qua cài đặt trình duyệt của mình, mặc dù điều này có thể ảnh hưởng đến chức năng của một số tính năng trên trang web của chúng tôi.
              </p>
            </section>

            <div className="pt-12 border-t border-gray-100 text-gray-400 text-sm">
              <p className="italic">Cập nhật lần cuối: Ngày 13 tháng 5 năm 2026</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPage;
