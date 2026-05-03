import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../contexts/CartContext.jsx';
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
  const [product, setProduct] = useState(null);
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const [productRes, inventoryRes] = await Promise.all([
          productApi.get(id),
          inventoryApi.checkStock(id)
        ]);
        if (productRes.success) {
          setProduct(productRes.result);
        }
        if (inventoryRes.success) {
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
          <a className="hover:text-primary" href="#">Home</a>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <a className="hover:text-primary" href="#">Electronics</a>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <a className="hover:text-primary" href="#">Smartphones</a>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
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
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-heading-text">{product.name}</h1>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center text-primary">
                  <span className="material-symbols-outlined text-[16px]">star</span>
                  <span className="material-symbols-outlined text-[16px]">star</span>
                  <span className="material-symbols-outlined text-[16px]">star</span>
                  <span className="material-symbols-outlined text-[16px]">star</span>
                  <span className="material-symbols-outlined text-[16px]">star_half</span>
                  <span className="ml-1 font-bold underline">4.8</span>
                </div>
                <span className="text-gray-300">|</span>
                <span className="underline cursor-pointer">1.2k Reviews</span>
                <span className="text-gray-300">|</span>
                <span>2.5k Sold</span>
              </div>
            </div>
            <div className="p-5 bg-[#fafafa] rounded space-y-4">
              <div className="flex items-center gap-4">
                {product.oldPrice && <span className="text-gray-400 line-through text-sm">{formatCurrency(product.oldPrice)}</span>}
                <span className="text-3xl font-bold text-primary">{formatCurrency(product.price)}</span>
                {product.discount && <span className="pastel-badge-primary text-[11px] font-bold px-1.5 py-0.5 rounded">{product.discount}</span>}
              </div>
              {/* Inventory Urgency */}
              {inventory && (
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-primary font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
                      Hurry! Only {inventory.availableQuantity} items left in stock
                    </span>
                    <span className="text-gray-500">{Math.round((inventory.reservedQuantity / inventory.totalQuantity) * 100) || 0}% Sold</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${(inventory.reservedQuantity / inventory.totalQuantity) * 100}%` }}></div>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => addToCart(product)}
                  className="flex-1 border border-primary text-primary bg-[#ffeeea] font-bold py-3.5 rounded-sm flex items-center justify-center gap-2 transition-all hover:bg-primary/10"
                  type="button"
                >
                  <span className="material-symbols-outlined">add_shopping_cart</span>
                  Add to Cart
                </button>
                <button className="flex-1 bg-primary text-white font-bold py-3.5 rounded-sm flex items-center justify-center gap-2 transition-all hover:bg-primary/90">
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
            {/* Promotion */}
            <div className="p-3 bg-[#fffaf5] border border-primary/20 rounded flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-primary">
                  <span className="material-symbols-outlined">confirmation_number</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-heading-text">Nhận Voucher {formatCurrency(100000)}</p>
                  <p className="text-[11px] text-gray-500">For new customers only</p>
                </div>
              </div>
              <button className="text-primary font-bold text-sm px-4 py-1 hover:bg-primary/5 rounded">Claim</button>
            </div>
          </div>
        </div>
        {/* Product Details & Seller Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-9 bg-card-white shadow-soft">
            <div className="flex border-b border-gray-100">
              <button className="px-8 py-4 text-primary border-b-2 border-primary font-bold text-sm">PRODUCT SPECIFICATIONS</button>
              <button className="px-8 py-4 text-heading-text hover:text-primary font-medium text-sm">PRODUCT DESCRIPTION</button>
            </div>
            <div className="p-6 space-y-8">
              <div className="prose prose-sm max-w-none text-body-text">
                <p className="text-base leading-relaxed">
                  {product.description}
                </p>
                <h3 className="text-lg font-bold mt-8 mb-4">Highlights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="rounded overflow-hidden aspect-video bg-cover bg-center shadow-sm" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD4NJ2YSUwddpgafTM6-onHTkbf_7p81A-I4i61JX_ItD49SOQMPuUvnLYG3XUziLBq1wDbaHuH0935U3lPhy7mR7wh7gBM0D9qBbad1i62IN7X1WryK5EoP-uYVBcUsXDc91FvzTpTAIOh2nmCeCXI6Yra37tawT42GMTthyA1flX9P2FpQMYECHmVh4FjMF0a1VBlfZP13cLc-n9y5FGtkancDxn77Mbxs2TdMTlK-hHHzcLaFJwoHqVrDkyvAH3YRa0xjIkKKXAF")'}}></div>
                  <div className="rounded overflow-hidden aspect-video bg-cover bg-center shadow-sm" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC4zGNkti5YGwJvqWkPs04gMsKRNT6-UmLzT6zaNpTfNG76zNcldAgLPCnEZorPCblw3eYRofFgVhICrmw3x8NPdO1Kx9FdUxY46YT_6v53SywVYoYzzbb_lNhp56KDJmWTm2PtKsfZSj2Wjk_vyni1jUQWJ8913HdUIMpV74_11oRHfRXSgy0RQdMXLYU5ocCb7hRQnCBt9_7v-HdBxsVQQ03OH6vNtvXnsWj5iPD9o1rSmvAcRTBNT9hz1FpVQqjm_9anHQ9tROy4")'}}></div>
                </div>
                <ul className="space-y-3 text-body-text">
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">check</span>
                    <span><strong className="text-heading-text">Next-Gen Performance:</strong> Snapdragon Elite processor with 12GB RAM.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">check</span>
                    <span><strong className="text-heading-text">Crystal Clear Display:</strong> 6.7" Dynamic AMOLED 2X.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">check</span>
                    <span><strong className="text-heading-text">All-Day Battery:</strong> 5000mAh battery with 100W HyperCharge.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-card-white p-5 shadow-soft">
              <h3 className="font-bold text-sm mb-4 uppercase text-gray-400 tracking-wider">Seller Details</h3>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 bg-gray-100 rounded-full bg-center bg-cover border border-gray-100" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAAdM7eW3FowuYynUVaaRx7ELiZy2g1iP72leAKKqikViG1M308sfQ3j-qigA0X1MaTqbdlkqsVF6_xME_ZmjcHcgxF_Gz5_3jzP6S1JCQva-TS9fbBL14Qa7kEUwTX30Af6Y9aaE8uFDJtmUW4UPQN8y3jEBhj4KLB3K8DIXtPMI3gAbQSZw4vCI6L29PN-StoWzqvUoxU4NhLCYd3kgA1XM9EcmJ8yahT6ITZ_NQb-BHl0CrpiXkO5RIREACugx4WCR7tXHNxSC47")'}}></div>
                <div>
                  <p className="font-bold text-sm text-heading-text">Official Tech Store</p>
                  <p className="text-[11px] text-green-500 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Active Now
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center mb-5">
                <div className="p-2 bg-[#fcfcfc] border border-gray-50 rounded">
                  <p className="text-sm font-bold text-primary">98%</p>
                  <p className="text-[9px] text-gray-500 uppercase font-medium">Positive</p>
                </div>
                <div className="p-2 bg-[#fcfcfc] border border-gray-50 rounded">
                  <p className="text-sm font-bold text-primary">4.9/5</p>
                  <p className="text-[9px] text-gray-500 uppercase font-medium">Rating</p>
                </div>
              </div>
              <button className="w-full py-2 border border-primary text-primary text-sm font-bold rounded-sm hover:bg-primary/5 transition-colors">
                Visit Shop
              </button>
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