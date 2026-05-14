import React from 'react';
import { useNavigate } from 'react-router-dom';

const categories = [
  {
    name: 'Women',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
    count: '240+ Products',
    color: 'bg-rose-500/10'
  },
  {
    name: 'Men',
    image: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=800&q=80',
    count: '180+ Products',
    color: 'bg-blue-500/10'
  },
  {
    name: 'Kids',
    image: 'https://images.unsplash.com/photo-1519234110450-1aa96369f468?auto=format&fit=crop&w=800&q=80',
    count: '150+ Products',
    color: 'bg-green-500/10'
  }
];

const CategoryShowcase = ({ categories }) => {
  const navigate = useNavigate();

  // Define default metadata for common categories
  const categoryMeta = {
    'Women': {
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
      count: '240+ Products',
      color: 'bg-rose-500/10'
    },
    'Men': {
      image: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=800&q=80',
      count: '180+ Products',
      color: 'bg-blue-500/10'
    },
    'Kids': {
      image: 'https://images.unsplash.com/photo-1519234110450-1aa96369f468?auto=format&fit=crop&w=800&q=80',
      count: '150+ Products',
      color: 'bg-green-500/10'
    }
  };

  // Merge dynamic categories with meta or use defaults
  const mainCategories = ['Women', 'Men', 'Kids'];
  
  const displayCategories = mainCategories.map(name => {
    const dynamicCat = categories?.find(c => (c.name || c) === name);
    const meta = categoryMeta[name];
    
    return {
      name,
      image: dynamicCat?.image || meta.image,
      count: meta.count,
      color: meta.color
    };
  });

  // Add any other dynamic categories found that aren't in the main list
  if (categories && categories.length > 0) {
    categories.forEach(cat => {
      const name = cat.name || cat;
      if (!mainCategories.includes(name)) {
        displayCategories.push({
          name,
          image: cat.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
          count: 'Check out our collection',
          color: 'bg-primary/5'
        });
      }
    });
  }

  return (
    <section className="space-y-6 mb-16">
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold text-heading-text">Curated Categories</h2>
          <p className="text-gray-500">Explore our wide range of premium collections</p>
        </div>
        <button 
          onClick={() => navigate('/products')}
          className="text-primary font-bold text-sm hover:underline flex items-center gap-1"
        >
          View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayCategories.map((cat, index) => (
          <div 
            key={index}
            onClick={() => navigate(`/products?categoryName=${cat.name}`)}
            className="group relative h-[400px] rounded-3xl overflow-hidden cursor-pointer shadow-soft hover:shadow-xl transition-all"
          >
            <img 
              src={cat.image} 
              alt={cat.name} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform">
              <span className={`inline-block px-3 py-1 ${cat.color} backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest rounded-full mb-3`}>
                {cat.count}
              </span>
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
