import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/home/Header';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSendCode = () => {
    if (email) {
      setCurrentStep(2);
    }
  };

  const handleVerifyOtp = () => {
    if (otp.every(digit => digit !== '')) {
      setCurrentStep(3);
    }
  };

  const handleResetPassword = () => {
    if (newPassword && confirmPassword && newPassword === confirmPassword) {
      // Handle password reset
      console.log('Password reset successful');
      // Navigate to login
      navigate('/login');
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-[#181411] dark:text-white min-h-screen flex flex-col font-display">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-[560px] space-y-8">
          {/* Progress Breadcrumbs */}
          <div className="flex justify-center items-center gap-2 p-4">
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold h-6 w-6 rounded-full border-2 flex items-center justify-center ${currentStep >= 1 ? 'border-primary text-primary' : 'border-[#8a7260] text-[#8a7260]'}`}>1</span>
              <span className={`text-sm font-semibold ${currentStep >= 1 ? 'text-[#181411] dark:text-white' : 'text-[#8a7260]'}`}>Email</span>
            </div>
            <div className="h-px w-8 bg-[#e6dfdb] dark:bg-[#3d2c20]"></div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold h-6 w-6 rounded-full border-2 flex items-center justify-center ${currentStep >= 2 ? 'border-primary text-primary' : 'border-[#8a7260] text-[#8a7260]'}`}>2</span>
              <span className={`text-sm font-medium ${currentStep >= 2 ? 'text-[#181411] dark:text-white' : 'text-[#8a7260]'}`}>Verify</span>
            </div>
            <div className="h-px w-8 bg-[#e6dfdb] dark:bg-[#3d2c20]"></div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold h-6 w-6 rounded-full border-2 flex items-center justify-center ${currentStep >= 3 ? 'border-primary text-primary' : 'border-[#8a7260] text-[#8a7260]'}`}>3</span>
              <span className={`text-sm font-medium ${currentStep >= 3 ? 'text-[#181411] dark:text-white' : 'text-[#8a7260]'}`}>Reset</span>
            </div>
          </div>

          {/* Page Heading */}
          <div className="text-center space-y-3">
            <h1 className="text-[#181411] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Forgot Password?</h1>
            <p className="text-[#8a7260] text-base font-normal max-w-sm mx-auto">Enter the email address associated with your account and we'll send you a recovery code.</p>
          </div>

          {/* Step 1: Request Code */}
          {currentStep === 1 && (
            <div className="bg-white dark:bg-[#2c1d14] rounded-xl shadow-sm border border-[#e6dfdb] dark:border-[#3d2c20] p-8 space-y-6">
              <h2 className="text-[#181411] dark:text-white text-xl font-bold border-b border-[#f5f2f0] dark:border-[#3d2c20] pb-4">Step 1: Request Reset Code</h2>
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[#181411] dark:text-white text-sm font-bold">Email Address</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#8a7260]">mail</span>
                    <input
                      className="form-input flex w-full rounded-lg border-[#e6dfdb] dark:border-[#3d2c20] bg-white dark:bg-[#1a110b] h-14 pl-12 pr-4 text-base focus:border-primary focus:ring-primary placeholder:text-[#8a7260]"
                      placeholder="e.g. alex@example.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  onClick={handleSendCode}
                  className="w-full bg-primary text-white font-bold py-4 rounded-lg hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <span>Send Verification Code</span>
                  <span className="material-symbols-outlined text-xl">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Verify OTP */}
          {currentStep === 2 && (
            <div className="bg-white dark:bg-[#2c1d14] rounded-xl shadow-sm border border-[#e6dfdb] dark:border-[#3d2c20] p-8 space-y-6">
              <h2 className="text-[#181411] dark:text-white text-xl font-bold border-b border-[#f5f2f0] dark:border-[#3d2c20] pb-4">Step 2: Verify Your Identity</h2>
              <p className="text-sm text-[#8a7260]">A 6-digit code has been sent to your email. It expires in 10 minutes.</p>
              <div className="flex justify-between gap-2 max-w-sm mx-auto">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    className="w-12 h-14 text-center text-xl font-bold rounded-lg border-[#e6dfdb] dark:border-[#3d2c20] bg-white dark:bg-[#1a110b] focus:border-primary focus:ring-2 focus:ring-primary/20"
                    maxLength="1"
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#8a7260]">Didn't receive the code?</span>
                <button className="text-primary font-bold hover:underline">Resend (01:59)</button>
              </div>
              <button
                onClick={handleVerifyOtp}
                className="w-full bg-primary text-white font-bold py-4 rounded-lg hover:bg-opacity-90 transition-all"
              >
                Verify Code
              </button>
            </div>
          )}

          {/* Step 3: Reset Password */}
          {currentStep === 3 && (
            <div className="bg-white dark:bg-[#2c1d14] rounded-xl shadow-sm border border-[#e6dfdb] dark:border-[#3d2c20] p-8 space-y-6">
              <h2 className="text-[#181411] dark:text-white text-xl font-bold border-b border-[#f5f2f0] dark:border-[#3d2c20] pb-4">Step 3: Set New Password</h2>
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[#181411] dark:text-white text-sm font-bold">New Password</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#8a7260]">lock</span>
                    <input
                      className="form-input flex w-full rounded-lg border-[#e6dfdb] dark:border-[#3d2c20] bg-white dark:bg-[#1a110b] h-14 pl-12 pr-12 text-base focus:border-primary focus:ring-primary"
                      placeholder="••••••••"
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a7260]"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[#181411] dark:text-white text-sm font-bold">Confirm New Password</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#8a7260]">lock_reset</span>
                    <input
                      className="form-input flex w-full rounded-lg border-[#e6dfdb] dark:border-[#3d2c20] bg-white dark:bg-[#1a110b] h-14 pl-12 pr-12 text-base focus:border-primary focus:ring-primary"
                      placeholder="••••••••"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={handleResetPassword}
                className="w-full bg-primary text-white font-bold py-4 rounded-lg hover:bg-opacity-90 transition-all"
              >
                Update Password
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-auto py-8 border-t border-[#e6dfdb] dark:border-[#3d2c20] bg-white dark:bg-background-dark text-center">
        <p className="text-sm text-[#8a7260]">© 2026 ShopModern. All rights reserved.</p>
        <div className="mt-2 flex justify-center gap-4 text-xs font-semibold text-[#8a7260]">
          <a className="hover:text-primary" href="#">Privacy Policy</a>
          <a className="hover:text-primary" href="#">Terms of Service</a>
          <a className="hover:text-primary" href="#">Contact Support</a>
        </div>
      </footer>
    </div>
  );
};

export default ForgotPasswordPage;