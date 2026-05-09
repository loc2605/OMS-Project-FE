import axiosClient from './axiosClient';

const profileApi = {
  getProfile: () => {
    const url = '/customers/me';
    return axiosClient.get(url);
  },
  getAddresses: () => {
    const url = '/customers/addresses';
    return axiosClient.get(url);
  },
  addAddress: (data) => {
    const url = '/customers/addresses';
    return axiosClient.post(url, data);
  },
  updateAddress: (addressId, data) => {
    const url = `/customers/addresses/${addressId}`;
    return axiosClient.put(url, data);
  },
  deleteAddress: (addressId) => {
    const url = `/customers/addresses/${addressId}`;
    return axiosClient.delete(url);
  },
  setDefaultAddress: (addressId) => {
    const url = `/customers/addresses/${addressId}/default`;
    return axiosClient.put(url);
  },
  updateProfile: (data) => {
    const url = '/customers/me';
    return axiosClient.put(url, data);
  }
};

export default profileApi;
