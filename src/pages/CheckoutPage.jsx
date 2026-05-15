import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext.jsx';
import Header from '../components/home/Header';
import { useAuth } from '../contexts/AuthContext';
import orderApi from '../api/orderApi';
import paymentApi from '../api/paymentApi';
import profileApi from '../api/profileApi';
import notificationApi from '../api/notificationApi';

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
  const [tempSelectedAddress, setTempSelectedAddress] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [addressError, setAddressError] = useState('');
  const addressRef = useRef(null);

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
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [addressForm, setAddressForm] = useState({
    street: '',
    ward: '',
    district: '',
    city: '',
    isDefault: false
  });
  const [activeOrderId, setActiveOrderId] = useState(null);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await fetch('https://provinces.open-api.vn/api/p/');
        const data = await res.json();
        setProvinces(data);
      } catch (e) {
        console.error('Failed to fetch provinces', e);
      }
    };
    fetchProvinces();
  }, []);

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

  const handleProvinceChange = async (e) => {
    const provinceCode = e.target.value;
    const provinceName = provinces.find(p => p.code === parseInt(provinceCode))?.name || '';
    setAddressForm({ ...addressForm, city: provinceName, district: '', ward: '' });
    setWards([]);

    if (provinceCode) {
      try {
        const res = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
        const data = await res.json();
        setDistricts(data.districts || []);
      } catch (e) {
        console.error('Failed to fetch districts', e);
      }
    } else {
      setDistricts([]);
    }
  };

  const handleDistrictChange = async (e) => {
    const districtCode = e.target.value;
    const districtName = districts.find(d => d.code === parseInt(districtCode))?.name || '';
    setAddressForm({ ...addressForm, district: districtName, ward: '' });

    if (districtCode) {
      try {
        const res = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
        const data = await res.json();
        setWards(data.wards || []);
      } catch (e) {
        console.error('Failed to fetch wards', e);
      }
    } else {
      setWards([]);
    }
  };

  const handleAddNewAddress = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await profileApi.addAddress(addressForm);
      if (res.success) {
        // Fetch addresses again
        const profileRes = await profileApi.getProfile();
        if (profileRes.success && profileRes.result.addresses) {
          const updatedAddresses = profileRes.result.addresses;
          setAddresses(updatedAddresses);
          // Find the newly added address (usually the last one or by some logic)
          // Or if it's default, it will be the new selected address
          const newAddr = updatedAddresses.find(a => a.street === addressForm.street && a.city === addressForm.city) || updatedAddresses[updatedAddresses.length - 1];
          setSelectedAddress(newAddr);
          setAddressError('');
        }
        setShowAddAddressModal(false);
        setAddressForm({ street: '', ward: '', district: '', city: '', isDefault: false });
      }
    } catch (error) {
      alert("Add address failed!");
    } finally {
      setLoading(false);
    }
  };

  const CustomSelect = ({ label, options, value, onChange, disabled, placeholder }) => {
    const isOpen = activeDropdown === label;
    return (
      <div className="space-y-1 relative">
        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">{label}</label>
        <div className="relative">
          <button
            type="button"
            disabled={disabled}
            onClick={() => setActiveDropdown(isOpen ? null : label)}
            className={`w-full px-4 py-3 rounded-sm border border-gray-200 focus:border-primary outline-none transition-all text-sm bg-white flex justify-between items-center disabled:bg-gray-50 disabled:opacity-60 cursor-pointer ${isOpen ? 'border-primary shadow-sm' : ''}`}
          >
            <span className={!value ? 'text-gray-400' : 'text-gray-700 font-medium'}>
              {value || placeholder}
            </span>
            <span className={`material-symbols-outlined text-gray-400 text-[20px] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
              expand_more
            </span>
          </button>

          {isOpen && (
            <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-100 rounded-sm shadow-xl z-[210] max-h-48 overflow-y-auto">
              {options.length === 0 ? (
                <div className="px-3 py-2 text-xs text-gray-400 italic">No options</div>
              ) : (
                options.map((opt) => {
                  const name = opt.name || opt;
                  const code = opt.code || opt;
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => {
                        onChange({ target: { value: code } });
                        setActiveDropdown(null);
                      }}
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${value === name ? 'text-primary font-medium bg-primary/5' : 'text-gray-700'}`}
                    >
                      {name}
                      {value === name && <span className="material-symbols-outlined text-sm">check</span>}
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty.');
      return;
    }
    if (!selectedAddress) {
      setAddressError('Please provide a delivery address to complete your order.');
      addressRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    try {
      setLoading(true);
      const apiPaymentMethod = selectedPayment === 'transfer' ? 'BANK_TRANSFER' : selectedPayment.toUpperCase();
      
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
          receiverName: profile?.fullname || profile?.fullName || user?.fullName || user?.username || 'Guest',
          receiverPhone: profile?.phone || user?.phone || '0000000000'
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
                    onClick={() => navigate(`/order/${activeOrderId}`)}
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
          <div className="bg-white rounded-sm shadow-xl w-full max-w-[700px] relative z-10 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-medium">My Addresses</h3>
              <button onClick={() => setShowAddressModal(false)} className="material-symbols-outlined text-gray-400 hover:text-gray-600 transition-colors">close</button>
            </div>

            <div className="p-8 max-h-[500px] overflow-y-auto space-y-5">
              {addresses.map((addr, index) => {
                const isSelected = tempSelectedAddress 
                  ? (tempSelectedAddress.id === addr.id && addr.id) || 
                    (tempSelectedAddress.street === addr.street && tempSelectedAddress.city === addr.city && tempSelectedAddress.ward === addr.ward)
                  : false;

                return (
                  <label
                    key={addr.id || index}
                    className={`block p-4 border rounded-sm cursor-pointer transition-all hover:bg-gray-50 ${isSelected ? 'border-primary bg-primary/[0.02]' : 'border-gray-100'
                      }`}
                  >
                    <div className="flex gap-3">
                      <input
                        type="radio"
                        name="modal-address"
                        className="mt-1 text-primary focus:ring-primary"
                        checked={isSelected}
                        onChange={() => {
                          setTempSelectedAddress(addr);
                        }}
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
                );
              })}

              <button
                onClick={() => {
                  setShowAddressModal(false);
                  setShowAddAddressModal(true);
                }}
                className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors text-sm font-medium py-2 w-full text-left"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                Add New Address
              </button>
            </div>

            <div className="p-6 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
              <button
                onClick={() => setShowAddressModal(false)}
                className="px-8 py-2 text-sm border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setSelectedAddress(tempSelectedAddress);
                  setAddressError('');
                  setShowAddressModal(false);
                }}
                className="px-8 py-2 text-sm bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Address Modal */}
      {showAddAddressModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAddAddressModal(false)}></div>
          <div className="bg-white rounded-sm shadow-xl w-full max-w-[850px] relative z-10 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-medium">New Address</h3>
              <button onClick={() => setShowAddAddressModal(false)} className="material-symbols-outlined text-gray-400 hover:text-gray-600 transition-colors">close</button>
            </div>

            <form onSubmit={handleAddNewAddress} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <CustomSelect
                  label="Province / City"
                  placeholder="Select Province"
                  options={provinces}
                  value={addressForm.city}
                  onChange={handleProvinceChange}
                />
                <CustomSelect
                  label="District"
                  placeholder="Select District"
                  disabled={!addressForm.city}
                  options={districts}
                  value={addressForm.district}
                  onChange={handleDistrictChange}
                />
                <CustomSelect
                  label="Ward"
                  placeholder="Select Ward"
                  disabled={!addressForm.district}
                  options={wards}
                  value={addressForm.ward}
                  onChange={(e) => setAddressForm({ ...addressForm, ward: wards.find(w => w.code === parseInt(e.target.value))?.name || '' })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Street Address</label>
                <input
                  required
                  className="w-full px-4 py-3 rounded-sm border border-gray-200 focus:border-primary outline-none transition-all text-sm font-medium"
                  placeholder="House number, street name..."
                  value={addressForm.street}
                  onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="checkout-default-addr"
                  type="checkbox"
                  className="size-5 rounded-sm text-primary focus:ring-primary border-gray-300 cursor-pointer"
                  checked={addressForm.isDefault}
                  onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                />
                <label htmlFor="checkout-default-addr" className="text-base text-gray-600 cursor-pointer select-none">Set as default address</label>
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setShowAddAddressModal(false)}
                  className="px-10 py-3 text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-10 py-3 text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors shadow-md disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Submit'}
                </button>
              </div>
            </form>
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
        <section
          ref={addressRef}
          className={`bg-white rounded-sm shadow-sm mb-4 relative overflow-hidden transition-all duration-300 ${addressError ? 'ring-2 ring-primary ring-offset-2' : ''}`}
        >
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
                <div className="flex flex-col">
                  <div className="text-gray-400 italic">Please select a shipping address</div>
                  {addressError && (
                    <div className="mt-2 text-primary text-sm font-medium flex items-center gap-1 animate-pulse">
                      <span className="material-symbols-outlined text-[18px]">error</span>
                      {addressError}
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={() => {
                  setTempSelectedAddress(selectedAddress);
                  setShowAddressModal(true);
                }}
                className="text-[#4080ee] hover:opacity-80 text-sm font-medium whitespace-nowrap"
              >
                {selectedAddress ? 'Change' : 'Select Address'}
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
                  disabled={loading || cartItems.length === 0}
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
