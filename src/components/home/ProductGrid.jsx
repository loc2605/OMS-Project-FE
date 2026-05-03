import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import productApi from '../../api/productApi';

const ProductGrid = ({ filters }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 0, size: 20, totalPages: 1 });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productApi.getAll({
          page: pagination.page,
          size: pagination.size,
          category: filters?.category || undefined,
          name: filters?.search || undefined
        });

        if (response.success) {
          if (Array.isArray(response.result)) {
            setProducts(response.result);
          } else if (response.result?.content) {
            setProducts(response.result.content);
            setPagination(prev => ({
              ...prev,
              totalPages: response.result.totalPages || 1
            }));
          }
        }
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [pagination.page, pagination.size, filters]);

  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 0 }));
  }, [filters]);

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-2 bg-white/50 p-2 rounded">
        <h2 className="text-base font-medium text-heading">Recommended for You</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-body-text">Sort by:</span>
          <select className="bg-white border border-primary/40 text-sm min-w-[160px] px-5 py-1.5 rounded focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer transition-all">
            <option>Most Popular</option>
            <option>Lowest Price</option>
            <option>Newest Arrival</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4">
        {loading ? (
          <>
            <ProductCard isSkeleton />
            <ProductCard isSkeleton />
            <ProductCard isSkeleton />
            <ProductCard isSkeleton />
          </>
        ) : (
          products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
      {!loading && products.length > 0 && (
        <div className="mt-6 flex justify-center">
          <div className="flex items-center gap-1 text-sm">
            <button
              disabled={pagination.page === 0}
              onClick={() => handlePageChange(pagination.page - 1)}
              className="px-4 py-2 text-body-text hover:text-primary transition-colors disabled:opacity-30"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            {[...Array(pagination.totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => handlePageChange(idx)}
                className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${pagination.page === idx ? 'bg-primary text-white font-medium' : 'hover:bg-primary/10'}`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              disabled={pagination.page === pagination.totalPages - 1}
              onClick={() => handlePageChange(pagination.page + 1)}
              className="px-4 py-2 text-body-text hover:text-primary transition-colors disabled:opacity-30"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      )}
      {!loading && products.length === 0 && (
        <div className="mt-10 text-center text-gray-500">No products found.</div>
      )}
    </div>
  );
};

export default ProductGrid;