import axiosClient from './axiosClient';

const orderApi = {
  create: (data) => {
    const url = '/orders';
    return axiosClient.post(url, data);
  },
  get: (orderId) => {
    const url = `/orders/${orderId}`;
    return axiosClient.get(url);
  },
  getMyOrders: () => {
    const url = '/orders/me';
    return axiosClient.get(url);
  }
};

export default orderApi;
