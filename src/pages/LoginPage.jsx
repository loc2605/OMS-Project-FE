import React from 'react';
import { Link } from 'react-router-dom';
import MarketingBanner from '../components/login/MarketingBanner';
import LoginForm from '../components/login/LoginForm';

const LoginPage = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark h-screen overflow-hidden">
      <div className="flex h-full flex-col lg:flex-row">
        <MarketingBanner />
        <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 sm:px-12 lg:px-24 bg-[#fdfcfb] dark:bg-background-dark overflow-hidden h-full relative">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -ml-32 -mb-32"></div>

          <div className="w-full max-w-2xl flex flex-col justify-center relative z-10">
            <div className="bg-white dark:bg-stone-900/50 p-16 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-stone-800 backdrop-blur-sm">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;