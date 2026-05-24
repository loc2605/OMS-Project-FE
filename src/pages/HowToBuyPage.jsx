import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/home/Header';
import Footer from '../components/home/Footer';

const HowToBuyPage = () => {
  const navigate = useNavigate();

  const steps = [
    {
      title: "Duyệt và Chọn",
      desc: "Khám phá các danh mục đa dạng của chúng tôi và tìm những sản phẩm bạn yêu thích. Nhấp vào bất kỳ sản phẩm nào để xem thông số kỹ thuật và đánh giá chi tiết.",
      icon: 'search'
    },
    {
      title: "Thêm vào Giỏ",
      desc: "Chọn các tùy chọn ưa thích của bạn (kích thước, màu sắc, v.v.) và nhấp vào 'Thêm vào giỏ' để lưu chúng cho quá trình thanh toán.",
      icon: 'add_shopping_cart'
    },
    {
      title: "Xem lại Giỏ hàng",
      desc: "Nhấp vào biểu tượng giỏ hàng ở trên cùng bên phải để xem lại các lựa chọn của bạn. Bạn có thể dễ dàng điều chỉnh số lượng hoặc xóa các mặt hàng tại đây.",
      icon: 'shopping_cart'
    },
    {
      title: "Thanh toán An toàn",
      desc: "Cung cấp thông tin vận chuyển của bạn, chọn phương thức thanh toán ưa thích và xác nhận đơn hàng trong môi trường an toàn của chúng tôi.",
      icon: 'lock_person'
    },
    {
      title: "Xác nhận Đơn hàng",
      desc: "Sau khi đặt hàng, bạn sẽ nhận được email xác nhận với tất cả các chi tiết và số theo dõi để theo dõi gói hàng của bạn.",
      icon: 'mark_email_read'
    }
  ];

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
          <h1 className="text-5xl font-black text-white mb-4 tracking-tight">Hướng dẫn mua hàng</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">Mới sử dụng ShopModern? Thực hiện theo hướng dẫn từng bước đơn giản của chúng tôi để bắt đầu hành trình mua sắm của bạn ngay hôm nay.</p>
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-12 max-w-5xl">
        <div className="bg-white p-8 md:p-16 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100">
          <div className="prose prose-orange max-w-none space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-10">
                <span className="p-2 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary">auto_stories</span>
                </span>
                <h2 className="text-2xl font-bold text-gray-900 m-0">Quá trình mua sắm</h2>
              </div>
              
              <div className="space-y-10">
                {steps.map((step, index) => (
                  <div key={index} className="flex gap-8 group">
                    <div className="flex flex-col items-center">
                      <div className="size-14 rounded-2xl bg-primary text-white flex items-center justify-center font-black text-2xl shadow-xl shadow-primary/20 group-hover:scale-110 transition-transform">
                        {index + 1}
                      </div>
                      {index !== steps.length - 1 && <div className="w-1 h-full bg-primary/10 mt-2 rounded-full"></div>}
                    </div>
                    <div className="pb-10">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="material-symbols-outlined text-primary font-black">{step.icon}</span>
                        <h3 className="text-2xl font-black text-gray-900 m-0 tracking-tight">{step.title}</h3>
                      </div>
                      <p className="text-gray-600 leading-relaxed text-lg m-0">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="bg-gray-50 rounded-3xl p-10 text-center border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-2 m-0">Cần sự trợ giúp?</h3>
              <p className="text-gray-500 mb-6 m-0">Đội ngũ của chúng tôi sẵn sàng giúp đỡ bạn với đơn hàng ở bất kỳ giai đoạn nào.</p>
              <button 
                onClick={() => navigate('/help')}
                className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-primary transition-all active:scale-95"
              >
                Truy cập Trung tâm trợ giúp
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HowToBuyPage;
