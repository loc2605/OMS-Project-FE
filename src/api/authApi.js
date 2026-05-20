import axiosClient from './axiosClient';

const authApi = {
  login: (data) => {
    const url = '/auth/login';
    return axiosClient.post(url, data);
  },
  register: (data) => {
    const url = '/auth/register';
    return axiosClient.post(url, data);
  },
  refreshToken: (data) => {
    const url = '/auth/refresh';
    return axiosClient.post(url, data);
  },
  forgotPassword: (data) => {
    const url = '/auth/forgot-password';
    return axiosClient.post(url, data);
  },
  verifyOtp: (data) => {
    const url = '/auth/verify-otp';
    return axiosClient.post(url, data);
  },
  resetPassword: (data) => {
    const url = '/auth/reset-password';
    return axiosClient.post(url, data);
  },
  changePassword: (data) => {
    const url = '/auth/change-password';
    return axiosClient.post(url, data);
  }
};

export default authApi;

