import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export default {
  async getCurrentUser() {
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token);
      
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get('/api/user/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error details:', error.response?.data);
      if (error.response?.status === 401) {
        // Token không hợp lệ hoặc đã hết hạn
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
        throw new Error('Unauthorized');
      }
      throw error;
    }
  },

  async updateUser(userData) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.put('/api/user/me', userData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
        throw new Error('Unauthorized');
      }
      throw error;
    }
  },

  async updateProfilePicture(formData) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Không tìm thấy token xác thực');
      }

      const response = await axios.post(
        `${API_URL}/user/profile-picture`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data && response.data.success) {
        return response.data.user;
      } else {
        throw new Error(response.data.message || 'Dữ liệu phản hồi không hợp lệ');
      }
    } catch (error) {
      if (error.response) {
        // Server trả về lỗi
        throw new Error(error.response.data.message || 'Không thể cập nhật ảnh đại diện');
      } else if (error.request) {
        // Không nhận được phản hồi từ server
        throw new Error('Không thể kết nối đến máy chủ');
      } else {
        // Lỗi khi tạo request
        throw error;
      }
    }
  }
}; 