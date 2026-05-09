import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/home/Header';
import orderApi from '../api/orderApi';

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');

  const tabs = [
    { id: 'ALL', label: 'All' },
    { id: 'PENDING', label: 'Pending' },
    { id: 'CONFIRMED', label: 'Confirmed' },
    { id: 'SHIPPING', label: 'Shipping' },
    { id: 'COMPLETED', label: 'Completed' },
    { id: 'CANCELLED', label: 'Cancelled' },
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
    ? (activeTab === 'ALL' ? orders : orders.filter(order => order.status === activeTab))
    : [];

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
      case 'COMPLETED': return 'text-emerald-500 bg-emerald-50 border-emerald-100';
      case 'SHIPPING': return 'text-blue-500 bg-blue-50 border-blue-100';
      case 'CONFIRMED': return 'text-cyan-500 bg-cyan-50 border-cyan-100';
      case 'CANCELLED': return 'text-red-500 bg-red-50 border-red-100';
      case 'PENDING': return 'text-orange-500 bg-orange-50 border-orange-100';
      default: return 'text-gray-500 bg-gray-50 border-gray-100';
    }
  };

  return (
    <div className="bg-[#f5f5f5] min-h-screen pb-20">
      <Header />

      <main className="max-w-[1200px] mx-auto px-4 pt-4">
        {/* Tab Navigation */}
        <div className="bg-white rounded-sm shadow-sm mb-4 flex sticky top-[100px] z-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-4 text-sm font-medium transition-all relative ${activeTab === tab.id ? 'text-primary' : 'text-gray-600 hover:text-primary'
                }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary animate-in fade-in duration-300"></div>
              )}
            </button>
          ))}
        </div>

        {/* Search Order*/}
        <div className="bg-[#eaeaea] rounded-sm flex items-center px-4 py-2 mb-4">
          <span className="material-symbols-outlined text-gray-400 mr-3">search</span>
          <input
            type="text"
            placeholder="You can search by Order ID or Product Name"
            className="bg-transparent border-none outline-none text-sm w-full py-1"
          />
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-sm shadow-sm">
            <div className="size-12 border-4 border-gray-100 border-t-primary rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 text-sm">Loading your orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-sm shadow-sm py-24 text-center">
            <div className="size-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-gray-300 text-6xl">order_approve</span>
            </div>
            <p className="text-gray-500">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.orderId} className="bg-white rounded-sm shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Order Header */}
                <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-800">Order ID: {order.orderId}</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-xs text-gray-500 italic">{formatDate(order.createdAt)}</span>
                  </div>
                  <span className={`text-[11px] font-bold uppercase px-2 py-1 rounded-sm ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                {/* Order Content */}
                <div className="p-6 bg-white border-b border-gray-50/50">
                  {order.orderItems && order.orderItems.length > 0 ? (
                    <div className="flex justify-between items-center">
                      <div className="flex gap-4">
                        <div className="size-20 bg-gray-50 rounded-sm flex items-center justify-center border border-gray-100 flex-shrink-0">
                          <span className="material-symbols-outlined text-gray-300 text-4xl">inventory_2</span>
                        </div>
                        <div className="flex flex-col justify-center">
                          <h4 className="text-sm font-medium text-gray-800 line-clamp-2">
                            {order.orderItems[0].productName}
                          </h4>
                          <p className="text-sm text-gray-400 mt-1">
                            Quantity: {order.orderItems[0].quantity}
                          </p>
                          {order.orderItems.length > 1 && (
                            <p className="text-sm text-primary/70 mt-1 font-medium">
                              + {order.orderItems.length - 1} other items
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
                      <p className="text-sm text-gray-500 italic">No items information</p>
                    </div>
                  )}
                </div>

                <div className="px-6 py-4 flex justify-end items-center gap-2 bg-[#fdfdfd]">
                  <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
                  <span className="text-sm text-gray-600">Order Total:</span>
                  <span className="text-xl font-bold text-primary ml-2">{formatCurrency(order.totalAmount)}</span>
                </div>

                {/* Order Footer */}
                <div className="px-6 py-4 bg-[#fffcf5] border-t border-gray-50 flex justify-end gap-3">
                  <button
                    onClick={() => navigate(`/order/${order.orderId}`)}
                    className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-sm hover:bg-primary/90 transition-all shadow-sm"
                  >
                    View Details
                  </button>
                  <button className="px-6 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-sm hover:bg-white transition-all">
                    Contact Seller
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyOrdersPage;
