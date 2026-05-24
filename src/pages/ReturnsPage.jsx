import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/home/Header';
import Footer from '../components/home/Footer';

const ReturnsPage = () => {
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
          <h1 className="text-5xl font-black text-white mb-4 tracking-tight">Đổi trả & Hoàn tiền</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">Không hài lòng với giao dịch mua hàng của bạn? Không thành vấn đề. Quá trình đổi trả đơn giản của chúng tôi đảm bảo bạn có thể tự tin mua sắm.</p>
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-12 max-w-5xl">
        <div className="bg-white p-8 md:p-16 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100">
          <div className="prose prose-orange max-w-none space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary">assignment_return</span>
                </span>
                <h2 className="text-2xl font-bold text-gray-900 m-0">Chính sách Đổi trả</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                Chúng tôi muốn bạn hoàn toàn hài lòng với việc mua hàng của mình. Nếu vì bất kỳ lý do gì bạn không hài lòng, bạn có thể trả lại hầu hết các mặt hàng trong vòng <span className="font-bold text-gray-900">30 ngày</span> kể từ ngày giao hàng để được hoàn tiền đầy đủ hoặc đổi trả.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary">fact_check</span>
                </span>
                <h2 className="text-2xl font-bold text-gray-900 m-0">Điều kiện Trả hàng</h2>
              </div>
              <ul className="list-none p-0 space-y-4">
                {[
                  { icon: 'inventory_2', title: 'Bao bì gốc', desc: 'Các mặt hàng phải được trả lại trong bao bì ban đầu của chúng với tất cả các thẻ đính kèm.' },
                  { icon: 'new_releases', title: 'Chưa qua sử dụng', desc: 'Mặt hàng phải chưa qua sử dụng, chưa giặt và ở cùng tình trạng như khi nhận.' },
                  { icon: 'receipt_long', title: 'Bằng chứng mua hàng', desc: 'Cần có biên lai hợp lệ hoặc số đơn đặt hàng cho tất cả các khoản trả hàng.' }
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 items-start p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <span className="material-symbols-outlined text-primary">{item.icon}</span>
                    <div>
                      <h4 className="font-bold text-gray-900 m-0">{item.title}</h4>
                      <p className="text-gray-500 text-sm m-0">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary">published_with_changes</span>
                </span>
                <h2 className="text-2xl font-bold text-gray-900 m-0">Quá trình hoàn tiền</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                Khi chúng tôi nhận được và kiểm tra mặt hàng bạn trả lại, chúng tôi sẽ gửi cho bạn email thông báo. Nếu được chấp thuận, khoản tiền hoàn lại của bạn sẽ tự động được áp dụng vào phương thức thanh toán ban đầu của bạn trong vòng <span className="font-bold text-gray-900">5-10 ngày làm việc</span>.
              </p>
            </section>

            <div className="bg-orange-50 border-l-8 border-primary p-8 rounded-2xl">
              <div className="flex gap-4 items-center">
                <span className="material-symbols-outlined text-primary text-3xl font-black">warning</span>
                <div>
                  <h4 className="text-primary font-black uppercase tracking-widest text-xs mb-1 m-0">Lưu ý Quan trọng</h4>
                  <p className="text-sm text-gray-700 m-0">Các sản phẩm tùy chỉnh, đồ dễ hỏng và hàng thanh lý không đủ điều kiện để trả lại trừ khi chúng bị hư hỏng hoặc lỗi.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReturnsPage;
