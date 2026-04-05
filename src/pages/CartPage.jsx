import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext.jsx';

const formatCurrency = (value) => {
  const amount = Number(String(value).replace(/[^0-9.-]+/g, ''));
  if (Number.isNaN(amount)) return '$0.00';
  return new Intl.NumberFormat('en-SG', { style: 'currency', currency: 'SGD' }).format(amount);
};

const CartPage = () => {
  const { cartItems, cartCount, cartTotal, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const groupedByStore = cartItems.reduce((groups, item) => {
    const storeName = item.store || 'ShopEase Official Store';
    if (!groups[storeName]) groups[storeName] = [];
    groups[storeName].push(item);
    return groups;
  }, {});

  return (
    <div className="bg-background-light font-display text-body-text min-h-screen">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#e6dfdb] px-4 lg:px-40 py-4">
        <div className="flex items-center justify-between whitespace-nowrap">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4 text-heading-text">
              <div className="size-6 text-primary">
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
            onClick={() => navigate('/')}
            className="text-sm font-medium text-body-text hover:text-primary transition-colors"
          >
            Back to Shop
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 lg:px-40 pt-6 pb-10">
        <div className="max-w-[1200px] mx-auto">
          <nav className="flex flex-wrap gap-2 mb-6 text-sm text-body-text">
            <button onClick={() => navigate('/')} className="hover:text-primary transition-colors">
              Home
            </button>
            <span className="text-[#8a7260]">/</span>
            <span className="text-heading-text font-medium">Shopping Cart</span>
          </nav>

          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-heading-text text-4xl font-extrabold leading-tight tracking-tight">
                Shopping Cart
              </h1>
              <p className="text-sm text-body-text mt-2">You have {cartCount} item{cartCount === 1 ? '' : 's'} in your cart.</p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-1 w-full space-y-8">
              <div className="bg-white p-6 rounded-md shadow-sm flex items-center">
                <p className="text-heading-text text-base font-bold">Select items to proceed</p>
              </div>

              {cartItems.length === 0 ? (
                <div className="bg-white rounded-md shadow-sm p-10 text-center text-body-text">
                  Your cart is empty. Add products from the shop to save them here.
                </div>
              ) : (
                Object.keys(groupedByStore).map((storeName) => (
                  <div key={storeName} className="bg-white rounded-md shadow-sm overflow-hidden">
                    <div className="px-8 py-5 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-primary">
                          <span className="material-symbols-outlined text-[20px]">store</span>
                          <p className="text-heading-text font-bold">{storeName}</p>
                        </div>
                      </div>
                      <span className="text-xs text-primary bg-primary/10 px-3 py-1 rounded-full font-bold">
                        Free Shipping Available
                      </span>
                    </div>
                    <div className="divide-y divide-gray-50">
                      {groupedByStore[storeName].map((item) => (
                        <div key={item.id} className="p-8 flex flex-col md:flex-row gap-8">
                          <div className="flex items-center gap-6">
                            <div className="size-24 rounded-[6px] bg-cover bg-center border border-gray-100" style={{ backgroundImage: `url(${item.image})` }} />
                          </div>
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <h3 className="text-heading-text text-lg font-bold">{item.name}</h3>
                              <p className="text-body-text text-sm mt-1">{item.variant || item.description || 'Default option'}</p>
                            </div>
                            <div className="flex items-center gap-6 mt-4">
                              <button className="text-xs font-bold text-primary hover:underline transition-all">
                                Wishlist
                              </button>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-xs font-bold text-red-400 hover:text-red-600 transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                          <div className="flex flex-col md:items-end justify-between min-w-[140px]">
                            <p className="text-heading-text text-xl font-bold">{formatCurrency(item.price)}</p>
                            <div className="flex items-center border border-gray-200 rounded-md px-1 py-1 mt-4">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="size-8 flex items-center justify-center text-body-text hover:text-primary transition-colors"
                              >
                                <span className="material-symbols-outlined text-[18px]">remove</span>
                              </button>
                              <span className="w-10 text-center text-sm font-bold text-heading-text">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="size-8 flex items-center justify-center text-body-text hover:text-primary transition-colors"
                              >
                                <span className="material-symbols-outlined text-[18px]">add</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            <aside className="w-full lg:w-[380px] lg:sticky lg:top-28">
              <div className="bg-white p-8 rounded-md shadow-sm">
                <h2 className="text-xl font-bold mb-8 text-heading-text">Order Summary</h2>
                <div className="space-y-5 mb-8">
                  <div className="flex justify-between">
                    <p className="text-body-text font-medium">Subtotal ({cartCount} items)</p>
                    <p className="text-heading-text font-bold">{formatCurrency(cartTotal)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-body-text font-medium">Estimated Shipping</p>
                    <p className="text-heading-text font-bold">{cartItems.length ? 'S$ 5.00' : 'S$ 0.00'}</p>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <p className="font-medium">Shipping Discount</p>
                    <p className="font-bold">- S$ 5.00</p>
                  </div>
                  <div className="pt-6 border-t border-gray-100 flex flex-col gap-4">
                    <label className="text-xs font-bold uppercase tracking-wider text-body-text">Voucher Code</label>
                    <div className="flex gap-2">
                      <input
                        className="flex-1 rounded-md border border-gray-200 bg-transparent px-4 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                        placeholder="Enter code"
                        type="text"
                      />
                      <button className="bg-[#f5f2f0] px-6 py-2 rounded-md text-xs font-bold text-heading-text hover:bg-gray-200 transition-colors">
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-8 mb-10">
                  <div className="flex justify-between items-end">
                    <p className="text-lg font-bold text-heading-text">Total</p>
                    <p className="text-3xl font-extrabold text-primary">{formatCurrency(cartTotal)}</p>
                  </div>
                  <p className="text-[10px] text-body-text mt-2 text-right italic">GST included where applicable</p>
                </div>
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-primary text-white py-4 rounded-md font-bold text-lg hover:brightness-110 active:scale-[0.98] transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-3"
                >
                  <span>Proceed to Checkout</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
                <div className="mt-8 flex flex-col gap-4">
                  <div className="flex items-center gap-4 text-body-text">
                    <span className="material-symbols-outlined text-sm">verified_user</span>
                    <p className="text-xs">Secure payment guaranteed</p>
                  </div>
                  <div className="flex items-center gap-4 text-body-text">
                    <span className="material-symbols-outlined text-sm">local_shipping</span>
                    <p className="text-xs">7-day free return policy</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-primary/5 border border-primary/10 p-6 rounded-md flex items-center gap-5">
                <span className="material-symbols-outlined text-primary text-[32px]">redeem</span>
                <div>
                  <p className="text-heading-text text-sm font-bold leading-tight">Get S$ 10 off!</p>
                  <p className="text-body-text text-xs mt-1">Spend S$ 150 more to unlock gold rewards.</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CartPage;
