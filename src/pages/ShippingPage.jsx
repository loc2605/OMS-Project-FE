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
          Back
        </button>
        <div className="container mx-auto max-w-5xl relative">
          <h1 className="text-5xl font-black text-white mb-4 tracking-tight">Shipping & Delivery</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">Fast, reliable, and secure. Learn more about our shipping methods, rates, and tracking options.</p>
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
                <h2 className="text-2xl font-bold text-gray-900 m-0">Shipping Methods</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-2 m-0 text-xl">Standard Shipping</h3>
                  <p className="text-primary font-black mb-4 uppercase tracking-widest text-xs">5-7 Business Days</p>
                  <p className="text-gray-600 m-0">Ideal for non-urgent deliveries with the best value.</p>
                </div>
                <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-2 m-0 text-xl">Express Shipping</h3>
                  <p className="text-primary font-black mb-4 uppercase tracking-widest text-xs">2-3 Business Days</p>
                  <p className="text-gray-600 m-0">Priority handling for when you need your items quickly.</p>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary">payments</span>
                </span>
                <h2 className="text-2xl font-bold text-gray-900 m-0">Shipping Rates</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                Shipping rates are calculated based on the total weight of your order and your destination. We offer <span className="font-bold text-gray-900">Free Standard Shipping</span> on all domestic orders over <span className="font-bold text-gray-900">$150</span>.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary">public</span>
                </span>
                <h2 className="text-2xl font-bold text-gray-900 m-0">International Shipping</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                We currently ship to over 50 countries worldwide. Please be aware that international shipments may be subject to customs duties and taxes upon arrival, which are the responsibility of the recipient.
              </p>
            </section>

            <section id="tracking">
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary">location_on</span>
                </span>
                <h2 className="text-2xl font-bold text-gray-900 m-0">Order Tracking</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                Once your order has been dispatched, you will receive a confirmation email containing a tracking number. You can monitor your package's journey through our website or directly via the courier's tracking portal.
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
