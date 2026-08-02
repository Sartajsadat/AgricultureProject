import axiosClient from './axiosClient';

export const roleApi = {
  list: () => axiosClient.get('/roles').then((res) => res.data),
  create: (name) => axiosClient.post('/roles', { name }).then((res) => res.data),
};
