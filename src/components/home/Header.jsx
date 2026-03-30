import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext.jsx';

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    logout();
    setOpenMenu(false);
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-black/5">
      <div className="max-w-[1200px] mx-auto px-4 py-3 flex items-center justify-between gap-8">
        <div className="flex items-center gap-8 flex-1">
          <div className="flex items-center gap-2 shrink-0">
            <div className="size-9 bg-primary rounded flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-xl">shopping_basket</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-primary">ShopModern</h2>
          </div>

          <div className="flex-1 max-w-2xl">
            <div className="relative flex items-center">
              <input
                className="w-full h-10 pl-4 pr-12 bg-[#F5F5F5] border border-black/5 rounded focus:ring-1 focus:ring-primary focus:border-primary text-sm placeholder:text-[#999]"
                placeholder="Search for products, brands, and shops..."
                type="text"
              />
              <button className="absolute right-1 top-1 bottom-1 px-4 bg-primary text-white rounded flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">search</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <nav className="hidden lg:flex items-center gap-6">
            <Link
              className={`text-sm font-medium hover:text-primary transition-colors ${
                location.pathname === '/' ? 'text-primary' : 'text-heading'
              }`}
              to="/"
            >
              Home
            </Link>

            <Link
              className={`text-sm font-medium hover:text-primary transition-colors ${
                location.pathname === '/products' ? 'text-primary' : 'text-heading'
              }`}
              to="/products"
            >
              Products
            </Link>

            <a className="text-sm font-medium text-heading hover:text-primary transition-colors" href="#">
              Flash Sale
            </a>
            <a className="text-sm font-medium text-heading hover:text-primary transition-colors" href="#">
              Vouchers
            </a>
          </nav>

          <div className="h-6 w-px bg-black/5"></div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/cart')}
              type="button"
              className="relative p-2 text-heading hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined">shopping_cart</span>
              <span className="absolute top-0 right-0 size-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white">
                {cartCount}
              </span>
            </button>

            {isAuthenticated ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setOpenMenu(!openMenu)}
                  className="size-8 rounded-full bg-cover bg-center border border-black/5"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD_81lQTMq2eC__GSW-CPsbIeAP2br__-8QxeJL37GnKnn5onNgRVsbSC_YxeWINh77eLBs0B09d5QcoJKNgp0MUHFn2Peq2t4e3LoGR0yxCF1qNKmHn-QAQn3JuRvYPmvKEKGbHzt1wUaHGUVhZCFwabx3sM5ndox4GpAWTCnkh6hzpyDRAnpZIpQn_-5WeSQzq_Hy5gk1TrKqgr0QOqNCTHQ4B7Wv0Cp-T3E-stkODf11Lvpr371P0JrVZMf5bUp9HBf_kIjybOvm")'
                  }}
                ></button>

                {openMenu && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-black/10 rounded-lg shadow-lg py-2">
                    <button
                      onClick={() => {
                        setOpenMenu(false);
                        navigate('/profile');
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-heading hover:bg-gray-100"
                      type="button"
                    >
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-heading hover:bg-gray-100"
                      type="button"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className={`inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-bold transition-all active:scale-[0.98] ${
                  location.pathname === '/login'
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'border border-black/10 bg-white text-heading hover:bg-primary hover:text-white'
                }`}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;