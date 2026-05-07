import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/home/Header';
import Sidebar from '../components/home/Sidebar';
import ProductGrid from '../components/home/ProductGrid';
import Footer from '../components/home/Footer';

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const [filters, setFilters] = useState({ category: '', search });

  useEffect(() => {
    setFilters(prev => ({ ...prev, search }));
  }, [search]);
  return (
    <div className="bg-background-light text-body-text min-h-screen">
      <Header />
      <main className="max-w-full mx-auto px-4 md:px-8 lg:px-12 py-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          <Sidebar 
            activeCategory={filters.category} 
            onCategoryChange={(cat) => setFilters(prev => ({ ...prev, category: cat }))} 
            onPriceChange={({ minPrice, maxPrice }) => setFilters(prev => ({ ...prev, minPrice, maxPrice }))}
          />
          <ProductGrid filters={filters} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductsPage;