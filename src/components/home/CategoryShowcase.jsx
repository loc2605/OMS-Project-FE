import React from 'react';
import { useNavigate } from 'react-router-dom';

const CategoryShowcase = ({ categories }) => {
  const navigate = useNavigate();

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6 mb-8">
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold text-heading-text">Curated Categories</h2>
          <p className="text-gray-500">Explore our wide range of premium collections</p>
        </div>
        <button 
          onClick={() => navigate('/products')}
          className="text-primary font-bold text-sm hover:underline flex items-center gap-1"
        >
          View All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat, index) => (
          <div 
            key={index}
            onClick={() => navigate(`/products?categoryName=${cat.name}`)}
            className="group relative h-[400px] rounded-3xl overflow-hidden cursor-pointer shadow-soft hover:shadow-xl transition-all"
          >
            <img 
              src={cat.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80'} 
              alt={cat.name} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform">
              <h3 className="text-2xl font-bold text-white mb-2">{cat.name}</h3>
              <div className="flex items-center gap-2 text-white/80 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Discover More <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryShowcase;
