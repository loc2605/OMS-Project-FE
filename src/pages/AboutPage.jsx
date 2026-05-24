import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/home/Header';
import Footer from '../components/home/Footer';

const AboutPage = () => {
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
          <h1 className="text-5xl font-black text-white mb-4 tracking-tight">Về ShopModern</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">Khám phá câu chuyện, sứ mệnh của chúng tôi và lý do tại sao chúng tôi là sự lựa chọn hàng đầu của những người mua sắm hiện đại trên toàn thế giới.</p>
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-12 max-w-5xl">
        <div className="bg-white p-8 md:p-16 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100">
          <div className="prose prose-orange max-w-none space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary">rocket_launch</span>
                </span>
                <h2 className="text-2xl font-bold text-gray-900 m-0">Câu chuyện của chúng tôi</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                Được thành lập vào năm 2026, ShopModern được xây dựng dựa trên nguyên tắc cung cấp các sản phẩm chất lượng cao, bổ sung cho phong cách sống hiện đại, nhịp độ nhanh. Chúng tôi tin rằng việc mua sắm phải liền mạch, thú vị và đáng tin cậy.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary">visibility</span>
                </span>
                <h2 className="text-2xl font-bold text-gray-900 m-0">Sứ mệnh của chúng tôi</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                Sứ mệnh của chúng tôi là mang những thương hiệu và sản phẩm tốt nhất thế giới đến tận cửa nhà bạn. Chúng tôi tận dụng công nghệ microservices tiên tiến để đảm bảo trải nghiệm mua sắm nhanh chóng, an toàn và được cá nhân hóa cho từng khách hàng.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary">verified</span>
                </span>
                <h2 className="text-2xl font-bold text-gray-900 m-0">Tại sao chọn chúng tôi?</h2>
              </div>
              <ul className="list-none p-0 space-y-4">
                {[
                  { icon: 'check_circle', title: 'Chất lượng Đảm bảo', desc: 'Mọi sản phẩm trên nền tảng của chúng tôi đều trải qua quá trình kiểm tra chất lượng nghiêm ngặt.' },
                  { icon: 'speed', title: 'Giao hàng Nhanh', desc: 'Chúng tôi hợp tác với các nhà lãnh đạo hậu cần toàn cầu để đảm bảo đơn đặt hàng của bạn đến đúng hạn.' },
                  { icon: 'shield_lock', title: 'Thanh toán An toàn', desc: 'Mã hóa hàng đầu trong ngành cho tất cả các giao dịch của bạn.' }
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 items-start p-4 rounded-2xl bg-gray-50">
                    <span className="material-symbols-outlined text-primary">{item.icon}</span>
                    <div>
                      <h4 className="font-bold text-gray-900">{item.title}</h4>
                      <p className="text-gray-500 text-sm">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <div className="pt-12 border-t border-gray-100 text-gray-400 text-sm">
              <p className="italic">Cùng chúng tôi xác định lại tương lai của thương mại điện tử.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
