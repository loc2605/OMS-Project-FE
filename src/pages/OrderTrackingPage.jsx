import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from '../components/home/Header';
import orderApi from '../api/orderApi';
const formatCurrency = (value) => {
  const amount = Number(String(value).replace(/[^0-9.-]+/g, ''));
  if (Number.isNaN(amount)) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const OrderTrackingPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let interval;
    const fetchOrder = async (isFirst = false) => {
      try {
        if (isFirst) setLoading(true);
        const res = await orderApi.get(orderId);
        if (res.success) {
          setOrder(res.result);
          // Stop polling if order is in a final state
          if (['CONFIRMED', 'CANCELLED', 'SHIPPED', 'DELIVERED'].includes(res.result.status)) {
            if (interval) clearInterval(interval);
          }
        }
      } catch (e) {
        console.error('Polling error:', e);
        if (interval) clearInterval(interval);
      } finally {
        if (isFirst) setLoading(false);
      }
    };

    fetchOrder(true);
    interval = setInterval(() => fetchOrder(false), 5000);
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [orderId]);

  if (loading) {
    return (
      <div className="bg-background-light min-h-screen">
        <Header />
        <div className="max-w-full mx-auto px-4 md:px-8 lg:px-12 py-20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-500">Fetching order status...</p>
        </div>
      </div>
    );
  }

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'PENDING': return { text: 'Pending', color: 'bg-orange-50 text-orange-600 border-orange-200' };
      case 'CONFIRMED': return { text: 'Confirmed', color: 'bg-cyan-50 text-cyan-600 border-cyan-200' };
      case 'SHIPPING': return { text: 'Shipping', color: 'bg-blue-50 text-blue-600 border-blue-200' };
      case 'COMPLETED': return { text: 'Completed', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' };
      case 'CANCELLED': return { text: 'Cancelled', color: 'bg-red-50 text-red-600 border-red-200' };
      default: return { text: status, color: 'bg-gray-50 text-gray-600 border-gray-200' };
    }
  };

  const statusInfo = getStatusDisplay(order?.status);

  return (
    <div className="bg-[#f5f5f5] text-body-text min-h-screen">
      <Header />

      <main className="max-w-[1200px] mx-auto px-4 py-10">
        <div className="flex flex-col gap-6">
          
          {/* Order Header Card */}
          <div className="bg-white p-8 rounded-sm shadow-sm border-b-2 border-primary/10">
            <div className="flex flex-wrap justify-between items-start gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Order Details</h1>
                  <span className={`px-3 py-1 ${statusInfo.color} text-[11px] font-bold rounded-sm uppercase tracking-wider border`}>
                    {statusInfo.text}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="font-medium">Order ID: {orderId}</span>
                  <span>•</span>
                  <span>Placed on {new Date(order?.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
              <div className="flex gap-3">
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Items & Payment */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Order Items List */}
              <div className="bg-white p-6 rounded-sm shadow-sm">
                <h2 className="text-base font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">shopping_bag</span>
                  ORDER ITEMS ({order?.orderItems?.length || 0})
                </h2>
                <div className="divide-y divide-gray-50">
                  {order?.orderItems?.map((item, idx) => (
                    <div key={idx} className="py-5 flex gap-4 first:pt-0 last:pb-0 group">
                      <div className="size-20 bg-gray-50 rounded-sm border border-gray-100 flex items-center justify-center flex-shrink-0 group-hover:border-primary/30 transition-all overflow-hidden">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                        ) : (
                          <span className="material-symbols-outlined text-gray-300 text-3xl">inventory_2</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-800 line-clamp-2 hover:text-primary cursor-pointer transition-colors">
                          {item.productName}
                        </h4>
                        <div className="flex items-center justify-between mt-3">
                          <div className="text-xs text-gray-400">
                            Unit Price: <span className="text-gray-600">{formatCurrency(item.price)}</span>
                            <span className="mx-2">•</span>
                            Qty: <span className="text-gray-600">{item.quantity}</span>
                          </div>
                          <div className="text-sm font-bold text-gray-800">
                            {formatCurrency(item.price * item.quantity)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total Summary */}
                <div className="mt-8 pt-6 border-t border-gray-100 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Merchandise Subtotal</span>
                    <span className="text-gray-800 font-medium">{formatCurrency(order?.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping Fee</span>
                    <span className="text-gray-800 font-medium">{formatCurrency(0)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-50 mt-4">
                    <span className="text-lg font-bold text-gray-800">Total Amount</span>
                    <div className="text-right">
                      <div className="text-2xl font-black text-primary">{formatCurrency(order?.totalAmount)}</div>
                      <p className="text-[10px] text-gray-400 mt-1 italic">Included VAT (if applicable)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white p-6 rounded-sm shadow-sm">
                <h2 className="text-base font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">account_balance_wallet</span>
                  PAYMENT METHOD
                </h2>
                <div className="flex items-center gap-4 p-4 bg-[#fcfcfc] border border-dashed border-gray-200 rounded-sm">
                  <div className="size-10 bg-white rounded-full flex items-center justify-center text-primary shadow-sm border border-gray-50">
                    <span className="material-symbols-outlined text-xl">
                      {order?.paymentMethod === 'COD' ? 'payments' : 'account_balance'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-700">
                      {order?.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : 'Bank Transfer'}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5 uppercase tracking-wide">
                      Transaction ID: {order?.paymentId || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Shipping Info */}
            <div className="space-y-6">
              {/* Delivery Address */}
              <div className="bg-white p-6 rounded-sm shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
                <h2 className="text-base font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">location_on</span>
                  DELIVERY ADDRESS
                </h2>
                {order?.shippingAddress ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-bold text-gray-800">{order.shippingAddress.receiverName}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{order.shippingAddress.receiverPhone}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {order.shippingAddress.street}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.shippingAddress.ward}, {order.shippingAddress.district}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.shippingAddress.city}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">Address information not available</p>
                )}
                
                <div className="mt-8 pt-6 border-t border-gray-50">
                   <div className="bg-[#f0f9ff] p-4 rounded-sm border border-blue-50">
                      <p className="text-[12px] text-blue-600 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">info</span>
                        Our courier will contact you before delivery.
                      </p>
                   </div>
                </div>
              </div>

              {/* Order Status Message */}
              <div className="bg-white p-6 rounded-sm shadow-sm">
                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 uppercase tracking-wide">
                   Latest Update
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-sm italic border-l-4 border-gray-200">
                  "{order?.message || 'We have received your order and are processing it.'}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-20 py-12 px-4 md:px-6 bg-white border-t border-gray-100 text-center shadow-sm">
        <div className="max-w-6xl mx-auto">
          <p className="text-body text-sm font-semibold">© 2026 ShopModern E-commerce Inc. All rights reserved.</p>
          <div className="flex justify-center gap-10 mt-6">
            <a className="text-xs text-body font-bold hover:text-primary transition-colors uppercase tracking-widest" href="#">
              Privacy Policy
            </a>
            <a className="text-xs text-body font-bold hover:text-primary transition-colors uppercase tracking-widest" href="#">
              Terms of Service
            </a>
            <a className="text-xs text-body font-bold hover:text-primary transition-colors uppercase tracking-widest" href="#">
              Cookie Settings
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default OrderTrackingPage;
