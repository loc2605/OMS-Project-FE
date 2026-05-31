import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext.jsx';
import notificationApi from '../../api/notificationApi';

const getLocalizedNotification = (noti) => {
  if (!noti) return null;
  let title = noti.title;
  let content = noti.content;

  if (title === 'Order Update') {
    title = 'Cập nhật đơn hàng';
  } else if (title === 'Delivery Update') {
    title = 'Cập nhật vận chuyển';
  }

  content = content
    .replace(/Order confirmation for order ID /gi, 'Đã xác nhận đơn hàng ')
    .replace(/is processing/gi, 'đang được xử lý')
    .replace(/Shipper /gi, 'Người giao hàng ')
    .replace(/ assigned to deliver order ID /gi, ' đã được phân phối để giao đơn hàng ')
    .replace(/Order ID /gi, 'Đơn hàng ')
    .replace(/ has been successfully delivered/gi, ' đã được giao thành công')
    .replace(/Delivery failed for order ID /gi, 'Giao hàng thất bại cho đơn hàng ')
    .replace(/ due to /gi, ' do ')
    .replace(/Order cancelled for order ID /gi, 'Đơn hàng đã bị hủy cho mã đơn ')
    .replace(/ due to inventory issues/gi, ' do sự cố hàng tồn kho');

  return { ...noti, title, content };
};

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

  // Notifications state
  const [openNotification, setOpenNotification] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [expandedNotificationId, setExpandedNotificationId] = useState(null);
  const [toastNoti, setToastNoti] = useState(null);
  const notificationRef = useRef(null);

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

  const handleNotificationClick = async (noti) => {
    // Toggle expansion inline
    if (expandedNotificationId === noti.id) {
      setExpandedNotificationId(null);
    } else {
      setExpandedNotificationId(noti.id);

      // Mark as read if not already read
      if (!noti.read) {
        try {
          await notificationApi.markAsRead(noti.id);
          setNotifications(prev => prev.map(n => n.id === noti.id ? { ...n, read: true } : n));
          setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
          console.error('Failed to mark notification as read:', error);
        }
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      const fetchNotifications = async () => {
        try {
          // Request more notifications (increase limit) so dropdown can show more items
          const response = await notificationApi.getMyNotifications({ size: 100 });
          if (response.success) {
            const notifs = response.result?.content || [];

            setNotifications(prev => {
              if (prev.length > 0) {
                const newFirst = notifs[0];
                const oldFirst = prev[0];
                if (newFirst && oldFirst && newFirst.id !== oldFirst.id && !newFirst.read) {
                  // Show toast for new notifications
                  if (newFirst.title === 'Order Update' || newFirst.title === 'Delivery Update' || newFirst.title === 'Cập nhật đơn hàng' || newFirst.title === 'Cập nhật vận chuyển') {
                    setToastNoti(newFirst);
                    window.dispatchEvent(new CustomEvent('notification-received', { detail: newFirst }));
                    setTimeout(() => setToastNoti(null), 5000);
                  }
                }
              }
              return notifs;
            });
            setUnreadCount(notifs.filter(n => !n.read).length);
          }
        } catch (error) {
          console.error('Failed to fetch notifications:', error);
        }
      };

      fetchNotifications();
      const intervalId = setInterval(fetchNotifications, 2000); // 2 seconds
      return () => clearInterval(intervalId);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setOpenNotification(false);
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
                  placeholder="Tìm kiếm tên sản phẩm"
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
              Trang Chủ
            </Link>

            <Link
              className={`text-sm font-medium hover:text-primary transition-colors ${location.pathname === '/products' ? 'text-primary' : 'text-heading'
                }`}
              to="/products"
            >
              Sản Phẩm
            </Link>

            <Link
              className={`text-sm font-medium hover:text-primary transition-colors ${location.pathname === '/orders' ? 'text-primary' : 'text-heading'
                }`}
              to="/orders"
            >
              Đơn Hàng Của Tôi
            </Link>


          </nav>

          <div className="h-6 w-px bg-black/5"></div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => {
                    setOpenNotification(!openNotification);
                    if (!openNotification && unreadCount > 0) {
                      setUnreadCount(0);
                    }
                  }}
                  type="button"
                  className="relative p-2 text-heading hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined">notifications</span>
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 size-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {openNotification && (
                  <div className="absolute right-0 mt-2 w-[400px] bg-white border border-black/10 rounded-sm shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                      <h3 className="text-sm font-bold text-gray-800">Thông báo mới nhận</h3>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                      {loadingNotifications ? (
                        <div className="flex justify-center items-center py-8">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        </div>
                      ) : notifications.length > 0 ? (
                        <div className="divide-y divide-gray-50">
                          {notifications.map((noti) => {
                            const locNoti = getLocalizedNotification(noti);
                            const isExpanded = expandedNotificationId === locNoti.id;
                            const orderMatch = locNoti.content.match(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i);
                            return (
                              <div
                                key={locNoti.id}
                                onClick={() => handleNotificationClick(locNoti)}
                                className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${!locNoti.read ? 'bg-primary/5' : ''}`}
                              >
                                <h4 className="text-sm font-medium text-gray-800 mb-1">{locNoti.title}</h4>
                                <p className={`text-xs text-gray-600 leading-relaxed ${isExpanded ? 'whitespace-pre-wrap' : 'line-clamp-2'}`}>
                                  {locNoti.content}
                                </p>
                                <span className="text-[10px] text-gray-400 mt-2 block">
                                  {new Date(locNoti.createdAt).toLocaleString('vi-VN')}
                                </span>

                                {isExpanded && orderMatch && (
                                  <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenNotification(false);
                                        navigate(`/order/${orderMatch[0]}`);
                                      }}
                                      className="px-4 py-1.5 bg-primary text-white text-xs font-medium rounded-sm hover:bg-primary/90 transition-all shadow-sm"
                                    >
                                      Xem chi tiết đơn hàng
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="py-12 text-center flex flex-col items-center">
                          <span className="material-symbols-outlined text-gray-300 text-4xl mb-2">notifications_off</span>
                          <p className="text-sm text-gray-500">Chưa có thông báo nào.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

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
                      Hồ sơ
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-heading hover:bg-gray-100"
                      type="button"
                    >
                      Đăng xuất
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
                Đăng Nhập
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastNoti && (() => {
        const locToast = getLocalizedNotification(toastNoti);
        return (
          <div className="fixed bottom-6 right-6 bg-white border-l-4 border-primary rounded-sm shadow-2xl p-4 w-[350px] z-[9999] animate-in slide-in-from-right-8 fade-in duration-300">
            <div className="flex justify-between items-start mb-1">
              <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">notifications_active</span>
                {locToast.title}
              </h4>
              <button onClick={() => setToastNoti(null)} className="text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed mt-2 line-clamp-3">
              {locToast.content}
            </p>
          </div>
        );
      })()}
    </header>
  );
};

export default Header;