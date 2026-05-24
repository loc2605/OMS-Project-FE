import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext.jsx';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/home/Header';
import Footer from '../components/home/Footer';
import productApi from '../api/productApi';
import inventoryApi from '../api/inventoryApi';
const formatCurrency = (value) => {
  const amount = Number(String(value).replace(/[^0-9.-]+/g, ''));
  if (Number.isNaN(amount)) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const [productRes, inventoryRes] = await Promise.all([
          productApi.get(id),
          inventoryApi.checkStock(id).catch(err => {
            console.warn('Inventory fetch failed (likely unauthorized):', err);
            return { success: false };
          })
        ]);
        if (productRes.success) {
          setProduct(productRes.result);
        }
        if (inventoryRes && inventoryRes.success) {
          setInventory(inventoryRes.result);
        }
      } catch (error) {
        console.error('Failed to fetch product detail', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    addToCart(product, quantity);
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="bg-background-light min-h-screen">
        <Header />
        <div className="max-w-full mx-auto px-4 md:px-8 lg:px-12 py-20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-500">Đang tải chi tiết sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-background-light min-h-screen">
        <Header />
        <div className="max-w-full mx-auto px-4 md:px-8 lg:px-12 py-20 text-center">
          <p className="text-gray-500">Không tìm thấy sản phẩm.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-light text-body-text transition-colors duration-200">
      {/* Top Navigation Bar */}
      <Header />
      <main className="max-w-full mx-auto px-4 md:px-8 lg:px-12 py-4 space-y-4">
        {/* Breadcrumbs */}
        <div className="flex flex-wrap gap-2 items-center text-sm mb-2 text-gray-500">
          <Link className="hover:text-primary transition-colors" to="/">Trang Chủ</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          {product.categoryName && (
            <>
              <Link className="hover:text-primary transition-colors" to={`/products?categoryName=${encodeURIComponent(product.categoryName)}`}>
                {product.categoryName}
              </Link>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            </>
          )}
          <span className="text-heading-text font-medium">{product.name}</span>
        </div>
        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Gallery Card */}
          <div className="lg:col-span-5 bg-card-white p-4 shadow-soft">
            <div className="space-y-4">
              <div className="overflow-hidden bg-white border border-gray-100 rounded">
                <div className="aspect-square bg-center bg-no-repeat bg-cover" data-alt={product.name} style={{ backgroundImage: `url("${product.imageUrl?.[0] || product.image}")` }}></div>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {(product.imageUrl || [product.image]).map((img, index) => (
                  <div key={index} className={`min-w-[80px] aspect-square rounded border-2 ${index === 0 ? 'border-primary' : 'border-gray-200'} cursor-pointer overflow-hidden`}>
                    <div className="w-full h-full bg-center bg-cover" style={{ backgroundImage: `url("${img}")` }}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Product Info Card */}
          <div className="lg:col-span-7 bg-card-white p-6 shadow-soft space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-xs font-medium">SKU: {product.sku || 'N/A'}</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-heading-text">{product.name}</h1>

            </div>
            <div className="p-5 bg-[#fafafa] rounded">
              <div className="flex items-center gap-4">
                {product.oldPrice && <span className="text-gray-400 line-through text-sm">{formatCurrency(product.oldPrice)}</span>}
                <span className="text-3xl font-bold text-primary">{formatCurrency(product.price)}</span>
                {product.discount && <span className="pastel-badge-primary text-[11px] font-bold px-1.5 py-0.5 rounded">{product.discount}</span>}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-6 py-2">
              <span className="text-sm font-medium text-gray-600">Số lượng</span>
              <div className="flex items-center border border-gray-200 rounded-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || product.stockQuantity === 0}
                  className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 border-r border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">remove</span>
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val) && val >= 1 && val <= product.stockQuantity) {
                      setQuantity(val);
                    } else if (e.target.value === '') {
                      setQuantity('');
                    }
                  }}
                  onBlur={() => {
                    if (!quantity || quantity < 1) setQuantity(1);
                  }}
                  disabled={product.stockQuantity === 0}
                  className="w-12 h-8 text-center outline-none text-sm font-medium bg-transparent disabled:bg-gray-50 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none m-0"
                  style={{ MozAppearance: 'textfield' }}
                  min="1"
                  max={product.stockQuantity || 1}
                />
                <button
                  onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                  disabled={quantity >= product.stockQuantity || product.stockQuantity === 0}
                  className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 border-l border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                </button>
              </div>
              <span className="text-sm text-gray-500">{product.stockQuantity} sản phẩm có sẵn</span>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stockQuantity === 0}
                  className={`flex-1 border border-primary text-primary bg-[#ffeeea] font-bold py-3.5 rounded-sm flex items-center justify-center gap-2 transition-all ${product.stockQuantity === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/10'}`}
                  type="button"
                >
                  <span className="material-symbols-outlined">add_shopping_cart</span>
                  Thêm vào giỏ
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={product.stockQuantity === 0}
                  className={`flex-1 bg-primary text-white font-bold py-3.5 rounded-sm flex items-center justify-center gap-2 transition-all ${product.stockQuantity === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90'}`}
                >
                  Mua ngay
                </button>
              </div>
              <div className="flex items-center justify-start gap-8 py-2 border-t border-gray-100 mt-4">
                <div className="flex items-center gap-2 text-[12px] text-gray-500">
                  <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
                  100% Chính hãng
                </div>
                <div className="flex items-center gap-2 text-[12px] text-gray-500">
                  <span className="material-symbols-outlined text-primary text-[18px]">local_shipping</span>
                  Miễn phí vận chuyển
                </div>
                <div className="flex items-center gap-2 text-[12px] text-gray-500">
                  <span className="material-symbols-outlined text-primary text-[18px]">history</span>
                  Đổi trả 15 ngày
                </div>
              </div>
            </div>
            {/* Product Description Moved Up */}
            <div className="pt-6 border-t border-gray-100">
              <h3 className="font-bold text-heading-text uppercase tracking-wider text-xs mb-3">Mô tả sản phẩm</h3>
              <div className="prose prose-sm max-w-none text-body-text">
                <p className="text-sm leading-relaxed text-gray-600">
                  {product.description}
                </p>
              </div>
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
};

export default ProductDetailPage;