// src/services/auth.service.js (frontend)
import axios from 'axios';

export default {
  register(userData) {
    return axios.post('/api/auth/register', userData);
  },
  login(credentials) {
    return axios.post('/api/auth/login', credentials);
  },
  forgotPassword(email) {
    return axios.post('/api/auth/forgot-password', { email });
  },
  resetPassword(token, password) {
    return axios.post('/api/auth/reset-password', { token, password });
  },
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
  }

};