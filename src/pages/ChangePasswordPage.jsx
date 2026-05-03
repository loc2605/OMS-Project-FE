import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/home/Header';

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
    <div className="bg-background-light dark:bg-background-dark min-h-screen">
      <div className="flex flex-col min-h-screen">
        <Header />

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