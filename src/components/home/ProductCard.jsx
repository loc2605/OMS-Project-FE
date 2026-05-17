import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext.jsx';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, isSkeleton = false }) => {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    addToCart(product);
  };

  if (isSkeleton) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col shadow-sm">
        <div className="aspect-[4/5] bg-gray-100 animate-pulse"></div>
        <div className="p-4 md:p-5 space-y-4">
          <div className="h-2 w-1/3 bg-gray-200 rounded animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-3 w-full bg-gray-200 rounded animate-pulse"></div>
            <div className="h-3 w-2/3 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="pt-3 border-t border-gray-50 flex justify-between items-end">
            <div className="space-y-1">
               <div className="h-2 w-8 bg-gray-200 rounded animate-pulse"></div>
               <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="size-10 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  const productImage = product.imageUrl?.[0] || product.image;
  const formattedPrice = typeof product.price === 'number' 
    ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)
    : product.price;

  return (
    <div 
      className="group bg-white rounded-2xl border border-gray-100 hover:border-primary/30 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer overflow-hidden flex flex-col h-full" 
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
        <img 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" 
          src={productImage} 
          alt={product.name} 
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.discount && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
              {product.discount}
            </span>
          )}
        </div>

        {/* Hover Overlay Button (Desktop) */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out bg-gradient-to-t from-black/60 via-black/20 to-transparent hidden lg:block">
          <button 
            onClick={(e) => { e.stopPropagation(); handleAddToCart(); }} 
            className="w-full bg-white text-gray-900 text-sm font-bold py-3 rounded-xl hover:bg-primary hover:text-white transition-all shadow-lg flex items-center justify-center gap-2 transform active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
            Quick Add
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-5 flex flex-col flex-grow bg-white z-10">
        {product.categoryName && (
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">
            {product.categoryName}
          </span>
        )}
        
        <h3 className="text-sm md:text-[15px] font-medium text-gray-800 line-clamp-2 leading-snug group-hover:text-primary transition-colors flex-grow">
          {product.name}
        </h3>
        
        <div className="flex items-end justify-between mt-3 pt-3 border-t border-gray-50">
          <div>
            <p className="text-[11px] text-gray-400 font-medium mb-0.5">Price</p>
            <span className="text-base md:text-lg font-bold text-gray-900">
              {formattedPrice}
            </span>
          </div>
          
          {/* Mobile/Tablet Add Button */}
          <button 
            onClick={(e) => { e.stopPropagation(); handleAddToCart(); }} 
            className="lg:hidden size-10 bg-gray-50 hover:bg-primary text-gray-600 hover:text-white rounded-full flex items-center justify-center transition-all shadow-sm active:scale-95 border border-gray-100 hover:border-primary"
            aria-label="Add to cart"
          >
            <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;