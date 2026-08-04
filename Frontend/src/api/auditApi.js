import axiosClient from './axiosClient';

export const auditApi = {
  // params: { page, size, sort, action, performedBy }
  list: (params) => axiosClient.get('/audit-logs', { params }).then((res) => res.data),

  forUser: (userId, params) =>
    axiosClient.get(`/audit-logs/user/${userId}`, { params }).then((res) => res.data),
};
