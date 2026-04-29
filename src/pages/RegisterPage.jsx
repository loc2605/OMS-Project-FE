import React from 'react';
import MarketingBanner from '../components/login/MarketingBanner';
import RegisterForm from '../components/register/RegisterForm';
import FooterLinks from '../components/common/FooterLinks';

const RegisterPage = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark h-screen overflow-hidden">
      <div className="flex h-full flex-col lg:flex-row">
        <MarketingBanner />
        <div className="h-full flex flex-1 flex-col justify-center px-6 py-12 sm:px-12 lg:px-24 bg-white dark:bg-background-dark overflow-hidden">
          <div className="mx-auto w-full max-w-md h-full flex flex-col justify-between">
            <div>
              <div className="flex lg:hidden items-center gap-3 text-primary mb-8">
                <div className="size-8">
                  <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor"></path>
                  </svg>
                </div>
                <h2 className="text-xl font-bold tracking-tight">ShopModern</h2>
              </div>
              <div className="mb-10">
                <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Create Your Account</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Join our Identity Service for a seamless shopping experience.</p>
              </div>
              <RegisterForm />
            </div>
            <FooterLinks />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
