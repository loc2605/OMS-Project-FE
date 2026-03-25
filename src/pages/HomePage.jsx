import React from 'react';
import Header from '../components/home/Header';
import Banner from '../components/home/Banner';
import Sidebar from '../components/home/Sidebar';
import ProductGrid from '../components/home/ProductGrid';
import Footer from '../components/home/Footer';

const HomePage = () => {
  return (
    <div className="bg-background-light font-display text-body-text min-h-screen">
      <Header />
      <main className="max-w-[1200px] mx-auto px-4 py-4">
        <Banner />
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          <Sidebar />
          <ProductGrid />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;