import React from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../components/register/RegisterForm';

const RegisterPage = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen font-display">
      <div className="flex flex-col min-h-screen">
        <header className="flex items-center justify-between border-b border-solid border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark px-4 sm:px-6 lg:px-10 py-4">
          <div className="flex items-center gap-4 text-[#181411] dark:text-white">
            <div className="size-6 text-primary">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold leading-tight tracking-tight">ShopEase</h2>
          </div>
          <div className="flex items-center gap-8">
            <nav className="hidden md:flex items-center gap-9">
              <a className="text-sm font-medium hover:text-primary transition-colors dark:text-gray-300" href="#">Home</a>
              <a className="text-sm font-medium hover:text-primary transition-colors dark:text-gray-300" href="#">Products</a>
              <a className="text-sm font-medium hover:text-primary transition-colors dark:text-gray-300" href="#">Support</a>
            </nav>
            <button className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-gray-100 dark:bg-gray-800 text-sm font-bold">
              <Link to="/login">Log In</Link>
            </button>
          </div>
        </header>

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
          <p className="text-xs text-gray-400">© 2024 ShopEase Identity Service. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default RegisterPage;
