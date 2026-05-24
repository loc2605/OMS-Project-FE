import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/home/Header';
import Footer from '../components/home/Footer';

const TermsPage = () => {
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
          <h1 className="text-5xl font-black text-white mb-4 tracking-tight">Điều khoản & Điều kiện</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">Vui lòng đọc kỹ các điều khoản này trước khi sử dụng nền tảng của chúng tôi. Những điều khoản này chi phối việc bạn truy cập và sử dụng ShopModern.</p>
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-12 max-w-5xl">
        {/* Content Area */}
        <div className="bg-white p-8 md:p-16 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100">
          <div className="prose prose-orange max-w-none space-y-12">
            <section id="acceptance">
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary">verified_user</span>
                </span>
                <h2 className="text-2xl font-bold text-gray-900 m-0">1. Chấp nhận các Điều khoản</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                Bằng cách truy cập và sử dụng <span className="font-bold text-primary">ShopModern</span>, bạn đồng ý bị ràng buộc bởi các Điều khoản và Điều kiện này. Nền tảng của chúng tôi được thiết kế để cung cấp các sản phẩm và dịch vụ thời trang chất lượng cao. Nếu bạn không đồng ý với tất cả các điều khoản này, bạn bị cấm sử dụng trang web này.
              </p>
            </section>

            <section id="intellectual">
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary">copyright</span>
                </span>
                <h2 className="text-2xl font-bold text-gray-900 m-0">2. Sở hữu trí tuệ</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                Dịch vụ và nội dung, tính năng và chức năng ban đầu của nó là và sẽ vẫn là tài sản độc quyền của ShopModern và những người cấp phép cho ShopModern. Không được sử dụng nhãn hiệu và bao bì thương mại của chúng tôi liên quan đến bất kỳ sản phẩm hoặc dịch vụ nào mà không có sự đồng ý trước bằng văn bản.
              </p>
            </section>

            <section id="accounts">
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary">person_outline</span>
                </span>
                <h2 className="text-2xl font-bold text-gray-900 m-0">3. Tài khoản Người dùng</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                Khi bạn tạo tài khoản với chúng tôi, bạn phải cung cấp thông tin chính xác, đầy đủ và hiện hành vào mọi thời điểm. Việc không thực hiện như vậy cấu thành vi phạm các Điều khoản, điều này có thể dẫn đến việc chấm dứt ngay lập tức tài khoản của bạn trên Dịch vụ của chúng tôi.
              </p>
            </section>

            <section id="shipping">
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary">local_shipping</span>
                </span>
                <h2 className="text-2xl font-bold text-gray-900 m-0">4. Vận chuyển & Đổi trả</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                Chúng tôi cam kết giao hàng nhanh chóng, với mục tiêu hoàn thành trong vòng 24-48 giờ. Chính sách đổi trả của chúng tôi được thiết kế thân thiện với khách hàng, cho phép đổi trả trong vòng 30 ngày kể từ ngày nhận. Tất cả các mặt hàng phải ở trong tình trạng ban đầu, còn nguyên tem mác và bao bì gốc.
              </p>
            </section>

            <section id="liability">
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary">gavel</span>
                </span>
                <h2 className="text-2xl font-bold text-gray-900 m-0">5. Giới hạn Trách nhiệm</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                Trong mọi trường hợp, ShopModern, cũng như các giám đốc, nhân viên, đối tác, đại lý, nhà cung cấp hoặc chi nhánh của nó, sẽ không chịu trách nhiệm cho bất kỳ thiệt hại gián tiếp, ngẫu nhiên, đặc biệt, hậu quả hoặc trừng phạt nào, bao gồm nhưng không giới hạn ở việc mất lợi nhuận, dữ liệu, sử dụng, thiện chí hoặc các tổn thất vô hình khác.
              </p>
            </section>

            <section id="governing">
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary">language</span>
                </span>
                <h2 className="text-2xl font-bold text-gray-900 m-0">6. Luật điều chỉnh</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                Các Điều khoản này sẽ được điều chỉnh và hiểu theo luật pháp của khu vực tài phán, không liên quan đến các điều khoản xung đột pháp luật. Việc chúng tôi không thực thi bất kỳ quyền hoặc quy định nào của các Điều khoản này sẽ không được coi là sự từ bỏ các quyền đó.
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

export default TermsPage;
