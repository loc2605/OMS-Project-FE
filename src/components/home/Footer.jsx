import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-0 border-t border-black/5 bg-white py-12">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 flex flex-col md:flex-row justify-between gap-12">
        <div className="space-y-4 md:max-w-sm">
          <div className="flex items-center gap-2">
            <div className="size-7 bg-primary rounded flex items-center justify-center text-white shadow-sm">
              <span className="material-symbols-outlined text-base">shopping_basket</span>
            </div>
            <Link to="/" className="text-lg font-bold text-[#181411]">Shop<span className="text-primary">Modern</span></Link>
          </div>
          <p className="text-sm leading-relaxed text-gray-500">The world's leading microservices-driven e-commerce platform for a seamless shopping experience.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-12 md:gap-24 lg:gap-32">
          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5">Customer Care</h4>
            <ul className="text-sm text-gray-500 space-y-3">
              <li><Link className="hover:text-primary transition-colors" to="/help">Help Center</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/how-to-buy">How to Buy</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/shipping">Shipping & Delivery</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/returns">Return & Refunds</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5">ShopModern</h4>
            <ul className="text-sm text-gray-500 space-y-3">
              <li><Link className="hover:text-primary transition-colors" to="/about">About Us</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/privacy">Privacy Policy</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/terms">Terms & Conditions</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/seller-center">Seller Center</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-8 mt-8 pt-8 border-t border-gray-100 text-center text-xs text-gray-400 uppercase tracking-widest">
        <p>© 2026 ShopModern E-Commerce. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;