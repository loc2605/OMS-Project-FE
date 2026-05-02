import React from 'react';

const Sidebar = ({ activeCategory, onCategoryChange }) => {
  return (
    <aside className="w-48 shrink-0 hidden md:block">
      <div className="sticky top-24 space-y-6">
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-heading uppercase flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">list</span>
            Categories
          </h3>
          <div className="space-y-1">
            {['Electronics', 'Fashion', 'Home & Living', 'Beauty', 'Health'].map((cat) => (
              <button 
                key={cat}
                onClick={() => onCategoryChange(activeCategory === cat ? '' : cat)}
                className={`w-full text-left px-2 py-2 text-sm transition-colors rounded ${
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
              <input className="w-full text-xs p-2 rounded border border-black/10 focus:ring-1 focus:ring-primary focus:border-primary" placeholder="Min" type="text" />
              <span className="text-gray-400">-</span>
              <input className="w-full text-xs p-2 rounded border border-black/10 focus:ring-1 focus:ring-primary focus:border-primary" placeholder="Max" type="text" />
            </div>
            <button className="w-full py-2 bg-primary text-white text-xs font-bold rounded uppercase mt-2">Apply</button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;