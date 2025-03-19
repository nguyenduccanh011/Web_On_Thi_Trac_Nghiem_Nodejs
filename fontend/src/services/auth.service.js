// src/services/auth.service.js (frontend)
import axios from 'axios';

export default {
  register(userData) {
    return axios.post('/api/auth/register', userData);
  },
  login(credentials) {
    return axios.post('/api/auth/login', credentials);
  },
  // logout() { // Nếu muốn có hàm logout riêng
  //   localStorage.removeItem('token');
  // },
};