import axiosClient from './axiosClient';

const aiApi = {
  chat: (message, userId = 'guest') => {
    return axiosClient.post('/ai/chat', { message, userId });
  },
  syncBootstrap: () => {
    return axiosClient.post('/ai/sync/bootstrap');
  }
};

export default aiApi;
