import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/home/Header';
import Sidebar from '../components/home/Sidebar';
import ProductGrid from '../components/home/ProductGrid';
import Footer from '../components/home/Footer';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const categoryName = searchParams.get('categoryName') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const filters = {
    category: categoryName,
    search,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
  };

  const [categories, setCategories] = useState([]);

  const updateFilters = (newFilters) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newFilters).forEach(([key, value]) => {
      // Map 'category' to 'categoryName' for the URL
      const urlKey = key === 'category' ? 'categoryName' : key;
      if (value) {
        params.set(urlKey, value);
      } else {
        params.delete(urlKey);
      }
    });
    setSearchParams(params);
  };

  return (
    <div className="bg-background-light text-body-text min-h-screen">
      <Header />
      <main className="max-w-full mx-auto px-4 md:px-8 lg:px-12 py-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          <Sidebar 
            activeCategory={categoryName} 
            categories={categories}
            initialMinPrice={minPrice}
            initialMaxPrice={maxPrice}
            onCategoryChange={(cat) => updateFilters({ category: cat })} 
            onPriceChange={({ minPrice, maxPrice }) => updateFilters({ minPrice, maxPrice })}
          />
          <ProductGrid 
            filters={filters} 
            onCategoriesFetched={setCategories}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductsPage;