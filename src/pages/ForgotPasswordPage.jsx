import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/home/Header';
import authApi from '../api/authApi';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Resend OTP Cooldown Timer (in seconds)
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef(null);

  // Clear states when stepping
  const changeStep = (step) => {
    setErrorMsg('');
    setSuccessMsg('');
    setCurrentStep(step);
  };

  // Cooldown countdown effect
  useEffect(() => {
    if (cooldown > 0) {
      timerRef.current = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [cooldown]);

  const handleSendCode = async (isResend = false) => {
    if (!usernameOrEmail.trim()) {
      setErrorMsg('Vui lòng nhập tên đăng nhập hoặc email.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    if (!isResend) setSuccessMsg('');

    try {
      const res = await authApi.forgotPassword({ usernameOrEmail: usernameOrEmail.trim() });
      if (res.success) {
        setSuccessMsg(res.message || 'Mã OTP đã được gửi đến email của bạn');
        setCooldown(120); // 2 minutes cooldown for resend
        if (!isResend) {
          changeStep(2);
        }
      } else {
        setErrorMsg(res.message || 'Gửi mã OTP thất bại. Vui lòng thử lại.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Hệ thống gặp lỗi khi gửi mã OTP. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    if (otpString.length < 6) {
      setErrorMsg('Vui lòng nhập đầy đủ mã OTP 6 chữ số.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await authApi.verifyOtp({
        usernameOrEmail: usernameOrEmail.trim(),
        otp: otpString
      });

      if (res.success) {
        setSuccessMsg(res.message || 'Xác thực mã OTP thành công.');
        // Briefly display success and proceed to step 3
        setTimeout(() => {
          changeStep(3);
        }, 1000);
      } else {
        setErrorMsg(res.message || 'Mã OTP không hợp lệ hoặc đã hết hạn.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Thông tin xác thực không hợp lệ.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword) {
      setErrorMsg('Vui lòng nhập mật khẩu mới.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không khớp.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await authApi.resetPassword({
        usernameOrEmail: usernameOrEmail.trim(),
        otp: otp.join(''),
        newPassword
      });

      if (res.success) {
        setSuccessMsg(res.message || 'Đặt lại mật khẩu thành công. Đang chuyển hướng...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setErrorMsg(res.message || 'Đặt lại mật khẩu thất bại. Vui lòng thử lại.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Hệ thống gặp sự cố khi đặt lại mật khẩu.');
    } finally {
      setLoading(false);
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

  const handleOtpKeyDown = (index, e) => {
    // Backspace key on empty input: focus previous input
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
        // Option: clear the previous value when focusing back
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
      }
    }
  };

  const formatCooldown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-[#181411] dark:text-white h-screen flex flex-col font-sans transition-colors duration-300 overflow-hidden">
      <Header />

      <main className="flex-1 overflow-y-auto flex flex-col items-center justify-center px-4 py-4 md:py-6">
        <div className="w-full max-w-[560px] space-y-4 md:space-y-6 my-auto">
          {/* Progress Breadcrumbs */}
          <div className="flex justify-center items-center gap-3 p-3 bg-white/50 dark:bg-[#1a110b]/50 backdrop-blur-md rounded-2xl border border-[#e6dfdb]/60 dark:border-[#3d2c20]/60 shadow-sm max-w-md mx-auto">
            <button 
              disabled={loading || currentStep === 3}
              onClick={() => changeStep(1)}
              className="flex items-center gap-2 focus:outline-none transition-all"
            >
              <span className={`text-xs font-black h-6 w-6 rounded-full flex items-center justify-center transition-all ${currentStep >= 1 ? 'bg-primary text-white shadow-md shadow-primary/20' : 'border-2 border-[#8a7260] text-[#8a7260]'}`}>1</span>
              <span className={`text-xs font-bold ${currentStep >= 1 ? 'text-primary dark:text-[#ffaa66]' : 'text-[#8a7260]'}`}>Nhập Email</span>
            </button>
            <div className="h-0.5 w-6 bg-[#e6dfdb] dark:bg-[#3d2c20]"></div>
            <button 
              disabled={loading || currentStep < 2 || currentStep === 3}
              onClick={() => changeStep(2)}
              className="flex items-center gap-2 focus:outline-none transition-all"
            >
              <span className={`text-xs font-black h-6 w-6 rounded-full flex items-center justify-center transition-all ${currentStep >= 2 ? 'bg-primary text-white shadow-md shadow-primary/20' : 'border-2 border-[#8a7260] text-[#8a7260]'}`}>2</span>
              <span className={`text-xs font-bold ${currentStep >= 2 ? 'text-primary dark:text-[#ffaa66]' : 'text-[#8a7260]'}`}>Xác thực OTP</span>
            </button>
            <div className="h-0.5 w-6 bg-[#e6dfdb] dark:bg-[#3d2c20]"></div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-black h-6 w-6 rounded-full flex items-center justify-center transition-all ${currentStep >= 3 ? 'bg-primary text-white shadow-md shadow-primary/20' : 'border-2 border-[#8a7260] text-[#8a7260]'}`}>3</span>
              <span className={`text-xs font-bold ${currentStep >= 3 ? 'text-primary dark:text-[#ffaa66]' : 'text-[#8a7260]'}`}>Mật khẩu mới</span>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center space-y-1.5">
            <h1 className="text-gray-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-tight">
              {currentStep === 1 && "Quên mật khẩu?"}
              {currentStep === 2 && "Xác minh OTP"}
              {currentStep === 3 && "Đặt lại mật khẩu"}
            </h1>
            <p className="text-[#8a7260] dark:text-[#bcaaa4] text-sm font-normal max-w-sm mx-auto">
              {currentStep === 1 && "Nhập tên đăng nhập hoặc địa chỉ email của bạn để yêu cầu mã xác thực khôi phục mật khẩu."}
              {currentStep === 2 && `Mã OTP đã được gửi đến tài khoản của bạn. Vui lòng nhập mã để tiếp tục.`}
              {currentStep === 3 && "Tạo mật khẩu mới bảo mật cho tài khoản của bạn."}
            </p>
          </div>

          {/* Alerts */}
          {errorMsg && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 p-3.5 rounded-xl flex items-start gap-3 animate-in fade-in duration-200">
              <span className="material-symbols-outlined shrink-0 text-xl">error</span>
              <div className="text-sm font-medium">{errorMsg}</div>
            </div>
          )}

          {successMsg && (
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50 text-green-600 dark:text-green-400 p-3.5 rounded-xl flex items-start gap-3 animate-in fade-in duration-200">
              <span className="material-symbols-outlined shrink-0 text-xl">check_circle</span>
              <div className="text-sm font-medium">{successMsg}</div>
            </div>
          )}

          {/* Forms container */}
          <div className="bg-white dark:bg-[#2c1d14] rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-[#e6dfdb] dark:border-[#3d2c20] p-5 md:p-6 space-y-4">
            
            {/* Step 1: Enter Username or Email */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[#181411] dark:text-[#e6dfdb] text-sm font-bold">Tên đăng nhập hoặc Email</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a7260]">alternate_email</span>
                    <input
                      className="form-input flex w-full rounded-xl border border-[#e6dfdb] dark:border-[#3d2c20] bg-white dark:bg-[#1a110b] h-12 pl-12 pr-4 text-base focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-[#8a7260] outline-none transition-all"
                      placeholder="Nhập tên đăng nhập hoặc email..."
                      type="text"
                      value={usernameOrEmail}
                      onChange={(e) => setUsernameOrEmail(e.target.value)}
                      disabled={loading}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendCode()}
                    />
                  </div>
                </div>

                <button
                  onClick={() => handleSendCode(false)}
                  disabled={loading}
                  className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-opacity-95 shadow-lg shadow-primary/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Gửi mã xác thực</span>
                      <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Step 2: Verification Code (OTP) */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <label className="block text-center text-[#181411] dark:text-[#e6dfdb] text-sm font-bold">Mã xác thực OTP (6 chữ số)</label>
                  <div className="flex justify-center gap-2 max-w-sm mx-auto">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        className="w-10 h-12 md:w-12 md:h-14 text-center text-xl font-black rounded-xl border border-[#e6dfdb] dark:border-[#3d2c20] bg-white dark:bg-[#1a110b] focus:border-primary focus:ring-2 focus:ring-primary/20 focus:scale-105 outline-none transition-all"
                        maxLength="1"
                        type="text"
                        pattern="\d*"
                        inputMode="numeric"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        disabled={loading}
                      />
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs font-semibold px-1 mt-3">
                    <span className="text-[#8a7260] dark:text-[#bcaaa4] flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">schedule</span>
                      OTP hiệu lực trong 15 phút
                    </span>
                    {cooldown > 0 ? (
                      <span className="text-[#8a7260] dark:text-[#bcaaa4]">Gửi lại sau ({formatCooldown(cooldown)})</span>
                    ) : (
                      <button
                        onClick={() => handleSendCode(true)}
                        disabled={loading}
                        className="text-primary hover:text-orange-600 underline font-bold focus:outline-none transition-colors"
                      >
                        Gửi lại mã
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => changeStep(1)}
                    disabled={loading}
                    className="flex-1 border border-gray-300 dark:border-stone-700 text-[#8a7260] dark:text-stone-300 font-bold py-3.5 rounded-xl hover:bg-gray-50 dark:hover:bg-stone-800 transition-colors disabled:opacity-50"
                  >
                    Quay lại
                  </button>
                  <button
                    onClick={handleVerifyOtp}
                    disabled={loading}
                    className="flex-[2] bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-opacity-95 shadow-lg shadow-primary/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <span>Xác nhận</span>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Set New Password */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[#181411] dark:text-[#e6dfdb] text-sm font-bold">Mật khẩu mới</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a7260]">lock</span>
                      <input
                        className="form-input flex w-full rounded-xl border border-[#e6dfdb] dark:border-[#3d2c20] bg-white dark:bg-[#1a110b] h-12 pl-12 pr-12 text-base focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="Mật khẩu tối thiểu 6 ký tự..."
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8a7260] hover:text-primary transition-colors focus:outline-none"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        <span className="material-symbols-outlined text-xl">{showNewPassword ? 'visibility_off' : 'visibility'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[#181411] dark:text-[#e6dfdb] text-sm font-bold">Xác nhận mật khẩu mới</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a7260]">lock_reset</span>
                      <input
                        className="form-input flex w-full rounded-xl border border-[#e6dfdb] dark:border-[#3d2c20] bg-white dark:bg-[#1a110b] h-12 pl-12 pr-12 text-base focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="Nhập lại mật khẩu mới..."
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={loading}
                        onKeyDown={(e) => e.key === 'Enter' && handleResetPassword()}
                      />
                      <button
                        type="button"
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8a7260] hover:text-primary transition-colors focus:outline-none"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        <span className="material-symbols-outlined text-xl">{showConfirmPassword ? 'visibility_off' : 'visibility'}</span>
                      </button>
                    </div>
                    {confirmPassword && newPassword !== confirmPassword && (
                      <p className="text-red-500 text-xs font-bold pl-1 mt-1">Mật khẩu xác nhận không khớp</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleResetPassword}
                  disabled={loading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                  className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-opacity-95 shadow-lg shadow-primary/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <span>Cập nhật mật khẩu</span>
                  )}
                </button>
              </div>
            )}

          </div>

          {/* Links */}
          <div className="text-center font-medium">
            <Link className="font-bold text-primary hover:text-orange-600 transition-colors inline-flex items-center gap-1 group text-sm" to="/login">
              <span className="material-symbols-outlined text-lg transition-transform group-hover:-translate-x-1">arrow_back</span>
              Quay lại Đăng nhập
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-4 border-t border-[#e6dfdb]/60 dark:border-[#3d2c20]/60 bg-white dark:bg-background-dark text-center shrink-0">
        <p className="text-xs text-[#8a7260]">© 2026 ShopModern. All rights reserved.</p>
        <div className="mt-1 flex justify-center gap-4 text-[10px] font-semibold text-[#8a7260]">
          <Link className="hover:text-primary transition-colors" to="/privacy">Privacy Policy</Link>
          <Link className="hover:text-primary transition-colors" to="/terms">Terms of Service</Link>
          <Link className="hover:text-primary transition-colors" to="/help">Contact Support</Link>
        </div>
      </footer>
    </div>
  );
};

export default ForgotPasswordPage;