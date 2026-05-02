import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/home/Header';
import orderApi from '../api/orderApi';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await orderApi.getMyOrders();
        if (res.success) {
          setOrders(res.result);
        }
      } catch (error) {
        console.error('Failed to fetch orders', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'PAYMENT_PENDING': return 'text-yellow-600 bg-yellow-50';
      case 'CONFIRMED': return 'text-green-600 bg-green-50';
      case 'SHIPPED': return 'text-blue-600 bg-blue-50';
      case 'CANCELLED': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-background-light min-h-screen font-display">
      <Header />
      <main className="max-w-full mx-auto px-4 md:px-8 lg:px-12 py-10">
        <h1 className="text-3xl font-black text-heading mb-8">My Orders</h1>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-20 text-center shadow-sm">
            <span className="material-symbols-outlined text-6xl text-gray-200 mb-4">shopping_bag</span>
            <p className="text-gray-500">You haven't placed any orders yet.</p>
            <button 
              onClick={() => navigate('/')}
              className="mt-6 bg-primary text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-all"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div 
                key={order.orderId}
                onClick={() => navigate(`/order/${order.orderId}`)}
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-transparent hover:border-primary/10"
              >
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order ID</p>
                    <p className="text-lg font-bold text-heading">#{order.orderId}</p>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${getStatusColor(order.status)}`}>
                    {order.status}
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-50 flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Date Placed</p>
                    <p className="text-sm font-medium text-body">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                    <p className="text-2xl font-black text-primary">
                      ${typeof order.totalAmount === 'number' ? order.totalAmount.toFixed(2) : order.totalAmount}
                    </p>
                  </div>
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
