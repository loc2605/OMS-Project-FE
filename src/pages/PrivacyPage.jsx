import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/home/Header';
import Footer from '../components/home/Footer';

const PrivacyPage = () => {
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
          <h1 className="text-5xl font-black text-white mb-4 tracking-tight">Privacy Policy</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">Your privacy is our top priority. Learn how we collect, use, and protect your personal data at ShopModern.</p>
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-12 max-w-5xl">
        {/* Content Area */}
        <div className="bg-white p-8 md:p-16 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100">
          <div className="prose prose-orange max-w-none space-y-12">
            <section id="collection">
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary">analytics</span>
                </span>
                <h2 className="text-2xl font-bold text-gray-900 m-0">1. Information Collection</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                We collect information you provide directly to us, such as when you create an account, place an order, or contact us for support. This personal information may include your name, email address, phone number, and shipping address, which is essential for processing your transactions.
              </p>
            </section>

            <section id="use">
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary">smart_toy</span>
                </span>
                <h2 className="text-2xl font-bold text-gray-900 m-0">2. Use of Information</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                We use the information we collect to process your orders, provide customer support, improve our services, and send you marketing communications. Your data helps us personalize your shopping experience and provide you with relevant product recommendations.
              </p>
            </section>

            <section id="security">
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary">security</span>
                </span>
                <h2 className="text-2xl font-bold text-gray-900 m-0">3. Data Security</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                We implement a variety of high-level security measures, including SSL encryption and secure databases, to maintain the safety of your personal information. Access to your sensitive data is restricted to authorized personnel only who are required to keep the information confidential.
              </p>
            </section>

            <section id="disclosure">
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary">share</span>
                </span>
                <h2 className="text-2xl font-bold text-gray-900 m-0">4. Third-Party Disclosure</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties without your consent, except for trusted third parties who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential.
              </p>
            </section>

            <section id="cookies">
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary">cookie</span>
                </span>
                <h2 className="text-2xl font-bold text-gray-900 m-0">5. Cookies</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                Our website uses cookies to enhance your experience. These are small files that allow us to remember your preferences and recognize you on return visits. You can choose to turn off cookies through your browser settings, though this may affect the functionality of some features of our site.
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

export default PrivacyPage;
