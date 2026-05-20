import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/home/Header';
import authApi from '../api/authApi';

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Status state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setErrorMsg('Mật khẩu xác nhận không khớp.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await authApi.changePassword({
        oldPassword,
        newPassword,
        confirmNewPassword
      });

      if (res.success) {
        setSuccessMsg(res.message || 'Đổi mật khẩu thành công. Đang quay lại trang cá nhân...');
        // Clear fields
        setOldPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        
        // Redirect to profile page after 2 seconds
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
      } else {
        setErrorMsg(res.message || 'Thay đổi mật khẩu thất bại. Vui lòng thử lại.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Mật khẩu cũ không chính xác hoặc thông tin không hợp lệ.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark h-screen flex flex-col overflow-hidden text-[#181411] dark:text-white font-sans transition-colors duration-300">
      <Header />

      <main className="flex-grow overflow-y-auto flex items-center justify-center py-4 px-4 sm:px-6">
        <div className="w-full max-w-[480px] bg-white dark:bg-[#2c1d14] border border-[#e6dfdb] dark:border-[#3d2c20] rounded-2xl shadow-xl p-5 sm:p-6 space-y-4 my-auto">
          <div className="space-y-1 text-center sm:text-left">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Đổi mật khẩu</h1>
            <p className="text-[#8a7260] dark:text-[#bcaaa4] text-xs">Cập nhật mật khẩu tài khoản của bạn để tăng cường tính bảo mật.</p>
          </div>

          {/* Alerts */}
          {errorMsg && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 p-3 rounded-xl flex items-start gap-3 animate-in fade-in duration-200">
              <span className="material-symbols-outlined shrink-0 text-xl">error</span>
              <div className="text-xs font-medium">{errorMsg}</div>
            </div>
          )}

          {successMsg && (
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50 text-green-600 dark:text-green-400 p-3 rounded-xl flex items-start gap-3 animate-in fade-in duration-200">
              <span className="material-symbols-outlined shrink-0 text-xl">check_circle</span>
              <div className="text-xs font-medium">{successMsg}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-[#181411] dark:text-[#e6dfdb] text-xs font-bold">Mật khẩu hiện tại</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a7260] text-lg">lock</span>
                <input
                  className="form-input block w-full rounded-xl border border-[#e6dfdb] dark:border-[#3d2c20] bg-white dark:bg-[#1a110b] pl-10 pr-10 py-2.5 text-sm text-[#181411] dark:text-white placeholder:text-[#8a7260] focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="Nhập mật khẩu hiện tại..."
                  type={showCurrent ? 'text' : 'password'}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <button
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#8a7260] hover:text-primary transition-colors"
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                >
                  <span className="material-symbols-outlined text-lg">{showCurrent ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[#181411] dark:text-[#e6dfdb] text-xs font-bold">Mật khẩu mới</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a7260] text-lg">lock_open</span>
                <input
                  className="form-input block w-full rounded-xl border border-[#e6dfdb] dark:border-[#3d2c20] bg-white dark:bg-[#1a110b] pl-10 pr-10 py-2.5 text-sm text-[#181411] dark:text-white placeholder:text-[#8a7260] focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="Mật khẩu mới ít nhất 6 ký tự..."
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <button
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#8a7260] hover:text-primary transition-colors"
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                >
                  <span className="material-symbols-outlined text-lg">{showNew ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[#181411] dark:text-[#e6dfdb] text-xs font-bold">Xác nhận mật khẩu mới</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a7260] text-lg">lock_reset</span>
                <input
                  className="form-input block w-full rounded-xl border border-[#e6dfdb] dark:border-[#3d2c20] bg-white dark:bg-[#1a110b] pl-10 pr-10 py-2.5 text-sm text-[#181411] dark:text-white placeholder:text-[#8a7260] focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="Nhập lại mật khẩu mới..."
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <button
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#8a7260] hover:text-primary transition-colors"
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  <span className="material-symbols-outlined text-lg">{showConfirm ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
              {confirmNewPassword && newPassword !== confirmNewPassword && (
                <p className="text-red-500 text-[10px] font-bold pl-1 mt-0.5">Mật khẩu xác nhận không khớp</p>
              )}
            </div>

            <button
              className="w-full flex items-center justify-center rounded-xl bg-primary py-3 px-6 text-white font-bold text-base shadow-lg shadow-primary/20 hover:bg-opacity-95 active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none mt-1"
              type="submit"
              disabled={loading || !oldPassword || !newPassword || !confirmNewPassword || newPassword !== confirmNewPassword}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span>Cập nhật mật khẩu</span>
              )}
            </button>
          </form>

          <p className="text-center text-xs font-medium">
            <Link className="font-bold text-[#8a7260] dark:text-[#bcaaa4] hover:text-primary transition-colors inline-flex items-center gap-1 group" to="/profile">
              <span className="material-symbols-outlined text-sm transition-transform group-hover:-translate-x-1">arrow_back</span>
              Quay lại Trang cá nhân
            </Link>
          </p>
        </div>
      </main>

      <footer className="py-4 border-t border-[#e6dfdb]/60 dark:border-[#3d2c20]/60 bg-white dark:bg-background-dark text-center flex flex-col sm:flex-row items-center justify-between px-6 gap-2 shrink-0">
        <p className="text-xs text-[#8a7260]">© 2026 ShopModern. All rights reserved.</p>
        <div className="flex gap-4 text-[10px] font-semibold text-[#8a7260]">
          <Link className="hover:text-primary transition-colors" to="/privacy">Privacy Policy</Link>
          <Link className="hover:text-primary transition-colors" to="/terms">Terms of Service</Link>
          <Link className="hover:text-primary transition-colors" to="/help">Contact Support</Link>
        </div>
      </footer>
    </div>
  );
};

export default ChangePasswordPage;