import React, { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext.jsx';
import Header from '../components/home/Header';
import { useAuth } from '../contexts/AuthContext';
import orderApi from '../api/orderApi';
import paymentApi from '../api/paymentApi';
import profileApi from '../api/profileApi';

const formatCurrency = (value) => {
  const amount = Number(String(value).replace(/[^0-9.-]+/g, ''));
  if (Number.isNaN(amount)) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};



const paymentOptions = [
  { id: 'cod', label: 'Cash on Delivery (COD)', description: 'Pay when you receive the items', icon: 'payments' },
  { id: 'transfer', label: 'Bank Transfer', description: 'Transfer via bank account or e-wallet', icon: 'account_balance' },
];

const CheckoutPage = () => {
  const { cartItems, cartCount, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedPayment, setSelectedPayment] = useState('cod');


  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchAddresses = async () => {
      try {
        const res = await profileApi.getProfile();
        if (res.success) {
          setProfile(res.result);
          if (res.result.addresses && res.result.addresses.length > 0) {
            setAddresses(res.result.addresses);
            const defaultAddr = res.result.addresses.find(a => a.isDefault) || res.result.addresses[0];
            setSelectedAddress(defaultAddr);
          }
        }
      } catch (e) {
        console.error('Failed to fetch profile/addresses', e);
      }
    };
    fetchAddresses();
  }, []);

  const shippingFee = 0;



  const totalAmount = cartTotal + shippingFee;

  const [isPolling, setIsPolling] = useState(false);
  const [pollStatus, setPollStatus] = useState('PENDING'); // PENDING, CONFIRMED, CANCELLED
  const [pollMessage, setPollMessage] = useState('We are processing your order, please wait a moment.');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState(null);

  const startPolling = (orderId) => {
    setIsPolling(true);
    setActiveOrderId(orderId);
    setPollStatus('PENDING');
    setPollMessage('We are processing your order, please wait a moment...');

    let pollCount = 0;
    const maxPolls = 15; // Tối đa 30 giây (15 lần x 2 giây)

    const pollInterval = setInterval(async () => {
      try {
        pollCount++;
        console.log(`Polling attempt ${pollCount} for Order: ${orderId}`);
        
        // 1. Check Notifications (Non-blocking)
        try {
          const notiRes = await notificationApi.getMyNotifications({ size: 5 });
          if (notiRes.success && notiRes.result.content) {
            // Tìm thông báo chứa orderId HOẶC là thông báo cập nhật đơn hàng mới nhất
            const relevantNoti = notiRes.result.content.find(noti => 
              (noti.content && noti.content.includes(orderId)) || 
              (noti.title === 'Cập nhật đơn hàng' && pollCount < 5)
            );
            if (relevantNoti) {
              setPollMessage(relevantNoti.content);
            }
          }
        } catch (notiErr) {
          console.warn('Failed to fetch notifications during polling', notiErr);
        }

        // 2. Check Order Status
        const response = await orderApi.get(orderId);
        const result = response.result;
        console.log('Order Status:', result.status);
        
        if (result.status === 'CONFIRMED') {
          clearInterval(pollInterval);
          setPollStatus('CONFIRMED');
          setPollMessage(result.message || 'Payment confirmed! Your order has been placed successfully.');
          clearCart(); 
        } else if (result.status === 'CANCELLED') {
          clearInterval(pollInterval);
          setPollStatus('CANCELLED');
          setPollMessage(result.message || 'Transaction failed. Your order has been cancelled.');
        } else if (pollCount >= maxPolls) {
          clearInterval(pollInterval);
          setPollStatus('CANCELLED');
          setPollMessage('Order processing timed out. Please check your order history later.');
        }
      } catch (error) {
        console.error('Polling error:', error);
        if (error.response?.data?.result?.status === 'CANCELLED') {
          clearInterval(pollInterval);
          setPollStatus('CANCELLED');
          setPollMessage(error.response.data.result.message || 'Order failed.');
        }
      }
    }, 2000);
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty.');
      return;
    }
    if (!selectedAddress) {
      alert('Please select or add a shipping address.');
      return;
    }

    try {
      setLoading(true);
      const apiPaymentMethod = selectedPayment.toUpperCase();

      const orderData = {
        paymentMethod: apiPaymentMethod,
        orderItems: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity
        })),
        address: {
          street: selectedAddress.street,
          ward: selectedAddress.ward,
          district: selectedAddress.district,
          city: selectedAddress.city,
          receiverName: profile?.fullname || user?.fullName || '',
          receiverPhone: profile?.phone || user?.phone || ''
        }
      };

      const orderRes = await orderApi.create(orderData);
      if (orderRes.success) {
        const orderId = orderRes.result.orderId;
        // Thay vì chuyển hướng ngay, ta bắt đầu polling
        startPolling(orderId);
      }
    } catch (error) {
      console.error(error);
      const errorMsg = error.message || 'Failed to initiate order. Please try again.';
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f5f5f5] text-body-text min-h-screen pb-20">
      <Header />

      {/* Order Status Polling Overlay */}
      {isPolling && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div className="bg-white rounded-sm shadow-2xl w-full max-w-[450px] relative z-10 p-10 text-center animate-in fade-in zoom-in duration-300">
            
            {pollStatus === 'PENDING' && (
              <div className="flex flex-col items-center">
                <div className="size-20 border-4 border-gray-100 border-t-primary rounded-full animate-spin mb-6"></div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Processing Order</h3>
                <p className="text-gray-500 leading-relaxed">{pollMessage}</p>
                <div className="mt-8 flex gap-1 justify-center">
                  <div className="size-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="size-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="size-1.5 bg-primary rounded-full animate-bounce"></div>
                </div>
              </div>
            )}

            {pollStatus === 'CONFIRMED' && (
              <div className="flex flex-col items-center">
                <div className="size-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500">
                  <span className="material-symbols-outlined text-emerald-500 text-5xl">check_circle</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Order Confirmed!</h3>
                <p className="text-gray-500 leading-relaxed mb-8">{pollMessage}</p>
                <div className="flex flex-col gap-3 w-full">
                  <button 
                    onClick={() => navigate(`/order-tracking/${activeOrderId}`)}
                    className="w-full bg-primary text-white py-3 rounded-sm font-medium hover:bg-primary/90 transition-all shadow-sm"
                  >
                    View Order Details
                  </button>
                  <button 
                    onClick={() => navigate('/')}
                    className="w-full bg-white text-gray-600 py-3 rounded-sm font-medium border border-gray-200 hover:bg-gray-50 transition-all"
                  >
                    Back to Shop
                  </button>
                </div>
              </div>
            )}

            {pollStatus === 'CANCELLED' && (
              <div className="flex flex-col items-center">
                <div className="size-20 bg-red-50 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500">
                  <span className="material-symbols-outlined text-red-500 text-5xl">error</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Order Failed</h3>
                <p className="text-red-500 leading-relaxed font-medium mb-2">{pollMessage}</p>
                <p className="text-gray-400 text-sm mb-8">Please check your information and try again.</p>
                <button 
                  onClick={() => setIsPolling(false)}
                  className="w-full bg-gray-800 text-white py-3 rounded-sm font-medium hover:bg-black transition-all"
                >
                  Close & Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Address Selection Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAddressModal(false)}></div>
          <div className="bg-white rounded-sm shadow-xl w-full max-w-[500px] relative z-10 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-medium">My Addresses</h3>
              <button onClick={() => setShowAddressModal(false)} className="material-symbols-outlined text-gray-400 hover:text-gray-600 transition-colors">close</button>
            </div>

            <div className="p-6 max-h-[400px] overflow-y-auto space-y-4">
              {addresses.map((addr, index) => (
                <label
                  key={addr.id || index}
                  className={`block p-4 border rounded-sm cursor-pointer transition-all hover:bg-gray-50 ${selectedAddress?.id === addr.id ? 'border-primary bg-primary/[0.02]' : 'border-gray-100'
                    }`}
                >
                  <div className="flex gap-3">
                    <input
                      type="radio"
                      name="modal-address"
                      className="mt-1 text-primary focus:ring-primary"
                      checked={selectedAddress?.id === addr.id}
                      onChange={() => setSelectedAddress(addr)}
                    />
                    <div className="flex-1 text-sm">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-bold text-gray-800">{profile?.fullname || user?.fullName}</span>
                        <span className="text-gray-500">{profile?.phone || user?.phone}</span>
                      </div>
                      <div className="text-gray-600 mb-1">
                        {addr.street}
                      </div>
                      <div className="text-gray-600">
                        {addr.ward}, {addr.district}, {addr.city}
                      </div>
                      {addr.isDefault && (
                        <span className="inline-block mt-2 border border-primary text-primary text-[10px] px-1 py-0.5 rounded-sm">Default</span>
                      )}
                    </div>
                  </div>
                </label>
              ))}

              <Link to="/profile" className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors text-sm font-medium py-2">
                <span className="material-symbols-outlined text-[18px]">add</span>
                Add New Address
              </Link>
            </div>

            <div className="p-6 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
              <button
                onClick={() => setShowAddressModal(false)}
                className="px-8 py-2 text-sm border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddressModal(false)}
                className="px-8 py-2 text-sm bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-[1400px] mx-auto px-4 pt-4">
        {/* Step Indicator (Shopee Style) */}
        <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <Link to="/cart" className="hover:text-primary transition-colors">Cart</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-primary font-medium">Checkout</span>
        </div>

        {/* 1. Shipping Address Section (Shopee Style) */}
        <section className="bg-white rounded-sm shadow-sm mb-4 relative overflow-hidden">
          {/* Decorative Top Border */}
          <div className="h-[3px] w-full bg-[repeating-linear-gradient(45deg,#ee4d2d,#ee4d2d_33px,#fff_33px,#fff_46px,#405cbf_46px,#405cbf_79px,#fff_79px,#fff_92px)]"></div>

          <div className="p-6">
            <div className="flex items-center gap-2 text-primary mb-4">
              <span className="material-symbols-outlined">location_on</span>
              <h2 className="text-lg font-medium capitalize">Delivery Address</h2>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {selectedAddress ? (
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-1">
                    <span className="font-bold text-gray-800">{profile?.fullname || user?.fullName}</span>
                    <span className="font-bold text-gray-800">{profile?.phone || user?.phone}</span>
                  </div>
                  <div className="text-gray-600">
                    {selectedAddress.street}, {selectedAddress.ward}, {selectedAddress.district}, {selectedAddress.city}
                    {selectedAddress.isDefault && (
                      <span className="ml-3 border border-primary text-primary text-[10px] px-1 py-0.5 rounded-sm">Default</span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-gray-400 italic">Please select a shipping address</div>
              )}

              <button
                onClick={() => setShowAddressModal(true)}
                className="text-[#4080ee] hover:opacity-80 text-sm font-medium"
              >
                Change
              </button>
            </div>
          </div>
        </section>

        {/* 2. Product Table Section */}
        <section className="bg-white rounded-sm shadow-sm mb-4 overflow-hidden">
          <div className="grid grid-cols-12 p-4 text-sm text-gray-400 border-b border-gray-50">
            <div className="col-span-6 text-gray-800 font-medium text-base">Products Ordered</div>
            <div className="col-span-2 text-center">Unit Price</div>
            <div className="col-span-2 text-center">Amount</div>
            <div className="col-span-2 text-right">Item Subtotal</div>
          </div>

          <div className="divide-y divide-gray-50">
            {cartItems.map((item) => (
              <div key={item.id} className="grid grid-cols-12 p-4 items-center hover:bg-gray-50/50 transition-colors">
                <div className="col-span-6 flex gap-3">
                  <div
                    className="size-20 bg-cover bg-center rounded-sm border border-gray-100 flex-shrink-0"
                    style={{ backgroundImage: `url(${item.imageUrl?.[0] || item.image})` }}
                  />
                  <div className="flex flex-col justify-center">
                    <h3 className="text-sm text-gray-800 line-clamp-2 mb-1">{item.name}</h3>
                    <span className="text-xs text-gray-400">Variation: {item.variant || 'Default'}</span>
                  </div>
                </div>
                <div className="col-span-2 text-center text-sm">{formatCurrency(item.price)}</div>
                <div className="col-span-2 text-center text-sm">{item.quantity}</div>
                <div className="col-span-2 text-right text-sm font-medium">
                  {formatCurrency(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>


        </section>

        {/* 3. Payment Method Section */}
        <section className="bg-white rounded-sm shadow-sm mb-4">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-medium">Payment Method</h2>
          </div>
          <div className="p-6 flex flex-wrap gap-3">
            {paymentOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedPayment(option.id)}
                className={`px-6 py-2.5 rounded-sm border text-sm transition-all relative ${selectedPayment === option.id
                  ? 'border-primary text-primary'
                  : 'border-gray-200 text-gray-600 hover:border-gray-400'
                  }`}
              >
                {option.label}
                {selectedPayment === option.id && (
                  <div className="absolute bottom-0 right-0 size-0 border-[8px] border-transparent border-r-primary border-b-primary">
                    <span className="material-symbols-outlined text-white text-[10px] absolute -right-[1px] -bottom-[1px]">check</span>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Final Summary & Checkout Button */}
          <div className="bg-[#fffefb] border-t border-gray-50 p-8">
            <div className="flex flex-col items-end gap-3 text-sm text-gray-600">
              <div className="flex justify-between w-full md:w-[400px]">
                <span>Merchandise Subtotal:</span>
                <span className="text-gray-800">{formatCurrency(cartTotal)}</span>
              </div>
              <div className="flex justify-between w-full md:w-[400px]">
                <span>Shipping Total:</span>
                <span className="text-gray-800">{formatCurrency(shippingFee)}</span>
              </div>
              <div className="flex justify-between w-full md:w-[400px] mt-4 items-center">
                <span className="text-base text-gray-800">Total Payment:</span>
                <span className="text-3xl font-bold text-primary">{formatCurrency(totalAmount)}</span>
              </div>

              <div className="w-full md:w-[400px] mt-8 border-t border-gray-100 pt-6">
                <button
                  type="button"
                  disabled={loading || cartItems.length === 0 || !selectedAddress}
                  onClick={handlePlaceOrder}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-sm text-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CheckoutPage;
