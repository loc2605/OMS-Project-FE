import axiosClient from './axiosClient';

const inventoryApi = {
  checkStock: (productId) => {
    const url = `/inventory/product/${productId}`;
    return axiosClient.get(url);
  }
};

export default inventoryApi;
