import React, { useState } from 'react';
import Header from '../components/home/Header';
import Banner from '../components/home/Banner';
import Sidebar from '../components/home/Sidebar';
import ProductGrid from '../components/home/ProductGrid';
import Footer from '../components/home/Footer';

const HomePage = () => {
  const [filters, setFilters] = useState({ category: '', search: '' });

  return (
    <div className="bg-background-light text-body-text min-h-screen">
      <Header />
      <main className="max-w-full mx-auto px-4 md:px-8 lg:px-12 py-4">
        <Banner />
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

export default HomePage;