import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext.jsx';

const formatCurrency = (value) => {
  const amount = Number(String(value).replace(/[^0-9.-]+/g, ''));
  if (Number.isNaN(amount)) return '$0.00';
  return new Intl.NumberFormat('en-SG', { style: 'currency', currency: 'SGD' }).format(amount);
};

const shippingOptions = [
  { id: 'standard', label: 'Standard', details: '3-5 business days', price: 5 },
  { id: 'express', label: 'Express', details: '24-48 hours', price: 12 },
  { id: 'economy', label: 'Economy', details: '7-10 business days', price: 2 },
];

const paymentOptions = [
  { id: 'cod', label: 'Cash on Delivery (COD)', description: 'Pay when you receive the items', icon: 'payments' },
  { id: 'card', label: 'Credit / Debit Card', description: 'Visa, Mastercard, JCB supported', icon: 'credit_card' },
  { id: 'wallet', label: 'E-Wallet / Online Banking', description: 'GCash, Maya, or Bank Transfer', icon: 'account_balance_wallet' },
];

const CheckoutPage = () => {
  const { cartItems, cartCount, cartTotal } = useCart();
  const navigate = useNavigate();
  const [selectedShipping, setSelectedShipping] = useState('standard');
  const [selectedPayment, setSelectedPayment] = useState('cod');
  const [voucherCode, setVoucherCode] = useState('');

  const shippingFee = useMemo(
    () => shippingOptions.find((option) => option.id === selectedShipping)?.price || 0,
    [selectedShipping],
  );

  const voucherDiscount = useMemo(() => {
    if (voucherCode.trim().toUpperCase() === 'SAVENOW') return 10;
    return 0;
  }, [voucherCode]);

  const totalAmount = cartTotal + shippingFee - voucherDiscount;

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty. Add products before placing an order.');
      return;
    }
    alert('Order placed successfully! Thank you for shopping with ShopEase.');
    navigate('/');
  };

  return (
    <div className="bg-background-light font-display text-body-text min-h-screen">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#e6dfdb] px-4 lg:px-40 py-4">
        <div className="flex items-center justify-between whitespace-nowrap">
          <div className="flex items-center gap-8 text-heading-text">
            <div className="flex items-center gap-4 text-primary">
              <div className="size-6">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold leading-tight tracking-[-0.015em]">ShopEase</h2>
            </div>
          </div>
          <button
            onClick={() => navigate('/cart')}
            className="text-sm font-medium text-body-text hover:text-primary transition-colors"
          >
            Back to Cart
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 lg:px-40 pt-6 pb-10">
        <div className="max-w-[1200px] mx-auto">
          <nav className="flex flex-wrap gap-2 mb-6 text-sm text-body-text">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span className="text-[#8a7260]">/</span>
            <Link to="/cart" className="hover:text-primary transition-colors">
              Cart
            </Link>
            <span className="text-[#8a7260]">/</span>
            <span className="text-heading-text font-medium">Checkout</span>
          </nav>

          <div className="mb-10 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Checkout Progress</span>
              <span className="text-xs font-bold text-heading-text">Step 2 of 3</span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: '66%' }} />
            </div>
            <div className="flex justify-between mt-4 text-[11px] font-bold">
              <span className="text-gray-400">CART</span>
              <span className="text-primary">SHIPPING & PAYMENT</span>
              <span className="text-gray-400">CONFIRMATION</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-6">
              <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <span className="material-symbols-outlined text-primary">location_on</span>
                  </div>
                  <h2 className="text-xl font-bold text-heading-text">1. Shipping Address</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block mb-2 text-xs font-bold uppercase tracking-tight text-gray-500">Full Name</label>
                    <input
                      className="w-full rounded-xl border border-gray-200 bg-[#fafafa] focus:bg-white focus:border-primary focus:ring-0 h-11 px-4 text-sm transition-all"
                      placeholder="John Doe"
                      type="text"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-xs font-bold uppercase tracking-tight text-gray-500">Phone Number</label>
                    <input
                      className="w-full rounded-xl border border-gray-200 bg-[#fafafa] focus:bg-white focus:border-primary focus:ring-0 h-11 px-4 text-sm transition-all"
                      placeholder="+65 9123 4567"
                      type="tel"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-2 text-xs font-bold uppercase tracking-tight text-gray-500">Complete Address</label>
                    <textarea
                      className="w-full rounded-xl border border-gray-200 bg-[#fafafa] focus:bg-white focus:border-primary focus:ring-0 px-4 py-3 text-sm transition-all"
                      placeholder="Unit/Building, Street, District, City"
                      rows="3"
                    />
                  </div>
                </div>
              </section>

              <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <span className="material-symbols-outlined text-primary">local_shipping</span>
                  </div>
                  <h2 className="text-xl font-bold text-heading-text">2. Shipping Method</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {shippingOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSelectedShipping(option.id)}
                      className={`relative flex flex-col p-5 rounded-2xl border transition-all text-left ${
                        selectedShipping === option.id
                          ? 'border-primary bg-primary/10'
                          : 'border-gray-100 bg-[#fafafa] hover:border-primary/50'
                      }`}
                    >
                      {selectedShipping === option.id && (
                        <span className="absolute top-3 right-3 text-primary text-[20px] material-symbols-outlined">check_circle</span>
                      )}
                      <span className="font-bold text-sm text-heading-text">{option.label}</span>
                      <span className="text-[11px] text-gray-500 mt-1">{option.details}</span>
                      <span className="mt-4 font-bold text-heading-text">{formatCurrency(option.price)}</span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <span className="material-symbols-outlined text-primary">payments</span>
                  </div>
                  <h2 className="text-xl font-bold text-heading-text">3. Payment Method</h2>
                </div>
                <div className="space-y-4">
                  {paymentOptions.map((option) => (
                    <label
                      key={option.id}
                      className={`flex items-center justify-between p-5 rounded-2xl border transition-all cursor-pointer ${
                        selectedPayment === option.id ? 'border-primary bg-primary/10' : 'border-gray-100 hover:border-primary/30 hover:bg-[#fafafa]'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-gray-400">{option.icon}</span>
                        <div>
                          <p className="font-bold text-sm text-heading-text">{option.label}</p>
                          <p className="text-[11px] text-gray-500">{option.description}</p>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="payment"
                        value={option.id}
                        checked={selectedPayment === option.id}
                        onChange={() => setSelectedPayment(option.id)}
                        className="text-primary border-gray-300 focus:ring-primary size-5"
                      />
                    </label>
                  ))}
                </div>
              </section>
            </div>

            <aside className="w-full lg:w-[360px]">
              <div className="sticky top-24 space-y-6">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-heading-text">Order Summary</h3>
                      <p className="text-xs text-body-text mt-1">{cartCount} item{cartCount === 1 ? '' : 's'} in your order</p>
                    </div>
                  </div>
                  <div className="space-y-6 mb-8">
                    {cartItems.length === 0 ? (
                      <div className="text-body-text text-sm">Your cart is empty. Add products to continue.</div>
                    ) : (
                      cartItems.map((item) => (
                        <div key={item.id} className="flex gap-4">
                          <div
                            className="size-16 rounded-2xl bg-cover bg-center flex-shrink-0 border border-gray-100"
                            style={{ backgroundImage: `url(${item.image})` }}
                          />
                          <div className="flex-1">
                            <p className="text-sm font-bold text-heading-text line-clamp-1">{item.name}</p>
                            <p className="text-[11px] text-gray-500">Qty: {item.quantity}</p>
                            <p className="text-sm font-bold text-heading-text mt-1">{formatCurrency(item.price)}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="border-t border-gray-100 py-6 space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="font-bold text-heading-text">{formatCurrency(cartTotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Shipping Fee</span>
                      <span className="font-bold text-heading-text">{formatCurrency(shippingFee)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Voucher Discount</span>
                      <span className="font-bold text-emerald-600">-{formatCurrency(voucherDiscount)}</span>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 pt-6 mb-8">
                    <div className="flex justify-between items-end">
                      <span className="font-bold text-sm uppercase tracking-wider text-gray-400">Total</span>
                      <span className="text-2xl font-extrabold text-primary">{formatCurrency(totalAmount)}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl text-sm shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 mb-4"
                  >
                    Place Order Now
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                  <div className="flex items-center justify-center gap-2 text-gray-400 text-xs">
                    <span className="material-symbols-outlined text-[16px]">verified_user</span>
                    <span className="font-bold uppercase tracking-widest">Secure SSL Checkout</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Apply Voucher</p>
                  <div className="flex gap-2">
                    <input
                      className="flex-1 rounded-2xl border border-gray-200 bg-[#fafafa] text-sm h-10 px-4 focus:ring-0 focus:border-primary"
                      placeholder="Enter code"
                      type="text"
                      value={voucherCode}
                      onChange={(event) => setVoucherCode(event.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (voucherDiscount === 0) {
                          alert('Try code SAVENOW for a discount.');
                        }
                      }}
                      className="bg-heading-text text-white text-[11px] font-bold px-6 rounded-2xl h-10 hover:bg-black transition-colors uppercase tracking-wider"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
