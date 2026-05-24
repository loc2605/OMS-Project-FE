import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/home/Header';
import Footer from '../components/home/Footer';

const SellerCenterPage = () => {
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
          <h1 className="text-5xl font-black text-white mb-4 tracking-tight">Kênh người bán</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">Trao quyền cho doanh nghiệp của bạn. Tiếp cận hàng triệu khách hàng và mở rộng quy mô thương hiệu của bạn với nền tảng người bán của ShopModern.</p>
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-12 max-w-5xl">
        <div className="bg-white p-8 md:p-16 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100">
          <div className="prose prose-orange max-w-none space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-8">
                <span className="p-2 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary">storefront</span>
                </span>
                <h2 className="text-2xl font-bold text-gray-900 m-0">Tại sao nên bán hàng trên ShopModern?</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                {[
                  { icon: 'trending_up', title: 'Phạm vi toàn cầu', desc: 'Kết nối với khách hàng từ hơn 50 quốc gia trên toàn thế giới.' },
                  { icon: 'insights', title: 'Phân tích nâng cao', desc: 'Theo dõi sự phát triển của bạn với dữ liệu thời gian thực và báo cáo bán hàng.' },
                  { icon: 'paid', title: 'Hoa hồng thấp', desc: 'Giữ lại nhiều thu nhập của bạn hơn với cơ cấu phí cạnh tranh của chúng tôi.' }
                ].map((item, i) => (
                  <div key={i} className="p-6 rounded-3xl bg-gray-50 border border-gray-100 text-center">
                    <span className="material-symbols-outlined text-primary text-3xl mb-4">{item.icon}</span>
                    <h3 className="font-bold text-gray-900 mb-2 m-0">{item.title}</h3>
                    <p className="text-sm text-gray-500 m-0">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-gray-900 rounded-[2.5rem] p-12 text-center relative overflow-hidden">
              {/* Abstract decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32"></div>
              
              <div className="relative z-10">
                <h2 className="text-3xl font-black text-white mb-4 m-0 tracking-tight">Sẵn sàng bắt đầu chưa?</h2>
                <p className="text-gray-400 mb-10 max-w-md mx-auto text-lg leading-relaxed">Tham gia cộng đồng các doanh nhân thành đạt của chúng tôi và bắt đầu bán hàng ngay hôm nay.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="px-10 py-5 bg-primary text-white font-black rounded-2xl hover:bg-orange-600 transition-all shadow-xl shadow-primary/30 active:scale-95">
                    Trở thành người bán
                  </button>
                  <button className="px-10 py-5 bg-white/10 text-white font-black rounded-2xl hover:bg-white/20 transition-all active:scale-95 border border-white/20 backdrop-blur-md">
                    Tìm hiểu thêm
                  </button>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary">help</span>
                </span>
                <h2 className="text-2xl font-bold text-gray-900 m-0">Hỗ trợ Người bán</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                Đội ngũ hỗ trợ người bán tận tâm của chúng tôi luôn sẵn sàng hỗ trợ bạn thiết lập cửa hàng, quản lý hàng tồn kho và các chiến lược tiếp thị để giúp bạn thành công trên nền tảng của chúng tôi.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SellerCenterPage;
