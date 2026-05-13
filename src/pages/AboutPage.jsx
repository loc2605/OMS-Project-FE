import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/home/Header';
import Footer from '../components/home/Footer';

const AboutPage = () => {
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
          <h1 className="text-5xl font-black text-white mb-4 tracking-tight">About ShopModern</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">Discover our story, mission, and why we are the leading choice for modern shoppers worldwide.</p>
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-12 max-w-5xl">
        <div className="bg-white p-8 md:p-16 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100">
          <div className="prose prose-orange max-w-none space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary">rocket_launch</span>
                </span>
                <h2 className="text-2xl font-bold text-gray-900 m-0">Our Story</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                Founded in 2026, ShopModern was built on the principle of providing high-quality products that complement the modern, fast-paced lifestyle. We believe that shopping should be seamless, enjoyable, and reliable.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary">visibility</span>
                </span>
                <h2 className="text-2xl font-bold text-gray-900 m-0">Our Mission</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                Our mission is to bring the world's best brands and products to your doorstep. We leverage advanced microservices technology to ensure a fast, secure, and personalized shopping experience for every customer.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="p-2 bg-primary/10 rounded-lg">
                  <span className="material-symbols-outlined text-primary">verified</span>
                </span>
                <h2 className="text-2xl font-bold text-gray-900 m-0">Why Choose Us?</h2>
              </div>
              <ul className="list-none p-0 space-y-4">
                {[
                  { icon: 'check_circle', title: 'Quality Assured', desc: 'Every product on our platform undergoes a strict quality check.' },
                  { icon: 'speed', title: 'Fast Delivery', desc: 'We partner with global logistics leaders to ensure your orders arrive on time.' },
                  { icon: 'shield_lock', title: 'Secure Payments', desc: 'Industry-leading encryption for all your transactions.' }
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 items-start p-4 rounded-2xl bg-gray-50">
                    <span className="material-symbols-outlined text-primary">{item.icon}</span>
                    <div>
                      <h4 className="font-bold text-gray-900">{item.title}</h4>
                      <p className="text-gray-500 text-sm">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <div className="pt-12 border-t border-gray-100 text-gray-400 text-sm">
              <p className="italic">Join us in redefining the future of e-commerce.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
