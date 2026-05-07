import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext.jsx';

const Header = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const { cartCount, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [openMenu, setOpenMenu] = useState(false);
  const searchParams = new URLSearchParams(location.search);
  const searchParamValue = searchParams.get('search') || '';
  const [searchValue, setSearchValue] = useState(searchParamValue);
  const menuRef = useRef(null);

  useEffect(() => {
    setSearchValue(searchParamValue);
  }, [searchParamValue]);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (searchValue.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchValue.trim())}`);
    } else {
      navigate('/products');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearSearch = () => {
    setSearchValue('');
    navigate('/products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    logout();
    clearCart();
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
      <div className="max-w-full mx-auto px-4 md:px-8 lg:px-12 py-3 flex items-center justify-between gap-8">
        <div className="flex items-center gap-8 flex-1">
          <div className="flex items-center gap-2 shrink-0">
            <div className="size-9 bg-primary rounded flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-xl">shopping_basket</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[#181411]">Shop<span className="text-primary">Modern</span></h2>
          </div>

          <div className="flex-1 max-w-2xl">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <div className="relative flex items-center w-full">
                <input
                  className="w-full h-10 pl-4 pr-[80px] bg-[#F5F5F5] border border-black/5 rounded focus:ring-1 focus:ring-primary focus:border-primary text-sm placeholder:text-[#999]"
                  placeholder="Search for product name"
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                {searchValue && (
                  <button 
                    type="button" 
                    onClick={handleClearSearch} 
                    className="absolute right-12 text-gray-400 hover:text-gray-600 flex items-center justify-center p-1"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                )}
                <button type="submit" className="absolute right-1 top-1 bottom-1 px-3 bg-primary text-white rounded flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">search</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <nav className="hidden lg:flex items-center gap-6">
            <Link
              className={`text-sm font-medium hover:text-primary transition-colors ${location.pathname === '/' ? 'text-primary' : 'text-heading'
                }`}
              to="/"
            >
              Home
            </Link>

            <Link
              className={`text-sm font-medium hover:text-primary transition-colors ${location.pathname === '/products' ? 'text-primary' : 'text-heading'
                }`}
              to="/products"
            >
              Products
            </Link>

            <Link
              className={`text-sm font-medium hover:text-primary transition-colors ${location.pathname === '/orders' ? 'text-primary' : 'text-heading'
                }`}
              to="/orders"
            >
              My Orders
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
                  className="size-8 rounded-full bg-cover bg-center border border-black/5 flex items-center justify-center overflow-hidden"
                  style={{
                    backgroundImage: `url("${user?.avatarUrl || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}")`
                  }}
                >
                  {!user?.avatarUrl && (
                    <span className="material-symbols-outlined text-gray-400 text-xl">account_circle</span>
                  )}
                </button>

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
                className={`inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-bold transition-all active:scale-[0.98] ${location.pathname === '/login'
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