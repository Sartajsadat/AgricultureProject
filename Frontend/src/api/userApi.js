import axiosClient from './axiosClient';

export const userApi = {
  list: () => axiosClient.get('/users').then((res) => res.data),

  search: (query) =>
    axiosClient.get('/users/search', { params: { query } }).then((res) => res.data),

  getByEmail: (email) => axiosClient.get(`/users/email/${email}`).then((res) => res.data),

  create: (payload) => axiosClient.post('/users', payload).then((res) => res.data),

  update: (id, payload) => axiosClient.put(`/users/${id}`, payload).then((res) => res.data),

  assignRoles: (id, roles) =>
    axiosClient.post(`/users/${id}/roles`, { roles }).then((res) => res.data),

  updateStatus: (id, status) =>
    axiosClient.patch(`/users/${id}/status`, null, { params: { status } }).then((res) => res.data),

  resetPassword: (id, newPassword) =>
    axiosClient.patch(`/users/${id}/reset-password`, { newPassword }).then((res) => res.data),

  delete: (id) => axiosClient.delete(`/users/${id}`).then((res) => res.data),
};
