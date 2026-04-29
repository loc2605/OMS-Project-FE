import React from 'react';
import Header from '../components/home/Header';
import RegisterForm from '../components/register/RegisterForm';

const RegisterPage = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen font-display">
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow flex items-center justify-center py-8 px-4 sm:py-12 sm:px-6">
          <div className="w-full max-w-[500px] bg-white dark:bg-background-dark/50 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-6 sm:p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Create Your Account</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Join our Identity Service for a seamless shopping experience.</p>
            </div>
            <RegisterForm />
          </div>
        </main>

        <footer className="py-8 px-4 sm:px-6 lg:px-10 border-t border-gray-100 dark:border-gray-800 text-center">
          <p className="text-xs text-gray-400">© 2024 ShopModern Identity Service. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default RegisterPage;
