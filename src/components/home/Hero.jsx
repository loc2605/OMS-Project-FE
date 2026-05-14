import React from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full h-[600px] flex items-center overflow-hidden rounded-2xl mb-12">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] hover:scale-110"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=1600&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-8 md:px-16 max-w-2xl text-white space-y-6">
        <div className="space-y-2 animate-fade-in-up">
          <span className="inline-block px-4 py-1.5 bg-primary/20 backdrop-blur-md border border-primary/30 text-primary-light text-xs font-bold tracking-[0.2em] uppercase rounded-full">
            New Collection 2026
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
            Elevate Your <br />
            <span className="text-primary-light">Everyday Style</span>
          </h1>
        </div>
        
        <p className="text-lg text-white/80 max-w-lg leading-relaxed animate-fade-in-up delay-100">
          Discover a curated collection of premium essentials designed for modern living. Quality craftsmanship meets contemporary design.
        </p>

        <div className="flex flex-wrap gap-4 pt-4 animate-fade-in-up delay-200">
          <button 
            onClick={() => navigate('/products')}
            className="group relative px-8 py-4 bg-primary text-white font-bold rounded-full overflow-hidden transition-all hover:pr-12"
          >
            <span className="relative z-10">Shop Collection</span>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all material-symbols-outlined">
              arrow_forward
            </span>
          </button>
        </div>
      </div>

      {/* Stats/Badge */}
      <div className="absolute bottom-8 right-8 hidden md:flex items-center gap-6 animate-fade-in">
        <div className="flex flex-col text-right">
          <span className="text-3xl font-bold text-white">50k+</span>
          <span className="text-xs text-white/60 uppercase tracking-widest">Happy Customers</span>
        </div>
        <div className="w-px h-10 bg-white/20"></div>
        <div className="flex flex-col text-right">
          <span className="text-3xl font-bold text-white">4.9/5</span>
          <span className="text-xs text-white/60 uppercase tracking-widest">Store Rating</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
