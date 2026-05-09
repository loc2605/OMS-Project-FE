import axiosClient from './axiosClient';

const notificationApi = {
  getMyNotifications: (params) => {
    const url = '/notifications/me';
    return axiosClient.get(url, { params });
  },
  markAsRead: (id) => {
    const url = `/notifications/${id}/read`;
    return axiosClient.post(url);
  }
};

export default notificationApi;
