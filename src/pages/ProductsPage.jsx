import React from 'react';
import Header from '../components/home/Header';
import Sidebar from '../components/home/Sidebar';
import ProductGrid from '../components/home/ProductGrid';
import Footer from '../components/home/Footer';

const ProductsPage = () => {
  return (
    <div className="bg-background-light font-display text-body-text min-h-screen">
      <Header />
      <main className="max-w-full mx-auto px-4 md:px-8 lg:px-12 py-8">
        <div className="flex gap-6">
          <Sidebar />
          <ProductGrid />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductsPage;