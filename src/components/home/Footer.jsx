import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-8 border-t border-black/5 bg-white py-10">
      <div className="max-w-full mx-auto px-4 md:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="size-7 bg-primary rounded flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-base">shopping_basket</span>
            </div>
            <h2 className="text-base font-bold text-[#181411]">Shop<span className="text-primary">Modern</span></h2>
          </div>
          <p className="text-sm leading-relaxed text-body-text">The world's leading microservices-driven e-commerce platform for a seamless shopping experience.</p>
        </div>
        <div>
          <h4 className="text-sm font-bold text-heading uppercase mb-4">Customer Care</h4>
          <ul className="text-sm text-body-text space-y-2">
            <li><a className="hover:text-primary transition-colors" href="#">Help Center</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">How to Buy</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Shipping & Delivery</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Return & Refunds</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold text-heading uppercase mb-4">ShopModern</h4>
          <ul className="text-sm text-body-text space-y-2">
            <li><a className="hover:text-primary transition-colors" href="#">About Us</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Privacy Policy</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Terms & Conditions</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Seller Center</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold text-heading uppercase mb-4">Newsletter</h4>
          <p className="text-sm text-body-text mb-4">Subscribe for latest updates and offers.</p>
          <div className="flex gap-2">
            <input className="flex-1 px-3 py-2 bg-[#F5F5F5] border border-black/5 rounded focus:ring-1 focus:ring-primary text-sm" placeholder="Email address" type="email" />
            <button className="px-4 py-2 bg-primary text-white font-bold rounded text-sm uppercase">Join</button>
          </div>
        </div>
      </div>
      <div className="max-w-full mx-auto px-4 md:px-8 lg:px-12 mt-12 pt-8 border-t border-black/5 text-center text-xs text-body-text uppercase tracking-widest">
        © 2026 ShopModern E-Commerce. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;