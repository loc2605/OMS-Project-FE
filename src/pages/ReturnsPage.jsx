import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/home/Header';
import Footer from '../components/home/Footer';

const ReturnsPage = () => {
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
          <h1 className="text-5xl font-black text-white mb-4 tracking-tight">Returns & Refunds</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">Not happy with your purchase? No problem. Our simple return process ensures you can shop with confidence.</p>
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-12 max-w-5xl">
        <div className="bg-white p-8 md:p-16 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100">
          <div className="prose prose-orange max-w-none space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary">assignment_return</span>
                </span>
                <h2 className="text-2xl font-bold text-gray-900 m-0">Return Policy</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                We want you to be completely satisfied with your purchase. If for any reason you are not happy, you can return most items within <span className="font-bold text-gray-900">30 days</span> of delivery for a full refund or exchange.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary">fact_check</span>
                </span>
                <h2 className="text-2xl font-bold text-gray-900 m-0">Conditions for Return</h2>
              </div>
              <ul className="list-none p-0 space-y-4">
                {[
                  { icon: 'inventory_2', title: 'Original Packaging', desc: 'Items must be returned in their original packaging with all tags attached.' },
                  { icon: 'new_releases', title: 'Unused Condition', desc: 'The item must be unused, unwashed, and in the same condition as received.' },
                  { icon: 'receipt_long', title: 'Proof of Purchase', desc: 'A valid receipt or order number is required for all returns.' }
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 items-start p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <span className="material-symbols-outlined text-primary">{item.icon}</span>
                    <div>
                      <h4 className="font-bold text-gray-900 m-0">{item.title}</h4>
                      <p className="text-gray-500 text-sm m-0">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary">published_with_changes</span>
                </span>
                <h2 className="text-2xl font-bold text-gray-900 m-0">Refund Process</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                Once we receive and inspect your returned item, we will send you an email notification. If approved, your refund will be automatically applied to your original method of payment within <span className="font-bold text-gray-900">5-10 business days</span>.
              </p>
            </section>

            <div className="bg-orange-50 border-l-8 border-primary p-8 rounded-2xl">
              <div className="flex gap-4 items-center">
                <span className="material-symbols-outlined text-primary text-3xl font-black">warning</span>
                <div>
                  <h4 className="text-primary font-black uppercase tracking-widest text-xs mb-1 m-0">Important Note</h4>
                  <p className="text-sm text-gray-700 m-0">Customized products, perishables, and clearance items are not eligible for return unless they arrive damaged or defective.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReturnsPage;
