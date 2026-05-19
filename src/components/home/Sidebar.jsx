import React, { useState } from 'react';

const Sidebar = ({ activeCategory, categories, onCategoryChange, onPriceChange, initialMinPrice, initialMaxPrice, onReset }) => {
  const [minPrice, setMinPrice] = useState(initialMinPrice || '');
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice || '');
  const sidebarRef = React.useRef(null);
  const [sidebarStyle, setSidebarStyle] = useState({ position: 'fixed', top: '112px', width: '192px' });

  React.useEffect(() => {
    setMinPrice(initialMinPrice || '');
    setMaxPrice(initialMaxPrice || '');
  }, [initialMinPrice, initialMaxPrice]);

  React.useEffect(() => {
    const handleScroll = () => {
      const footer = document.querySelector('footer');
      if (!footer || !sidebarRef.current) return;

      const footerRect = footer.getBoundingClientRect();
      const sidebarRect = sidebarRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const topOffset = 112; // top-28 is 112px
      const sidebarHeight = sidebarRect.height;

      const minTopOffset = 88; // Ensure it never goes higher than 88px from viewport top (keeping a clean gap under the ~65px header)

      // Check if footer is visible in the viewport
      if (footerRect.top < viewportHeight) {
        const availableHeight = footerRect.top - topOffset - 24; // 24px safety margin from the footer!
        if (availableHeight < sidebarHeight) {
          const diff = sidebarHeight - availableHeight;
          const calculatedTop = topOffset - diff;
          setSidebarStyle({
            position: 'fixed',
            top: `${Math.max(calculatedTop, minTopOffset)}px`,
            width: '192px'
          });
          return;
        }
      }

      setSidebarStyle({
        position: 'fixed',
        top: `${topOffset}px`,
        width: '192px'
      });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);

    const timeoutId1 = setTimeout(handleScroll, 100);
    const timeoutId2 = setTimeout(handleScroll, 500);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      clearTimeout(timeoutId1);
      clearTimeout(timeoutId2);
    };
  }, [categories]);

  const handleApplyPrice = () => {
    if (onPriceChange) {
      onPriceChange({
        minPrice: minPrice || '',
        maxPrice: maxPrice || '',
      });
    }
  };

  const handleReset = () => {
    setMinPrice('');
    setMaxPrice('');
    if (onReset) {
      onReset();
    } else {
      if (onPriceChange) {
        onPriceChange({ minPrice: '', maxPrice: '' });
      }
      if (onCategoryChange) {
        onCategoryChange('');
      }
    }
  };

  const displayCategories = categories && categories.length > 0 ? categories : ['Women', 'Men', 'Kids'];

  return (
    <aside className="w-48 shrink-0 hidden md:block">
      <div ref={sidebarRef} style={sidebarStyle} className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-heading uppercase flex items-center gap-1.5 tracking-wider">
              <span className="material-symbols-outlined text-[20px] text-primary">list</span>
              Categories
            </h3>
            <button
              onClick={handleReset}
              className="size-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-primary transition-colors"
              title="Reset Filters"
            >
              <span className="material-symbols-outlined text-[14px]">filter_alt_off</span>
            </button>
          </div>
          <div className="space-y-0.5">
            {displayCategories.map((cat) => {
              const name = typeof cat === 'string' ? cat : cat.name;
              return (
                <button
                  key={name}
                  onClick={() => onCategoryChange(activeCategory === name ? '' : name)}
                  className={`w-full text-left px-2 py-1.5 text-base transition-colors rounded ${activeCategory === name ? 'text-primary bg-black/5 font-semibold' : 'text-heading hover:text-primary'
                    }`}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3 pt-3 border-t border-black/5">
          <h3 className="text-[15px] font-bold text-heading uppercase tracking-wider">Price Range</h3>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <input
                className="w-full text-sm p-1.5 rounded border border-black/10 focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="Min"
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <span className="text-gray-400 text-xs">-</span>
              <input
                className="w-full text-sm p-1.5 rounded border border-black/10 focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="Max"
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
            <button onClick={handleApplyPrice} className="w-full py-1.5 bg-primary text-[15px] font-bold text-white rounded uppercase mt-1 hover:bg-primary/90 transition-colors">Apply</button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;