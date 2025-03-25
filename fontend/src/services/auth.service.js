// src/services/auth.service.js (frontend)
import axios from 'axios';

export default {
  register(userData) {
    return axios.post('/api/auth/register', userData);
  },
  login(credentials) {
    return axios.post('/api/auth/login', credentials);
  },
  forgotPassword(emailData) {
    return axios.post('/api/auth/forgot-password', emailData);
  },
  resetPassword(token, newPassword) {
    return axios.post(`/api/auth/reset-password/${token}`, { password: newPassword });
  },
  // logout() { // Nếu muốn có hàm logout riêng
  //   localStorage.removeItem('token');
  // },
};