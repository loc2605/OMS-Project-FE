import axiosClient from './axiosClient';

const productApi = {
  getAll: (params) => {
    // If name is provided, use the search endpoint
    if (params && params.name) {
      return axiosClient.get('/products/search', { params });
    }
    const url = '/products';
    return axiosClient.get(url, { params });
  },
  get: (id) => {
    const url = `/products/${id}`;
    return axiosClient.get(url);
  }
};

export default productApi;
