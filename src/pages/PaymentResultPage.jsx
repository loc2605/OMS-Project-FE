import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import orderApi from '../api/orderApi';
import paymentApi from '../api/paymentApi';
import { useCart } from '../contexts/CartContext';
import Header from '../components/home/Header';

const PaymentResultPage = () => {
  const [status, setStatus] = useState('PROCESSING'); // PROCESSING, SUCCESS, FAILED, TIMEOUT
  const [message, setMessage] = useState('Hệ thống đang xác thực giao dịch, vui lòng chờ...');
  const [orderInfo, setOrderInfo] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();
  
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    const processPaymentResult = async () => {
      const urlParams = new URLSearchParams(location.search);
      const responseCode = urlParams.get('vnp_ResponseCode');
      const orderId = localStorage.getItem('pending_order_id');

      if (!orderId) {
        setStatus('FAILED');
        setMessage('Không tìm thấy thông tin đơn hàng đang chờ xử lý.');
        return;
      }

      if (responseCode !== '00') {
        setStatus('FAILED');
        setMessage('Giao dịch thanh toán đã bị hủy hoặc thất bại.');
        return;
      }

      setStatus('PROCESSING');
      setMessage('Hệ thống đang xác thực giao dịch, vui lòng chờ. Không đóng trình duyệt...');

      // Force the backend to verify the VNPAY transaction (useful for local testing or when IPN is blocked)
      try {
        await paymentApi.verifyVnPay(location.search);
      } catch (err) {
        console.log('IPN verification call returned:', err);
      }

      let attempts = 0;
      const maxAttempts = 10;

      const interval = setInterval(async () => {
        attempts++;
        try {
          const response = await orderApi.get(orderId);
          const order = response.result;

          if (order.status === 'CONFIRMED' || order.status === 'SHIPPING') {
            clearInterval(interval);
            localStorage.removeItem('pending_order_id');
            clearCart();
            setOrderInfo(order);
            setStatus('SUCCESS');
            setMessage('Thanh toán & Đặt hàng Thành công!');
          } else if (order.status === 'CANCELLED') {
            clearInterval(interval);
            setStatus('FAILED');
            setMessage(order.errorMessage || 'Hệ thống đã hủy đơn hàng do thanh toán thất bại.');
          }
        } catch (err) {
          console.error('Error querying order status:', err);
        }

        if (attempts >= maxAttempts) {
          clearInterval(interval);
          setStatus('TIMEOUT');
          setMessage('Đơn hàng đang chờ xử lý. Chúng tôi sẽ thông báo cho bạn ngay khi nhận được thanh toán.');
        }
      }, 1500);
    };

    processPaymentResult();
  }, [location, clearCart]);

  return (
    <div className="bg-[#f5f5f5] min-h-screen text-body-text pb-10">
      <Header />
      <div className="max-w-[800px] mx-auto mt-10 p-4">
        <div className="bg-white rounded-sm shadow-sm p-10 text-center animate-in fade-in zoom-in duration-300">
          
          {status === 'PROCESSING' && (
            <div className="flex flex-col items-center">
              <div className="size-20 border-4 border-gray-100 border-t-primary rounded-full animate-spin mb-6"></div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Đang xử lý</h3>
              <p className="text-gray-500 leading-relaxed">{message}</p>
            </div>
          )}

          {status === 'SUCCESS' && (
            <div className="flex flex-col items-center">
              <div className="size-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-emerald-500 text-5xl">check_circle</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{message}</h3>
              {orderInfo && (
                <div className="text-gray-600 mb-8 mt-4 bg-gray-50 w-full p-4 rounded-sm text-left border border-gray-100">
                  <p><strong>Mã đơn hàng:</strong> {orderInfo.orderId}</p>
                  <p><strong>Tổng số tiền:</strong> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(orderInfo.totalAmount)}</p>
                </div>
              )}
              <div className="flex gap-4 w-full justify-center">
                <button
                  onClick={() => navigate(`/order/${orderInfo?.orderId || localStorage.getItem('pending_order_id')}`)}
                  className="px-8 bg-primary text-white py-3 rounded-sm font-medium hover:bg-primary/90 transition-all shadow-sm"
                >
                  Xem chi tiết đơn hàng
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="px-8 bg-white text-gray-600 py-3 rounded-sm font-medium border border-gray-200 hover:bg-gray-50 transition-all"
                >
                  Tiếp tục mua sắm
                </button>
              </div>
            </div>
          )}

          {status === 'FAILED' && (
            <div className="flex flex-col items-center">
              <div className="size-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-red-500 text-5xl">error</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Thanh toán thất bại</h3>
              <p className="text-red-500 leading-relaxed font-medium mb-8">{message}</p>
              <div className="flex gap-4 w-full justify-center">
                <button
                  onClick={() => navigate('/checkout')}
                  className="px-8 bg-primary text-white py-3 rounded-sm font-medium hover:bg-primary/90 transition-all shadow-sm"
                >
                  Thử lại / Thanh toán lại
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="px-8 bg-white text-gray-600 py-3 rounded-sm font-medium border border-gray-200 hover:bg-gray-50 transition-all"
                >
                  Quay lại Trang chủ
                </button>
              </div>
            </div>
          )}

          {status === 'TIMEOUT' && (
            <div className="flex flex-col items-center">
              <div className="size-20 bg-yellow-50 rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-yellow-500 text-5xl">schedule</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Đang chờ xác nhận</h3>
              <p className="text-gray-500 leading-relaxed mb-8">{message}</p>
              <button
                onClick={() => navigate('/orders')}
                className="px-8 bg-primary text-white py-3 rounded-sm font-medium hover:bg-primary/90 transition-all shadow-sm"
              >
                Kiểm tra Lịch sử mua hàng
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default PaymentResultPage;
