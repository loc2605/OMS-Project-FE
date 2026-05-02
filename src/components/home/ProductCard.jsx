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
    addToCart(product);
  };

  if (isSkeleton) {
    return (
      <div className="bg-card-white rounded soft-shadow overflow-hidden flex flex-col">
        <div className="aspect-square skeleton-shimmer"></div>
        <div className="p-3 space-y-3">
          <div className="h-3 w-full skeleton-shimmer rounded"></div>
          <div className="h-3 w-2/3 skeleton-shimmer rounded"></div>
          <div className="h-5 w-1/2 skeleton-shimmer rounded"></div>
        </div>
      </div>
    );
  }

  const productImage = product.imageUrl?.[0] || product.image;
  const formattedPrice = typeof product.price === 'number' 
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price)
    : product.price;

  return (
    <div className="group bg-card-white rounded soft-shadow overflow-hidden border border-transparent hover:border-primary transition-all duration-200 cursor-pointer" onClick={handleCardClick}>
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img className="w-full h-full object-cover" src={productImage} alt={product.name} />
        {product.discount && (
          <div className="absolute top-0 right-0 bg-primary/90 text-white text-[11px] font-bold px-1.5 py-1">{product.discount}</div>
        )}
      </div>
      <div className="p-3 space-y-1.5">
        <h3 className="text-sm text-heading line-clamp-2 leading-relaxed min-h-[2.5rem]">{product.name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-primary font-medium text-base">{formattedPrice}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-[#ffce3d]">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`material-symbols-outlined text-xs ${i < (product.rating || 5) ? 'fill-current' : 'text-gray-200'}`}>star</span>
            ))}
          </div>
          <div className="text-xs text-body-text">{product.sold || '0'} Sold</div>
        </div>
        <button onClick={(e) => { e.stopPropagation(); handleAddToCart(); }} className="w-full bg-primary text-white text-sm font-medium py-2 rounded hover:bg-primary/90 transition-colors">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;