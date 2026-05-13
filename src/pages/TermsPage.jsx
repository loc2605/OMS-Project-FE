import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/home/Header';
import Footer from '../components/home/Footer';

const TermsPage = () => {
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
          <h1 className="text-5xl font-black text-white mb-4 tracking-tight">Terms & Conditions</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">Please read these terms carefully before using our platform. These terms govern your access to and use of ShopModern.</p>
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-12 max-w-5xl">
        {/* Content Area */}
        <div className="bg-white p-8 md:p-16 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100">
          <div className="prose prose-orange max-w-none space-y-12">
            <section id="acceptance">
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary">verified_user</span>
                </span>
                <h2 className="text-2xl font-bold text-gray-900 m-0">1. Acceptance of Terms</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                By accessing and using <span className="font-bold text-primary">ShopModern</span>, you agree to be bound by these Terms and Conditions. Our platform is designed to provide high-quality fashion products and services. If you do not agree to all of these terms, you are prohibited from using this website.
              </p>
            </section>

            <section id="intellectual">
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary">copyright</span>
                </span>
                <h2 className="text-2xl font-bold text-gray-900 m-0">2. Intellectual Property</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                The Service and its original content, features, and functionality are and will remain the exclusive property of ShopModern and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent.
              </p>
            </section>

            <section id="accounts">
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary">person_outline</span>
                </span>
                <h2 className="text-2xl font-bold text-gray-900 m-0">3. User Accounts</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
              </p>
            </section>

            <section id="shipping">
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary">local_shipping</span>
                </span>
                <h2 className="text-2xl font-bold text-gray-900 m-0">4. Shipping & Returns</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                We are committed to fast delivery, aiming for 24-48 hour fulfillment. Our return policy is designed to be customer-friendly, allowing returns within 30 days of receipt. All items must be in original condition, with tags attached and in original packaging.
              </p>
            </section>

            <section id="liability">
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary">gavel</span>
                </span>
                <h2 className="text-2xl font-bold text-gray-900 m-0">5. Limitation of Liability</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                In no event shall ShopModern, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
              </p>
            </section>

            <section id="governing">
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary">language</span>
                </span>
                <h2 className="text-2xl font-bold text-gray-900 m-0">6. Governing Law</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                These Terms shall be governed and construed in accordance with the laws of the jurisdiction, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
              </p>
            </section>

            <div className="pt-12 border-t border-gray-100 text-gray-400 text-sm">
              <p className="italic">Last Updated: May 13, 2026</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsPage;
