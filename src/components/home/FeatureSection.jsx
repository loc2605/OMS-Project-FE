import React from 'react';

const features = [
  {
    icon: 'local_shipping',
    title: 'Fast Delivery',
    description: 'Free shipping on all orders over $100'
  },
  {
    icon: 'verified_user',
    title: 'Secure Payment',
    description: '100% secure payment processing'
  },
  {
    icon: 'history',
    title: 'Easy Returns',
    description: '30-day money-back guarantee'
  },
  {
    icon: 'support_agent',
    title: '24/7 Support',
    description: 'Dedicated support for our customers'
  }
];

const FeatureSection = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
      {features.map((feature, index) => (
        <div 
          key={index} 
          className="group p-6 bg-card-white rounded-2xl shadow-soft hover:shadow-lg transition-all border border-transparent hover:border-primary/10"
        >
          <div className="size-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-2xl">{feature.icon}</span>
          </div>
          <h3 className="font-bold text-heading-text mb-1">{feature.title}</h3>
          <p className="text-sm text-gray-500">{feature.description}</p>
        </div>
      ))}
    </section>
  );
};

export default FeatureSection;
