import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import productApi from '../../api/productApi';

const ProductGrid = ({ filters, onCategoriesFetched }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 0, size: 10, totalPages: 1 });
  const [sortOption, setSortOption] = useState('newest');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = {
          page: pagination.page,
          size: filters?.size || pagination.size,
          categoryName: filters?.category || undefined,
          category: filters?.category || undefined,
          name: filters?.search || undefined,
          minPrice: filters?.minPrice || undefined,
          maxPrice: filters?.maxPrice || undefined,
        };
        
        console.log('Fetching products with params:', params);
        
        if (sortOption === 'priceAsc') {
          params.sort = 'price,asc';
        } else if (sortOption === 'priceDesc') {
          params.sort = 'price,desc';
        } else if (sortOption === 'newest') {
          params.sort = 'createdAt,desc';
        }

        const response = await productApi.getAll(params);

        if (response.success) {
          let fetchedProducts = [];
          if (Array.isArray(response.result)) {
            fetchedProducts = response.result;
          } else if (response.result?.content) {
            fetchedProducts = response.result.content;
            setPagination(prev => ({
              ...prev,
              totalPages: response.result.totalPages || 1,
              totalElements: response.result.totalElements || 0
            }));
          }
          setProducts(fetchedProducts);

          // Extract unique categories with representative images and notify parent
          if (onCategoriesFetched) {
            const categoryMap = {};
            fetchedProducts.forEach(p => {
              if (p.categoryName && !categoryMap[p.categoryName]) {
                categoryMap[p.categoryName] = p.imageUrl?.[0] || p.image;
              }
            });
            
            const categoryList = Object.entries(categoryMap).map(([name, image]) => ({ name, image }));
            
            if (categoryList.length > 0) {
              onCategoriesFetched(prev => {
                // Merge and avoid duplicates by name, preferring new images if available
                const combinedMap = {};
                prev.forEach(c => combinedMap[c.name || c] = c.image || null);
                categoryList.forEach(c => combinedMap[c.name] = c.image);
                
                const combined = Object.entries(combinedMap).map(([name, image]) => ({ name, image }));
                return JSON.stringify(combined) === JSON.stringify(prev) ? prev : combined;
              });
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [pagination.page, pagination.size, filters, sortOption]);

  // Only reset to page 0 when "real" filters change, not on every render
  const filterDeps = JSON.stringify({
    category: filters?.category,
    search: filters?.search,
    minPrice: filters?.minPrice,
    maxPrice: filters?.maxPrice,
    sortOption
  });

  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 0 }));
  }, [filterDeps]);

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-2 bg-white/50 p-2 rounded">
        <div></div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-body-text">Sort by:</span>
          <select 
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-white border border-primary/40 text-sm min-w-[160px] px-5 py-1.5 rounded focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer transition-all"
          >
            <option value="newest">Newest</option>
            <option value="priceAsc">Lowest Price</option>
            <option value="priceDesc">Highest Price</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4">
        {loading ? (
          <>
            <ProductCard isSkeleton />
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