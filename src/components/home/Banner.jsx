import React from 'react';

const Banner = () => {
  return (
    <div className="mb-8 overflow-hidden rounded soft-shadow">
      <div className="relative aspect-[21/6] @container">
        <div
          className="absolute inset-0 bg-cover bg-center flex flex-col justify-center px-12"
          style={{
            backgroundImage: 'linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 70%), url("/images/banner.png")'
          }}
        >
          <div className="max-w-md space-y-4">
            <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-bold rounded-sm">LIMITED TIME OFFER</span>
            <h1 className="text-4xl font-bold text-white leading-tight">Flash Sale:<br />Up to 70% Off!</h1>
            <p className="text-white/90 text-base">Refresh your wardrobe with our latest collection.</p>
            <button className="mt-4 px-6 py-2.5 bg-primary text-white font-bold rounded hover:brightness-110 transition-all text-base">
              Shop Collection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;