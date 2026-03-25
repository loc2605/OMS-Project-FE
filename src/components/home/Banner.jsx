import React from 'react';

const Banner = () => {
  return (
    <div className="mb-8 overflow-hidden rounded soft-shadow">
      <div className="relative aspect-[21/6] @container">
        <div
          className="absolute inset-0 bg-cover bg-center flex flex-col justify-center px-12"
          style={{
            backgroundImage: 'linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 60%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuD7zy2K5EEvvigOq3bSQb4qus0FUbTGW4giW1xYWade7kaBEBO-qeEjMX0mm8CXeQ0BdTedARDBlTaYgH-pi8sSRMN6K2AoX6OlsFTsCPjULZYXp7WLDT8sDSObtvke9Ibtw1P3pb0TUfoo0Z4aIQT7GvjcZIIYi1hQT7tdRUsdxB8knTnuQVScToB8dUZ5oSoVb1Zua90P1KJYNyJOAD1hSpVphmortTqK4zAQka1lDAVFpyvyMjLk84cq0XalwreG4joWoTHYiAE2")'
          }}
        >
          <div className="max-w-md space-y-4">
            <span className="inline-block px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-sm">LIMITED TIME OFFER</span>
            <h1 className="text-4xl font-bold text-white leading-tight">Flash Sale:<br />Up to 70% Off!</h1>
            <p className="text-white/90 text-sm">Refresh your wardrobe with our latest collection.</p>
            <button className="mt-4 px-6 py-2.5 bg-primary text-white font-bold rounded hover:brightness-110 transition-all text-sm">
              Shop Collection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;