import React from 'react';

const MarketingBanner = () => {
  return (
    <div className="relative hidden h-full w-1/2 lg:flex flex-col justify-center items-center overflow-hidden bg-primary p-12">
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      <div className="relative z-10 w-full max-w-lg">
        <div className="mb-8 flex items-center gap-3 text-white">
          <div className="size-8">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#181411]">Shop<span className="text-white">Modern</span></h1>
        </div>
        <div className="rounded-2xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-sm border border-white/20">
          <div
            className="aspect-[4/5] bg-cover bg-center flex flex-col justify-end p-8"
            style={{
              backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCK2LmBRp5KblbIKl_HaURaa11WaWpe5Fo4dYQjf8j0SJfGisq-MtHtq7FXayoeAVRhh5BPVuVrCr6CUCXM77vbrtZz2Rb2YW5mpZreGrY4eMejFPprM3T-d0IpuL4GzXCX2cdp9G6Fdt-gWGtpbwap7ovxvPd9eZZ7xsNO_Fpt0Ha-7OR5XQM0X7triPJl9SenCkPFn6PUeXwxAZm_wkL1xEqq2_7LmzJ8L0Dwz-LXnB6F_d9JsHC9tnAoDClHghy_nu3sbH9pe7nD")'
            }}
          >
            <span className="inline-block bg-white text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 w-fit">Limited Time Offer</span>
            <h2 className="text-white text-6xl font-black leading-[1.1] tracking-tighter mb-4">MEGA <br />SALE</h2>
            <p className="text-white/90 text-xl font-medium mb-6">Up to 70% off on all new season collections. Don't miss out!</p>
            <button className="bg-white text-primary font-bold py-4 px-8 rounded-lg hover:bg-orange-50 transition-colors w-full text-lg">Shop The Collection</button>
          </div>
        </div>
        <div className="mt-12 grid grid-cols-3 gap-6 text-white/80 text-center">
          <div>
            <p className="text-2xl font-bold text-white">24h</p>
            <p className="text-xs uppercase tracking-widest font-semibold">Fast Delivery</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">100%</p>
            <p className="text-xs uppercase tracking-widest font-semibold">Authentic</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">Free</p>
            <p className="text-xs uppercase tracking-widest font-semibold">Returns</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingBanner;