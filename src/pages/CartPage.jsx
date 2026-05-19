import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext.jsx';
import Header from '../components/home/Header';

const formatCurrency = (value) => {
  const amount = Number(String(value).replace(/[^0-9.-]+/g, ''));
  if (Number.isNaN(amount)) return '$0.00';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const CartPage = () => {
  const { cartItems, cartCount, cartTotal, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="bg-[#f5f5f5] text-body-text min-h-screen pb-32">
      <Header />

      <main className="max-w-[1400px] mx-auto px-4 pt-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
          <button onClick={() => navigate('/')} className="hover:text-primary transition-colors">Home</button>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-primary font-medium">Cart</span>
        </div>

        {/* Cart Items */}
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-sm shadow-sm p-20 text-center">
            <div className="size-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-gray-300 text-5xl">shopping_cart</span>
            </div>
            <p className="text-gray-500 mb-6">Your shopping cart is empty</p>
            <button
              onClick={() => navigate('/')}
              className="bg-primary text-white px-10 py-2.5 rounded-sm hover:bg-primary/90 transition-all font-medium"
            >
              Go Shopping
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-sm shadow-sm mb-4 overflow-hidden">
            {/* Items List */}
            <div className="divide-y divide-gray-50">
              {cartItems.map((item) => (
                <div key={item.id} className="px-6 py-5 grid grid-cols-12 items-center hover:bg-gray-50/30 transition-colors">
                  <div className="col-span-6 flex gap-4">
                    <div
                      className="size-20 bg-cover bg-center rounded-sm border border-gray-100 flex-shrink-0"
                      style={{ backgroundImage: `url(${item.imageUrl?.[0] || item.image})` }}
                    />
                    <div className="flex flex-col justify-center">
                      <h3 className="text-sm text-gray-800 line-clamp-2 mb-1">{item.name}</h3>
                      <span className="text-xs text-gray-400">Variation: {item.variant || 'Default'}</span>
                    </div>
                  </div>

                  <div className="col-span-2 text-center text-sm text-gray-800">
                    {formatCurrency(item.price)}
                  </div>

                  <div className="col-span-2 flex justify-center">
                    <div className="flex items-center border border-gray-200 rounded-sm overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="size-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors border-r border-gray-200"
                      >
                        <span className="material-symbols-outlined text-[16px]">remove</span>
                      </button>
                      <span className="w-12 text-center text-sm text-gray-800 font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="size-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors border-l border-gray-200"
                      >
                        <span className="material-symbols-outlined text-[16px]">add</span>
                      </button>
                    </div>
                  </div>

                  <div className="col-span-1 text-center text-sm font-medium text-primary">
                    {formatCurrency(item.price * item.quantity)}
                  </div>

                  <div className="col-span-1 text-center">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-500 hover:text-primary transition-colors text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Sticky Bottom Summary Bar (Shopee Style) */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-5px_15px_rgba(0,0,0,0.05)] z-50">
          <div className="max-w-[1200px] mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span>Total ({cartCount} items):</span>
                <span className="text-2xl font-bold text-primary">{formatCurrency(cartTotal)}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <button
                onClick={() => navigate('/checkout')}
                className="flex-1 md:w-52 bg-primary text-white py-3 font-medium text-base hover:bg-primary/90 transition-all rounded-sm shadow-sm"
              >
                Check Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
