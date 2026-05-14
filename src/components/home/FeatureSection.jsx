import React from 'react';

const features = [
  {
    icon: 'package_2',
    title: 'Fast Delivery',
    description: 'Free shipping on all orders over $100',
    gradient: 'from-blue-500/20 to-cyan-500/20'
  },
  {
    icon: 'shield_lock',
    title: 'Secure Payment',
    description: '100% secure payment processing',
    gradient: 'from-emerald-500/20 to-teal-500/20'
  },
  {
    icon: 'published_with_changes',
    title: 'Easy Returns',
    description: '30-day money-back guarantee',
    gradient: 'from-orange-500/20 to-amber-500/20'
  },
  {
    icon: 'headset_mic',
    title: '24/7 Support',
    description: 'Dedicated support for our customers',
    gradient: 'from-rose-500/20 to-pink-500/20'
  }
];

const FeatureSection = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
      {features.map((feature, index) => (
        <div 
          key={index} 
          className="group p-6 bg-white rounded-3xl shadow-soft hover:shadow-xl transition-all border border-black/5 hover:-translate-y-1"
        >
          <div className={`size-14 rounded-2xl bg-gradient-to-br ${feature.gradient} text-primary flex items-center justify-center mb-5 group-hover:rotate-12 transition-all duration-500`}>
            <span className="material-symbols-outlined text-[28px]">{feature.icon}</span>
          </div>
          <h3 className="text-lg font-bold text-heading-text mb-2">{feature.title}</h3>
          <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
        </div>
      ))}
    </section>
  );
};

export default FeatureSection;
