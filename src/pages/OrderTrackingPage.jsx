import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../contexts/CartContext.jsx';
import Header from '../components/home/Header';
import orderApi from '../api/orderApi';
import deliveryApi from '../api/deliveryApi';
const formatCurrency = (value) => {
  const amount = Number(String(value).replace(/[^0-9.-]+/g, ''));
  if (Number.isNaN(amount)) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const OrderTrackingPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [order, setOrder] = useState(null);
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let interval;
    const fetchOrder = async (isFirst = false) => {
      try {
        if (isFirst) setLoading(true);
        const res = await orderApi.get(orderId);
        if (res.success) {
          setOrder(res.result);
          
          if (['SHIPPING', 'COMPLETED'].includes(res.result.status)) {
            try {
              const delRes = await deliveryApi.getDeliveryByOrder(orderId);
              if (delRes.success) {
                setDelivery(delRes.result);
              }
            } catch (err) {
              console.log('Error fetching delivery:', err);
            }
          }

          // Stop polling if order is in a final state
          if (['COMPLETED', 'CANCELLED'].includes(res.result.status)) {
            if (interval) clearInterval(interval);
          }
        }
      } catch (e) {
        console.error('Polling error:', e);
        // axiosClient rejects with the intercepted error data directly
        const errorResult = e?.result || e.response?.data?.result;
        if (errorResult) {
          setOrder(errorResult);
        }
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

  const handleReorder = () => {
    if (order?.orderItems && order.orderItems.length > 0) {
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

  const getStatusDisplay = (status) => {
    const rawText = status ? status.replace(/_/g, ' ') : 'UNKNOWN';

    switch (status) {
      case 'PENDING_VALIDATION':
      case 'PENDING':
      case 'PAYMENT_PENDING': return { text: rawText, color: 'bg-amber-50 text-amber-600 border-amber-200' };
      case 'CONFIRMED': return { text: rawText, color: 'bg-blue-50 text-blue-600 border-blue-200' };
      case 'SHIPPING': return { text: rawText, color: 'bg-indigo-50 text-indigo-600 border-indigo-200' };
      case 'COMPLETED': return { text: rawText, color: 'bg-emerald-50 text-emerald-600 border-emerald-200' };
      case 'CANCELLED': return { text: rawText, color: 'bg-rose-50 text-rose-600 border-rose-200' };
      default: return { text: rawText, color: 'bg-gray-50 text-gray-600 border-gray-200' };
    }
  };

  const statusInfo = getStatusDisplay(order?.status);

  // Active steps calculation for the timeline
  const isStep1Active = ['PENDING_VALIDATION', 'PENDING', 'PAYMENT_PENDING', 'CONFIRMED', 'SHIPPING', 'COMPLETED'].includes(order?.status);
  const isStep2Active = ['CONFIRMED', 'SHIPPING', 'COMPLETED'].includes(order?.status);
  const isStep3Active = ['SHIPPING', 'COMPLETED'].includes(order?.status) || delivery?.status === 'READY_TO_UP' || delivery?.status === 'ASSIGNING';
  const isStep4Active = ['COMPLETED'].includes(order?.status) || delivery?.status === 'DELIVERING' || delivery?.status === 'DELIVERED';
  const isStep5Active = ['COMPLETED'].includes(order?.status) || delivery?.status === 'DELIVERED';
  const isReturned = delivery?.status === 'RETURNED';

  return (
    <div className="bg-[#f5f5f5] text-body-text min-h-screen">
      <Header />

      <main className="max-w-[1200px] mx-auto px-4 pt-6 pb-0">
        <div className="flex flex-col gap-6">
          
          {/* Order Header Card */}
          <div className="bg-white p-8 rounded-sm shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
            <div className="flex flex-col gap-8">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <div className="flex items-center gap-4">
                  <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-500 hover:text-primary transition-colors uppercase text-sm font-medium tracking-wider">
                    <span className="material-symbols-outlined text-[18px]">arrow_back_ios</span>
                    Back
                  </button>
                  <div className="h-4 w-px bg-gray-300"></div>
                  <span className="text-sm font-bold text-gray-800 tracking-tight uppercase">Order ID: {orderId}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-gray-500 uppercase font-medium">Status:</span>
                  <span className={`px-3.5 py-1 ${statusInfo.color} text-[11px] font-bold rounded-sm uppercase tracking-wider border transition-all`}>
                    {statusInfo.text}
                  </span>
                  <button
                    onClick={handleReorder}
                    className="ml-2 px-4 py-1.5 bg-primary text-white text-sm font-medium rounded-sm hover:bg-primary/90 transition-all shadow-sm flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">replay</span>
                    Buy Again
                  </button>
                </div>
              </div>

              {order?.status !== 'CANCELLED' ? (
                <div className="py-6 px-4">
                  <div className="relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1.5 bg-gray-100 rounded-full z-0"></div>
                    <div 
                      className={`absolute left-0 top-1/2 -translate-y-1/2 h-1.5 rounded-full z-0 transition-all duration-500 ${isReturned ? 'bg-red-500' : 'bg-primary'}`}
                      style={{ 
                        width: !isStep1Active ? '0%' : 
                               !isStep2Active ? '0%' : 
                               !isStep3Active ? '25%' : 
                               !isStep4Active ? '50%' : 
                               !isStep5Active ? '75%' : '100%'
                      }}
                    ></div>
                    
                    <div className="relative z-10 flex justify-between">
                      {/* Step 1 */}
                      <div className="flex flex-col items-center gap-3 w-24">
                        <div className={`size-12 rounded-full flex items-center justify-center border-4 border-white transition-all duration-300 ${isStep1Active ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105' : 'bg-gray-200 text-gray-400'}`}>
                          <span className="material-symbols-outlined text-2xl">receipt_long</span>
                        </div>
                        <span className={`text-xs text-center transition-colors duration-300 ${isStep1Active ? 'text-primary font-bold' : 'text-gray-400 font-medium'}`}>
                          {order?.paymentMethod === 'COD' ? 'Order Placed' : 'Payment Pending'}
                        </span>
                      </div>

                      {/* Step 2 */}
                      <div className="flex flex-col items-center gap-3 w-24">
                        <div className={`size-12 rounded-full flex items-center justify-center border-4 border-white transition-all duration-300 ${isStep2Active ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105' : 'bg-gray-200 text-gray-400'}`}>
                          <span className="material-symbols-outlined text-2xl">payments</span>
                        </div>
                        <span className={`text-xs text-center transition-colors duration-300 ${isStep2Active ? 'text-primary font-bold' : 'text-gray-400 font-medium'}`}>
                          {order?.paymentMethod === 'COD' ? 'Confirmed' : 'Paid & Confirmed'}
                        </span>
                      </div>

                      {/* Step 3 */}
                      <div className="flex flex-col items-center gap-3 w-24">
                        <div className={`size-12 rounded-full flex items-center justify-center border-4 border-white transition-all duration-300 ${isReturned ? 'bg-red-500 text-white' : isStep3Active ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105' : 'bg-gray-200 text-gray-400'}`}>
                          <span className="material-symbols-outlined text-2xl">local_shipping</span>
                        </div>
                        <span className={`text-xs text-center transition-colors duration-300 ${isReturned ? 'text-red-500 font-bold' : isStep3Active ? 'text-primary font-bold' : 'text-gray-400 font-medium'}`}>
                          Handing Over
                        </span>
                      </div>

                      {/* Step 4 */}
                      <div className="flex flex-col items-center gap-3 w-24">
                        <div className={`size-12 rounded-full flex items-center justify-center border-4 border-white transition-all duration-300 ${isReturned ? 'bg-red-500 text-white' : isStep4Active ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105' : 'bg-gray-200 text-gray-400'}`}>
                          <span className="material-symbols-outlined text-2xl">directions_run</span>
                        </div>
                        <span className={`text-xs text-center transition-colors duration-300 ${isReturned ? 'text-red-500 font-bold' : isStep4Active ? 'text-primary font-bold' : 'text-gray-400 font-medium'}`}>
                          Delivering
                        </span>
                      </div>

                      {/* Step 5 */}
                      <div className="flex flex-col items-center gap-3 w-24">
                        <div className={`size-12 rounded-full flex items-center justify-center border-4 border-white transition-all duration-300 ${isReturned ? 'bg-red-500 text-white' : isStep5Active ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105' : 'bg-gray-200 text-gray-400'}`}>
                          <span className="material-symbols-outlined text-2xl">star</span>
                        </div>
                        <span className={`text-xs text-center transition-colors duration-300 ${isReturned ? 'text-red-500 font-bold' : isStep5Active ? 'text-primary font-bold' : 'text-gray-400 font-medium'}`}>
                          {isReturned ? 'Failed' : 'Completed'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {delivery && (
                    <div className="mt-10 bg-gray-50 border border-gray-100 p-4 rounded-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                       <div className="flex flex-col gap-1">
                          <span className="text-sm font-bold text-gray-800">Tracking Number: <span className="text-primary">{delivery.trackingNumber}</span></span>
                          {delivery.shipperName && (
                            <span className="text-sm text-gray-600">Shipper: {delivery.shipperName} - {delivery.shipperPhone}</span>
                          )}
                          {isReturned && delivery.failReason && (
                            <span className="text-sm text-red-500 font-medium mt-2">Failure Reason: {delivery.failReason}</span>
                          )}
                       </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-6 px-4">
                  <div className="bg-red-50 p-6 rounded-sm border border-red-100 flex items-center gap-4">
                    <div className="size-12 bg-red-100 rounded-full flex items-center justify-center text-red-500">
                      <span className="material-symbols-outlined text-3xl">cancel</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-red-600 mb-1">Order Cancelled</h3>
                      <p className="text-sm text-red-500/80">This order has been cancelled and cannot be processed.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Items & Payment */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Order Items List */}
              <div className="bg-white p-6 rounded-sm shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
                <h2 className="text-base font-bold text-gray-800 mb-6 flex items-center gap-2 mt-2">
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

                  {/* Integrated Payment Method */}
                  <div className="pt-6 border-t border-gray-100 mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary text-[20px]">
                        {order?.paymentMethod === 'COD' ? 'payments' : 'account_balance'}
                      </span>
                      <span className="text-sm font-semibold text-gray-500">Payment Method:</span>
                      <span className="text-sm font-bold text-gray-800">
                        {order?.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : 'Bank Transfer'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wide bg-gray-50 px-2.5 py-1 rounded-sm border border-gray-100">
                        ID: {order?.paymentId || 'N/A'}
                      </span>
                    </div>
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

      <footer className="mt-0 py-6 text-center text-xs text-gray-400">
        <p>© 2026 ShopModern E-commerce Inc. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default OrderTrackingPage;
