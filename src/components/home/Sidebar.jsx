import React, { useState } from 'react';

const CATEGORY_GROUPS = {
  "Thời trang": ["Thời trang Nam", "Thời trang Nữ", "Thời trang Trẻ em", "Giày dép", "Phụ kiện thời trang"],
  "Điện tử": ["Điện thoại", "Máy tính xách tay", "Máy tính bảng", "Tivi & Màn hình", "Tai nghe", "Máy ảnh", "Phụ kiện"],
  "Nhà cửa & Đời sống": ["Nội thất & Nhà cửa", "Thiết bị gia dụng", "Dụng cụ nhà bếp"],
  "Sức khỏe & Làm đẹp": ["Sức khỏe & Sắc đẹp"]
};

const Sidebar = ({ activeCategory, categories, onCategoryChange, onPriceChange, initialMinPrice, initialMaxPrice, onReset }) => {
  const [minPrice, setMinPrice] = useState(initialMinPrice || '');
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice || '');


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

  const displayCategories = categories || [];

  const groups = {};
  const ungrouped = [];

  displayCategories.forEach(cat => {
    const name = typeof cat === 'string' ? cat : cat.name;
    let found = false;
    for (const [groupName, items] of Object.entries(CATEGORY_GROUPS)) {
      if (items.includes(name)) {
        if (!groups[groupName]) groups[groupName] = [];
        groups[groupName].push(name);
        found = true;
        break;
      }
    }
    if (!found) {
      ungrouped.push(name);
    }
  });

  for (const groupName in groups) {
    if (groups[groupName].length <= 1) {
      ungrouped.push(...groups[groupName]);
      delete groups[groupName];
    }
  }

  const [expandedGroups, setExpandedGroups] = useState({});

  React.useEffect(() => {
    setMinPrice(initialMinPrice || '');
    setMaxPrice(initialMaxPrice || '');
  }, [initialMinPrice, initialMaxPrice]);

  React.useEffect(() => {
    if (activeCategory) {
      for (const [groupName, items] of Object.entries(CATEGORY_GROUPS)) {
        if (items.includes(activeCategory)) {
          setExpandedGroups(prev => ({ ...prev, [groupName]: true }));
        }
      }
    }
  }, [activeCategory]);

  return (
    <aside 
      className="w-full md:w-72 shrink-0 hidden md:block self-start overflow-y-auto scrollbar-hide pb-4"
      style={{ position: 'sticky', top: '72px', maxHeight: 'calc(100vh - 88px)', zIndex: 10 }}
    >
      <div className="space-y-6 bg-white rounded-[32px] border border-gray-100 shadow-sm p-5">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-semibold text-gray-900 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[20px] text-primary">list</span>
              Danh Mục
            </h3>
            <button
              onClick={handleReset}
              className="size-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-primary transition-colors"
              title="Xóa Bộ Lọc"
            >
              <span className="material-symbols-outlined text-[14px]">filter_alt_off</span>
            </button>
          </div>

          <div className="space-y-1">
            {Object.keys(groups).map(groupName => (
              <div key={groupName} className="border-b border-black/5 pb-1 last:border-0">
                <button
                  onClick={() => setExpandedGroups(prev => ({ ...prev, [groupName]: !prev[groupName] }))}
                  className="w-full flex items-center justify-between px-2 py-2 text-[15px] font-medium text-gray-700 hover:text-primary transition-colors"
                >
                  {groupName}
                  <span className={`material-symbols-outlined text-[15px] transition-transform ${expandedGroups[groupName] ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </button>
                {expandedGroups[groupName] && (
                  <div className="pl-3 pr-1 py-1 space-y-1">
                    {groups[groupName].map(name => (
                      <button
                        key={name}
                        onClick={() => onCategoryChange(name)}
                        className={`w-full text-left px-3 py-2 text-[15px] transition-colors rounded-2xl ${activeCategory === name ? 'text-primary bg-primary/10 font-semibold border border-primary/20' : 'font-medium text-gray-700 hover:text-primary hover:bg-gray-100'}`}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {ungrouped.length > 0 && (
              <>
                {ungrouped.map(name => (
                  <div key={name} className="border-b border-black/5 pb-1 last:border-0">
                    <button
                      onClick={() => onCategoryChange(name)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-[14px] font-medium transition-colors rounded-2xl ${activeCategory === name ? 'text-primary bg-primary/10' : 'text-gray-700 hover:text-primary hover:bg-gray-100'}`}
                    >
                      {name}
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        <div className="space-y-3 pt-3 border-t border-black/5">
          <h3 className="text-sm font-semibold text-gray-900">Khoảng Giá</h3>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input
                className="w-full text-sm p-2 rounded-2xl border border-gray-200 focus:ring-1 focus:ring-primary/20 focus:border-primary outline-none"
                placeholder="Từ"
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <span className="text-gray-400 text-xs">-</span>
              <input
                className="w-full text-sm p-2 rounded-2xl border border-gray-200 focus:ring-1 focus:ring-primary/20 focus:border-primary outline-none"
                placeholder="Đến"
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
            <button onClick={handleApplyPrice} className="w-full py-2 bg-primary text-[15px] font-semibold text-white rounded-2xl mt-1 hover:bg-[#d63013] transition-colors">Áp Dụng</button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;