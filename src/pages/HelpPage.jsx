import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/home/Header';
import Footer from '../components/home/Footer';

const HelpPage = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      q: "Làm thế nào để theo dõi đơn hàng của tôi?",
      a: "Bạn có thể theo dõi đơn hàng bằng cách nhấp vào 'Đơn Hàng' trong hồ sơ của bạn hoặc sử dụng liên kết theo dõi được gửi đến email của bạn.",
      icon: 'local_shipping'
    },
    {
      q: "Chính sách đổi trả của bạn là gì?",
      a: "Chúng tôi cung cấp chính sách đổi trả trong 30 ngày cho hầu hết các mặt hàng. Vui lòng truy cập trang Đổi trả & Hoàn tiền của chúng tôi để biết thêm chi tiết.",
      icon: 'assignment_return'
    },
    {
      q: "Làm cách nào để liên hệ với bộ phận hỗ trợ khách hàng?",
      a: "Nhóm hỗ trợ của chúng tôi làm việc 24/7 thông qua phần 'Liên hệ' hoặc thông qua trò chuyện trực tiếp trên trang chủ.",
      icon: 'support_agent'
    },
    {
      q: "Bạn chấp nhận phương thức thanh toán nào?",
      a: "Chúng tôi chấp nhận tất cả các thẻ tín dụng chính, PayPal và Tiền mặt khi giao hàng (COD) ở một số khu vực.",
      icon: 'payments'
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
          <h1 className="text-5xl font-black text-white mb-4 tracking-tight">Trung tâm trợ giúp</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">Tìm câu trả lời cho các câu hỏi thường gặp và nhận hỗ trợ bạn cần.</p>
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-12 max-w-5xl">
        <div className="bg-white p-8 md:p-16 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100">
          <div className="prose prose-orange max-w-none space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-8">
                <span className="p-2 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary">quiz</span>
                </span>
                <h2 className="text-2xl font-bold text-gray-900 m-0">Các câu hỏi thường gặp</h2>
              </div>
              
              <div className="grid gap-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="p-8 rounded-3xl bg-gray-50 hover:bg-white hover:shadow-xl hover:shadow-gray-100 transition-all border border-transparent hover:border-gray-100 group">
                    <div className="flex gap-4 items-start">
                      <div className="size-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                        <span className="material-symbols-outlined">{faq.icon}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-2 text-lg m-0">{faq.q}</h3>
                        <p className="text-gray-600 leading-relaxed m-0">{faq.a}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-primary/5 rounded-[2rem] p-10 text-center border border-primary/10">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 m-0">Vẫn cần giúp đỡ?</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">Đội ngũ hỗ trợ của chúng tôi sẵn sàng hỗ trợ bạn 24 giờ một ngày, 7 ngày một tuần.</p>
              <button className="px-10 py-4 bg-primary text-white font-black rounded-2xl hover:bg-orange-600 transition-all shadow-xl shadow-primary/20">
                Liên hệ hỗ trợ
              </button>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HelpPage;
