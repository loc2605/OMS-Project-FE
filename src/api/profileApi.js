import axiosClient from './axiosClient';

const profileApi = {
  getProfile: () => {
    const url = '/customers/me';
    return axiosClient.get(url);
  },
  getAddresses: () => {
    const url = '/customers/me/addresses';
    return axiosClient.get(url);
  },
  addAddress: (data) => {
    const url = '/customers/me/addresses';
    return axiosClient.post(url, data);
  }
};

export default profileApi;
