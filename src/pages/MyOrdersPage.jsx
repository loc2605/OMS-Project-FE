import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext.jsx';
import Header from '../components/home/Header';
import orderApi from '../api/orderApi';

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const translateStatus = (status) => {
    switch (status) {
      case 'PENDING_VALIDATION': return 'Đang xác thực';
      case 'PENDING': return 'Chờ xử lý';
      case 'PAYMENT_PENDING': return 'Chờ thanh toán';
      case 'CONFIRMED': return 'Đã xác nhận';
      case 'SHIPPING': return 'Đang giao hàng';
      case 'COMPLETED': return 'Hoàn thành';
      case 'CANCELLED': return 'Đã hủy';
      default: return status ? status.replace(/_/g, ' ') : '';
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm]);

  const tabs = [
    { id: 'ALL', label: 'Tất cả' },
    { id: 'PENDING', label: 'Chờ xử lý' },
    { id: 'CONFIRMED', label: 'Đã xác nhận' },
    { id: 'SHIPPING', label: 'Đang giao' },
    { id: 'COMPLETED', label: 'Hoàn thành' },
    { id: 'CANCELLED', label: 'Đã hủy' },
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await orderApi.getMyOrders();
        if (response.success) {
          setOrders(response.result.content || response.result || []);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = Array.isArray(orders)
    ? orders.filter(order => {
      // Group PENDING, PENDING_VALIDATION, and PAYMENT_PENDING under the 'PENDING' tab
      const matchesTab = activeTab === 'ALL' || 
        (activeTab === 'PENDING' && ['PENDING', 'PENDING_VALIDATION', 'PAYMENT_PENDING'].includes(order.status)) ||
        order.status === activeTab;
      
      const searchLower = searchTerm.toLowerCase();
      const matchesId = order.orderId.toLowerCase().includes(searchLower);
      const matchesProduct = order.orderItems && order.orderItems.some(item => 
        item.productName.toLowerCase().includes(searchLower)
      );
      const matchesReceiver = order.shippingAddress && order.shippingAddress.receiverName && 
        order.shippingAddress.receiverName.toLowerCase().includes(searchLower);
      return matchesTab && (matchesId || matchesProduct || matchesReceiver);
    })
    : [];

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const pagedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const handleReorder = (order) => {
    if (order.orderItems && order.orderItems.length > 0) {
      order.orderItems.forEach(item => {
        const product = {
          id: item.productId,
          name: item.productName,
          price: item.price,
          image: item.imageUrl,
        };
        addToCart(product, item.quantity);
      });
      navigate('/cart');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount).replace('₫', 'đ');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'SHIPPING': return 'text-indigo-600 bg-indigo-50 border-indigo-100';
      case 'CONFIRMED': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'CANCELLED': return 'text-rose-600 bg-rose-50 border-rose-100';
      case 'PENDING':
      case 'PENDING_VALIDATION':
      case 'PAYMENT_PENDING': return 'text-amber-600 bg-amber-50 border-amber-100';
      default: return 'text-gray-500 bg-gray-50 border-gray-100';
    }
  };

  return (
    <div className="bg-[#f5f5f5] min-h-screen pb-10">
      <Header />

      <main className="max-w-[1400px] mx-auto px-4 pt-6">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Sidebar - Search & Filter */}
          <aside className="w-full lg:w-[320px] sticky top-[80px] space-y-6">
            <div className="bg-white rounded-sm shadow-sm p-6 space-y-8">
              {/* Search Section */}
              <div>
                <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">search</span>
                  TÌM KIẾM ĐƠN HÀNG
                </h3>
                <div className="flex shadow-sm">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Nhập mã đơn hàng"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full h-full bg-[#f8f8f8] border border-gray-200 border-r-0 rounded-l-sm py-2.5 pl-4 pr-10 text-sm outline-none focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary focus:bg-white transition-all relative z-10"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center outline-none z-20 w-6 h-6 rounded-full hover:bg-gray-200"
                        title="Xóa tìm kiếm"
                      >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                    )}
                  </div>
                  <button className="bg-primary hover:opacity-90 text-white px-4 py-2.5 rounded-r-sm flex items-center justify-center transition-all border border-primary z-10 shadow-sm shadow-primary/20">
                    <span className="material-symbols-outlined text-[20px]">search</span>
                  </button>
                </div>
              </div>

              {/* Status Filter Section */}
              <div>
                <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">filter_list</span>
                  TRẠNG THÁI ĐƠN HÀNG
                </h3>
                <div className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-sm text-sm transition-all ${activeTab === tab.id
                          ? 'bg-primary text-white font-medium shadow-md shadow-primary/20'
                          : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      <span>{tab.label}</span>
                      {activeTab === tab.id && (
                        <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>


            </div>
          </aside>

          {/* Main Content - Orders List */}
          <div className="flex-1 w-full">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 bg-white rounded-sm shadow-sm">
                <div className="size-12 border-4 border-gray-100 border-t-primary rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 text-sm">Đang tải danh sách đơn hàng của bạn...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="bg-white rounded-sm shadow-sm py-32 text-center">
                <div className="size-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="material-symbols-outlined text-gray-300 text-6xl">order_approve</span>
                </div>
                <h3 className="text-lg font-medium text-gray-800">Không tìm thấy đơn hàng nào</h3>
                <p className="text-gray-400 text-sm mt-2">Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm.</p>
                {activeTab !== 'ALL' || searchTerm !== '' ? (
                  <button
                    onClick={() => { setActiveTab('ALL'); setSearchTerm(''); }}
                    className="mt-6 text-primary text-sm font-medium hover:underline"
                  >
                    Xóa tất cả bộ lọc
                  </button>
                ) : null}
              </div>
            ) : (
              <div className="space-y-4">
                {pagedOrders.map((order) => (
                  <div key={order.orderId} className="bg-white rounded-sm shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 hover:shadow-md transition-shadow">
                    {/* Order Header */}
                    <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-[#fcfcfc]">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-gray-800">Mã đơn hàng: {order.orderId}</span>
                        <span className="text-gray-300">|</span>
                        <span className="text-xs text-gray-500">{formatDate(order.createdAt)}</span>
                      </div>
                      <span className={`text-[11px] font-bold uppercase px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                        {translateStatus(order.status)}
                      </span>
                    </div>

                    {/* Order Content */}
                    <div className="p-6 bg-white border-b border-gray-50/50">
                      {order.orderItems && order.orderItems.length > 0 ? (
                        <div className="flex justify-between items-center">
                          <div className="flex gap-4">
                            <div className="size-20 bg-gray-50 rounded-sm flex items-center justify-center border border-gray-100 flex-shrink-0 overflow-hidden">
                              {order.orderItems[0].imageUrl ? (
                                <img src={order.orderItems[0].imageUrl} alt={order.orderItems[0].productName} className="w-full h-full object-cover" />
                              ) : (
                                <span className="material-symbols-outlined text-gray-300 text-4xl">inventory_2</span>
                              )}
                            </div>
                            <div className="flex flex-col justify-center">
                              <h4 className="text-sm font-medium text-gray-800 line-clamp-2">
                                {order.orderItems[0].productName}
                              </h4>
                              <p className="text-sm text-gray-400 mt-1">
                                Số lượng: {order.orderItems[0].quantity}
                              </p>
                              {order.orderItems.length > 1 && (
                                <p className="text-sm text-primary/70 mt-1 font-medium">
                                  + {order.orderItems.length - 1} sản phẩm khác
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-primary font-medium">{formatCurrency(order.orderItems[0].price)}</div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4">
                          <div className="size-20 bg-gray-50 rounded-sm flex items-center justify-center border border-gray-100">
                            <span className="material-symbols-outlined text-gray-300 text-4xl">inventory_2</span>
                          </div>
                          <p className="text-sm text-gray-500 italic">Không có thông tin sản phẩm</p>
                        </div>
                      )}
                    </div>

                    <div className="px-6 py-4 flex justify-end items-center gap-2 bg-[#fdfdfd]">
                      <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
                      <span className="text-sm text-gray-600">Tổng tiền đơn hàng:</span>
                      <span className="text-xl font-bold text-primary ml-2">{formatCurrency(order.totalAmount)}</span>
                    </div>

                    {/* Order Footer */}
                    <div className="px-6 py-4 bg-[#fffcf5] border-t border-gray-50 flex justify-end gap-3">
                      <button
                        onClick={() => handleReorder(order)}
                        className="px-6 py-2 bg-white text-primary border border-primary text-sm font-medium rounded-sm hover:bg-primary/5 transition-all shadow-sm flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[18px]">replay</span>
                        Mua lại
                      </button>
                      <button
                        onClick={() => navigate(`/order/${order.orderId}`)}
                        className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-sm hover:bg-primary/90 transition-all shadow-sm"
                      >
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                ))}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <div className="flex items-center gap-1 text-sm">
                      <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className="px-4 py-2 text-body-text hover:text-primary transition-colors disabled:opacity-30 disabled:hover:text-body-text cursor-pointer disabled:cursor-not-allowed"
                      >
                        <span className="material-symbols-outlined">chevron_left</span>
                      </button>
                      {[...Array(totalPages)].map((_, idx) => {
                        const pageNum = idx + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-8 h-8 flex items-center justify-center rounded transition-colors cursor-pointer ${
                              currentPage === pageNum 
                                ? 'bg-primary text-white font-medium shadow-sm' 
                                : 'hover:bg-primary/10 text-body-text'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        className="px-4 py-2 text-body-text hover:text-primary transition-colors disabled:opacity-30 disabled:hover:text-body-text cursor-pointer disabled:cursor-not-allowed"
                      >
                        <span className="material-symbols-outlined">chevron_right</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyOrdersPage;
