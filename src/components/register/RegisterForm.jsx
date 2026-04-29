import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import authApi from '../../api/authApi';

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === confirmPassword && fullName && email && password) {
      try {
        const payload = {
          username: email.split('@')[0],
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
          alert(response.message || 'Registration failed');
        }
      } catch (error) {
        alert(error.message || 'Registration failed');
      }
    } else if (password !== confirmPassword) {
      alert("Passwords do not match");
    } else {
      alert("Please fill in all required fields");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Full Name</label>
        <div className="relative">
          <input className="w-full h-12 px-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white" placeholder="John Doe" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <span className="material-symbols-outlined absolute right-3 top-3 text-green-500 text-xl">check_circle</span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email Address</label>
        <input className="w-full h-12 px-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white" placeholder="john@example.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <p className="text-[11px] text-gray-400">We'll send a verification link to this email.</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Phone Number</label>
        <div className="flex gap-2">
          <select className="w-24 h-12 px-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none dark:text-white">
            <option>+1</option>
            <option>+44</option>
            <option>+33</option>
          </select>
          <input className="flex-1 h-12 px-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white" placeholder="(555) 000-0000" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Password</label>
        <div className="relative">
          <input className="w-full h-12 px-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white" placeholder="••••••••" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="absolute right-3 top-3 text-gray-400 hover:text-gray-600" type="button" onClick={() => setShowPassword((p) => !p)}>
            <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-y-1 mt-1">
          <div className="validation-item text-green-600 dark:text-green-400">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            <span>6+ characters</span>
          </div>
          <div className="validation-item text-gray-400">
            <span className="material-symbols-outlined text-sm">circle</span>
            <span>One uppercase</span>
          </div>
          <div className="validation-item text-gray-400">
            <span className="material-symbols-outlined text-sm">circle</span>
            <span>One number</span>
          </div>
          <div className="validation-item text-gray-400">
            <span className="material-symbols-outlined text-sm">circle</span>
            <span>One special char</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Confirm Password</label>
        <input className="w-full h-12 px-4 rounded-lg border border-red-200 dark:border-red-900 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-red-200 focus:border-red-500 outline-none transition-all dark:text-white" placeholder="••••••••" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        <p className="text-[11px] text-red-500 font-medium">Passwords do not match</p>
      </div>

      <div className="pt-2">
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="relative flex items-center h-5">
            <input className="peer h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary" type="checkbox" />
          </div>
          <span className="text-xs text-gray-600 dark:text-gray-400 leading-tight">
            I agree to the <a className="text-primary hover:underline" href="#">Terms & Conditions</a> and <a className="text-primary hover:underline" href="#">Privacy Policy</a>.
          </span>
        </label>
      </div>

      <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-lg shadow-lg shadow-primary/20 transition-all transform active:scale-[0.98]" type="submit">
        Create Account
      </button>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400 pt-4">
        Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Log In</Link>
      </p>
    </form>
  );
};

export default RegisterForm;
