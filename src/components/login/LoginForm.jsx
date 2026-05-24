import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import authApi from '../../api/authApi';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username && password) {
      try {
        setPasswordError('');
        const response = await authApi.login({ username, password });
        if (response.success) {
          // Pass token and refreshToken to login context
          login(response.result, response.result.token, response.result.refreshToken);
          const from = location.state?.from || '/';
          navigate(from, { replace: true });
        } else {
          // Check for locked account message from BE
          if (response.message?.toLowerCase().includes('lock')) {
            setPasswordError('Tài khoản của bạn đã bị khóa do đăng nhập sai nhiều lần. Vui lòng liên hệ hỗ trợ.');
          } else {
            setPasswordError(response.message || 'Đăng nhập thất bại');
          }
        }
      } catch (error) {
        if (error.message?.toLowerCase().includes('lock')) {
          setPasswordError('Tài khoản bị khóa. Vui lòng thử lại sau hoặc liên hệ hỗ trợ.');
        } else {
          setPasswordError(error.message || 'Thông tin đăng nhập không hợp lệ');
        }
      }
    } else {
      setPasswordError('Vui lòng điền đầy đủ thông tin');
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
        <h2 className="text-3xl font-black tracking-tight text-[#181411] dark:text-white mb-2">Chào mừng trở lại</h2>
        <p className="text-[#8a7260] dark:text-stone-400 font-medium">Vui lòng nhập thông tin để đăng nhập vào tài khoản của bạn.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Username Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[#181411] dark:text-stone-200 text-sm font-semibold leading-normal">Tên đăng nhập</label>
          <input
            className={`form-input block w-full rounded-lg border ${passwordError && !username ? 'border-red-500 focus:ring-red-200' : 'border-[#e6dfdb] dark:border-stone-700 focus:border-primary focus:ring-primary/20'} bg-white dark:bg-stone-800 px-4 py-3.5 text-[#181411] dark:text-white placeholder:text-[#8a7260] transition-all`}
            placeholder="Nhập tên đăng nhập của bạn"
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (passwordError) setPasswordError('');
            }}
          />
        </div>
        {/* Password Field with Validation Error */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label className="text-[#181411] dark:text-stone-200 text-sm font-semibold leading-normal">Mật khẩu</label>
            <Link className="text-sm font-bold text-primary hover:text-orange-600" to="/forgot-password">Quên mật khẩu?</Link>
          </div>
          <div className="relative">
            <input
              className={`form-input block w-full rounded-lg border ${passwordError ? 'border-red-500 focus:ring-red-200' : 'border-[#e6dfdb] dark:border-stone-700 focus:border-primary focus:ring-primary/20'} bg-white dark:bg-stone-800 px-4 py-3.5 text-[#181411] dark:text-white placeholder:text-[#8a7260] transition-all pr-12`}
              placeholder="Nhập mật khẩu của bạn"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError('');
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
          Đăng Nhập
        </button>
      </form>
      <p className="mt-10 text-center text-sm font-medium text-[#8a7260] dark:text-stone-400">
        Chưa có tài khoản?
        <Link className="font-bold text-primary hover:text-orange-600 underline-offset-4 hover:underline ml-1" to="/register">Đăng ký ngay</Link>
      </p>

      {/* Trust Badge */}
      <div className="mt-8 flex items-center justify-center gap-2 text-[#8a7260]/50 dark:text-stone-500/50">
        <span className="material-symbols-outlined text-sm">lock</span>
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Bảo mật mã hóa SSL</span>
      </div>
    </>
  );
};

export default LoginForm;