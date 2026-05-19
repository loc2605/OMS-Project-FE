import React, { useState } from 'react';
import Header from '../components/home/Header';
import Hero from '../components/home/Hero';
import CategoryShowcase from '../components/home/CategoryShowcase';
import ProductGrid from '../components/home/ProductGrid';
import Footer from '../components/home/Footer';

const HomePage = () => {
  const [filters, setFilters] = useState({ category: '', search: '' });
  const [categories, setCategories] = useState([]);

  return (
    <div className="bg-background-light text-body-text min-h-screen">
      <Header />

      <main className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 pt-6 pb-2">
        {/* Hero Section */}
        <Hero />

        {/* Category Showcase */}
        <CategoryShowcase categories={categories} />

        {/* Trending Products Section */}
        <section className="space-y-6 mb-2">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold text-heading-text">New Arrivals</h2>
              <p className="text-gray-500">Discover the latest additions to our premium collection</p>
            </div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-[2rem] shadow-soft">
            <ProductGrid 
              filters={{ ...filters, size: 5 }} 
              onCategoriesFetched={setCategories}
            />
          </div>
        </section>


      </main>

      <Footer />
    </div>
  );
};

export default HomePage;