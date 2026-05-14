import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext.jsx';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/home/Header';
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
    addToCart(product);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    addToCart(product);
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="bg-background-light min-h-screen">
        <Header />
        <div className="max-w-full mx-auto px-4 md:px-8 lg:px-12 py-20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-background-light min-h-screen">
        <Header />
        <div className="max-w-full mx-auto px-4 md:px-8 lg:px-12 py-20 text-center">
          <p className="text-gray-500">Product not found.</p>
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
          <Link className="hover:text-primary transition-colors" to="/">Home</Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          {product.categoryName && (
            <>
              <Link className="hover:text-primary transition-colors" to={`/products?category=${encodeURIComponent(product.categoryName)}`}>
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
                <div className="aspect-square bg-center bg-no-repeat bg-cover" data-alt={product.name} style={{backgroundImage: `url("${product.imageUrl?.[0] || product.image}")`}}></div>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {(product.imageUrl || [product.image]).map((img, index) => (
                  <div key={index} className={`min-w-[80px] aspect-square rounded border-2 ${index === 0 ? 'border-primary' : 'border-gray-200'} cursor-pointer overflow-hidden`}>
                    <div className="w-full h-full bg-center bg-cover" style={{backgroundImage: `url("${img}")`}}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Product Info Card */}
          <div className="lg:col-span-7 bg-card-white p-6 shadow-soft space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="pastel-badge-primary text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm">Top Seller</span>
                <span className="text-gray-400 text-xs font-medium">SKU: {product.sku || 'N/A'}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-sm ${product.stockQuantity > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {product.stockQuantity > 0 ? `In Stock: ${product.stockQuantity}` : 'Out of Stock'}
                </span>
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
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stockQuantity === 0}
                  className={`flex-1 border border-primary text-primary bg-[#ffeeea] font-bold py-3.5 rounded-sm flex items-center justify-center gap-2 transition-all ${product.stockQuantity === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/10'}`}
                  type="button"
                >
                  <span className="material-symbols-outlined">add_shopping_cart</span>
                  Add to Cart
                </button>
                <button 
                  onClick={handleBuyNow}
                  disabled={product.stockQuantity === 0}
                  className={`flex-1 bg-primary text-white font-bold py-3.5 rounded-sm flex items-center justify-center gap-2 transition-all ${product.stockQuantity === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90'}`}
                >
                  Buy Now
                </button>
              </div>
              <div className="flex items-center justify-start gap-8 py-2 border-t border-gray-100 mt-4">
                <div className="flex items-center gap-2 text-[12px] text-gray-500">
                  <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
                  100% Authentic
                </div>
                <div className="flex items-center gap-2 text-[12px] text-gray-500">
                  <span className="material-symbols-outlined text-primary text-[18px]">local_shipping</span>
                  Free Shipping
                </div>
                <div className="flex items-center gap-2 text-[12px] text-gray-500">
                  <span className="material-symbols-outlined text-primary text-[18px]">history</span>
                  15 Days Return
                </div>
              </div>
            </div>
            {/* Product Description Moved Up */}
            <div className="pt-6 border-t border-gray-100">
              <h3 className="font-bold text-heading-text uppercase tracking-wider text-xs mb-3">Product Description</h3>
              <div className="prose prose-sm max-w-none text-body-text">
                <p className="text-sm leading-relaxed text-gray-600">
                  {product.description}
                </p>
              </div>
            </div>
          </div>
        </div>

      </main>
      {/* Footer */}
      <footer className="bg-card-white border-t border-gray-200 mt-12 py-10">
        <div className="max-w-full mx-auto px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <div className="size-6">
                  <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z" fill="currentColor"></path>
                  </svg>
                </div>
                <h2 className="text-heading-text text-lg font-bold leading-tight">Shop<span className="text-primary">Modern</span></h2>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">ShopModern is a leading global e-commerce platform dedicated to providing quality tech gadgets and accessories at competitive prices.</p>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4 uppercase tracking-wider">Customer Service</h4>
              <ul className="text-xs text-gray-500 space-y-2">
                <li><a className="hover:text-primary" href="#">Help Centre</a></li>
                <li><a className="hover:text-primary" href="#">ShopModern Reward</a></li>
                <li><a className="hover:text-primary" href="#">Shipping &amp; Delivery</a></li>
                <li><a className="hover:text-primary" href="#">Return &amp; Refund</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4 uppercase tracking-wider">Payment Methods</h4>
              <div className="flex flex-wrap gap-2">
                <div className="w-10 h-6 bg-white rounded-sm border border-gray-200 flex items-center justify-center">
                  <svg className="w-6 h-4" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="24" height="16" rx="2" fill="#1A1F71"/>
                    <path d="M9.5 4H14.5L13 12H8L9.5 4Z" fill="white"/>
                    <path d="M6 4H9.5L8 12H4.5C4 12 3.5 11.5 3.5 11V5C3.5 4.5 4 4 4.5 4H6Z" fill="white"/>
                    <path d="M15.5 4H18.5C19 4 19.5 4.5 19.5 5V11C19.5 11.5 19 12 18.5 12H15.5L17 4Z" fill="white"/>
                  </svg>
                </div>
                <div className="w-10 h-6 bg-white rounded-sm border border-gray-200 flex items-center justify-center">
                  <svg className="w-6 h-4" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="24" height="16" rx="2" fill="#EB001B"/>
                    <rect x="6" width="12" height="16" fill="#F79E1B"/>
                    <circle cx="12" cy="8" r="4" fill="#FF5F00"/>
                  </svg>
                </div>
                <div className="w-10 h-6 bg-white rounded-sm border border-gray-200 flex items-center justify-center">
                  <svg className="w-6 h-4" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="24" height="16" rx="2" fill="#003087"/>
                    <path d="M6 4H18V12H6V4Z" fill="white"/>
                    <path d="M9 7H15V9H9V7Z" fill="#003087"/>
                  </svg>
                </div>
                <div className="w-10 h-6 bg-white rounded-sm border border-gray-200 flex items-center justify-center">
                  <svg className="w-6 h-4" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="24" height="16" rx="2" fill="#000000"/>
                    <path d="M6 4H18V12H6V4Z" fill="white"/>
                    <path d="M9 7H15V9H9V7Z" fill="#000000"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-100 mt-10 pt-6 text-center text-[11px] text-gray-400">
            © 2026 ShopModern. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProductDetailPage;