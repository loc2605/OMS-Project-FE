import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from '../components/home/Header';
import orderApi from '../api/orderApi';

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
      case 'PAYMENT_PENDING': return { text: 'Payment Pending', color: 'bg-yellow-50 text-yellow-600 border-yellow-200' };
      case 'CONFIRMED': return { text: 'Confirmed', color: 'bg-green-50 text-green-600 border-green-200' };
      case 'SHIPPED': return { text: 'Shipped', color: 'bg-blue-50 text-blue-600 border-blue-200' };
      case 'CANCELLED': return { text: 'Cancelled', color: 'bg-red-50 text-red-600 border-red-200' };
      default: return { text: status, color: 'bg-gray-50 text-gray-600 border-gray-200' };
    }
  };

  const statusInfo = getStatusDisplay(order?.status);

  return (
    <div className="bg-background-light font-display text-body-text min-h-screen">
      <Header />

      <main className="layout-container flex h-full grow flex-col px-4 md:px-8 lg:px-12 py-10">
        <div className="max-w-full mx-auto w-full flex flex-col gap-8">
          <div className="bg-white p-8 rounded-[16px] shadow-sm">
            <div className="flex flex-wrap justify-between items-center gap-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-4">
                  <h1 className="text-heading text-3xl font-extrabold leading-tight tracking-tight">{statusInfo.text}</h1>
                  <span className={`px-4 py-1.5 ${statusInfo.color} text-[10px] font-extrabold rounded-full uppercase tracking-widest border`}>
                    {order?.status}
                  </span>
                </div>
                <p className="text-body text-sm font-medium">
                  Order ID: <span className="text-heading font-bold">#{orderId}</span>
                </p>
                <p className="text-sm text-gray-500 mt-1">{order?.message}</p>
              </div>
              <div className="flex gap-4">
                <button className="flex items-center justify-center rounded-lg h-12 px-8 border border-gray-200 bg-white text-heading text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm">
                  <span className="material-symbols-outlined text-xl mr-2">chat_bubble</span>
                  Contact Seller
                </button>
                <button className="flex items-center justify-center rounded-lg h-12 px-8 bg-primary text-white text-sm font-bold shadow-md shadow-primary/20 hover:opacity-95 transition-all">
                  Confirm Receipt
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[16px] shadow-sm">
            <h2 className="text-heading text-xl font-extrabold mb-10 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-2xl">local_shipping</span>
              Shipping Progress
            </h2>
            <div className="relative pl-20 space-y-12">
              <div className="absolute left-[33px] top-2 bottom-2 w-0.5 bg-gray-100"></div>

              <div className="relative">
                <div className="absolute -left-[47px] size-10 rounded-full bg-primary flex items-center justify-center text-white ring-8 ring-white z-10">
                  <span className="material-symbols-outlined text-xl">local_shipping</span>
                </div>
                <div className="flex flex-col pt-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-primary text-lg font-bold">In Delivery</h3>
                    <span className="text-body/40 text-xs font-medium">— 14:00, Today</span>
                  </div>
                  <p className="text-heading text-sm font-semibold mt-2">Shipper: Nguyen Van A</p>
                  <p className="text-body text-sm mt-1 leading-relaxed">Your package is on its way to you and expected to arrive by evening.</p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-[47px] size-10 rounded-full bg-gray-50 border-2 border-primary/20 flex items-center justify-center text-primary ring-8 ring-white z-10">
                  <span className="material-symbols-outlined text-xl">payments</span>
                </div>
                <div className="flex flex-col pt-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-heading text-lg font-bold">Paid Successfully</h3>
                    <span className="text-body/40 text-xs font-medium">— 10:05, Oct 12</span>
                  </div>
                  <p className="text-body text-sm mt-2">Payment processed via Visa ending in •••• 4242.</p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-[47px] size-10 rounded-full bg-gray-50 border-2 border-primary/20 flex items-center justify-center text-primary ring-8 ring-white z-10">
                  <span className="material-symbols-outlined text-xl">list_alt</span>
                </div>
                <div className="flex flex-col pt-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-heading text-lg font-bold">Order Placed</h3>
                    <span className="text-body/40 text-xs font-medium">— 10:00, Oct 12</span>
                  </div>
                  <p className="text-body text-sm mt-2">We have received your order and started processing.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="lg:col-span-2 bg-white p-8 rounded-[16px] shadow-sm">
              <h2 className="text-heading text-xl font-extrabold mb-8">Order Items</h2>
              <div className="space-y-6">
                <div className="flex items-center gap-6 p-5 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
                  <div
                    className="size-24 bg-white rounded-lg flex-shrink-0 bg-cover bg-center border border-gray-100 shadow-sm"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDYTlK9YM0Jje6AmtEvPOA9lVFg4uXffoLQJuflHZZql_IWATEdArhO1-zpCS_rb1F977VUDLyFwJSrRbW4MQF1ld9CJiFyHUAtxsnZqlgV6qXEARw9u8Ml69-4fYLUkQpGCjMrFI5ALAL6IuJ824cay72BhzDG8OZDvQD-zhYFo1YLoiVwX5xZFRqRCcmLvLkhnm3nLUHKwR_8ODeGFCRbml0P6rRlrTK7DWWdOx-7SlRCsub4ch3qyaFn-2hhXrPNJ9CnEQ1wDa14")',
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-heading truncate">Sony WH-1000XM5 Wireless Headphones</p>
                    <p className="text-sm text-body mt-1 font-medium">Color: Silver • Qty: 1</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-extrabold text-primary">$349.00</p>
                    <p className="text-xs text-body/50 line-through font-medium">$399.00</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 p-5 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
                  <div
                    className="size-24 bg-white rounded-lg flex-shrink-0 bg-cover bg-center border border-gray-100 shadow-sm"
                    style={{
                      backgroundImage:
                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDjo_DKWAY3_4lCloOlLMw1nfDA3BYTx0HRrjC9GhLx8jXELpcaHZbTdfqwhFBfxRF3i9gPqP9PXuyCiTX0Dnf9pXfvCgdxj3SLQkmPT9Z1i1CFNwXTQjKtueM4ArKvikE_ib3m0RCgK2gFoVhxeKMBZTORdYgZB-ocFp3thSa4tagIddyEWYNcpB2GP2x1FPIcIStXDKlmzHprC5I8JMByb18zhbzDjxXbmO-19Zf58NFT8-wLqluiuClFq_z_jvdoV0lGCEVDPpXX")',
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-heading truncate">Premium Braided USB-C to Lightning Cable</p>
                    <p className="text-sm text-body mt-1 font-medium">Length: 2m • Qty: 2</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-extrabold text-primary">$38.00</p>
                    <p className="text-xs text-body/50 font-medium">$19.00 each</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-gray-100 space-y-4">
                <div className="flex justify-between text-body text-sm font-semibold">
                  <span>Merchandise Subtotal</span>
                  <span className="text-heading">$387.00</span>
                </div>
                <div className="flex justify-between text-body text-sm font-semibold">
                  <span>Shipping Fee</span>
                  <span className="text-heading">$12.00</span>
                </div>
                <div className="flex justify-between text-body text-sm font-semibold">
                  <span>Voucher Applied</span>
                  <span className="text-green-600">-$20.00</span>
                </div>
                <div className="flex justify-between text-heading text-2xl font-black pt-4">
                  <span>Total Amount</span>
                  <span className="text-primary">$379.00</span>
                </div>
              </div>
            </div>
            </div>

            <div className="lg:col-span-1 flex flex-col gap-8">
              <div className="bg-white p-8 rounded-[16px] shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-primary font-bold">location_on</span>
                  <h3 className="text-lg font-bold text-heading">Delivery Address</h3>
              </div>
              <div className="space-y-3">
                <p className="font-bold text-heading text-base">John Doe</p>
                <p className="text-sm text-body font-medium">(+84) 912 345 678</p>
                <p className="text-sm text-body leading-relaxed">
                  123 Sunshine Avenue, District 1<br />
                  Ho Chi Minh City, 700000<br />
                  Vietnam
                </p>
              </div>
              <div className="mt-6 rounded-lg h-36 w-full overflow-hidden shadow-inner ring-1 ring-gray-100">
                <div
                  className="w-full h-full bg-cover bg-center grayscale-[0.5] contrast-[0.9]"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCZCgB0sWsv3TIV5-HjcZU705vA7DNBuYuwMvSLU_lw2h9TSIo7rKdfQaLEavsbfuPkDbu3UCyer4XN5BFaPlPiMjiJk4vG50lVz9MDoOU3nnVPIzIUrLQG9bCwKUkAFVhA7U-uOoxxHlDTOC7E58tsscInTAXXYyyjWAz6W11Ss4yQN6GqJ8cpkkh0sGSwFzfwwaoIF-oJO-xPvbtY9YyjS6_2FAIs5aN2b_kyQUu-Zv2OuBbGxZYITuK2Fd5PRHnj-Frw0wygUBE1")',
                  }}
                />
              </div>
            </div>
            <div className="bg-white p-8 rounded-[16px] shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary font-bold">account_balance_wallet</span>
                <h3 className="text-lg font-bold text-heading">Payment Method</h3>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100">
                <div className="size-12 bg-white rounded-lg flex items-center justify-center shadow-sm text-body">
                  <span className="material-symbols-outlined text-2xl">credit_card</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-heading uppercase tracking-wide">Visa •••• 4242</p>
                  <p className="text-[11px] text-body font-medium mt-0.5">Paid Oct 12, 10:05 AM</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <Link
                to="#"
                className="flex items-center justify-between p-5 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 group"
              >
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-body/60 group-hover:text-primary transition-colors">assignment_return</span>
                  <span className="text-sm font-bold text-heading">Return / Refund Policy</span>
                </div>
                <span className="material-symbols-outlined text-body/40 group-hover:translate-x-1 transition-transform">chevron_right</span>
              </Link>
              <Link
                to="#"
                className="flex items-center justify-between p-5 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 group"
              >
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-body/60 group-hover:text-primary transition-colors">help</span>
                  <span className="text-sm font-bold text-heading">Need help with this order?</span>
                </div>
                <span className="material-symbols-outlined text-body/40 group-hover:translate-x-1 transition-transform">chevron_right</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-20 py-12 px-4 md:px-8 lg:px-12 bg-white border-t border-gray-100 text-center shadow-sm">
        <div className="max-w-full mx-auto">
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
