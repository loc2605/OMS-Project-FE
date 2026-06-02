import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://192.168.1.243:8888/api/v1';
const axiosClient = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor cho Request
axiosClient.interceptors.request.use(
  (config) => {
    // Lấy token từ sessionStorage
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const accountId = user?.accountId || user?.id || user?.userId || user?.account_id;
        const userRole = user?.role || user?.userRole || user?.roleName || user?.type;
        if (accountId) {
          config.headers['X-Account-Id'] = accountId;
        }
        if (userRole) {
          config.headers['X-User-Role'] = userRole;
        }
      } catch (_) {
        // ignore invalid user storage
      }
    }

    const sessionAccountId = sessionStorage.getItem('accountId');
    const sessionUserRole = sessionStorage.getItem('userRole');
    if (sessionAccountId && !config.headers['X-Account-Id']) {
      config.headers['X-Account-Id'] = sessionAccountId;
    }
    if (sessionUserRole && !config.headers['X-User-Role']) {
      config.headers['X-User-Role'] = sessionUserRole;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor cho Response
axiosClient.interceptors.response.use(
  (response) => {
    // API luôn trả về { success, status, message, result }
    // Trả thẳng data ra cho dễ dùng
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Xử lý lỗi 403 (Forbidden) - Tài khoản bị khoá
    if (error.response && error.response.status === 403) {
      const message = error.response.data?.message || 'Tài khoản của bạn đã bị khoá trên hệ thống';
      window.dispatchEvent(new Event('app-logout'));
      alert(message);
      window.location.href = '/login';
      return Promise.reject(error.response.data || { message });
    }

    // Xử lý lỗi 401 (Unauthorized) - Thử refresh token
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = sessionStorage.getItem('refreshToken');
        if (refreshToken) {
          // Gọi API refresh token (sử dụng axios gốc để tránh interceptor lặp vô tận nếu refresh cũng lỗi 401)
          const refreshUrl = `${API_BASE_URL.replace(/\/$/, '')}/auth/refresh`;
          const res = await axios.post(refreshUrl, { refreshToken });

          if (res.data && res.data.success) {
            const newToken = res.data.result.token;
            const newRefreshToken = res.data.result.refreshToken;

            sessionStorage.setItem('token', newToken);
            if (newRefreshToken) sessionStorage.setItem('refreshToken', newRefreshToken);

            // Cập nhật header và thực hiện lại request ban đầu
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            return axiosClient(originalRequest);
          }
        }
      } catch (refreshError) {
        // Nếu refresh cũng lỗi, logout người dùng
        sessionStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Xử lý lỗi trả về từ API
    if (error.response && error.response.data) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
