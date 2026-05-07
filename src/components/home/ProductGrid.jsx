import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import productApi from '../../api/productApi';

const ProductGrid = ({ filters }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 0, size: 20, totalPages: 1 });
  const [sortOption, setSortOption] = useState('priceAsc');

  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Fetch all products since backend doesn't support filtering
        const response = await productApi.getAll({ page: 0, size: 1000 });

        if (response.success) {
          if (Array.isArray(response.result)) {
            setAllProducts(response.result);
          } else if (response.result?.content) {
            setAllProducts(response.result.content);
          }
        }
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = [...allProducts];

    if (filters?.category) {
      filtered = filtered.filter(p => p.categoryName === filters.category);
    }
    if (filters?.search) {
      filtered = filtered.filter(p => p.name?.toLowerCase().includes(filters.search.toLowerCase()));
    }
    if (filters?.minPrice !== undefined && filters.minPrice !== '') {
      filtered = filtered.filter(p => p.price >= Number(filters.minPrice));
    }
    if (filters?.maxPrice !== undefined && filters.maxPrice !== '') {
      filtered = filtered.filter(p => p.price <= Number(filters.maxPrice));
    }

    if (sortOption === 'priceAsc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'priceDesc') {
      filtered.sort((a, b) => b.price - a.price);
    }

    const totalPages = Math.ceil(filtered.length / pagination.size) || 1;
    let currentPage = pagination.page;
    if (currentPage >= totalPages) currentPage = 0;

    setProducts(filtered.slice(currentPage * pagination.size, (currentPage + 1) * pagination.size));
    
    setPagination(prev => {
      if (prev.totalPages === totalPages && prev.page === currentPage) return prev;
      return { ...prev, totalPages, page: currentPage };
    });
  }, [allProducts, filters, pagination.page, pagination.size, sortOption]);

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-2 bg-white/50 p-2 rounded">
        <h2 className="text-base font-medium text-heading">Recommended for You</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-body-text">Sort by:</span>
          <select 
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-white border border-primary/40 text-sm min-w-[160px] px-5 py-1.5 rounded focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer transition-all"
          >
            <option value="priceAsc">Lowest Price</option>
            <option value="priceDesc">Highest Price</option>
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