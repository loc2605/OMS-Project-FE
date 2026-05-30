import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import authApi from '../../api/authApi';

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const hasMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const isPasswordValid = hasMinLength && hasUppercase && hasNumber && hasLowercase;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (!isPasswordValid) {
      alert("Mật khẩu không đáp ứng các yêu cầu tối thiểu");
      return;
    }
    if (password === confirmPassword && fullName && email && password) {
      try {
        const payload = {
          username,
          password,
          confirmPassword,
          email,
          fullName,
          phone
        };
        const response = await authApi.register(payload);
        if (response.success) {
          navigate('/login');
        } else {
          alert(response.message || 'Đăng ký thất bại');
        }
      } catch (error) {
        alert(error.message || 'Đăng ký thất bại');
      }
    } else if (password !== confirmPassword) {
      alert("Mật khẩu không khớp");
    } else {
      alert("Vui lòng điền đầy đủ thông tin");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Tên đăng nhập</label>
          <div className="relative">
            <input 
              className="w-full h-12 px-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white" 
              placeholder="nguyenvana" 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))} 
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Họ và tên</label>
          <div className="relative">
            <input className="w-full h-12 px-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white" placeholder="Nguyễn Văn A" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Địa chỉ Email</label>
          <input className="w-full h-12 px-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white" placeholder="vana@gmail.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Số điện thoại</label>
          <input className="w-full h-12 px-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white" placeholder="0123 456 789" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Mật khẩu</label>
            <div className="relative">
              <input className="w-full h-12 px-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white" placeholder="••••••••" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} />
              <button className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600" type="button" onClick={() => setShowPassword((p) => !p)}>
                <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Xác nhận mật khẩu</label>
            <input 
              className={`w-full h-12 px-4 rounded-lg border bg-white dark:bg-gray-900 focus:ring-2 outline-none transition-all dark:text-white ${isSubmitted && confirmPassword && password !== confirmPassword ? 'border-red-400 focus:ring-red-200 focus:border-red-500' : 'border-gray-200 dark:border-gray-700 focus:ring-primary/20 focus:border-primary'}`} 
              placeholder="••••••••" 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
            />
            {isSubmitted && confirmPassword && password !== confirmPassword && (
              <p className="text-[11px] text-red-500 font-bold mt-1.5">
                Mật khẩu không khớp
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 mt-1">
          <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
            <span className="material-symbols-outlined text-[14px]">{hasMinLength ? 'check_circle' : 'circle'}</span>
            <span className="text-[11px] font-medium leading-tight">Từ 6 ký tự</span>
          </div>
          <div className={`flex items-center gap-1.5 ${hasUppercase ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
            <span className="material-symbols-outlined text-[14px]">{hasUppercase ? 'check_circle' : 'circle'}</span>
            <span className="text-[11px] font-medium leading-tight">1 chữ in hoa</span>
          </div>
          <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
            <span className="material-symbols-outlined text-[14px]">{hasNumber ? 'check_circle' : 'circle'}</span>
            <span className="text-[11px] font-medium leading-tight">1 chữ số</span>
          </div>
          <div className={`flex items-center gap-1.5 ${hasLowercase ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
            <span className="material-symbols-outlined text-[14px]">{hasLowercase ? 'check_circle' : 'circle'}</span>
            <span className="text-[11px] font-medium leading-tight">1 chữ in thường</span>
          </div>
        </div>
      </div>

      <div className="pt-1">
        <label className="flex items-start gap-2 cursor-pointer group">
          <div className="relative flex items-center h-4">
            <input className="peer h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary mt-0.5" type="checkbox" />
          </div>
          <span className="text-xs text-gray-600 dark:text-gray-400 leading-tight">
            Tôi đồng ý với <Link className="text-primary font-bold hover:underline" to="/terms">Điều khoản Dịch vụ</Link> và <Link className="text-primary font-bold hover:underline" to="/privacy">Chính sách Bảo mật</Link>.
          </span>
        </label>
      </div>

      <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg shadow-lg shadow-primary/20 transition-all transform active:scale-[0.98]" type="submit">
        Đăng Ký
      </button>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400 pt-2">
        Đã có tài khoản? <Link to="/login" className="text-primary font-bold hover:underline">Đăng Nhập</Link>
      </p>

      {/* Trust Badge */}
      <div className="mt-6 flex items-center justify-center gap-2 text-gray-400/60 dark:text-gray-600/50">
        <span className="material-symbols-outlined text-sm">lock</span>
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Bảo mật mã hóa SSL</span>
      </div>
    </form>
  );
};

export default RegisterForm;
