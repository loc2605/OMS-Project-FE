import React, { useState } from 'react';

const Sidebar = ({ activeCategory, onCategoryChange, onPriceChange }) => {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleApplyPrice = () => {
    if (onPriceChange) {
      onPriceChange({
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
      });
    }
  };

  const handleReset = () => {
    setMinPrice('');
    setMaxPrice('');
    if (onPriceChange) {
      onPriceChange({ minPrice: undefined, maxPrice: undefined });
    }
    if (onCategoryChange) {
      onCategoryChange('');
    }
  };

  return (
    <aside className="w-48 shrink-0 hidden md:block">
      <div className="sticky top-24 space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-heading uppercase flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">list</span>
              Categories
            </h3>
            <button 
              onClick={handleReset} 
              className="size-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-primary transition-colors"
              title="Reset Filters"
            >
              <span className="material-symbols-outlined text-[16px]">filter_alt_off</span>
            </button>
          </div>
          <div className="space-y-1">
            {['Women', 'Men', 'Kids'].map((cat) => (
              <button 
                key={cat}
                onClick={() => onCategoryChange(activeCategory === cat ? '' : cat)}
                className={`w-full text-left px-2 py-2 text-base transition-colors rounded ${
                  activeCategory === cat ? 'text-primary bg-black/5 font-semibold' : 'text-heading hover:text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-black/5">
          <h3 className="text-sm font-bold text-heading uppercase">Price Range</h3>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input 
                className="w-full text-sm p-2 rounded border border-black/10 focus:ring-1 focus:ring-primary focus:border-primary" 
                placeholder="Min" 
                type="number" 
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <span className="text-gray-400">-</span>
              <input 
                className="w-full text-sm p-2 rounded border border-black/10 focus:ring-1 focus:ring-primary focus:border-primary" 
                placeholder="Max" 
                type="number" 
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
            <button onClick={handleApplyPrice} className="w-full py-2 bg-primary text-white text-sm font-bold rounded uppercase mt-2 hover:bg-primary/90 transition-colors">Apply</button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;