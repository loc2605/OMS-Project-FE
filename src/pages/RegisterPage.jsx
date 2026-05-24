import React from 'react';
import MarketingBanner from '../components/login/MarketingBanner';
import RegisterForm from '../components/register/RegisterForm';

const RegisterPage = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark h-screen overflow-hidden">
      <div className="flex h-full flex-col lg:flex-row">
        <MarketingBanner />
        <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 sm:px-12 lg:px-24 bg-[#fdfcfb] dark:bg-background-dark overflow-hidden h-full relative">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -ml-32 -mb-32"></div>

          <div className="w-full max-w-3xl flex flex-col justify-center relative z-10">
            <div className="bg-white dark:bg-stone-900/50 p-10 lg:p-14 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-stone-800 backdrop-blur-sm">
              <div className="flex lg:hidden items-center gap-3 text-primary mb-8">
                <div className="size-8">
                  <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor"></path>
                  </svg>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-[#181411]">Shop<span className="text-primary">Modern</span></h2>
              </div>
              <div className="mb-10">
                <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Tạo tài khoản mới</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Tham gia ngay để trải nghiệm mua sắm tuyệt vời nhất.</p>
              </div>
              <RegisterForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
