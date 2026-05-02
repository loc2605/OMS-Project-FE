import React, { useState } from 'react';
import Header from '../components/home/Header';
import Banner from '../components/home/Banner';
import Sidebar from '../components/home/Sidebar';
import ProductGrid from '../components/home/ProductGrid';
import Footer from '../components/home/Footer';

const HomePage = () => {
  const [filters, setFilters] = useState({ category: '', search: '' });

  return (
    <div className="bg-background-light font-display text-body-text min-h-screen">
      <Header onSearch={(val) => setFilters(prev => ({ ...prev, search: val }))} />
      <main className="max-w-[1200px] mx-auto px-4 py-4">
        <Banner />
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          <Sidebar 
            activeCategory={filters.category} 
            onCategoryChange={(cat) => setFilters(prev => ({ ...prev, category: cat }))} 
          />
          <ProductGrid filters={filters} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;