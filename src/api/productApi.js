import axiosClient from './axiosClient';

const productApi = {
  getAll: (params) => {
    // Check if any search filters are present to determine whether to use /search endpoint
    const hasFilters = params && (params.name || params.categoryName || params.categoryId || params.minPrice !== undefined || params.maxPrice !== undefined);
    const url = hasFilters ? '/products/search' : '/products';
    return axiosClient.get(url, { params });
  },
  get: (id) => {
    const url = `/products/${id}`;
    return axiosClient.get(url);
  }
};

export default productApi;
