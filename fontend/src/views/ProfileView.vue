<template>
  <div class="profile-container">
    <h2>Thông tin cá nhân</h2>
    <div v-if="loading" class="loading">
      Đang tải...
    </div>
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    <div v-else class="profile-info">
      <div class="info-item">
        <label>Tên đăng nhập:</label>
        <span>{{ profile.username }}</span>
      </div>
      <div class="info-item">
        <label>Email:</label>
        <span>{{ profile.email }}</span>
      </div>
      <div class="info-item">
        <label>Họ và tên:</label>
        <span>{{ profile.full_name }}</span>
      </div>
      <div class="info-item">
        <label>Ngày đăng ký:</label>
        <span>{{ formatDate(profile.registration_date) }}</span>
      </div>
      <div class="info-item">
        <label>Lần đăng nhập cuối:</label>
        <span>{{ formatDate(profile.last_login) }}</span>
      </div>
      <div class="info-item">
        <label>Vai trò:</label>
        <span>{{ profile.role === 'admin' ? 'Quản trị viên' : 'Người dùng' }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ProfileView',
  data() {
    return {
      profile: {},
      loading: true,
      error: null
    };
  },
  async created() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        this.$router.push('/login');
        return;
      }

      const response = await axios.get('http://localhost:3000/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      this.profile = response.data.data;
      this.loading = false;
    } catch (error) {
      console.error('Error fetching profile:', error);
      this.error = 'Không thể tải thông tin profile. Vui lòng thử lại sau.';
      this.loading = false;
    }
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return 'Chưa có';
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }
};
</script>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.loading, .error {
  text-align: center;
  padding: 20px;
  font-size: 1.2em;
}

.error {
  color: red;
}

.profile-info {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.info-item {
  margin-bottom: 15px;
  padding: 10px;
  background: white;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-item label {
  font-weight: bold;
  color: #333;
}

.info-item span {
  color: #666;
}
</style> 