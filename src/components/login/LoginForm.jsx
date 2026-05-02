import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import SocialLoginButtons from './SocialLoginButtons';
import { useAuth } from '../../contexts/AuthContext';
import authApi from '../../api/authApi';

const LoginForm = () => {
  const [email, setEmail] = useState('customer@example.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('Cannot be empty');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email && password) {
      try {
        setPasswordError('');
        const response = await authApi.login({ username: email, password });
        if (response.success) {
          login(response.result, response.result.token);
          const from = location.state?.from || '/';
          navigate(from, { replace: true });
        } else {
          setPasswordError(response.message || 'Login failed');
        }
      } catch (error) {
        setPasswordError(error.message || 'Invalid credentials');
      }
    } else {
      setPasswordError('Please fill in both fields');
    }
  };

  return (
    <>
      {/* Mobile Logo */}
      <div className="flex lg:hidden items-center gap-3 text-primary mb-8">
        <div className="size-8">
          <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor"></path>
          </svg>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-[#181411]">Shop<span className="text-primary">Modern</span></h2>
      </div>
      <div className="mb-10">
        <h2 className="text-3xl font-black tracking-tight text-[#181411] dark:text-white mb-2">Welcome Back</h2>
        <p className="text-[#8a7260] dark:text-stone-400 font-medium">Please enter your details to sign in to your account.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[#181411] dark:text-stone-200 text-sm font-semibold leading-normal">Username or Email</label>
          <input
            className="form-input block w-full rounded-lg border border-[#e6dfdb] dark:border-stone-700 bg-white dark:bg-stone-800 px-4 py-3.5 text-[#181411] dark:text-white placeholder:text-[#8a7260] focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {/* Password Field with Validation Error */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label className="text-[#181411] dark:text-stone-200 text-sm font-semibold leading-normal">Password</label>
            <Link className="text-sm font-bold text-primary hover:text-orange-600" to="/forgot-password">Forgot Password?</Link>
          </div>
          <div className="relative">
            <input
              className="form-input block w-full rounded-lg border border-red-500 bg-white dark:bg-stone-800 px-4 py-3.5 text-[#181411] dark:text-white placeholder:text-[#8a7260] focus:ring-2 focus:ring-red-200 transition-all pr-12"
              placeholder="Enter your password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (e.target.value.trim() === '') {
                  setPasswordError('Cannot be empty');
                } else {
                  setPasswordError('');
                }
              }}
            />
            <button
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#8a7260]"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
            </button>
          </div>
          {passwordError && (
            <p className="text-red-500 text-xs font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">error</span>
              {passwordError}
            </p>
          )}
        </div>
        {/* Sign In Button */}
        <button
          className="w-full flex items-center justify-center rounded-lg bg-primary py-4 px-6 text-white font-bold text-lg shadow-lg shadow-primary/20 hover:bg-orange-600 transition-all active:scale-[0.98]"
          type="submit"
        >
          Sign In
        </button>
        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-[#e6dfdb] dark:border-stone-700"></span>
          </div>
          <div className="relative flex justify-center text-sm uppercase">
            <span className="bg-white dark:bg-background-dark px-4 text-[#8a7260] font-bold tracking-widest text-[10px]">Or continue with</span>
          </div>
        </div>
        {/* Social Logins */}
        <SocialLoginButtons />
      </form>
      <p className="mt-10 text-center text-sm font-medium text-[#8a7260] dark:text-stone-400">
        Don't have an account?
        <Link className="font-bold text-primary hover:text-orange-600 underline-offset-4 hover:underline ml-1" to="/register">Register now</Link>
      </p>
    </>
  );
};

export default LoginForm;