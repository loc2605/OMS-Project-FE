import React from 'react';

const Sidebar = () => {
  return (
    <aside className="w-48 shrink-0 hidden md:block">
      <div className="sticky top-24 space-y-6">
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-heading uppercase flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">list</span>
            Categories
          </h3>
          <div className="space-y-1">
            <button className="w-full text-left px-2 py-2 text-primary text-sm font-semibold rounded hover:bg-black/5">
              Electronics
            </button>
            <button className="w-full text-left px-2 py-2 text-heading text-sm hover:text-primary transition-colors">
              Fashion
            </button>
            <button className="w-full text-left px-2 py-2 text-heading text-sm hover:text-primary transition-colors">
              Home & Living
            </button>
            <button className="w-full text-left px-2 py-2 text-heading text-sm hover:text-primary transition-colors">
              Beauty
            </button>
            <button className="w-full text-left px-2 py-2 text-heading text-sm hover:text-primary transition-colors">
              Health
            </button>
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