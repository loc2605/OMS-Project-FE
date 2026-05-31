import axiosClient from './axiosClient';

const profileApi = {
  getProfile: async () => {
    const url = '/customers/me';
    const res = await axiosClient.get(url);
    return res;
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
    if (data instanceof FormData) {
      return axiosClient.put(url, data);
    }
    const jsonData = JSON.parse(JSON.stringify(data));
    return axiosClient.put(url, jsonData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

export default profileApi;
