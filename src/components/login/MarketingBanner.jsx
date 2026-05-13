import React from 'react';
import { useNavigate } from 'react-router-dom';

const MarketingBanner = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="relative hidden h-full w-1/2 lg:flex flex-col justify-between overflow-hidden bg-primary p-16"
      style={{
        backgroundImage: 'linear-gradient(to bottom, rgba(242, 108, 13, 0.4) 0%, rgba(0,0,0,0.8) 100%), url("/images/banner_marketing_orange.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 text-white">
          <div className="size-10">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor"></path>
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Shop<span className="text-white/80">Modern</span></h1>
        </div>
      </div>

      <div className="relative z-10 max-w-lg">
        <span className="inline-block bg-white text-primary px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest mb-6 shadow-xl animate-bounce-subtle">Limited Time Offer</span>
        <h2 className="text-white text-7xl font-black leading-none tracking-tighter mb-6 drop-shadow-2xl">
          MEGA <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">SALE</span>
        </h2>
        <p className="text-white/90 text-2xl font-medium mb-8 max-w-md leading-relaxed">
          Up to 70% off on all new season collections. <br />
          <span className="text-white font-bold">Don't miss out!</span>
        </p>
        <button 
          onClick={() => navigate('/products')}
          className="bg-white text-primary font-bold py-5 px-10 rounded-xl hover:bg-orange-50 hover:scale-105 active:scale-95 transition-all text-xl shadow-2xl flex items-center gap-2 group"
        >
          Shop The Collection
          <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>
      </div>

      <div className="relative z-10 grid grid-cols-3 gap-8 text-white/90 border-t border-white/20 pt-8">
        <div>
          <p className="text-3xl font-black text-white">24h</p>
          <p className="text-xs uppercase tracking-widest font-bold opacity-70">Fast Delivery</p>
        </div>
        <div>
          <p className="text-3xl font-black text-white">100%</p>
          <p className="text-xs uppercase tracking-widest font-bold opacity-70">Authentic</p>
        </div>
        <div>
          <p className="text-3xl font-black text-white">Free</p>
          <p className="text-xs uppercase tracking-widest font-bold opacity-70">Returns</p>
        </div>
      </div>
    </div>
  );
};

export default MarketingBanner;