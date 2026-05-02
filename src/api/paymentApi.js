import axiosClient from './axiosClient';

const paymentApi = {
  pay: (data) => {
    const url = '/payment/pay';
    return axiosClient.post(url, data);
  }
};

export default paymentApi;
