import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-0 border-t border-black/5 bg-white py-8">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 flex flex-col md:flex-row justify-between gap-8">
        <div className="space-y-2.5 md:max-w-sm">
          <div className="flex items-center gap-2">
            <div className="size-7 bg-primary rounded flex items-center justify-center text-white shadow-sm">
              <span className="material-symbols-outlined text-base">shopping_basket</span>
            </div>
            <Link to="/" className="text-lg font-bold text-[#181411]">Shop<span className="text-primary">Modern</span></Link>
          </div>
          <p className="text-sm leading-relaxed text-gray-500">Nền tảng thương mại điện tử hàng đầu mang đến trải nghiệm mua sắm tuyệt vời.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-8 md:gap-16 lg:gap-24">
          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Chăm sóc khách hàng</h4>
            <ul className="text-sm text-gray-500 space-y-2">
              <li><Link className="hover:text-primary transition-colors" to="/help">Trung tâm trợ giúp</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/how-to-buy">Hướng dẫn mua hàng</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/shipping">Vận chuyển & Giao nhận</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/returns">Đổi trả & Hoàn tiền</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">ShopModern</h4>
            <ul className="text-sm text-gray-500 space-y-2">
              <li><Link className="hover:text-primary transition-colors" to="/about">Về chúng tôi</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/privacy">Chính sách bảo mật</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/terms">Điều khoản dịch vụ</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/seller-center">Kênh người bán</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-8 mt-6 pt-6 border-t border-gray-100 text-center text-xs text-gray-400 uppercase tracking-widest">
        <p>© 2026 ShopModern E-Commerce. Bảo lưu mọi quyền.</p>
      </div>
    </footer>
  );
};

export default Footer;