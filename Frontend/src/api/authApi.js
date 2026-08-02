import axiosClient from './axiosClient';

export const authApi = {
  login: (email, password) =>
    axiosClient.post('/auth/login', { email, password }).then((res) => res.data),

  logout: () => axiosClient.post('/auth/logout').then((res) => res.data),

  changeOwnPassword: (oldPassword, newPassword) =>
    axiosClient
      .patch('/users/change-password', { oldPassword, newPassword })
      .then((res) => res.data),
};
