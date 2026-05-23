import axiosClient from './axiosClient';

const paymentApi = {
  pay: (data) => {
    const url = '/payment/pay';
    return axiosClient.post(url, data);
  },
  verifyVnPay: (queryString) => {
    return axiosClient.get(`/payments/vnpay-ipn${queryString}`);
  }
};

export default paymentApi;
