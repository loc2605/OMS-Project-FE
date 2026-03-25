import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ChangePasswordPage = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword === confirmPassword) {
      // Handle password change
      console.log('Password changed successfully');
    }
  };

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
              <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Change Password</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Update your account password for better security.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[#181411] dark:text-stone-200 text-sm font-semibold leading-normal">Current Password</label>
                <div className="relative">
                  <input
                    className="form-input block w-full rounded-lg border border-[#e6dfdb] dark:border-stone-700 bg-white dark:bg-stone-800 px-4 py-3.5 text-[#181411] dark:text-white placeholder:text-[#8a7260] focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all pr-12"
                    placeholder="Enter current password"
                    type={showCurrent ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <button
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#8a7260]"
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                  >
                    <span className="material-symbols-outlined text-xl">{showCurrent ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[#181411] dark:text-stone-200 text-sm font-semibold leading-normal">New Password</label>
                <div className="relative">
                  <input
                    className="form-input block w-full rounded-lg border border-[#e6dfdb] dark:border-stone-700 bg-white dark:bg-stone-800 px-4 py-3.5 text-[#181411] dark:text-white placeholder:text-[#8a7260] focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all pr-12"
                    placeholder="Enter new password"
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#8a7260]"
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                  >
                    <span className="material-symbols-outlined text-xl">{showNew ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[#181411] dark:text-stone-200 text-sm font-semibold leading-normal">Confirm New Password</label>
                <div className="relative">
                  <input
                    className="form-input block w-full rounded-lg border border-[#e6dfdb] dark:border-stone-700 bg-white dark:bg-stone-800 px-4 py-3.5 text-[#181411] dark:text-white placeholder:text-[#8a7260] focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all pr-12"
                    placeholder="Confirm new password"
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#8a7260]"
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    <span className="material-symbols-outlined text-xl">{showConfirm ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-red-500 text-xs font-bold">Passwords do not match</p>
                )}
              </div>

              <button
                className="w-full flex items-center justify-center rounded-lg bg-primary py-4 px-6 text-white font-bold text-lg shadow-lg shadow-primary/20 hover:bg-orange-600 transition-all active:scale-[0.98]"
                type="submit"
                disabled={!currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
              >
                Update Password
              </button>
            </form>

            <p className="mt-10 text-center text-sm font-medium text-[#8a7260] dark:text-stone-400">
              <Link className="font-bold text-primary hover:text-orange-600 underline-offset-4 hover:underline" to="/login">Back to Login</Link>
            </p>
          </div>
        </main>

        <footer className="mt-auto pt-10 border-t border-[#f5f2f0] dark:border-stone-800 flex flex-wrap justify-center gap-6 text-xs font-semibold text-[#8a7260] uppercase tracking-widest">
          <a className="hover:text-primary transition-colors" href="#">Help Center</a>
          <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
          <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
        </footer>
      </div>
    </div>
  );
};

export default ChangePasswordPage;