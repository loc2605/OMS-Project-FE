import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/home/Header';
import Footer from '../components/home/Footer';

const ShippingPage = () => {
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
          <h1 className="text-5xl font-black text-white mb-4 tracking-tight">Vận chuyển & Giao nhận</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">Nhanh chóng, đáng tin cậy và an toàn. Tìm hiểu thêm về phương thức vận chuyển, giá cước và tùy chọn theo dõi của chúng tôi.</p>
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-12 max-w-5xl">
        <div className="bg-white p-8 md:p-16 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100">
          <div className="prose prose-orange max-w-none space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary">local_shipping</span>
                </span>
                <h2 className="text-2xl font-bold text-gray-900 m-0">Phương thức vận chuyển</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-2 m-0 text-xl">Vận chuyển tiêu chuẩn</h3>
                  <p className="text-primary font-black mb-4 uppercase tracking-widest text-xs">5-7 Ngày làm việc</p>
                  <p className="text-gray-600 m-0">Lý tưởng cho các đơn hàng không khẩn cấp với chi phí tiết kiệm nhất.</p>
                </div>
                <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-2 m-0 text-xl">Vận chuyển hỏa tốc</h3>
                  <p className="text-primary font-black mb-4 uppercase tracking-widest text-xs">2-3 Ngày làm việc</p>
                  <p className="text-gray-600 m-0">Xử lý ưu tiên cho những đơn hàng bạn cần giao nhanh.</p>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary">payments</span>
                </span>
                <h2 className="text-2xl font-bold text-gray-900 m-0">Cước phí vận chuyển</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                Cước phí vận chuyển được tính dựa trên tổng trọng lượng đơn hàng và điểm đến của bạn. Chúng tôi cung cấp <span className="font-bold text-gray-900">Miễn phí Vận chuyển Tiêu chuẩn</span> cho tất cả các đơn hàng trong nước trên <span className="font-bold text-gray-900">150.000đ</span>.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary">public</span>
                </span>
                <h2 className="text-2xl font-bold text-gray-900 m-0">Vận chuyển Quốc tế</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                Chúng tôi hiện đang vận chuyển đến hơn 50 quốc gia trên toàn thế giới. Xin lưu ý rằng các lô hàng quốc tế có thể phải chịu thuế và phí hải quan khi hàng đến, và người nhận sẽ chịu trách nhiệm cho các khoản phí này.
              </p>
            </section>

            <section id="tracking">
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary">location_on</span>
                </span>
                <h2 className="text-2xl font-bold text-gray-900 m-0">Theo dõi đơn hàng</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                Ngay sau khi đơn hàng của bạn được gửi đi, bạn sẽ nhận được email xác nhận có chứa số theo dõi. Bạn có thể theo dõi hành trình gói hàng thông qua trang web của chúng tôi hoặc trực tiếp qua cổng thông tin theo dõi của đơn vị vận chuyển.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ShippingPage;
