import React, { useState } from 'react';
import Header from '../components/home/Header';
import Hero from '../components/home/Hero';
import FeatureSection from '../components/home/FeatureSection';
import CategoryShowcase from '../components/home/CategoryShowcase';
import ProductGrid from '../components/home/ProductGrid';
import Footer from '../components/home/Footer';

const HomePage = () => {
  const [filters, setFilters] = useState({ category: '', search: '' });
  const [categories, setCategories] = useState([]);

  return (
    <div className="bg-background-light text-body-text min-h-screen">
      <Header />

      <main className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 py-6">
        {/* Hero Section */}
        <Hero />

        {/* Feature Section (Trust Signals) */}
        <FeatureSection />

        {/* Category Showcase */}
        <CategoryShowcase categories={categories} />

        {/* Trending Products Section */}
        <section className="space-y-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold text-heading-text">Trending Now</h2>
              <p className="text-gray-500">The most popular items from our recent collection</p>
            </div>
            <div className="flex gap-2">
              <button className="size-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all">
                <span className="material-symbols-outlined text-xl">chevron_left</span>
              </button>
              <button className="size-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all">
                <span className="material-symbols-outlined text-xl">chevron_right</span>
              </button>
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