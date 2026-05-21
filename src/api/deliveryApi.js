import axiosClient from './axiosClient';

const deliveryApi = {
  getDeliveryByOrder: (orderId) => {
    return axiosClient.get(`/deliveries/order/${orderId}`);
  },
  updateDeliveryStatus: (id, status, failReason) => {
    return axiosClient.patch(`/deliveries/${id}/status`, null, {
      params: { status, failReason }
    });
  }
};

export default deliveryApi;
