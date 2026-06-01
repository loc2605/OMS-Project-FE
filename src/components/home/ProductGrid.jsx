import React, { useState, useEffect, useMemo } from 'react';
import ProductCard from './ProductCard';
import productApi from '../../api/productApi';

const ProductGrid = ({ filters, onCategoriesFetched }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 0, size: 10 });
  const [sortOption, setSortOption] = useState('newest');

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        // Fetch a large number of products to filter locally 
        // since the backend does not fully support categoryName filtering
        const response = await productApi.getAll({ size: 1000 });

        if (response.success) {
          let fetchedProducts = [];
          if (Array.isArray(response.result)) {
            fetchedProducts = response.result;
          } else if (response.result?.content) {
            fetchedProducts = response.result.content;
          }
          setAllProducts(fetchedProducts);

          // Extract unique categories
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
    fetchAllProducts();
  }, []);

  // Filter and sort products locally
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Filter by Category
    if (filters?.category) {
      result = result.filter(p => p.categoryName === filters.category);
    }
    
    // Filter by Search Name
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(p => 
        p.name?.toLowerCase().includes(searchLower) || 
        p.description?.toLowerCase().includes(searchLower)
      );
    }
    
    const getNumericPrice = (price) => {
      if (typeof price === 'number') return price;
      if (!price) return 0;
      const numericString = String(price).replace(/[^\d]/g, '');
      return Number(numericString);
    };

    // Filter by Price
    if (filters?.minPrice !== undefined && filters?.minPrice !== '') {
      result = result.filter(p => getNumericPrice(p.price) >= Number(filters.minPrice));
    }
    if (filters?.maxPrice !== undefined && filters?.maxPrice !== '') {
      result = result.filter(p => getNumericPrice(p.price) <= Number(filters.maxPrice));
    }

    // Sort
    if (sortOption === 'priceAsc') {
      result.sort((a, b) => getNumericPrice(a.price) - getNumericPrice(b.price));
    } else if (sortOption === 'priceDesc') {
      result.sort((a, b) => getNumericPrice(b.price) - getNumericPrice(a.price));
    } else if (sortOption === 'newest') {
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    return result;
  }, [allProducts, filters, sortOption]);

  const totalPages = Math.ceil(filteredProducts.length / pagination.size) || 1;
  const currentProducts = filteredProducts.slice(
    pagination.page * pagination.size,
    (pagination.page + 1) * pagination.size
  );

  // Reset to page 0 and scroll up when filters or sort change
  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 0 }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filters, sortOption]);

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex-1">
      <div className="flex items-center justify-end mb-4 bg-white/90 border border-gray-200 rounded-3xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Sắp xếp theo</span>
          <select 
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-white border border-gray-200 text-sm min-w-[160px] px-4 py-2 rounded-2xl focus:ring-1 focus:ring-primary/20 focus:border-primary/70 cursor-pointer transition-all"
          >
            <option value="newest">Mới Nhất</option>
            <option value="priceAsc">Giá Thấp Nhất</option>
            <option value="priceDesc">Giá Cao Nhất</option>
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
          currentProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
      {!loading && filteredProducts.length > 0 && (
        <div className="mt-4 flex justify-center">
          <div className="flex items-center gap-1 text-sm">
            <button
              disabled={pagination.page === 0}
              onClick={() => handlePageChange(pagination.page - 1)}
              className="px-4 py-2 text-body-text hover:text-primary transition-colors disabled:opacity-30"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => handlePageChange(idx)}
                className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${pagination.page === idx ? 'bg-primary text-white font-semibold shadow-sm' : 'text-gray-600 hover:bg-primary/10'}`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              disabled={pagination.page === totalPages - 1}
              onClick={() => handlePageChange(pagination.page + 1)}
              className="px-4 py-2 text-body-text hover:text-primary transition-colors disabled:opacity-30"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      )}
      {!loading && filteredProducts.length === 0 && (
        <div className="mt-10 text-center text-gray-500">Không tìm thấy sản phẩm.</div>
      )}
    </div>
  );
};

export default ProductGrid;