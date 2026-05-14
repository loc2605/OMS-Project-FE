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
        <section className="space-y-8 mb-16">
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

          <div className="bg-white p-8 rounded-[2rem] shadow-soft">
            <ProductGrid 
              filters={{ ...filters, size: 5 }} 
              onCategoriesFetched={setCategories}
            />
          </div>
        </section>

        {/* Newsletter / Promotional Section */}
        <section className="relative h-[400px] rounded-[3rem] overflow-hidden mb-16">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80")' }}
          >
            <div className="absolute inset-0 bg-primary/80 mix-blend-multiply"></div>
          </div>

          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-white max-w-2xl">
              Join the Modern Club & Get 20% Off Your First Order
            </h2>
            <p className="text-white/80 text-lg max-w-lg">
              Subscribe to our newsletter and stay up to date with our latest collections and exclusive offers.
            </p>
            <div className="flex w-full max-w-md gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button className="px-8 py-4 bg-white text-primary font-bold rounded-full hover:bg-opacity-90 transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;