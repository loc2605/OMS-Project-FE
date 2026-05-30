import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://192.168.10.160:8888/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor cho Request
axiosClient.interceptors.request.use(
  (config) => {
    // Lấy token từ sessionStorage
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
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

    // Xử lý lỗi 401 (Unauthorized) - Thử refresh token
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = sessionStorage.getItem('refreshToken');
        if (refreshToken) {
          // Gọi API refresh token (sử dụng axios gốc để tránh interceptor lặp vô tận nếu refresh cũng lỗi 401)
          const res = await axios.post('http://localhost:8080/api/v1/auth/refresh', { refreshToken });

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
