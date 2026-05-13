import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/home/Header';
import Footer from '../components/home/Footer';

const HowToBuyPage = () => {
  const navigate = useNavigate();

  const steps = [
    {
      title: "Browse and Select",
      desc: "Explore our diverse categories and find the products you love. Click on any product to see detailed specifications and reviews.",
      icon: 'search'
    },
    {
      title: "Add to Cart",
      desc: "Select your preferred options (size, color, etc.) and click 'Add to Cart' to save them for checkout.",
      icon: 'add_shopping_cart'
    },
    {
      title: "Review Your Cart",
      desc: "Click the cart icon at the top right to review your selections. You can easily adjust quantities or remove items here.",
      icon: 'shopping_cart'
    },
    {
      title: "Secure Checkout",
      desc: "Provide your shipping details, choose your preferred payment method, and confirm your order in our secure environment.",
      icon: 'lock_person'
    },
    {
      title: "Order Confirmation",
      desc: "After placing your order, you'll receive a confirmation email with all details and a tracking number to follow your package.",
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
          Back
        </button>
        <div className="container mx-auto max-w-5xl relative">
          <h1 className="text-5xl font-black text-white mb-4 tracking-tight">How to Buy</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">New to ShopModern? Follow our simple step-by-step guide to start your shopping journey today.</p>
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
                <h2 className="text-2xl font-bold text-gray-900 m-0">The Shopping Process</h2>
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
              <h3 className="text-xl font-bold text-gray-900 mb-2 m-0">Need any assistance?</h3>
              <p className="text-gray-500 mb-6 m-0">Our team is available to help you with your order at any stage.</p>
              <button 
                onClick={() => navigate('/help')}
                className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-primary transition-all active:scale-95"
              >
                Visit Help Center
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
