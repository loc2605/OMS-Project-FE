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
          Back
        </button>
        <div className="container mx-auto max-w-5xl relative">
          <h1 className="text-5xl font-black text-white mb-4 tracking-tight">Seller Center</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">Empower your business. Reach millions of customers and scale your brand with ShopModern's seller platform.</p>
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
                <h2 className="text-2xl font-bold text-gray-900 m-0">Why Sell on ShopModern?</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                {[
                  { icon: 'trending_up', title: 'Global Reach', desc: 'Connect with customers from over 50 countries worldwide.' },
                  { icon: 'insights', title: 'Advanced Analytics', desc: 'Track your growth with real-time data and sales reports.' },
                  { icon: 'paid', title: 'Low Commission', desc: 'Keep more of your earnings with our competitive fee structure.' }
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
                <h2 className="text-3xl font-black text-white mb-4 m-0 tracking-tight">Ready to start?</h2>
                <p className="text-gray-400 mb-10 max-w-md mx-auto text-lg leading-relaxed">Join our community of successful entrepreneurs and start selling today.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="px-10 py-5 bg-primary text-white font-black rounded-2xl hover:bg-orange-600 transition-all shadow-xl shadow-primary/30 active:scale-95">
                    Become a Seller
                  </button>
                  <button className="px-10 py-5 bg-white/10 text-white font-black rounded-2xl hover:bg-white/20 transition-all active:scale-95 border border-white/20 backdrop-blur-md">
                    Learn More
                  </button>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary">help</span>
                </span>
                <h2 className="text-2xl font-bold text-gray-900 m-0">Seller Support</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                Our dedicated seller support team is available to assist you with store setup, inventory management, and marketing strategies to help you succeed on our platform.
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
